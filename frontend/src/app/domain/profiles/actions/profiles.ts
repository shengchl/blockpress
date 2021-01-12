import { Action } from '@ngrx/store';
import { ProfileInfo } from '../models/profile-info.interface';

export enum ProfilesActionTypes {
  FetchActiveProfiles = '[Profiles] Fetch Active profiles',
  FetchSetProfilesList = '[Profiles] Fetch Setup profiles',
  FetchSetProfilesListComplete = '[Profiles] Fetch Setup profiles Complete',
  FetchProfileExtendedInfo = '[Profiles] Fetch Profile Extended Info',
  FetchProfileExtendedInfoComplete = '[Profiles] Fetch Profile Extended Info Complete',
  FetchProfileInfo = '[Profiles] Fetch Profile Info',
  FetchProfileInfoComplete = '[Profiles] Fetch Profile Info Complete',
  FetchProfileFollowers = '[Profiles] Fetch Profile Followers',
  FetchProfileFollowersComplete = '[Profiles] Fetch Profile Followers Complete',
  FetchProfileFollowings = '[Profiles] Fetch Profile Followings',
  FetchProfileFollowingsComplete = '[Profiles] Fetch Profile Followings Complete',
  FetchProfileLikes = '[Profiles] Fetch Profile Likes',
  FetchProfileLikesComplete = '[Profiles] Fetch Profile Likes Complete',
  ResolveProfileInfos = '[Profiles] Resolve Profiles',
  StartEditProfile = '[Profiles] Start edit',
  CloseEditProfile = '[Profiles] Close edit',
  StartConfirmPhoto = '[Profiles] Start confirm photo',
  CancelConfirmPhoto = '[Profiles] Cancel confirm photo',
  SaveConfirmPhoto = '[Profiles] Save confirm photo',
  SaveConfirmPhotoComplete = '[Profiles] Save confirm photo complete',
  StartConfirmAvatar = '[Profiles] Start confirm avatar photo',
  CancelConfirmAvatar = '[Profiles] Cancel confirm avatar photo',
  SaveConfirmAvatar = '[Profiles] Save confirm avatar',
  SaveConfirmAvatarComplete = '[Profiles] Save confirm vatar complete',
  StartConfirmName = '[Profiles] Start confirm name',
  CancelConfirmName = '[Profiles] Cancel confirm name',
  SaveConfirmName = '[Profiles] Save confirm name',
  SaveConfirmNameComplete = '[Profiles] Save confirm name complete',
  FollowUser = '[Profiles] Follow user',
  FollowUserComplete = '[Profiles] Follow user complete',
  UnfollowUser = '[Profiles] Unfollow user',
  UnfollowUserComplete = '[Profiles] Unfollow user complete',
  StoreWorkingProfileId = '[Profiles] Store working profile id',
}

export class StoreWorkingProfileId implements Action {
  readonly type = ProfilesActionTypes.StoreWorkingProfileId;
  constructor(public payload: string) {}
}

export class StartEditProfile implements Action {
  readonly type = ProfilesActionTypes.StartEditProfile;
  constructor() {}
}

export class CloseEditProfile implements Action {
  readonly type = ProfilesActionTypes.CloseEditProfile;

  constructor() {}
}

export class StartConfirmName implements Action {
  readonly type = ProfilesActionTypes.StartConfirmName;
  constructor(public payload: any) {}
}

export class CancelConfirmName implements Action {
  readonly type = ProfilesActionTypes.CancelConfirmName;

  constructor() {}
}

export class SaveConfirmName implements Action {
  readonly type = ProfilesActionTypes.SaveConfirmName;

  constructor(public payload: any ) {}
}

export class SaveConfirmNameComplete implements Action {
  readonly type = ProfilesActionTypes.SaveConfirmNameComplete;

  constructor(public payload: {response: string }) {}
}

export class StartConfirmPhoto implements Action {
  readonly type = ProfilesActionTypes.StartConfirmPhoto;
  constructor(public payload: any) {}
}

export class CancelConfirmPhoto implements Action {
  readonly type = ProfilesActionTypes.CancelConfirmPhoto;

  constructor() {}
}

export class SaveConfirmPhoto implements Action {
  readonly type = ProfilesActionTypes.SaveConfirmPhoto;

  constructor(public payload: string) {}
}

export class SaveConfirmPhotoComplete implements Action {
  readonly type = ProfilesActionTypes.SaveConfirmPhotoComplete;

  constructor(public payload: {response: string }) {}
}

export class StartConfirmAvatar implements Action {
  readonly type = ProfilesActionTypes.StartConfirmAvatar;

  constructor(public payload: string) {}
}

export class CancelConfirmAvatar implements Action {
  readonly type = ProfilesActionTypes.CancelConfirmAvatar;

  constructor() {}
}

export class SaveConfirmAvatar implements Action {
  readonly type = ProfilesActionTypes.SaveConfirmAvatar;

  constructor(public payload: string) {}
}

export class SaveConfirmAvatarComplete implements Action {
  readonly type = ProfilesActionTypes.SaveConfirmAvatarComplete;

  constructor(public payload: {response: string }) {}
}


export class FollowUser implements Action {
  readonly type = ProfilesActionTypes.FollowUser;

  constructor(public payload: string) {}
}

export class FollowUserComplete implements Action {
  readonly type = ProfilesActionTypes.FollowUserComplete;

  constructor(public payload: {response: string }) {}
}

export class UnfollowUser implements Action {
  readonly type = ProfilesActionTypes.UnfollowUser;

  constructor(public payload: string) {}
}

export class UnfollowUserComplete implements Action {
  readonly type = ProfilesActionTypes.UnfollowUserComplete;

  constructor(public payload: {response: string }) {}
}

export class FetchProfileInfo implements Action {
  readonly type = ProfilesActionTypes.FetchProfileInfo;
  constructor(public payload: {addresses: Array<any>, loadedProfilesMap?: any, isCurrentUser: boolean, forceLoad?: boolean}) {}
}

export class FetchProfileInfoComplete implements Action {
  readonly type = ProfilesActionTypes.FetchProfileInfoComplete;

  constructor(public payload: {response: string, isCurrentUser: boolean}) {}
}

export class FetchProfileExtendedInfo implements Action {
  readonly type = ProfilesActionTypes.FetchProfileExtendedInfo;
  constructor(public payload: {addresses: Array<any>, loadedProfilesMap?: any, isCurrentUser?: boolean, forceLoad?: boolean}) {}
}

export class FetchProfileExtendedInfoComplete implements Action {
  readonly type = ProfilesActionTypes.FetchProfileExtendedInfoComplete;

  constructor(public payload: {response: any, isCurrentUser?: boolean}) {}
}

export class ResolveProfileInfos implements Action {
  readonly type = ProfilesActionTypes.ResolveProfileInfos;
  constructor(public payload: {storedProfiles: any, resolveProfiles: Array<string>}) {}
}

export class FetchActiveProfiles implements Action {
  readonly type = ProfilesActionTypes.FetchActiveProfiles;
  constructor(public payload: any) {}
}

export class FetchSetProfilesList implements Action {
  readonly type = ProfilesActionTypes.FetchSetProfilesList;
  constructor(public payload: {offsetId?: number, count?: number}) {}
}

export class FetchSetProfilesListComplete implements Action {
  readonly type = ProfilesActionTypes.FetchSetProfilesListComplete;

  constructor(public payload: any) {}
}

export class FetchProfileFollowers implements Action {
  readonly type = ProfilesActionTypes.FetchProfileFollowers;
  constructor(public payload: {address: string}) {}
}

export class FetchProfileFollowersComplete implements Action {
  readonly type = ProfilesActionTypes.FetchProfileFollowersComplete;

  constructor(public payload: any) {}
}

export class FetchProfileFollowings implements Action {
  readonly type = ProfilesActionTypes.FetchProfileFollowings;
  constructor(public payload: {address: string}) {}
}

export class FetchProfileFollowingsComplete implements Action {
  readonly type = ProfilesActionTypes.FetchProfileFollowingsComplete;

  constructor(public payload: any) {}
}

export class FetchProfileLikes implements Action {
  readonly type = ProfilesActionTypes.FetchProfileLikes;
  constructor(public payload: {address: string}) {}
}

export class FetchProfileLikesComplete implements Action {
  readonly type = ProfilesActionTypes.FetchProfileLikesComplete;

  constructor(public payload: any) {}
}

export type ProfilesActionsUnion =
| FetchProfileInfo
| FetchProfileInfoComplete
| FetchProfileExtendedInfo
| FetchProfileExtendedInfoComplete
| FetchProfileFollowers
| FetchProfileFollowersComplete
| FetchProfileFollowings
| FetchProfileFollowingsComplete
| FetchProfileLikes
| FetchProfileLikesComplete
| ResolveProfileInfos
| StartEditProfile
| CloseEditProfile
| StartConfirmPhoto
| CancelConfirmPhoto
| SaveConfirmPhoto
| SaveConfirmPhotoComplete
| StartConfirmAvatar
| CancelConfirmAvatar
| SaveConfirmAvatar
| SaveConfirmAvatarComplete
| StartConfirmName
| CancelConfirmName
| SaveConfirmName
| SaveConfirmNameComplete
| FollowUser
| FollowUserComplete
| UnfollowUser
| UnfollowUserComplete
| StoreWorkingProfileId
| FetchSetProfilesList
| FetchSetProfilesListComplete
| FetchActiveProfiles;




