import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Session } from '../../domain/session/models/session.interface';
import { ProfileInfo } from '../../domain/profiles/models/profile-info.interface';
import * as fromStore from '../../reducers';
import * as fromPosts from '../../domain/posts/reducers';
import { Store } from '@ngrx/store';
import * as postsActions from '../../domain/posts/actions/posts';
import * as modalActions from '../../domain/modals/actions/modals';
import DateUtils from '../../helpers/date-utils';
import { Location } from '@angular/common';

@Component({
  selector: 'app-footer-nav',
  templateUrl: './footer-nav.component.html',
  styleUrls: ['./footer-nav.component.sass']
})
export class FooterNavComponent {

  @Input() session: Session;
  @Input() currentUserProfile: ProfileInfo;
  @Output() post = new EventEmitter<void>();
  @Output() showSignUp = new EventEmitter<void>();

  constructor(private router: Router,
            private store: Store<fromStore.State>,
           private location: Location) {}

  gotoProfile() {
    this.router.navigate([this.session.addressCash]);
  }

  get effectiveBalance(): string {
    if (!this.session || !this.session.balances) {
      return ``;
    }
    return `${DateUtils.formatNumberWithCommas(this.session.balances.confirmedBalance + this.session.balances.unconfirmedBalance, false)}`;
  }

  gotoHome() {
    this.location.go('/');
    this.router.navigate(['/']);
    this.store.dispatch(new postsActions.FetchFeed({
      offsetId: 0,
    }));
    window.scrollTo(0, 0);
  }

  gotoDevs() {
    this.router.navigate(['developers/blockpress-protocol']);
    window.scrollTo(0, 0);
  }

  gotoPartners() {
    this.router.navigate(['partners']);
    window.scrollTo(0, 0);
  }

  userSignedIn(): boolean {
    return this.session && !!this.session.userId;
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
