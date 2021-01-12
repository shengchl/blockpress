import { Action } from '@ngrx/store';

import { Community } from '../models/community.interface';
import { Post } from '../../posts/models/post.interface';

export enum CommunitiesActionTypes {
  FetchCommunities = '[Communities] Fetch Communities',
  FetchCommunitiesComplete = '[Communities] Fetch Communities Complete',
  FetchCommunityPosts = '[Communities] Fetch Community Posts',
  FetchCommunityPostsComplete = '[Communities] Fetch Community Posts Complete',
}

export class FetchCommunities implements Action {
  readonly type = CommunitiesActionTypes.FetchCommunities;
  constructor(public payload: {offsetId?: number} ) {}
}

export class FetchCommunitiesComplete implements Action {
  readonly type = CommunitiesActionTypes.FetchCommunitiesComplete;

  constructor(public payload: any) {}
}

export class FetchCommunityPosts implements Action {
  readonly type = CommunitiesActionTypes.FetchCommunityPosts;
  constructor(public payload: {communityName: string, offsetId?: number} ) {}
}

export class FetchCommunityPostsComplete implements Action {
  readonly type = CommunitiesActionTypes.FetchCommunityPostsComplete;

  constructor(public payload: { posts: any, communityName: string, offsetId?: number}) {}
}

export type CommunitiesActionsUnion =
| FetchCommunities
| FetchCommunitiesComplete
| FetchCommunityPosts
| FetchCommunityPostsComplete;









