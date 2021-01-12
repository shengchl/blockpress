import { Component, AfterViewInit, OnInit} from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromStore from '../../reducers';
import * as fromPosts from '../../domain/posts/reducers';
import * as fromPublisher from '../../domain/publisher/reducers';
import * as fromCommunities from '../../domain/communities/reducers';
import * as fromSession from '../../domain/session/reducers';
import * as fromModal from '../../domain/modals/reducers';
import * as fromAlert from '../../domain/alerts/reducers';
import * as postsActions from '../../domain/posts/actions/posts';
import * as fromProfiles from '../../domain/profiles/reducers';
import * as sessionActions from '../../domain/session/actions/session';
import * as alertsActions from '../../domain/alerts/actions/alerts';
import * as communitiesActions from '../../domain/communities/actions/communities';
import { Router, ActivatedRoute } from '@angular/router';
import * as profilesActions from '../../domain/profiles/actions/profiles';

@Component({
  templateUrl: './communities-container-page.component.html',
  styleUrls: ['./communities-container-page.component.sass']
})
export class CommunitiesContainerPageComponent  implements OnInit, AfterViewInit {
  shouldLoadIpfsScript$ = this.store.pipe(select(fromPublisher.shouldLoadIpfsScript));
  communities$ = this.store.pipe(select(fromCommunities.getCommunitiesList));
  publishers$ = this.store.pipe(select(fromPublisher.getPublishers));
  communityPosts$ = this.store.pipe(select(fromCommunities.getCommunityPosts));
  session$ = this.store.pipe(select(fromSession.getSession));
  currentUserProfile$ = this.store.pipe(select(fromProfiles.getCurrentUserProfile));
  profiles$ = this.store.pipe(select(fromProfiles.getProfiles));
  exportKeyInfo$ = this.store.pipe(select(fromSession.getExportKeyInfo));
  getIsFundingModalOpen$ = this.store.pipe(select(fromModal.getIsFundingModalOpen));
  alertsList$ = this.store.pipe(select(fromAlert.getAlerts));
  modalState$ = this.store.pipe(select(fromModal.getModalState));
  workingPost$ = this.store.pipe(select(fromPosts.getWorkingPost));
  postsState$ = this.store.pipe(select(fromPosts.getPostsState));
  workingPostReplies$ = this.store.pipe(select(fromPosts.getWorkingPostReplies));
  activeViewingPost$ = this.store.pipe(select(fromPosts.getActiveViewingPost));
  profileSearch$ = this.store.pipe(select(fromProfiles.getProfileSearch));
  openedTxLikeTips$ = this.store.pipe(select(fromPosts.getOpenedTxLikeTips));


  isPublisherVisible = false;
  isViewKeyModalVisible = false;
  isDepositFundsModalVisible = false;

  isCommunityListView = true;
  communityName = '';

  constructor(private store: Store<fromStore.State>,
              private postsStore: Store<fromPosts.State>,
              private communitiesStore: Store<fromCommunities.State>,
              private sessionStore: Store<fromSession.State>,
              private router: Router,
              private profilesStore: Store<fromProfiles.State>,
              private route: ActivatedRoute) {

    sessionStore.dispatch(new sessionActions.Fetch());
    profilesStore.dispatch(new profilesActions.FetchActiveProfiles(0));
  }

  ngAfterViewInit() {
    this.route.params.subscribe(params => {
      // They navigated to /[profileId]/posts/[txId] (Canonical)
      if (params['communityName']) {
        this.communityName = params['communityName'];
        this.isCommunityListView = false;
        this.communitiesStore.dispatch(new communitiesActions.FetchCommunityPosts({
          communityName: params['communityName'],
          offsetId: 0,
        }));
      } else {
        this.communityName = '';
        this.isCommunityListView = true;
        this.communitiesStore.dispatch(new communitiesActions.FetchCommunities({
          offsetId: 0,
        }));
      }
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      // They navigated to /[profileId]/posts/[txId] (Canonical)
      if (params['communityName']) {
        this.communityName = params['communityName'];
        this.isCommunityListView = false;
        this.communitiesStore.dispatch(new communitiesActions.FetchCommunityPosts({
          communityName: params['communityName'],
          offsetId: 0,
        }));
      } else {
        this.communityName = '';
        this.isCommunityListView = true;
        this.communitiesStore.dispatch(new communitiesActions.FetchCommunities({
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
