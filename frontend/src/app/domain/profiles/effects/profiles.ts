import { Inject, Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/RX';
import { from } from 'rxjs/observable/from';
import { map, switchMap, mergeMap } from 'rxjs/operators';
import { ProfilesActionTypes,
  FetchSetProfilesList,
  FetchSetProfilesListComplete,
  FetchProfileInfo,
  FetchProfileInfoComplete,
  FetchProfileExtendedInfo,
  FetchProfileExtendedInfoComplete,
  FetchProfileFollowers,
  FetchProfileFollowersComplete,
  FetchProfileFollowings,
  FetchProfileFollowingsComplete,
  FetchProfileLikes,
  FetchProfileLikesComplete,
  ResolveProfileInfos,
  SaveConfirmPhoto,
  SaveConfirmPhotoComplete,
  SaveConfirmAvatar,
  SaveConfirmAvatarComplete,
  SaveConfirmName,
  SaveConfirmNameComplete,
  FollowUser,
  FollowUserComplete,
  UnfollowUser,
  UnfollowUserComplete,
  FetchActiveProfiles
} from '../actions/profiles';
import { ProfileInfo } from '../models/profile-info.interface';
import * as profilesActions from '../actions/profiles';
import mockData from '../helpers/mock-data';
import { ApiService } from '../../../services/api.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/withLatestFrom';

import * as profileActions from '../../profiles/actions/profiles';
import * as alertsActions from '../../alerts/actions/alerts';
import * as sessionActions from '../../session/actions/session';
import * as fromProfiles from '../reducers';
import * as fromSession from '../reducers';

@Injectable()
export class ProfilesEffects {


@Effect()
followUser$: Observable<Action> = this.actions$
.ofType<FollowUser>(ProfilesActionTypes.FollowUser)
.map((action: profilesActions.FollowUser) => action.payload)
.mergeMap((payload: string) => {
  return this.api.callBlockPressApi(null,
    `/api/profiles/following/${payload}`, 'post')
      .mergeMap((response) => {
        return [
          new sessionActions.Fetch(),
          new profilesActions.FetchProfileExtendedInfo({
            addresses: [payload],
            isCurrentUser: false,
            forceLoad: true
          }),
          new profilesActions.FollowUserComplete({response: response.responseBody})
        ];
      })
      .catch((err) => from([
      ]));
  });

@Effect()
unfollowUser$: Observable<Action> = this.actions$
.ofType<UnfollowUser>(ProfilesActionTypes.UnfollowUser)
.map((action: profilesActions.UnfollowUser) => action.payload)
.mergeMap((payload: string) => {
  return this.api.callBlockPressApi(null,
    `/api/profiles/following/${payload}`, 'delete')
      .mergeMap((response) => {
        return [
          new sessionActions.Fetch(),
          new profilesActions.FetchProfileExtendedInfo({
            addresses: [payload],
            isCurrentUser: false,
            forceLoad: true
          }),
          new profilesActions.FollowUserComplete({response: response.responseBody})
        ];
      })
      .catch((err) => from([
      ]));
  });

@Effect()
  saveConfirmNamePhoto$: Observable<Action> = this.actions$
  .ofType<SaveConfirmName>(ProfilesActionTypes.SaveConfirmName)
  .map((action: profilesActions.SaveConfirmName) => action.payload)
  .mergeMap((payload: string) => {
    return this.api.callBlockPressApi({name: payload},
      `/api/profiles/name`, 'post')
        .mergeMap((response) => {
          return [
            new sessionActions.Fetch(),
            new profilesActions.SaveConfirmNameComplete({response: response.responseBody})
          ];
        })
        .catch((err) => from([
        ]));
    });

@Effect()
  saveConfirmAvatarPhoto$: Observable<Action> = this.actions$
  .ofType<SaveConfirmAvatar>(ProfilesActionTypes.SaveConfirmAvatar)
  .map((action: profilesActions.SaveConfirmAvatar) => action.payload)
  .mergeMap((payload: string) => {
    return this.api.callBlockPressApi({link: payload},
      `/api/profiles/avatar`, 'post')
        .mergeMap((response) => {
          return [
            new sessionActions.Fetch(),
            new profilesActions.SaveConfirmAvatarComplete({response: response.responseBody})
          ];
        })
        .catch((err) => from([
        ]));
    });

@Effect()
  saveConfirmProfilePhoto$: Observable<Action> = this.actions$
  .ofType<SaveConfirmPhoto>(ProfilesActionTypes.SaveConfirmPhoto)
  .map((action: profilesActions.SaveConfirmPhoto) => action.payload)
  .mergeMap((payload: string) => {
    return this.api.callBlockPressApi({link: payload},
      `/api/profiles/header`, 'post')
        .mergeMap((response) => {
          return [
            new sessionActions.Fetch(),
            new profilesActions.SaveConfirmPhotoComplete({response: response.responseBody})
          ];
        })
        .catch((err) => from([
        ]));
    });

@Effect()
  fetchProfileInfo$: Observable<Action> = this.actions$
  .ofType<FetchProfileInfo>(ProfilesActionTypes.FetchProfileInfo)
  .withLatestFrom(this.profileStore$)
  .mergeMap((action: any, storeState: any, theApi = this.api) => {
    const theOriginalAction = action[0];
    const stateProfiles = action[1].profilesState.profiles.profiles;
    if (!theOriginalAction.payload.addresses || !theOriginalAction.payload.addresses.length) {
      return [];
    }
    const addressesToFetch = [];
    for (const address of theOriginalAction.payload.addresses) {
      if (stateProfiles && stateProfiles[address]) {
        // Do nothing since we have it
        if (theOriginalAction.payload.forceLoad) {
          addressesToFetch.push(address);
        }
      } else {
        addressesToFetch.push(address);
      }
    }
    if (!addressesToFetch.length) {
      return [];
    }

    return this.api.callBlockPressApi(null,
      `/api/profiles/${addressesToFetch.join(',')}/basic`, 'get')
        .mergeMap((response) => {
          return [
            new profilesActions.FetchProfileInfoComplete({
              response: response.responseBody,
              isCurrentUser: theOriginalAction.payload.isCurrentUser
            })
          ];
        });
    }).catch((err) => from([
    ]));



@Effect()
fetchProfileExtendedInfo$: Observable<Action> = this.actions$
.ofType<FetchProfileExtendedInfo>(ProfilesActionTypes.FetchProfileExtendedInfo)
.withLatestFrom(this.profileStore$)
.mergeMap((action: any, storeState: any, theApi = this.api) => {
  const theAction = action[0];
  const stateProfiles = action[1].profilesState.profiles.profiles;
  if (!theAction.payload.addresses || !theAction.payload.addresses.length) {
    return [];
  }
  const addressesToFetch = [];
  for (const address of theAction.payload.addresses) {
    if (stateProfiles && stateProfiles[address]) {
      if (theAction.payload.forceLoad) {
        addressesToFetch.push(address);
      }
    } else {
      addressesToFetch.push(address);
    }
  }

  if (!addressesToFetch.length) {
    return [];
  }
  return this.api.callBlockPressApi(null,
    `/api/profiles/${addressesToFetch.join(',')}/extended`, 'get')
      .mergeMap((response) => {
        return [
          new profilesActions.FetchProfileExtendedInfoComplete({
            response: response.responseBody,
            isCurrentUser: theAction.payload.isCurrentUser
          })
        ];
      });
  }).catch((err) => from([
  ]));


@Effect()
  fetchProfileFollowers$: Observable<Action> = this.actions$
  .ofType<FetchProfileFollowers>(ProfilesActionTypes.FetchProfileFollowers)
  .map((action: profilesActions.FetchProfileFollowers) => action.payload)
  .mergeMap((payload: {address: string}) => {
    if (!payload.address || payload.address === '') {
      return [];
    }
    return this.api.callBlockPressApi(null,
      `/api/profiles/${payload.address}/followers`, 'get')
        .mergeMap((response) => {
          return [
            new profilesActions.FetchProfileFollowersComplete(response.responseBody)
          ];
        })
        .catch((err) => from([
        ]));
    });

@Effect()
  fetchSetupProfiles$: Observable<Action> = this.actions$
  .ofType<FetchSetProfilesList>(ProfilesActionTypes.FetchSetProfilesList)
  .map((action: profilesActions.FetchSetProfilesList) => action.payload)
  .mergeMap((payload: {offsetId?: number, count?: number}) => {
    return this.api.callBlockPressApi(null,
      `/api/profiles/search?offsetId=${payload.offsetId}&count=${payload.count}`, 'get')
        .mergeMap((response) => {
          return [
            new profilesActions.FetchSetProfilesListComplete(response.responseBody)
          ];
        })
        .catch((err) => from([
        ]));
    });

  @Effect()
    fetchActiveProfiles$: Observable<Action> = this.actions$
    .ofType<FetchActiveProfiles>(ProfilesActionTypes.FetchActiveProfiles)
    .map((action: profilesActions.FetchActiveProfiles) => action.payload)
    .mergeMap((payload: any) => {
      return this.api.callBlockPressApi(null,
        `/api/profiles/active`, 'get')
          .mergeMap((response) => {
            return [
              new profilesActions.FetchSetProfilesListComplete(response.responseBody)
            ];
          })
          .catch((err) => from([
          ]));
      });



  @Effect()
    fetchProfileFollowings$: Observable<Action> = this.actions$
    .ofType<FetchProfileFollowings>(ProfilesActionTypes.FetchProfileFollowings)
    .map((action: profilesActions.FetchProfileFollowings) => action.payload)
    .mergeMap((payload: {address: string}) => {
      if (!payload.address || payload.address === '') {
        return [];
      }
      return this.api.callBlockPressApi(null,
        `/api/profiles/${payload.address}/following`, 'get')
          .mergeMap((response) => {
            return [
              new profilesActions.FetchProfileFollowingsComplete(response.responseBody)
            ];
          })
          .catch((err) => from([
          ]));
      });

  @Effect()
    fetchProfileLikes$: Observable<Action> = this.actions$
    .ofType<FetchProfileLikes>(ProfilesActionTypes.FetchProfileLikes)
    .map((action: profilesActions.FetchProfileLikes) => action.payload)
    .mergeMap((payload: {address: string}) => {
      if (!payload.address || payload.address === '') {
        return [];
      }
      return this.api.callBlockPressApi(null,
        `/api/profiles/${payload.address}/likes`, 'get')
          .mergeMap((response) => {
            const profilesToResolveActions = [];
            for (const likedPost of response.responseBody) {
              profilesToResolveActions.push(new profilesActions.FetchProfileInfo({addresses: [likedPost.authorId], isCurrentUser: false}));
            }
            return [
              new profilesActions.FetchProfileLikesComplete(response.responseBody)
            ].concat(profilesToResolveActions);
          })
          .catch((err) => from([
          ]));
      });

  @Effect()
    resolveProfiles$: Observable<Action> = this.actions$
    .ofType<ResolveProfileInfos>(ProfilesActionTypes.ResolveProfileInfos)
    .map((action: profilesActions.ResolveProfileInfos) => action.payload)
    .mergeMap((payload: {storedProfiles: any, resolveProfiles: Array<string>}) => {
      const fetchProfiles = [];
      const actionsFetch = [];
      // Perform the fetch for the profiles we do not yet have locally
      return actionsFetch;
    });

  constructor(
    private actions$: Actions,
    private api: ApiService,
    private profileStore$: Store<fromProfiles.State>) { }
}

