import { Action } from '@ngrx/store';

import { PostPublish } from '../models/post-publish.interface';
import { Post } from '../models/post.interface';

export enum PostsActionTypes {
    Publish = '[Posts] Publish',
    PublishComplete = '[Posts] Publish Complete',
    PublishCommunity = '[Posts] Publish community',
    PublishCommunityComplete = '[Posts] Publish community complete',
    PublishError = '[Posts] Publish Error',
    FetchRepliesFeed = '[Posts] Fetch Replies Feed',
    FetchFeed = '[Posts] Fetch Feed',
    FetchFeedComplete = '[Posts] Fetch Feed Complete',
    FetchProfileFeed = '[Posts] Fetch Profile Feed',
    FetchProfileFeedComplete = '[Posts] Fetch Profile Feed Complete',
    FetchError = '[Posts] Fetch Error',
    StartEdit = '[Posts] Start Edit',
    UpdateWorkingPost = '[Posts] Update Working Post',
    CancelEditPost = '[Posts] Cancel edit post',
    PublishReply = '[Posts] Publish reply',
    PublishReplyComplete = '[Posts] Publish reply complete',
    PublishLike = '[Posts] Publish like',
    PublishLikeComplete = '[Posts] Publish like complete',
    FetchPostReplies = '[Posts] Fetch replies',
    FetchPostRepliesComplete = '[Posts] Fetch replies complete',
    FetchPost = '[Posts] Fetch post',
    FetchPostComplete = '[Posts] Fetch post complete',
    ReloadPost = '[Posts] Reload post',
    ReloadPostComplete = '[Posts] Reload Post complete',
    ClosePostModals = '[Posts] Close post modals',
    OpenLikeTipReplyForPost = '[Posts] Open tip like',
    CloseLikeTipReplyForPost = '[Posts] Close tip like',
    UpdateLikeTipAmount = '[Posts] Update like tip amount',
    UpdateLikePassword = '[Posts] Update like password',
    StopSubmittingLike = '[Posts] Stop submitting like',
    ChangeLikeOrTip = '[Posts] Change tip or like type',
    FetchNotifications = '[Posts] Fetch Notifications',
    FetchNotificationsComplete = '[Posts] Fetch Notifications Complete',
    PerformSearch = '[Posts] Perform search',
    PerformSearchComplete = '[Posts] Perform search complete',
    FetchDirectPostWithAuthor = '[Posts] Fetch direct post with author',
}

export class FetchDirectPostWithAuthor implements Action {
  readonly type = PostsActionTypes.FetchDirectPostWithAuthor;
  constructor(public payload: {txId: string} ) {}
}

export class PerformSearch implements Action {
  readonly type = PostsActionTypes.PerformSearch;
  constructor(public payload: {searchQuery: string, offsetId?: number} ) {}
}

export class PerformSearchComplete implements Action {
  readonly type = PostsActionTypes.PerformSearchComplete;
  constructor(public payload: { results: Array<{ entityType: string, entity: any}>, offsetId?: number }) {}
}

export class StopSubmittingLike implements Action {
  readonly type = PostsActionTypes.StopSubmittingLike;
  constructor(public payload: {txId: string} ) {}
}

export class UpdateLikeTipAmount implements Action {
  readonly type = PostsActionTypes.UpdateLikeTipAmount;
  constructor(public payload: {txId: string, tipAmount: number} ) {}
}

export class UpdateLikePassword implements Action {
  readonly type = PostsActionTypes.UpdateLikePassword;
  constructor(public payload: {txId: string, password: string} ) {}
}

export class ChangeLikeOrTip implements Action {
  readonly type = PostsActionTypes.ChangeLikeOrTip;
  constructor(public payload: {txId: string, tipsOpen: boolean} ) {}
}

export class OpenLikeTipReplyForPost implements Action {
  readonly type = PostsActionTypes.OpenLikeTipReplyForPost;
  constructor(public payload: {txId: string, tipsOpen: boolean} ) {}
}

export class CloseLikeTipReplyForPost implements Action {
  readonly type = PostsActionTypes.CloseLikeTipReplyForPost;

  constructor(public payload: { txId: string }) {}
}

export class ClosePostModals implements Action {
  readonly type = PostsActionTypes.ClosePostModals;
  constructor() {}
}

export class FetchPost implements Action {
  readonly type = PostsActionTypes.FetchPost;
  constructor(public payload: { txId: string, resolveAuthor?: boolean}) {}
}

export class FetchPostComplete implements Action {
  readonly type = PostsActionTypes.FetchPostComplete;

  constructor(public payload: { post: any, txId?: string}) {}
}

export class ReloadPost implements Action {
  readonly type = PostsActionTypes.ReloadPost;
  constructor(public payload: { txId: string}) {}
}

export class ReloadPostComplete implements Action {
  readonly type = PostsActionTypes.ReloadPostComplete;

  constructor(public payload: { post: any}) {}
}

export class FetchPostReplies implements Action {
  readonly type = PostsActionTypes.FetchPostReplies;
  constructor(public payload: any ) {}
}

export class FetchPostRepliesComplete implements Action {
  readonly type = PostsActionTypes.FetchPostRepliesComplete;

  constructor(public payload: { posts: Array<any>, txId: string}) {}
}

export class Publish implements Action {
  readonly type = PostsActionTypes.Publish;
  constructor(public payload: PostPublish) {}
}

export class PublishComplete implements Action {
  readonly type = PostsActionTypes.PublishComplete;

  constructor(public payload: any) {}
}

export class PublishCommunity implements Action {
  readonly type = PostsActionTypes.PublishCommunity;
  constructor(public payload: PostPublish) {}
}

export class PublishCommunityComplete implements Action {
  readonly type = PostsActionTypes.PublishCommunityComplete;

  constructor(public payload: any) {}
}

export class PublishLike implements Action {
  readonly type = PostsActionTypes.PublishLike;
  constructor(public payload: any) {}
}

export class PublishLikeComplete implements Action {
  readonly type = PostsActionTypes.PublishLikeComplete;

  constructor(public payload: any) {}
}

export class PublishReply implements Action {
  readonly type = PostsActionTypes.PublishReply;
  constructor(public payload: {body: string, txId: string}) {}
}

export class PublishReplyComplete implements Action {
  readonly type = PostsActionTypes.PublishReplyComplete;

  constructor(public payload: any) {}
}

export class PublishError implements Action {
  readonly type = PostsActionTypes.PublishError;
}

export class FetchRepliesFeed implements Action {
  readonly type = PostsActionTypes.FetchRepliesFeed;
  constructor(public payload: { offsetId?: number }) {}
}

export class FetchFeed implements Action {
  readonly type = PostsActionTypes.FetchFeed;
  constructor(public payload: { offsetId?: number, isTop?: boolean, range?: string}) {}
}

export class FetchFeedComplete implements Action {
  readonly type = PostsActionTypes.FetchFeedComplete;

  constructor(public payload: { posts: any, offsetId?: number }) {}
}

export class FetchNotifications implements Action {
  readonly type = PostsActionTypes.FetchNotifications;
  constructor(public payload: { offsetId?: number }) {}
}

export class FetchNotificationsComplete implements Action {
  readonly type = PostsActionTypes.FetchNotificationsComplete;

  constructor(public payload: { notifications: Array<{ entityType: string, entity: any}>, offsetId?: number }) {}
}

export class FetchProfileFeed implements Action {
  readonly type = PostsActionTypes.FetchProfileFeed;
  constructor(public payload: any) {}
}

export class FetchProfileFeedComplete implements Action {
  readonly type = PostsActionTypes.FetchProfileFeedComplete;

  constructor(public payload: any) {}
}


export class FetchError implements Action {
  readonly type = PostsActionTypes.FetchError;
}

export class StartEditPost implements Action {
  readonly type = PostsActionTypes.StartEdit;

  constructor(public payload?: any) {}
}

export class CancelEditPost implements Action {
  readonly type = PostsActionTypes.CancelEditPost;

  constructor() {}
}

export class UpdateWorkingPost implements Action {
  readonly type = PostsActionTypes.UpdateWorkingPost;

  constructor(public payload: any) {}
}

export type PostsActionsUnion =
| Publish
| PublishComplete
| PublishReply
| PublishReplyComplete
| PublishError
| FetchFeed
| FetchFeedComplete
| FetchProfileFeed
| FetchProfileFeedComplete
| FetchError
| StartEditPost
| UpdateWorkingPost
| CancelEditPost
| FetchPostReplies
| FetchPostRepliesComplete
| PublishLike
| PublishLikeComplete
| FetchPost
| FetchPostComplete
| ClosePostModals
| OpenLikeTipReplyForPost
| CloseLikeTipReplyForPost
| UpdateLikePassword
| UpdateLikeTipAmount
| StopSubmittingLike
| ChangeLikeOrTip
| FetchNotifications
| FetchNotificationsComplete
| PerformSearch
| PerformSearchComplete
| FetchDirectPostWithAuthor
| PublishCommunity
| PublishCommunityComplete
| ReloadPost
| ReloadPostComplete
| FetchRepliesFeed;










