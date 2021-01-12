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

@Component({
  selector: 'app-page-devs-view',
  templateUrl: './page-devs-view.component.html',
  styleUrls: ['./page-devs-view.component.sass']
})
export class PageDevsViewComponent {

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

    isPublisherVisible = false;
    isViewKeyModalVisible = false;

  constructor(  private store: Store<fromStore.State>,
                private postsStore: Store<fromPosts.State>,
                private sessionStore: Store<fromSession.State>,
                private router: Router) {
  }

  stopProp(e) {
    e.stopPropagation();
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

  gotoHome() {
    this.router.navigate(['feed']);
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
