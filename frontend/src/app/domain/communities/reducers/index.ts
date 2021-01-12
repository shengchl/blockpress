import {
  createSelector,
  createFeatureSelector,
  ActionReducerMap,
} from '@ngrx/store';
import * as fromCommunities from './communities';
import * as fromRoot from '../../../reducers';


export interface CommunitiesState {
  communities: fromCommunities.State;
}

export interface State extends fromRoot.State {
  communityList: CommunitiesState;
}

export const reducers: ActionReducerMap<CommunitiesState> = {
  communities: fromCommunities.reducer
};

// Selectors
export const getCommunitiesList = (state: State) => {
  return state.communityList.communities.communityList;
};

export const getCommunityPosts = (state: State) => {
  return state.communityList.communities.communityPosts;
};

