import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IpfsService } from '../../services/ipfs.service';
import { Post } from '../../domain/posts/models/post.interface';
import { ProfileInfo } from '../../domain/profiles/models/profile-info.interface';
import { Session } from '../../domain/session/models/session.interface';
import * as fromStore from '../../reducers';
import * as postsActions from '../../domain/posts/actions/posts';
import * as profilesActions from '../../domain/profiles/actions/profiles';
import * as communitiesActions from '../../domain/communities/actions/communities';
import { Store } from '@ngrx/store';
import { Alert } from '../../domain/alerts/models/alert.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-stream',
  templateUrl: './post-stream.component.html',
  styleUrls: ['./post-stream.component.sass']
})
export class PostStreamComponent {

  @Input() posts: Array<Post>;
  @Input() workingPostReplies: Array<Post>;
  @Input() profiles: any;
  @Input() session: Session;
  @Input() currentUserProfile: ProfileInfo;
  @Input() alertsList: Array<Alert>;
  @Input() workingPost: Post;
  @Input() openedTxLikeTips: any;
  @Input() withHeader?: boolean;
  @Input() headerText?: string;
  @Input() streamType?: string;
  @Input() communityName?: string;
  @Input() currentPostOffsetId = 0;
  @Input() routerState: any;

  constructor(private store: Store<fromStore.State>) { }

  get getPosts(): Array<Post> {
    return this.posts && this.posts.length ? this.posts : [];
  }

  get headerTitle(): string {
    if (this.headerText) {
      return this.headerText;
    }
    return `Newest Posts`;
  }

  loadMore() {
    this.buildStreamActionType();
  }

  buildStreamActionType(offsetId?: number) {
    let range = 'today';

    if (this.routerState.queryParams && this.routerState.queryParams.t) {
      range = this.routerState.queryParams.t;
    }

    if (!this.streamType || this.streamType === '' || this.streamType === 'feed') {
      this.store.dispatch(new postsActions.FetchFeed({
        offsetId: this.currentPostOffsetId + 1,
        range: range
      }));
      return;
    }
    if (!this.streamType || this.streamType === '' || this.streamType === 'top') {
      this.store.dispatch(new postsActions.FetchFeed({
        offsetId: this.currentPostOffsetId + 1,
        isTop: true,
        range: range
      }));
      return;
    }
    if (!this.streamType || this.streamType === '' || this.streamType === 'community_posts') {
      this.store.dispatch(new communitiesActions.FetchCommunityPosts({
        communityName: this.communityName,
        offsetId: this.currentPostOffsetId + 1
      }));
    }
  }
}
