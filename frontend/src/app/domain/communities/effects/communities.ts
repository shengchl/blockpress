import { Inject, Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/RX';
import { from } from 'rxjs/observable/from';
import { map, switchMap, mergeMap } from 'rxjs/operators';
import { CommunitiesActionTypes,
  FetchCommunities,
  FetchCommunitiesComplete,
  FetchCommunityPosts,
  FetchCommunityPostsComplete

} from '../actions/communities';
import { Community } from '../models/community.interface';
import * as communitiesActions from '../actions/communities';
import * as alertsActions from '../../alerts/actions/alerts';
import mockData from '../helpers/mock-data';
import { ApiService } from '../../../services/api.service';
import * as fromProfiles from '../reducers';
import * as profileActions from '../../profiles/actions/profiles';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/withLatestFrom';

@Injectable()
export class CommunitiesEffects {

@Effect()
  fetchCommunities$: Observable<Action> = this.actions$
  .ofType<FetchCommunities>(CommunitiesActionTypes.FetchCommunities)
  .map((action: communitiesActions.FetchCommunities) => action.payload)
  .mergeMap((payload: {offsetId?: number}) => {
      return this.api.callBlockPressApi(null, `/api/communities/index?offset_id=${payload.offsetId}`, 'get')
        .mergeMap((response) => {
          return [
            new communitiesActions.FetchCommunitiesComplete({
              communities: response.responseBody,
              offsetId: payload.offsetId
            }),
          ];
        });
    }).catch((err) => from([
    ]));

    @Effect()
fetchCommunityPosts$: Observable<Action> = this.actions$
  .ofType<FetchCommunityPosts>(CommunitiesActionTypes.FetchCommunityPosts)
  .withLatestFrom(this.profileStore$)
  .mergeMap((action: any, storeState: any, theApi = this.api) => {
    const theOriginalAction = action[0];
    const stateProfiles = action[1].profilesState.profiles;
      return theApi.callBlockPressApi(null,
        `/api/posts/communities/query?q=${theOriginalAction.payload.communityName}&offset_id=${theOriginalAction.payload.offsetId}`, 'get')
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
            new communitiesActions.FetchCommunityPostsComplete({
              posts: response.responseBody,
              communityName: theOriginalAction.payload.communityName,
              offsetId: theOriginalAction.payload.offsetId
            }),
          ].concat(newActions);
        });
    }).catch((err) => from([
    ]));

  constructor(
    private actions$: Actions,
    private api: ApiService,
    private profileStore$: Store<fromProfiles.State>) { }
}



