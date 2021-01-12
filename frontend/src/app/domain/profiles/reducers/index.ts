import {
  createSelector,
  createFeatureSelector,
  ActionReducerMap,
} from '@ngrx/store';
import * as fromProfiles from './profiles';
import * as fromRoot from '../../../reducers';

export interface ProfilesState {
  profiles: fromProfiles.State;
}

export interface State extends fromRoot.State {
  profilesState: ProfilesState;
}

export const reducers: ActionReducerMap<ProfilesState> = {
  profiles: fromProfiles.reducer
};

export const getProfiles = (state: State) => {
  return state.profilesState.profiles.profiles;
};
export const getCurrentUserProfile = (state: State) => {
  return state.profilesState.profiles.currentUserProfile;
};
export const getFollowers = (state: State) => {
  return state.profilesState.profiles.workingProfileFollowers;
};
export const getFollowing = (state: State) => {
  return state.profilesState.profiles.workingProfileFollowings;
};

export const getLikes = (state: State) => {
  return state.profilesState.profiles.workingProfileLikes;
};

export const isEditProfile = (state: State) => {
  return state.profilesState.profiles.isEditProfile;
};

export const isConfirmPhoto = (state: State) => {
  return state.profilesState.profiles.isConfirmPhoto;
};

export const confirmPhotoTarget = (state: State) => {
  return state.profilesState.profiles.confirmPhotoTarget;
};

export const isConfirmAvatar = (state: State) => {
  return state.profilesState.profiles.isConfirmAvatar;
};

export const confirmAvatarTarget = (state: State) => {
  return state.profilesState.profiles.confirmAvatarTarget;
};

export const isConfirmName = (state: State) => {
  return state.profilesState.profiles.isConfirmName;
};

export const confirmNameTarget = (state: State) => {
  return state.profilesState.profiles.confirmNameTarget;
};

export const getWorkingProfileId = (state: State) => {
  return state.profilesState.profiles.workingProfileId;
};

export const getProfileSearch = (state: State) => {
  return state.profilesState.profiles.profileSearch;
};
