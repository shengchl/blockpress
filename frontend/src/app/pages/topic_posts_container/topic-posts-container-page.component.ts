import { Component, AfterViewInit} from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromStore from '../../reducers';
import * as fromPosts from '../../domain/posts/reducers';
import * as fromSession from '../../domain/session/reducers';
import * as fromModal from '../../domain/modals/reducers';
import * as fromAlert from '../../domain/alerts/reducers';
import * as postsActions from '../../domain/posts/actions/posts';
import * as fromProfiles from '../../domain/profiles/reducers';
import * as sessionActions from '../../domain/session/actions/session';
import * as alertsActions from '../../domain/alerts/actions/alerts';
import { Router } from '@angular/router';

@Component({
  templateUrl: './topic-posts-container-page.component.html',
  styleUrls: ['./topic-posts-container-page.component.sass']
})
export class TopicPostsContainerPageComponent {
  posts$ = this.store.pipe(select(fromPosts.getPosts));
  workingPost$ = this.store.pipe(select(fromPosts.getWorkingPost));
  session$ = this.store.pipe(select(fromSession.getSession));
  currentUserProfile$ = this.store.pipe(select(fromProfiles.getCurrentUserProfile));
  profiles$ = this.store.pipe(select(fromProfiles.getProfiles));
  exportKeyInfo$ = this.store.pipe(select(fromSession.getExportKeyInfo));
  getIsFundingModalOpen$ = this.store.pipe(select(fromModal.getIsFundingModalOpen));
  alertsList$ = this.store.pipe(select(fromAlert.getAlerts));
  postsState$ = this.store.pipe(select(fromPosts.getPostsState));
  workingPostReplies$ = this.store.pipe(select(fromPosts.getWorkingPostReplies));
  activeViewingPost$ = this.store.pipe(select(fromPosts.getActiveViewingPost));
  modalState$ = this.store.pipe(select(fromModal.getModalState));
  openedTxLikeTips$ = this.store.pipe(select(fromPosts.getOpenedTxLikeTips));

  isPublisherVisible = false;
  isViewKeyModalVisible = false;
  isDepositFundsModalVisible = false;

  constructor(private store: Store<fromStore.State>,
              private postsStore: Store<fromPosts.State>,
              private sessionStore: Store<fromSession.State>,
              private router: Router) {

     sessionStore.dispatch(new sessionActions.Fetch());
     postsStore.dispatch(new postsActions.FetchFeed({
       offsetId: 0,
     }));
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
