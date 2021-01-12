import { Component, AfterViewInit} from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromStore from '../../reducers';
import * as fromPosts from '../../domain/posts/reducers';
import * as fromSession from '../../domain/session/reducers';
import * as fromModal from '../../domain/modals/reducers';
import * as fromAlert from '../../domain/alerts/reducers';
import * as postsActions from '../../domain/posts/actions/posts';
import * as profilesActions from '../../domain/profiles/actions/profiles';
import * as fromProfiles from '../../domain/profiles/reducers';
import * as sessionActions from '../../domain/session/actions/session';
import * as alertsActions from '../../domain/alerts/actions/alerts';
import * as fromPublisher from '../../domain/publisher/reducers';
import * as moment from 'moment';
import { Router } from '@angular/router';
import PostHelpers from '../../helpers/post-helpers';

@Component({
  templateUrl: './feed-container-page.component.html',
  styleUrls: ['./feed-container-page.component.sass']
})
export class FeedContainerPageComponent {
  routerState$ = this.store.pipe(select(fromStore.getRouterState));
  shouldLoadIpfsScript$ = this.store.pipe(select(fromPublisher.shouldLoadIpfsScript));
  posts$ = this.store.pipe(select(fromPosts.getPosts));
  publishers$ = this.store.pipe(select(fromPublisher.getPublishers));
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
  profileSearch$ = this.store.pipe(select(fromProfiles.getProfileSearch));

  isPublisherVisible = false;
  isViewKeyModalVisible = false;
  isDepositFundsModalVisible = false;

  constructor(private store: Store<fromStore.State>,
              private postsStore: Store<fromPosts.State>,
              private profilesStore: Store<fromProfiles.State>,
              private sessionStore: Store<fromSession.State>,
              private router: Router) {

    sessionStore.dispatch(new sessionActions.Fetch());
    profilesStore.dispatch(new profilesActions.FetchActiveProfiles(0));

    this.routerState$.subscribe((params) => {
      if (/^\/top/i.test(params.url)) {
        if (params.queryParams) {
          this.postsStore.dispatch(new postsActions.FetchFeed({
            offsetId: 0,
            isTop: true,
            range: params.queryParams.t
          }));
          return;
        }
        this.postsStore.dispatch(new postsActions.FetchFeed({
          offsetId: 0,
          isTop: true,
        }));
      } else if (/^\/replies/i.test(params.url)) {
          this.postsStore.dispatch(new postsActions.FetchRepliesFeed({
            offsetId: 0,
          }));
          return;
      } else {
        this.postsStore.dispatch(new postsActions.FetchFeed({
          offsetId: 0,
        }));
      }
    });
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
}
