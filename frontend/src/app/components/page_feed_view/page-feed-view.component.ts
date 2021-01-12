import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';

import { Post } from '../../domain/posts/models/post.interface';
import { ProfileInfo } from '../../domain/profiles/models/profile-info.interface';

import { Router } from '@angular/router';
import * as moment from 'moment';
import { Session } from '../../domain/session/models/session.interface';
import { ExportKeyInfo } from '../../domain/session/models/export-key-info.interface';
import { Store, select } from '@ngrx/store';
import * as fromStore from '../../reducers';
import * as fromPosts from '../../domain/posts/reducers';
import * as fromSession from '../../domain/session/reducers';
import * as fromModal from '../../domain/modals/reducers';
import * as postsActions from '../../domain/posts/actions/posts';
import * as fromProfiles from '../../domain/profiles/reducers';
import * as sessionActions from '../../domain/session/actions/session';
import { Alert } from '../../domain/alerts/models/alert.interface';
import { Publisher } from '../../domain/publisher/models/publisher-interface';
import PostHelpers from '../../helpers/post-helpers';

@Component({
  selector: 'app-page-feed-view',
  templateUrl: './page-feed-view.component.html',
  styleUrls: ['./page-feed-view.component.sass']
})
export class PageFeedViewComponent {

    @Input() routerState: any;
    @Input() posts: Array<Post>;
    @Input() workingPostReplies: Array<Post>;
    @Input() workingPost: Post;
    @Input() session: Session;
    @Input() currentUserProfile: ProfileInfo;
    @Input() profiles: Array<ProfileInfo>;
    @Input() exportKeyInfo: ExportKeyInfo;
    @Input() getIsFundingModalOpen: boolean;
    @Input() alertsList: Array<Alert>;
    @Input() activeViewingPost: Post;
    @Input() modalState: any;
    @Input() openedTxLikeTips: any;
    @Input() profileSearch: Array<any>;
    @Input() shouldLoadIpfsScript: boolean;
    @Input() showTop?: boolean;
    @Input() showTopRange?: string;
    @Input() postsState: any;

    @Input() publishers: {
      [key: string]: Publisher
    };

    isPublisherVisible = false;
    isViewKeyModalVisible = false;

  constructor(  private store: Store<fromStore.State>,
                private postsStore: Store<fromPosts.State>,
                private sessionStore: Store<fromSession.State>,
                private router: Router) {
  }

  gotoTop() {
    this.postsStore.dispatch(new postsActions.FetchFeed({
      offsetId: 0,
      isTop: true,
      range: 'today'
    }));
    this.router.navigate(['top']);
  }

  gotoFeed() {
    this.router.navigate(['feed']);
  }

  get nextOffsetId(): number {
    if (this.routerState.queryParams && this.routerState.queryParams.offsetId) {
      return this.routerState.queryParams.offsetId + 1;
    }
    return 1;
  }

  get isReplies() {
    if (/^\/replies$/i.test(this.routerState.url)) {
      return true;
    }
    return false;
  }

  get isNewest() {
    if (/^\/?$/i.test(this.routerState.url) || /^\/feed$/i.test(this.routerState.url)) {
      return true;
    }
    return false;
  }

  get streamType(): string {
    if (this.isTop) {
      return 'top';
    }
    return 'feed';
  }

  get isTop() {
    if (/^\/top/i.test(this.routerState.url)) {
      return true;
    }
    return false;
  }

  get hasBadgeCount(): boolean {
    return this.session && this.session.badgeCount && this.session.badgeCount > 0 ;
  }

  get badgeCount(): number {
    return this.session.badgeCount;
  }

  userSignedIn(): boolean {
    return !!this.session && !!this.session.userId;
  }

  gotoSearchProfiles() {
    this.router.navigate(['profiles']);
  }

  closePostModal() {
    this.postsStore.dispatch(new postsActions.ClosePostModals());
  }

  openPublisher() {
    this.isPublisherVisible = true;
  }

  closePublisher() {
    this.isPublisherVisible = false;
  }

  gotoNotifications() {
    this.router.navigate(['notifications']);
  }

  gotoReplies() {
    this.router.navigate(['replies']);
  }

  gotoSignUp() {
    this.router.navigate(['signup']);
  }

  gotoLogin() {
    this.router.navigate(['signup']);
  }

  updateWorkingPost(domElement) {
    this.postsStore.dispatch(new postsActions.UpdateWorkingPost({
      property: domElement.attributes.name.nodeValue,
      value: domElement.value,
    }));
  }

}
