import { createSelector } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { ProfileInfo } from '../models/profile-info.interface';
import { ProfilesActionTypes, ProfilesActionsUnion } from '../actions/profiles';
import { payloadParser, miniProfileParser } from '../helpers/payload-parser';
import { followerProfilePayloadParser } from '../helpers/follower-profile-payload-parser';
import { postsPayloadParser } from '../../posts/helpers/payload-parser';

export interface State {
  currentUserProfile: any;
  profiles: any;
  workingProfileId: string;
  workingProfileFollowers: any;
  workingProfileFollowings: any;
  workingProfileLikes: Array<any>;
  isEditProfile: boolean;
  isConfirmPhoto: boolean;
  confirmPhotoTarget: any;
  isConfirmAvatar: boolean;
  confirmAvatarTarget: string;
  isConfirmName: boolean;
  confirmNameTarget: string;
  profileSearch:  Array<any>;
}

const initialState: State = {
  currentUserProfile: {},
  profiles: {},
  workingProfileId: '',
  workingProfileFollowers: {},
  workingProfileFollowings: {},
  workingProfileLikes: [],
  isEditProfile: false,
  isConfirmPhoto: false,
  confirmPhotoTarget: null,
  isConfirmAvatar: false,
  confirmAvatarTarget: null,
  isConfirmName: false,
  confirmNameTarget: null,
  profileSearch: []
};

export function reducer(
  state = initialState,
  action: ProfilesActionsUnion,
): State {

  switch (action.type) {
    case ProfilesActionTypes.FetchProfileInfoComplete:
      const profileInfos = payloadParser(action.payload.response);
      const newMap = Object.assign({}, state.profiles);
      for (const profile of profileInfos) {
        newMap[profile.addressLegacy] = profile;
      }
      let userProfile = state.currentUserProfile;
      if (action.payload.isCurrentUser) {
        userProfile = action.payload.response[0];
      }
      return Object.assign({}, state,
        {
          currentUserProfile: userProfile,
          profiles: newMap,
          workingProfileId: state.workingProfileId,
          workingProfileFollowers: state.workingProfileFollowers,
          workingProfileFollowings: state.workingProfileFollowings,
          workingProfileLikes: state.workingProfileLikes,
          isEditProfile: state.isEditProfile,
          isConfirmPhoto: state.isConfirmPhoto,
          confirmPhotoTarget: state.confirmPhotoTarget,
          isConfirmAvatar: state.isConfirmAvatar,
          isConfirmName: state.isConfirmName,
          confirmNameTarget: state.confirmNameTarget,
          profileSearch: state.profileSearch,
        }
      );

    case ProfilesActionTypes.FetchProfileExtendedInfoComplete:
      const extProfileInfos = payloadParser(action.payload.response);
        const extNewMap = Object.assign({}, state.profiles);
        for (const profile of extProfileInfos) {
          extNewMap[profile.addressLegacy] = Object.assign({}, state.profiles[profile.addressLegacy], profile);
        }

        let userProfileExt = state.currentUserProfile;
        if (action.payload.isCurrentUser) {
          userProfileExt = action.payload.response[0];
        }

        return Object.assign({}, state,
          {
            currentUserProfile: userProfileExt,
            profiles: extNewMap,
            workingProfileId: state.workingProfileId,
            workingProfileFollowers: state.workingProfileFollowers,
            workingProfileFollowings: state.workingProfileFollowings,
            workingProfileLikes: state.workingProfileLikes,
            isEditProfile: state.isEditProfile,
            isConfirmPhoto: state.isConfirmPhoto,
            confirmPhotoTarget: state.confirmPhotoTarget,
            isConfirmAvatar: state.isConfirmAvatar,
            isConfirmName: state.isConfirmName,
            confirmNameTarget: state.confirmNameTarget,
            profileSearch: state.profileSearch,
          }
        );

    case ProfilesActionTypes.FetchProfileFollowersComplete:
      const list = [];
      for (const item of action.payload) {
        list.push(followerProfilePayloadParser(item));
      }
      return Object.assign({}, state,
        {
          currentUserProfile: state.currentUserProfile,
          profiles: state.profiles,
          workingProfileId: state.workingProfileId,
          workingProfileFollowers: list,
          workingProfileFollowings: state.workingProfileFollowings,
          workingProfileLikes: state.workingProfileLikes,
          isEditProfile: state.isEditProfile,
          isConfirmPhoto: state.isConfirmPhoto,
          confirmPhotoTarget: state.confirmPhotoTarget,
          isConfirmAvatar: state.isConfirmAvatar,
          confirmAvatarTarget: state.confirmAvatarTarget,
          isConfirmName: state.isConfirmName,
          confirmNameTarget: state.confirmNameTarget,
          profileSearch: state.profileSearch,
        }
      );

    case ProfilesActionTypes.FetchProfileFollowingsComplete:
      const list2 = [];
      for (const item of action.payload) {
        list2.push(followerProfilePayloadParser(item));
      }
      return Object.assign({}, state,
        {
          currentUserProfile: state.currentUserProfile,
          profiles: state.profiles,
          workingProfileId: state.workingProfileId,
          workingProfileFollowers: state.workingProfileFollowers,
          workingProfileFollowings: list2,
          workingProfileLikes: state.workingProfileLikes,
          isEditProfile: state.isEditProfile,
          isConfirmPhoto: state.isConfirmPhoto,
          confirmPhotoTarget: state.confirmPhotoTarget,
          isConfirmAvatar: state.isConfirmAvatar,
          confirmAvatarTarget: state.confirmAvatarTarget,
          isConfirmName: state.isConfirmName,
          confirmNameTarget: state.confirmNameTarget,
          profileSearch: state.profileSearch,
        }
      );

    case ProfilesActionTypes.FetchProfileLikesComplete:
      return Object.assign({}, state,
        {
          currentUserProfile: state.currentUserProfile,
          profiles: state.profiles,
          workingProfileId: state.workingProfileId,
          workingProfileFollowers: state.workingProfileFollowers,
          workingProfileFollowings: state.workingProfileFollowings,
          workingProfileLikes: postsPayloadParser(action.payload),
          isEditProfile: state.isEditProfile,
          isConfirmPhoto: state.isConfirmPhoto,
          confirmPhotoTarget: state.confirmPhotoTarget,
          isConfirmAvatar: state.isConfirmAvatar,
          confirmAvatarTarget: state.confirmAvatarTarget,
          isConfirmName: state.isConfirmName,
          confirmNameTarget: state.confirmNameTarget,
          profileSearch: state.profileSearch,
        }
      );

    case ProfilesActionTypes.StartEditProfile:
      return Object.assign({}, state,
        {
          currentUserProfile: state.currentUserProfile,
          profiles: state.profiles,
          workingProfileId: state.workingProfileId,
          workingProfileFollowers: state.workingProfileFollowers,
          workingProfileFollowings: state.workingProfileFollowings,
          workingProfileLikes: state.workingProfileLikes,
          isEditProfile: true,
          isConfirmPhoto: state.isConfirmPhoto,
          confirmPhotoTarget: state.confirmPhotoTarget,
          isConfirmAvatar: state.isConfirmAvatar,
          confirmAvatarTarget: state.confirmAvatarTarget,
          isConfirmName: state.isConfirmName,
          confirmNameTarget: state.confirmNameTarget,
          profileSearch: state.profileSearch,
        }
      );

    case ProfilesActionTypes.CloseEditProfile:
      return Object.assign({}, state,
        {
          currentUserProfile: state.currentUserProfile,
          profiles: state.profiles,
          workingProfileId: state.workingProfileId,
          workingProfileFollowers: state.workingProfileFollowers,
          workingProfileFollowings: state.workingProfileFollowings,
          workingProfileLikes: state.workingProfileLikes,
          isEditProfile: false,
          isConfirmPhoto: false,
          confirmPhotoTarget: state.confirmPhotoTarget,
          isConfirmAvatar: state.isConfirmAvatar,
          confirmAvatarTarget: state.confirmAvatarTarget,
          isConfirmName: state.isConfirmName,
          confirmNameTarget: state.confirmNameTarget,
          profileSearch: state.profileSearch,
        }
      );

    case ProfilesActionTypes.StartConfirmPhoto:
      return Object.assign({}, state,
        {
          currentUserProfile: state.currentUserProfile,
          profiles: state.profiles,
          workingProfileId: state.workingProfileId,
          workingProfileFollowers: state.workingProfileFollowers,
          workingProfileFollowings: state.workingProfileFollowings,
          workingProfileLikes: state.workingProfileLikes,
          isEditProfile: state.isEditProfile,
          isConfirmPhoto: true,
          confirmPhotoTarget: action.payload,
          isConfirmAvatar: state.isConfirmAvatar,
          confirmAvatarTarget: state.confirmAvatarTarget,
          isConfirmName: state.isConfirmName,
          confirmNameTarget: state.confirmNameTarget,
          profileSearch: state.profileSearch,
        }
      );

    case ProfilesActionTypes.CancelConfirmPhoto:
      return Object.assign({}, state,
        {
          currentUserProfile: state.currentUserProfile,
          profiles: state.profiles,
          workingProfileId: state.workingProfileId,
          workingProfileFollowers: state.workingProfileFollowers,
          workingProfileFollowings: state.workingProfileFollowings,
          workingProfileLikes: state.workingProfileLikes,
          isEditProfile: state.isEditProfile,
          isConfirmPhoto: false,
          confirmPhotoTarget: state.confirmPhotoTarget,
          isConfirmAvatar: state.isConfirmAvatar,
          confirmAvatarTarget: state.confirmAvatarTarget,
          isConfirmName: state.isConfirmName,
          confirmNameTarget: state.confirmNameTarget,
          profileSearch: state.profileSearch,
        }
      );

      case ProfilesActionTypes.SaveConfirmPhotoComplete:
      return Object.assign({}, state,
        {
          currentUserProfile: state.currentUserProfile,
          profiles: state.profiles,
          workingProfileId: state.workingProfileId,
          workingProfileFollowers: state.workingProfileFollowers,
          workingProfileFollowings: state.workingProfileFollowings,
          workingProfileLikes: state.workingProfileLikes,
          isEditProfile: false,
          isConfirmPhoto: false,
          confirmPhotoTarget: null,
          isConfirmAvatar: false,
          confirmAvatarTarget: null,
          isConfirmName: state.isConfirmName,
          confirmNameTarget: state.confirmNameTarget,
          profileSearch: state.profileSearch,
        }
      );

      case ProfilesActionTypes.StartConfirmAvatar:
      return Object.assign({}, state,
        {
          currentUserProfile: state.currentUserProfile,
          profiles: state.profiles,
          workingProfileId: state.workingProfileId,
          workingProfileFollowers: state.workingProfileFollowers,
          workingProfileFollowings: state.workingProfileFollowings,
          workingProfileLikes: state.workingProfileLikes,
          isEditProfile: state.isEditProfile,
          isConfirmPhoto: state.isConfirmPhoto,
          confirmPhotoTarget: state.confirmPhotoTarget,
          isConfirmAvatar: true,
          confirmAvatarTarget: action.payload,
          isConfirmName: state.isConfirmName,
          confirmNameTarget: state.confirmNameTarget,
          profileSearch: state.profileSearch,
        }
      );

    case ProfilesActionTypes.CancelConfirmAvatar:
      return Object.assign({}, state,
        {
          currentUserProfile: state.currentUserProfile,
          profiles: state.profiles,
          workingProfileId: state.workingProfileId,
          workingProfileFollowers: state.workingProfileFollowers,
          workingProfileFollowings: state.workingProfileFollowings,
          workingProfileLikes: state.workingProfileLikes,
          isEditProfile: state.isEditProfile,
          isConfirmPhoto: state.isConfirmPhoto,
          confirmPhotoTarget: state.confirmPhotoTarget,
          isConfirmAvatar: false,
          confirmAvatarTarget: null,
          isConfirmName: state.isConfirmName,
          confirmNameTarget: state.confirmNameTarget,
          profileSearch: state.profileSearch,
        }
      );

    case ProfilesActionTypes.SaveConfirmAvatarComplete:
      return Object.assign({}, state,
        {
          currentUserProfile: state.currentUserProfile,
          profiles: state.profiles,
          workingProfileId: state.workingProfileId,
          workingProfileFollowers: state.workingProfileFollowers,
          workingProfileFollowings: state.workingProfileFollowings,
          workingProfileLikes: state.workingProfileLikes,
          isEditProfile: false,
          isConfirmPhoto: state.isConfirmPhoto,
          confirmPhotoTarget: state.confirmPhotoTarget,
          isConfirmAvatar: false,
          confirmAvatarTarget: null,
          isConfirmName: state.isConfirmName,
          confirmNameTarget: state.confirmNameTarget,
          profileSearch: state.profileSearch,
        }
      );

    case ProfilesActionTypes.StartConfirmName:
      return Object.assign({}, state,
        {
          currentUserProfile: state.currentUserProfile,
          profiles: state.profiles,
          workingProfileId: state.workingProfileId,
          workingProfileFollowers: state.workingProfileFollowers,
          workingProfileFollowings: state.workingProfileFollowings,
          workingProfileLikes: state.workingProfileLikes,
          isEditProfile: state.isEditProfile,
          isConfirmPhoto: state.isConfirmPhoto,
          confirmPhotoTarget: state.confirmPhotoTarget,
          isConfirmAvatar: state.isConfirmAvatar,
          confirmAvatarTarget: state.confirmAvatarTarget,
          isConfirmName: true,
          confirmNameTarget: action.payload,
          profileSearch: state.profileSearch,
        }
      );

    case ProfilesActionTypes.CancelConfirmName:
      return Object.assign({}, state,
        {
          currentUserProfile: state.currentUserProfile,
          profiles: state.profiles,
          workingProfileId: state.workingProfileId,
          workingProfileFollowers: state.workingProfileFollowers,
          workingProfileFollowings: state.workingProfileFollowings,
          workingProfileLikes: state.workingProfileLikes,
          isEditProfile: state.isEditProfile,
          isConfirmPhoto: state.isConfirmPhoto,
          confirmPhotoTarget: state.confirmPhotoTarget,
          isConfirmAvatar: state.isConfirmAvatar,
          confirmAvatarTarget: state.confirmAvatarTarget,
          isConfirmName: false,
          confirmNameTarget: null,
          profileSearch: state.profileSearch,
        }
      );

      case ProfilesActionTypes.SaveConfirmNameComplete:
      return Object.assign({}, state,
        {
          currentUserProfile: state.currentUserProfile,
          profiles: state.profiles,
          workingProfileId: state.workingProfileId,
          workingProfileFollowers: state.workingProfileFollowers,
          workingProfileFollowings: state.workingProfileFollowings,
          workingProfileLikes: state.workingProfileLikes,
          isEditProfile: false,
          isConfirmPhoto: false,
          confirmPhotoTarget: null,
          isConfirmAvatar: false,
          confirmAvatarTarget: null,
          isConfirmName: false,
          confirmNameTarget: null,
          profileSearch: state.profileSearch,
        }
      );

    case ProfilesActionTypes.StoreWorkingProfileId:
      return Object.assign({}, state,
        {
          currentUserProfile: state.currentUserProfile,
          profiles: state.profiles,
          workingProfileId: action.payload,
          workingProfileFollowers: state.workingProfileFollowers,
          workingProfileFollowings: state.workingProfileFollowings,
          workingProfileLikes: state.workingProfileLikes,
          isEditProfile: false,
          isConfirmPhoto: false,
          confirmPhotoTarget: null,
          isConfirmAvatar: false,
          confirmAvatarTarget: null,
          isConfirmName: false,
          confirmNameTarget: null,
          profileSearch: state.profileSearch,
        }
      );


    case ProfilesActionTypes.FetchSetProfilesListComplete:
      return Object.assign({}, state,
        {
          currentUserProfile: state.currentUserProfile,
          profiles: state.profiles,
          workingProfileId: state.workingProfileId,
          workingProfileFollowers: state.workingProfileFollowers,
          workingProfileFollowings: state.workingProfileFollowings,
          workingProfileLikes: state.workingProfileLikes,
          isEditProfile: false,
          isConfirmPhoto: false,
          confirmPhotoTarget: null,
          isConfirmAvatar: false,
          confirmAvatarTarget: null,
          isConfirmName: false,
          confirmNameTarget: null,
          profileSearch: miniProfileParser(action.payload),
        }
      );

    default: {
      return state;
    }
  }
}
