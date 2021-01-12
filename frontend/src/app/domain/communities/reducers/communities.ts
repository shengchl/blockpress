import { createSelector } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Community } from '../models/community.interface';
import { CommunitiesActionTypes, CommunitiesActionsUnion } from '../actions/communities';
import { communitiesPayloadParser} from '../helpers/payload-parser';
import { Post } from '../../posts/models/post.interface';
import { postsPayloadParser, postPayloadParser, userNotificationsPayloadParser } from '../../posts/helpers/payload-parser';

declare var $;

export interface State {
  communityList: Array<Community>;
  communityPosts: Array<Post>;
}

const initialState: State = {
  communityList: [],
  communityPosts: []
};

export function reducer(
  state = initialState,
  action: CommunitiesActionsUnion,
): State {

  switch (action.type) {
    case CommunitiesActionTypes.FetchCommunitiesComplete:
      let communitiesTotal = communitiesPayloadParser(action.payload.communities);
      if (action.payload.offsetId) {
         communitiesTotal = state.communityList.concat(communitiesPayloadParser(action.payload.communities));
      }
      return Object.assign({}, state,
        {
          communityList: communitiesTotal,
          communityPosts: state.communityPosts
        }
      );
    case CommunitiesActionTypes.FetchCommunityPostsComplete:
      let postsToTotal = postsPayloadParser(action.payload.posts);
      if (action.payload.offsetId) {
          postsToTotal = state.communityPosts.concat(postsPayloadParser(action.payload.posts));
      }
      return Object.assign({}, state,
        {
          communityList: state.communityList,
          communityPosts: postsToTotal
        }
      );

    default: {
      return state;
    }
  }
}
