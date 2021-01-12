import {
  createSelector,
  createFeatureSelector,
  ActionReducerMap,
} from '@ngrx/store';
import * as fromPosts from './posts';
import * as fromRoot from '../../../reducers';

import { PostPublish } from '../models/post-publish.interface';

export interface PostsState {
  posts: fromPosts.State;
}

export interface State extends fromRoot.State {
  postList: PostsState;
}

export const reducers: ActionReducerMap<PostsState> = {
  posts: fromPosts.reducer
};


// Selectors
export const getPosts = (state: State) => {
  return state.postList.posts.postList;
};

export const getNotifications = (state: State) => {
  return state.postList.posts.notifications;
};

export const getWorkingPost = (state: State) => {
  return state.postList.posts.workingPost;
};

export const getProfilePosts = (state: State) => {
  return state.postList.posts.profilePostList;
};

export const getPostsState = (state: State) => {
  return state.postList.posts;
};

export const getWorkingPostReplies = (state: State) => {
  return state.postList.posts.workingPostReplies;
};

export const getActiveViewingPost = (state: State) => {
  return state.postList.posts.activeViewingPost;
};

export const getOpenedTxLikeTips = (state: State) => {
  return state.postList.posts.openedTxLikeTips;
};

