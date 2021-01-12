import { Inject, Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/RX';
import { from } from 'rxjs/observable/from';
import { map, switchMap, mergeMap } from 'rxjs/operators';
import { PostsActionTypes,
  Publish,
  PublishComplete,
  PublishCommunity,
  PublishCommunityComplete,
  PublishReply,
  PublishReplyComplete,
  FetchFeed,
  FetchFeedComplete,
  FetchProfileFeed,
  FetchProfileFeedComplete,
  FetchPostReplies,
  FetchPostRepliesComplete,
  ReloadPost,
  ReloadPostComplete,
  PublishLike,
  PublishLikeComplete,
  FetchPost,
  FetchPostComplete,
  FetchNotifications,
  FetchNotificationsComplete,
  PerformSearch,
  PerformSearchComplete,
  FetchRepliesFeed
} from '../actions/posts';
import { PostPublish } from '../models/post-publish.interface';
import * as postsActions from '../actions/posts';
import * as sessionActions from '../../session/actions/session';
import * as publisherActions from '../../publisher/actions/publisher';
import * as profileActions from '../../profiles/actions/profiles';
import * as communitiesActions from '../../communities/actions/communities';
import * as alertsActions from '../../alerts/actions/alerts';
import mockData from '../helpers/mock-data';
import { ApiService } from '../../../services/api.service';
import * as fromProfiles from '../reducers';
import * as moment from 'moment';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/withLatestFrom';
import { SessionActionTypes } from '../../session/actions/session';
import PostHelpers from '../../../helpers/post-helpers';

@Injectable()
export class PostsEffects {

@Effect()
  fetch$: Observable<Action> = this.actions$
  .ofType<FetchFeed>(PostsActionTypes.FetchFeed)
  .withLatestFrom(this.profileStore$)
  .mergeMap((action: any, storeState: any, theApi = this.api) => {
    const theOriginalAction = action[0];
    const stateProfiles = action[1].profilesState.profiles;
      console.log('theOriginal action ========', theOriginalAction);
      let feedUrl = `/api/posts/feed/index?offset_id=${theOriginalAction.payload.offsetId}`;

      if (theOriginalAction.payload.isTop) {
        const range = PostHelpers.getUnixFromRange(theOriginalAction.payload.range);
        feedUrl = `/api/posts/top/index?&range=${range}&offset_id=${theOriginalAction.payload.offsetId}`;
      }

      return theApi.callBlockPressApi(null, feedUrl, 'get')
        .mergeMap((response) => {
          const newActions = [];
          const maxBatchSize = 10;
          let counter = 0;
          let profileAddressBatch = [];
          let lastBatchNeedsPush = true;
          const uniqueAuthorIds = {};
          for (const post of response.responseBody) {
            uniqueAuthorIds[post.authorId] = post.authorId;
            if (post.isLikeTippedAddress) {
              uniqueAuthorIds[post.isLikeTippedAddress] = post.isLikeTippedAddress;
            }
          }
          Object.keys(uniqueAuthorIds).forEach(key => {
            lastBatchNeedsPush = true;
            profileAddressBatch.push(key);
            counter++;
            if (counter >= maxBatchSize) {
              newActions.push(new profileActions.FetchProfileInfo({
                addresses: profileAddressBatch,
                loadedProfilesMap: stateProfiles,
                isCurrentUser: false
              }));
              profileAddressBatch = [];
              counter = 0;
              lastBatchNeedsPush = false;
            }
          });
          if (lastBatchNeedsPush) {
            newActions.push(new profileActions.FetchProfileInfo({
              addresses: profileAddressBatch,
              loadedProfilesMap: stateProfiles,
              isCurrentUser: false
            }));
          }
          return [
            new postsActions.FetchFeedComplete({
              posts: response.responseBody,
              offsetId: theOriginalAction.payload.offsetId
            }),
          ].concat(newActions);
        });
    }).catch((err) => from([
    ]));


  @Effect()
    fetchRepliesFeed$: Observable<Action> = this.actions$
    .ofType<FetchRepliesFeed>(PostsActionTypes.FetchRepliesFeed)
    .withLatestFrom(this.profileStore$)
    .mergeMap((action: any, storeState: any, theApi = this.api) => {
      const theOriginalAction = action[0];
      const stateProfiles = action[1].profilesState.profiles;
        const feedUrl = `/api/posts/replies/index?offset_id=${theOriginalAction.payload.offsetId}`;
        return theApi.callBlockPressApi(null, feedUrl, 'get')
          .mergeMap((response) => {
            const newActions = [];
            const maxBatchSize = 10;
            let counter = 0;
            let profileAddressBatch = [];
            let lastBatchNeedsPush = true;
            const uniqueAuthorIds = {};
            for (const post of response.responseBody) {
              uniqueAuthorIds[post.authorId] = post.authorId;
              if (post.isLikeTippedAddress) {
                uniqueAuthorIds[post.isLikeTippedAddress] = post.isLikeTippedAddress;
              }
            }
            Object.keys(uniqueAuthorIds).forEach(key => {
              lastBatchNeedsPush = true;
              profileAddressBatch.push(key);
              counter++;
              if (counter >= maxBatchSize) {
                newActions.push(new profileActions.FetchProfileInfo({
                  addresses: profileAddressBatch,
                  loadedProfilesMap: stateProfiles,
                  isCurrentUser: false
                }));
                profileAddressBatch = [];
                counter = 0;
                lastBatchNeedsPush = false;
              }
            });
            if (lastBatchNeedsPush) {
              newActions.push(new profileActions.FetchProfileInfo({
                addresses: profileAddressBatch,
                loadedProfilesMap: stateProfiles,
                isCurrentUser: false
              }));
            }
            return [
              new postsActions.FetchFeedComplete({
                posts: response.responseBody,
                offsetId: theOriginalAction.payload.offsetId
              }),
              new sessionActions.Fetch()
            ].concat(newActions);
          });
      }).catch((err) => from([
      ]));

  @Effect()
    fetchNotifications$: Observable<Action> = this.actions$
    .ofType<FetchNotifications>(PostsActionTypes.FetchNotifications)
    .withLatestFrom(this.profileStore$)
    .mergeMap((action: any, storeState: any, theApi = this.api) => {
      const theOriginalAction = action[0];
      const stateProfiles = action[1].profilesState.profiles;
        return theApi.callBlockPressApi(null, `/api/notifications/index?offset_id=${theOriginalAction.payload.offsetId}`, 'get')
          .mergeMap((response) => {
            const newActions = [];
            const maxBatchSize = 10;
            let counter = 0;
            let profileAddressBatch = [];
            let lastBatchNeedsPush = true;
            const uniqueAuthorIds = {};
            for (const post of response.responseBody) {
              uniqueAuthorIds[post.entity.authorId] = post.entity.authorId;
              if (post.entity.isLikeTippedAddress) {
                uniqueAuthorIds[post.entity.isLikeTippedAddress] = post.entity.isLikeTippedAddress;
              }
            }
            Object.keys(uniqueAuthorIds).forEach(key => {
              lastBatchNeedsPush = true;
              profileAddressBatch.push(key);
              counter++;
              if (counter >= maxBatchSize) {
                newActions.push(new profileActions.FetchProfileInfo({
                  addresses: profileAddressBatch,
                  loadedProfilesMap: stateProfiles,
                  isCurrentUser: false
                }));
                profileAddressBatch = [];
                counter = 0;
                lastBatchNeedsPush = false;
              }
            });
            if (lastBatchNeedsPush) {
              newActions.push(new profileActions.FetchProfileInfo({
                addresses: profileAddressBatch,
                loadedProfilesMap: stateProfiles,
                isCurrentUser: false
              }));
            }
            return [
              new postsActions.FetchNotificationsComplete({
                notifications: response.responseBody,
                offsetId: theOriginalAction.payload.offsetId
              }),
            ].concat(newActions);
          });
      }).catch((err) => from([
      ]));


    @Effect()
      performSearch$: Observable<Action> = this.actions$
      .ofType<PerformSearch>(PostsActionTypes.PerformSearch)
      .withLatestFrom(this.profileStore$)
      .mergeMap((action: any, storeState: any, theApi = this.api) => {
        const theOriginalAction = action[0];
        const stateProfiles = action[1].profilesState.profiles;
          return theApi.callBlockPressApi(null,
            `/api/posts/search/hashtag/${theOriginalAction.payload.searchQuery}?offset_id=${theOriginalAction.payload.offsetId}`, 'get')
            .mergeMap((response) => {
              const newActions = [];
              const maxBatchSize = 10;
              let counter = 0;
              let profileAddressBatch = [];
              let lastBatchNeedsPush = true;
              const uniqueAuthorIds = {};
              for (const post of response.responseBody) {
                uniqueAuthorIds[post.authorId] = post.authorId;
                if (post.isLikeTippedAddress) {
                  uniqueAuthorIds[post.isLikeTippedAddress] = post.isLikeTippedAddress;
                }
              }
              Object.keys(uniqueAuthorIds).forEach(key => {
                lastBatchNeedsPush = true;
                profileAddressBatch.push(key);
                counter++;
                if (counter >= maxBatchSize) {
                  newActions.push(new profileActions.FetchProfileInfo({
                    addresses: profileAddressBatch,
                    loadedProfilesMap: stateProfiles,
                    isCurrentUser: false
                  }));
                  profileAddressBatch = [];
                  counter = 0;
                  lastBatchNeedsPush = false;
                }
              });
              if (lastBatchNeedsPush) {
                newActions.push(new profileActions.FetchProfileInfo({
                  addresses: profileAddressBatch,
                  loadedProfilesMap: stateProfiles,
                  isCurrentUser: false
                }));
              }
              return [
                new postsActions.FetchFeedComplete({
                  posts: response.responseBody,
                  offsetId: theOriginalAction.payload.offsetId
                }),
              ].concat(newActions);
            });
        }).catch((err) => from([
        ]));

@Effect()
fetchPost$: Observable<Action> = this.actions$
.ofType<FetchPost>(PostsActionTypes.FetchPost)
.map((action: postsActions.FetchPost) => action.payload)
.mergeMap((payload: {txId: string, resolveAuthor?: boolean}) => {
  return this.api.callBlockPressApi(null,
    `/api/posts/tx/${payload.txId}`, 'get')
      .mergeMap((response) => {
        const actions = [];
        if (payload.resolveAuthor) {
          actions.push(new profileActions.StoreWorkingProfileId(response.responseBody.authorId));
        }
        return actions.concat(
          [
            new postsActions.FetchPostReplies(payload),
            new postsActions.FetchPostComplete({
              post: response.responseBody,
            })
          ]);
      })
      .catch((err) => from([
      ]));
  });

@Effect()
reloadPost$: Observable<Action> = this.actions$
.ofType<ReloadPost>(PostsActionTypes.ReloadPost)
.map((action: postsActions.ReloadPost) => action.payload)
.mergeMap((payload: {txId: string}) => {
  return this.api.callBlockPressApi(null,
    `/api/posts/tx/${payload.txId}`, 'get')
      .mergeMap((response) => {
        return [
            new profileActions.StoreWorkingProfileId(response.responseBody.authorId),
            new postsActions.FetchPostReplies(payload),
            new postsActions.ReloadPostComplete({
              post: response.responseBody,
            }),
          ];
      })
      .catch((err) => from([
      ]));
  });


@Effect()
fetchPostReplies$: Observable<Action> = this.actions$
.ofType<FetchPostReplies>(PostsActionTypes.FetchPostReplies)
.map((action: postsActions.FetchPostReplies) => action.payload)
.mergeMap((payload: { txId: string, loadedProfilesMap?: any }) => {
  return this.api.callBlockPressApi(null,
    `/api/posts/tx/${payload.txId}/replies`, 'get')
      .mergeMap((response) => {
        const newActions = [];
        const maxBatchSize = 10;
        let counter = 0;
        let profileAddressBatch = [];
        let lastBatchNeedsPush = true;
        for (const post of response.responseBody) {
          lastBatchNeedsPush = true;
          profileAddressBatch.push(post.authorId);
          counter++;
          if (counter >= maxBatchSize) {
            newActions.push(new profileActions.FetchProfileInfo({
              addresses: profileAddressBatch,
              loadedProfilesMap: payload.loadedProfilesMap,
              isCurrentUser: false}));
            profileAddressBatch = [];
            counter = 0;
            lastBatchNeedsPush = false;
          }
        }
        if (lastBatchNeedsPush && newActions.length) {
          newActions.push(new profileActions.FetchProfileInfo({addresses: profileAddressBatch, isCurrentUser: false}));
        }
        return [
          new postsActions.FetchPostRepliesComplete({
            posts: response.responseBody,
            txId: payload.txId
          }),
        ].concat(newActions);
      })
      .catch((err) => from([
      ]));
  });


@Effect()
  fetchProfilePosts$: Observable<Action> = this.actions$
  .ofType<FetchProfileFeed>(PostsActionTypes.FetchProfileFeed)
  .map((action: postsActions.FetchProfileFeed) => action.payload)
  .mergeMap((payload: {address: string, offsetId?: number}) => {
    return this.api.callBlockPressApi(null,
      `/api/posts/profiles/${payload.address}/index?offset_id=${payload.offsetId}`, 'get')
        .mergeMap((response) => {
          return [
            new postsActions.FetchProfileFeedComplete(response.responseBody)
          ];
        })
        .catch((err) => from([
        ]));
    });

@Effect()
publishCommunity$: Observable<Action> = this.actions$
.ofType<PublishCommunity>(PostsActionTypes.PublishCommunity)
.map((action: postsActions.PublishCommunity) => action.payload)
.mergeMap((payload: {body: string, communityName: string, imageUrlOrIpfs?: string}) => {
  return this.api.callBlockPressApi(payload, `/api/posts`, 'post')
      .mergeMap((response) => {
        const publishResult = {
          txId: response.txId,
          authorId: response.authorId,
          messageBody: payload.body,
          createdAt: response.createdAt,
          tags: ''
        };
        return [
          new postsActions.PublishCommunityComplete(publishResult),
          new communitiesActions.FetchCommunityPosts({
            communityName: payload.communityName,
          }),
          new publisherActions.ClosePublisher({
            txId: null
          })
        ];
      })
      .catch((err) => {
        return [
          new alertsActions.PushAlert({
            type: 'danger',
            message: err,
            permanent: false,
            imperative: false
          }),
        ];
      });
  });


@Effect()
publishReply$: Observable<Action> = this.actions$
.ofType<PublishReply>(PostsActionTypes.PublishReply)
.map((action: postsActions.PublishReply) => action.payload)
.mergeMap((payload: {txId: string, body: string, tip: number}) => {
  return this.api.callBlockPressApi(payload, `/api/posts/tx/${payload.txId}/replies`, 'post')
      .mergeMap((response) => {
        const publishResult = {
          txId: response.txId,
          authorId: response.authorId,
          messageBody: payload.body,
          createdAt: response.createdAt,
          tags: ''
        };
        return [
          new postsActions.PublishReplyComplete(publishResult),
          new postsActions.FetchPost({txId: payload.txId}),
          new publisherActions.ClosePublisher({
            txId: null
          })
        ];
      })
      .catch((err) => {
        return [
          new alertsActions.PushAlert({
            type: 'danger',
            message: err,
            permanent: false,
            imperative: false
          }),
        ];
      });
  });


  @Effect()
  publishLike$: Observable<Action> = this.actions$
  .ofType<PublishLike>(PostsActionTypes.PublishLike)
  .map((action: postsActions.PublishLike) => action.payload)
  .mergeMap((payload: {txId: string, body: string, tip?: number, password?: string}) => {
    return this.api.callBlockPressApi(payload, `/api/posts/tx/${payload.txId}/likes`, 'post')
        .mergeMap((response) => {
          const publishResult = {
            txId: response.txId,
            authorId: response.authorId,
            messageBody: payload.body,
            createdAt: response.createdAt,
            tags: ''
          };

          const actions = [];
          return actions.concat([
            new postsActions.PublishReplyComplete(publishResult),
            new postsActions.CloseLikeTipReplyForPost({txId: payload.txId}),
            new postsActions.StopSubmittingLike({txId: payload.txId}),
            new postsActions.FetchPostReplies(payload.txId),
            new postsActions.ReloadPost({
              txId: payload.txId
            }),
            new sessionActions.Fetch()
          ]);
        })
        .catch((err) => {
          return [
            new alertsActions.PushAlert({
              type: 'danger',
              message: err,
              permanent: false,
              imperative: false,
              selectiveDisplay: true,
              selectKey: `tip-giving-alert-${payload.txId}`
            }),
            new postsActions.StopSubmittingLike({txId: payload.txId})
          ];
        });
    });


@Effect()
  publish$: Observable<Action> = this.actions$
  .ofType<Publish>(PostsActionTypes.Publish)
  .map((action: postsActions.Publish) => action.payload)
  .mergeMap((payload: {body: string, imageUrlOrIpfs?: string}) => {
    return this.api.callBlockPressApi(payload, '/api/posts', 'post')
        .mergeMap((response) => {
          const publishResult = {
            txId: response.txId,
            authorId: response.authorId,
            messageBody: payload.body,
            createdAt: response.createdAt,
            tags: ''
          };
          return [
            new postsActions.FetchFeed({
              offsetId: 0,
            }),
            new postsActions.PublishComplete(publishResult),
            new publisherActions.ClosePublisher({
              txId: null
            })
          ];
        })
        .catch((err) => {
          return [
            new alertsActions.PushAlert({
              type: 'danger',
              message: err,
              permanent: false,
              imperative: true
            })
          ];
        });
    });

  constructor(
    private actions$: Actions,
    private api: ApiService,
    private profileStore$: Store<fromProfiles.State>) { }
}

