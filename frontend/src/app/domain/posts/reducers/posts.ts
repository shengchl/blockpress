import { createSelector } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { PostPublish } from '../models/post-publish.interface';
import { Post } from '../models/post.interface';
import { PostsActionTypes, PostsActionsUnion } from '../actions/posts';
import { postsPayloadParser, postPayloadParser, userNotificationsPayloadParser } from '../helpers/payload-parser';
import { UserNotification } from '../models/user-notification-interface';

declare var $;

export interface State {
  profilePostList: Array<Post>;
  postList: Array<Post>;
  workingPost: Post | {};
  workingPostReplies: Array<Post>;
  isPublisherOpen: boolean;
  activeViewingPost?: Post;
  openedTxLikeTips: {
    [key: string]: {
      isDialogOpen: boolean,
      tipAmount: number,
      password: string,
      submitting: boolean,
      tipsOpen: boolean,
  }};
  notifications: Array<UserNotification>;
  currentPostOffsetId?: number;
}

const initialState: State = {
  profilePostList: [],
  postList: [],
  workingPost: {},
  workingPostReplies: [],
  isPublisherOpen: false,
  activeViewingPost: null,
  openedTxLikeTips: {
  },
  notifications: [],
  currentPostOffsetId: 0
};

function addRepliesToPost(txId, postReplies: Array<Post>, posts: Array<Post>): any {
  const reconstructed = [];
  for (const post of posts) {
    if (post.txId === txId) {
      reconstructed.push(Object.assign({}, post, {
        replyPosts: postReplies
      }));
    } else {
      reconstructed.push(post);
    }
  }
  return reconstructed;
}

export function reducer(
  state = initialState,
  action: PostsActionsUnion,
): State {

  switch (action.type) {
    case PostsActionTypes.FetchFeedComplete:
      let postsToTotal = postsPayloadParser(action.payload.posts);
      let offsetId = 0;
      if (action.payload.offsetId) {
         postsToTotal = state.postList.concat(postsPayloadParser(action.payload.posts));
         offsetId = action.payload.offsetId;
      }
      return Object.assign({}, state,
        {
          profilePostList: state.profilePostList,
          postList: postsToTotal,
          workingPost: state.workingPost,
          workingPostReplies: state.workingPostReplies,
          isPublisherOpen: state.isPublisherOpen,
          activeViewingPost: state.activeViewingPost,
          openedTxLikeTips: state.openedTxLikeTips,
          notifications: state.notifications,
          currentPostOffsetId: offsetId
        }
      );

    case PostsActionTypes.FetchNotificationsComplete:

      let notesTotal = userNotificationsPayloadParser(action.payload.notifications);
      if (action.payload.offsetId) {
        notesTotal = state.notifications.concat(userNotificationsPayloadParser(action.payload.notifications));
      }
      return Object.assign({}, state,
        {
          profilePostList: state.profilePostList,
          postList: state.postList,
          workingPost: state.workingPost,
          workingPostReplies: state.workingPostReplies,
          isPublisherOpen: state.isPublisherOpen,
          activeViewingPost: state.activeViewingPost,
          openedTxLikeTips: state.openedTxLikeTips,
          notifications: notesTotal,
          currentPostOffsetId: state.currentPostOffsetId
        }
      );

    case PostsActionTypes.FetchPostComplete:
      const post = postPayloadParser(action.payload.post);

      return Object.assign({}, state,
        {
          profilePostList: state.profilePostList,
          postList: state.postList,
          workingPost: state.workingPost,
          workingPostReplies: state.workingPostReplies,
          isPublisherOpen: state.isPublisherOpen,
          activeViewingPost: post,
          openedTxLikeTips: state.openedTxLikeTips,
          notifications: state.notifications,
          currentPostOffsetId: state.currentPostOffsetId
        }
      );

    case PostsActionTypes.ReloadPostComplete:
      const newPostLoaded = postPayloadParser(action.payload.post);
      const updatedPostList = [];


      for (const aPost of state.postList) {
        if (aPost.txId === newPostLoaded.txId) {
          updatedPostList.push(newPostLoaded);
        } else {
          updatedPostList.push(aPost);
        }
      }


      const updatedNotes = [];

      for (const aPost of state.notifications) {
        if (aPost.txId === newPostLoaded.txId) {
          updatedNotes.push(Object.assign({}, aPost, {entity: newPostLoaded }));
        } else {
          updatedNotes.push(aPost);
        }
      }


      return Object.assign({}, state,
        {
          profilePostList: state.profilePostList,
          postList: updatedPostList,
          workingPost: state.workingPost,
          workingPostReplies: state.workingPostReplies,
          isPublisherOpen: state.isPublisherOpen,
          activeViewingPost: state.activeViewingPost,
          openedTxLikeTips: state.openedTxLikeTips,
          notifications: state.notifications,
          currentPostOffsetId: state.currentPostOffsetId
        }
      );

    case PostsActionTypes.FetchPostReplies:
      return Object.assign({}, state,
        {
          profilePostList: state.profilePostList,
          postList: state.postList,
          workingPost: state.workingPost,
          workingPostReplies: [],
          isPublisherOpen: state.isPublisherOpen,
          activeViewingPost: state.activeViewingPost,
          openedTxLikeTips: state.openedTxLikeTips,
          notifications: state.notifications,
          currentPostOffsetId: state.currentPostOffsetId
        }
      );

    case PostsActionTypes.FetchPostRepliesComplete:
      const postRepliesTotal = postsPayloadParser(action.payload.posts);

      return Object.assign({}, state,
        {
          profilePostList: state.profilePostList,
          postList: state.postList,
          workingPost: state.workingPost,
          workingPostReplies: postRepliesTotal,
          isPublisherOpen: state.isPublisherOpen,
          activeViewingPost: state.activeViewingPost,
          openedTxLikeTips: state.openedTxLikeTips,
          notifications: state.notifications,
          currentPostOffsetId: state.currentPostOffsetId
        }
      );

    case PostsActionTypes.FetchProfileFeedComplete:
      return Object.assign({}, state,
        {
          profilePostList: postsPayloadParser(action.payload),
          postList: state.postList,
          workingPost: state.workingPost,
          workingPostReplies: state.workingPostReplies,
          isPublisherOpen: state.isPublisherOpen,
          activeViewingPost: state.activeViewingPost,
          openedTxLikeTips: state.openedTxLikeTips,
          notifications: state.notifications,
          currentPostOffsetId: state.currentPostOffsetId
        }
      );

    case PostsActionTypes.FetchError:
      return Object.assign({}, state,
        {
          profilePostList: state.profilePostList,
          postList: state.postList,
          workingPost: state.workingPost,
          workingPostReplies: state.workingPostReplies,
          isPublisherOpen: state.isPublisherOpen,
          activeViewingPost: state.activeViewingPost,
          openedTxLikeTips: state.openedTxLikeTips,
          notifications: state.notifications,
          currentPostOffsetId: state.currentPostOffsetId
        }
      );

    case PostsActionTypes.PublishComplete:
      return Object.assign({}, state,
        {
          profilePostList: state.profilePostList,
          postList: state.postList,
          workingPost: {
            messageBody: ''
          },
          isPublisherOpen: false,
          activeViewingPost: state.activeViewingPost,
          openedTxLikeTips: state.openedTxLikeTips,
          notifications: state.notifications,
          currentPostOffsetId: state.currentPostOffsetId
        }
      );

    case PostsActionTypes.PublishReplyComplete:
      return Object.assign({}, state,
        {
          profilePostList: state.profilePostList,
          postList: state.postList,
          workingPost: {
            messageBody: ''
          },
          isPublisherOpen: false,
          activeViewingPost: state.activeViewingPost,
          openedTxLikeTips: state.openedTxLikeTips,
          notifications: state.notifications,
          currentPostOffsetId: state.currentPostOffsetId
        }
      );

    case PostsActionTypes.CancelEditPost:
      return Object.assign({}, state,
        {
          profilePostList: state.profilePostList,
          postList: state.postList,
          workingPostReplies: state.workingPostReplies,
          workingPost: {
            messageBody: ''
          },
          isPublisherOpen: false,
          activeViewingPost: state.activeViewingPost,
          openedTxLikeTips: state.openedTxLikeTips,
          notifications: state.notifications,
          currentPostOffsetId: state.currentPostOffsetId
        }
      );

    case PostsActionTypes.StartEdit:
      return Object.assign({}, state,
        {
          profilePostList: state.profilePostList,
          postList: state.postList,
          workingPost: {
            messageBody: ''
          },
          workingPostReplies: state.workingPostReplies,
          isPublisherOpen: true,
          activeViewingPost: state.activeViewingPost,
          openedTxLikeTips: state.openedTxLikeTips,
          notifications: state.notifications,
          currentPostOffsetId: state.currentPostOffsetId
        }
      );

    case PostsActionTypes.UpdateWorkingPost:
      const change = {};
      change[action.payload.property] = action.payload.value;
      const updatedProps = Object.assign({}, state.workingPost, change);
      return Object.assign({}, {
        profilePostList: state.profilePostList,
          postList: state.postList,
          workingPost: updatedProps,
          workingPostReplies: state.workingPostReplies,
          isPublisherOpen: true,
          activeViewingPost: state.activeViewingPost,
          openedTxLikeTips: state.openedTxLikeTips,
          notifications: state.notifications,
          currentPostOffsetId: state.currentPostOffsetId
        }
      );

    case PostsActionTypes.ClosePostModals:

      if ($('div.modal-backdrop.fade.show').length) {
        $('div.modal-backdrop.fade.show').remove();
      }
      $('body').removeClass('modal-open');

      if ( $('.post-view.modal').length) {
        $('.post-view.modal').modal('hide');
      }

      return Object.assign({}, {
        profilePostList: state.profilePostList,
          postList: state.postList,
          workingPost: updatedProps,
          workingPostReplies: state.workingPostReplies,
          isPublisherOpen: state.isPublisherOpen,
          activeViewingPost: null,
          openedTxLikeTips: state.openedTxLikeTips,
          notifications: state.notifications,
          currentPostOffsetId: state.currentPostOffsetId
        }
      );


    case PostsActionTypes.OpenLikeTipReplyForPost:
      const openState = {
          isDialogOpen: true,
          tipAmount: 546,
          password: '',
          submitting: false,
          tipsOpen: action.payload.tipsOpen
      };

      return Object.assign({}, {
        profilePostList: state.profilePostList,
          postList: state.postList,
          workingPost: updatedProps,
          workingPostReplies: state.workingPostReplies,
          isPublisherOpen: state.isPublisherOpen,
          activeViewingPost: state.activeViewingPost,
          openedTxLikeTips: Object.assign({}, { [action.payload.txId]: openState }),
          notifications: state.notifications,
          currentPostOffsetId: state.currentPostOffsetId
        });

    case PostsActionTypes.CloseLikeTipReplyForPost:

      const closeState = {
          isDialogOpen: false,
          tipAmount: 546,
          password: '',
          submitting: false,
          tipsOpen: false
      };

      return Object.assign({}, {
        profilePostList: state.profilePostList,
          postList: state.postList,
          workingPost: updatedProps,
          workingPostReplies: state.workingPostReplies,
          isPublisherOpen: state.isPublisherOpen,
          activeViewingPost: state.activeViewingPost,
          openedTxLikeTips: Object.assign({}, state.openedTxLikeTips, {[action.payload.txId]: closeState}),
          notifications: state.notifications,
          currentPostOffsetId: state.currentPostOffsetId
        }
      );

      case PostsActionTypes.ChangeLikeOrTip:
        const copyUpdateLikeTipAmountTypeTip = Object.assign({}, state.openedTxLikeTips[action.payload.txId], {
          tipsOpen: action.payload.tipsOpen,
          password: !action.payload.tipsOpen ? '' : state.openedTxLikeTips[action.payload.txId].password
        });

        return Object.assign({}, {
          profilePostList: state.profilePostList,
            postList: state.postList,
            workingPost: updatedProps,
            workingPostReplies: state.workingPostReplies,
            isPublisherOpen: state.isPublisherOpen,
            activeViewingPost: state.activeViewingPost,
            openedTxLikeTips: Object.assign({}, state.openedTxLikeTips, {[action.payload.txId]: copyUpdateLikeTipAmountTypeTip}),
            notifications: state.notifications,
            currentPostOffsetId: state.currentPostOffsetId
          }
        );


    case PostsActionTypes.UpdateLikePassword:
      const copyUpdateLikePassword = Object.assign({},
        state.openedTxLikeTips[action.payload.txId], { password: action.payload.password });
      return Object.assign({}, {
        profilePostList: state.profilePostList,
          postList: state.postList,
          workingPost: updatedProps,
          workingPostReplies: state.workingPostReplies,
          isPublisherOpen: state.isPublisherOpen,
          activeViewingPost: state.activeViewingPost,
          openedTxLikeTips: Object.assign({}, state.openedTxLikeTips, {[action.payload.txId]: copyUpdateLikePassword}),
          notifications: state.notifications,
          currentPostOffsetId: state.currentPostOffsetId
        }
      );

    case PostsActionTypes.UpdateLikeTipAmount:
      const copyUpdateLikeTipAmount = Object.assign({},
        state.openedTxLikeTips[action.payload.txId],
         { tipAmount: action.payload.tipAmount });

      return Object.assign({}, {
        profilePostList: state.profilePostList,
          postList: state.postList,
          workingPost: updatedProps,
          workingPostReplies: state.workingPostReplies,
          isPublisherOpen: state.isPublisherOpen,
          activeViewingPost: state.activeViewingPost,
          openedTxLikeTips: Object.assign({}, state.openedTxLikeTips, {[action.payload.txId]: copyUpdateLikeTipAmount}),
          notifications: state.notifications,
          currentPostOffsetId: state.currentPostOffsetId
        }
      );

    case PostsActionTypes.PublishLike:
      const copyUpdateLikeTipAmountSubmitting = Object.assign({}, state.openedTxLikeTips[action.payload.txId], { submitting: true });

      return Object.assign({}, {
        profilePostList: state.profilePostList,
          postList: state.postList,
          workingPost: updatedProps,
          workingPostReplies: state.workingPostReplies,
          isPublisherOpen: state.isPublisherOpen,
          activeViewingPost: state.activeViewingPost,
          openedTxLikeTips: Object.assign({}, state.openedTxLikeTips, {[action.payload.txId]: copyUpdateLikeTipAmountSubmitting}),
          notifications: state.notifications,
          currentPostOffsetId: state.currentPostOffsetId
        }
      );

    case PostsActionTypes.PublishReplyComplete:
      const copyUpdateLikeTipAmountSubmittingComplete = Object.assign({},
        state.openedTxLikeTips[action.payload.txId], { submitting: false });

      return Object.assign({}, {
        profilePostList: state.profilePostList,
          postList: state.postList,
          workingPost: updatedProps,
          workingPostReplies: state.workingPostReplies,
          isPublisherOpen: state.isPublisherOpen,
          activeViewingPost: state.activeViewingPost,
          openedTxLikeTips: Object.assign({}, state.openedTxLikeTips, {[action.payload.txId]: copyUpdateLikeTipAmountSubmittingComplete}),
          notifications: state.notifications,
          currentPostOffsetId: state.currentPostOffsetId
        }
      );

    case PostsActionTypes.PublishCommunityComplete:
      return Object.assign({}, state,
        {
          profilePostList: state.profilePostList,
          postList: state.postList,
          workingPost: {
            messageBody: ''
          },
          isPublisherOpen: false,
          activeViewingPost: state.activeViewingPost,
          openedTxLikeTips: state.openedTxLikeTips,
          notifications: state.notifications,
          currentPostOffsetId: state.currentPostOffsetId
        }
      );

    case PostsActionTypes.StopSubmittingLike:
      const copyUpdateLikeTipAmountStopSubmitComplete = Object.assign({},
        state.openedTxLikeTips[action.payload.txId], { submitting: false });

      return Object.assign({}, {
        profilePostList: state.profilePostList,
          postList: state.postList,
          workingPost: updatedProps,
          workingPostReplies: state.workingPostReplies,
          isPublisherOpen: state.isPublisherOpen,
          activeViewingPost: state.activeViewingPost,
          openedTxLikeTips: Object.assign({}, state.openedTxLikeTips, {[action.payload.txId]: copyUpdateLikeTipAmountStopSubmitComplete}),
          notifications: state.notifications,
          currentPostOffsetId: state.currentPostOffsetId
        }
      );

    default: {
      return state;
    }
  }
}
