import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Session } from '../../domain/session/models/session.interface';
import { ProfileInfo } from '../../domain/profiles/models/profile-info.interface';
import * as fromStore from '../../reducers';
import * as fromPosts from '../../domain/posts/reducers';
import * as fromCommunities from '../../domain/communities/reducers';
import { Store } from '@ngrx/store';
import * as postsActions from '../../domain/posts/actions/posts';
import * as communitiesActions from '../../domain/communities/actions/communities';
import * as modalActions from '../../domain/modals/actions/modals';
import DateUtils from '../../helpers/date-utils';
import { Location } from '@angular/common';

@Component({
  selector: 'app-standard-nav',
  templateUrl: './standard-nav.component.html',
  styleUrls: ['./standard-nav.component.sass']
})
export class StandardNavComponent {

  @Input() session: Session;
  @Input() currentUserProfile: ProfileInfo;
  @Output() post = new EventEmitter<void>();
  @Output() showSignUp = new EventEmitter<void>();

  constructor(private router: Router,
              private store: Store<fromStore.State>,
              private location: Location,
              private postStore: Store<fromPosts.State>,
              private communitiesStore: Store<fromCommunities.State>) {}

  get alertCount(): string {
    return `4`;
  }
  userSignedIn(): boolean {
    return !!this.session.userId;
  }

  openNotifications() {
      this.router.navigate(['replies']);
      this.postStore.dispatch(new postsActions.FetchNotifications({
        offsetId: 0,
      }));
      window.scrollTo(0, 0);
  }

  gotoCommunities() {
      this.router.navigate(['communities']);
      this.postStore.dispatch(new communitiesActions.FetchCommunities({
        offsetId: 0,
      }));
      window.scrollTo(0, 0);
  }

  gotoProfile() {
    this.router.navigate([this.session.addressCash]);
  }
  gotoProfiles() {
    this.router.navigate(['profiles']);
  }

  get effectiveBalance(): string {
    if (!this.session || !this.session.balances) {
      return ``;
    }
    return `${DateUtils.formatNumberWithCommas(this.session.balances.confirmedBalance + this.session.balances.unconfirmedBalance, false)}`;
  }

  gotoHome() {
    this.postStore.dispatch(new postsActions.FetchFeed({
      offsetId: 0,
    }));
    this.location.go('/');
    this.router.navigate(['/']);
    window.scrollTo(0, 0);
  }

  openFundingModal() {
      this.store.dispatch(new modalActions.OpenFundingModal());
  }

  gotoSignUp() {
    window.location.href = `${environment.apiBaseUrl}/users/sign_up`;
  }

  gotoLogin() {
    window.location.href = `${environment.apiBaseUrl}/users/sign_in`;
  }

  get currentUserProfileAvatar(): string | null {
      return this.currentUserProfile.avatar && this.currentUserProfile.avatar !== '' ?  this.currentUserProfile.avatar : null;
  }

  get logoutUrl(): string {
    return `${environment.apiBaseUrl}/users/sign_out`;
  }
}
