import { Component, AfterViewInit, OnInit} from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromStore from '../../reducers';
import * as fromPosts from '../../domain/posts/reducers';
import * as fromSession from '../../domain/session/reducers';
import * as fromProfiles from '../../domain/profiles/reducers';
import * as postsActions from '../../domain/posts/actions/posts';
import * as sessionActions from '../../domain/session/actions/session';
import * as profileActions from '../../domain/profiles/actions/profiles';
import * as fromPublisher from '../../domain/publisher/reducers';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import * as fromAlert from '../../domain/alerts/reducers';
import * as fromModal from '../../domain/modals/reducers';

@Component({
  templateUrl: './profile-container-page.component.html',
  styleUrls: ['./profile-container-page.component.sass']
})
export class ProfileContainerPageComponent implements AfterViewInit, OnInit {

  publishers$ = this.store.pipe(select(fromPublisher.getPublishers));
  workingProfileId$ = this.store.pipe(select(fromProfiles.getWorkingProfileId));
  profilePageId$ = this.store.pipe(select(fromStore.getProfilePageId));
  profilePosts$ = this.store.pipe(select(fromPosts.getProfilePosts));
  workingPost$ = this.store.pipe(select(fromPosts.getWorkingPost));
  session$ = this.store.pipe(select(fromSession.getSession));
  currentUserProfile$ = this.store.pipe(select(fromProfiles.getCurrentUserProfile));
  profiles$ = this.store.pipe(select(fromProfiles.getProfiles));
  followers$ = this.store.pipe(select(fromProfiles.getFollowers));
  following$ = this.store.pipe(select(fromProfiles.getFollowing));
  likes$ = this.store.pipe(select(fromProfiles.getLikes));
  exportKeyInfo$ = this.store.pipe(select(fromSession.getExportKeyInfo));
  isEditProfile$ = this.store.pipe(select(fromProfiles.isEditProfile));
  isConfirmPhoto$ = this.store.pipe(select(fromProfiles.isConfirmPhoto));
  confirmPhotoTarget$ = this.store.pipe(select(fromProfiles.confirmPhotoTarget));
  isConfirmAvatar$ = this.store.pipe(select(fromProfiles.isConfirmAvatar));
  confirmAvatarTarget$ = this.store.pipe(select(fromProfiles.confirmAvatarTarget));
  isConfirmName$ = this.store.pipe(select(fromProfiles.isConfirmName));
  confirmNameTarget$ = this.store.pipe(select(fromProfiles.confirmNameTarget));
  postsState$ = this.store.pipe(select(fromPosts.getPostsState));
  workingPostReplies$ = this.store.pipe(select(fromPosts.getWorkingPostReplies));
  alertsList$ = this.store.pipe(select(fromAlert.getAlerts));
  activeViewingPost$ = this.store.pipe(select(fromPosts.getActiveViewingPost));
  getIsFundingModalOpen$ = this.store.pipe(select(fromModal.getIsFundingModalOpen));
  modalState$ = this.store.pipe(select(fromModal.getModalState));
  openedTxLikeTips$ = this.store.pipe(select(fromPosts.getOpenedTxLikeTips));

  directlyNavigatedToPost = false;
  signUpModalVisible = false;

  constructor(private store: Store<fromStore.State>,
    private route: ActivatedRoute,
    private router: Router,
    private postsStore: Store<fromPosts.State>,
    private sessionStore: Store<fromSession.State>,
    private profileStore: Store<fromProfiles.State>) {
    sessionStore.dispatch(new sessionActions.Fetch());
  }

  ngOnInit() {

     this.route.params.subscribe(params => {
      // They navigated to /[profileId]/posts/[txId] (Canonical)
      if (params['tabId']) {
        console.log('params tab better be a single item', params['tabId']);
        this.profileStore.dispatch(new profileActions.StoreWorkingProfileId(params['tabId']));
      } else if (params['directTxId']) {
        this.directlyNavigatedToPost = true;
        // Or they went straight to /posts/[txId]
        // Then we must fetch the post and then resolve the profile
        this.postsStore.dispatch(new postsActions.FetchPost({
          txId: params['directTxId'],
          resolveAuthor: true
        }));
      }

      this.workingProfileId$.subscribe((workingProfileAddressId) => {
        if (!workingProfileAddressId) {
          return;
        }
        console.log('workingProfileAddressId Better be a single item', workingProfileAddressId);

        this.profileStore.dispatch(new profileActions.FetchProfileExtendedInfo({
          addresses: [workingProfileAddressId], forceLoad: true
        }));

        this.profileStore.dispatch(new postsActions.FetchProfileFeed({
          address: workingProfileAddressId
        }));

        if (!params['txId'] && !params['directTx']) {
          this.postsStore.dispatch(new postsActions.ClosePostModals());
        }
        if (params['profilePageId'] === 'followers') {
          this.profileStore.dispatch(new profileActions.FetchProfileFollowers({address: workingProfileAddressId}));
        }
        if (params['profilePageId'] === 'following') {
          this.profileStore.dispatch(new profileActions.FetchProfileFollowings({address: workingProfileAddressId}));
        }
        if (params['profilePageId'] === 'likes') {
          this.profileStore.dispatch(new profileActions.FetchProfileLikes({address: workingProfileAddressId}));
        }

        if (params['txId'] || params['directTxId']) {
          this.postsStore.dispatch(new postsActions.ClosePostModals());
          this.postsStore.dispatch(new postsActions.FetchPost({
            txId: params['txId'] ? params['txId'] : params['directTxId']
          }));
        }

      });



     });
  }

  ngAfterViewInit() {
    this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
            return;
        }
        window.scrollTo(0, 0);
    });
  }

  openPublisher() {

  }
  showSignUpModal() {
    this.signUpModalVisible = true;
  }

  hideSignUpModal() {
    this.signUpModalVisible = false;
  }
}
