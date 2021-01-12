import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Session } from '../../domain/session/models/session.interface';
import * as profileActions from '../../domain/profiles/actions/profiles';
import * as modalActions from '../../domain/modals/actions/modals';
import { Store, select } from '@ngrx/store';
import * as fromProfiles from '../../domain/profiles/reducers';
import * as fromModals from '../../domain/modals/reducers';
import { IpfsService } from '../../services/ipfs.service';
import UrlUtils from '../../helpers/url-utils';
import { ProfileInfo } from '../../domain/profiles/models/profile-info.interface';

@Component({
  selector: 'app-navigation-tabs',
  templateUrl: './navigation-tabs.component.html',
  styleUrls: ['./navigation-tabs.component.sass']
})
export class NavigationTabsComponent {

  @Input() session: Session;
  @Input() profileId: string;
  @Input() profilePageId: string;
  @Input() profiles: any;
  @Input() followers: any;
  @Input() viewingUserProfileAddressLegacy: any;
  @Input() isEditProfile = true;
  @Input() isConfirmPhoto: boolean;
  @Input() confirmPhotoTarget: string;
  @Input() isConfirmAvatar: boolean;
  @Input() confirmAvatarTarget: string;
  @Input() isConfirmName: boolean;
  @Input() confirmNameTarget: string;

  followActionPerformed = false;
  profileNameTemp = '';

  constructor(private router: Router,
          private profileStore: Store<fromProfiles.State>,
          private ipfsService: IpfsService) {}

          isProfileSet(): ProfileInfo {
            return this.profiles[this.viewingUserProfileAddressLegacy];
        }
        get profileTips(): string | null {
            const setProfile = this.isProfileSet();
            if (setProfile) {
              if (setProfile.tips > 0) {
                return `Earned ${setProfile.tips} sats`;
              } else {
                return `Earned ${setProfile.tips} sats`;
              }
            }
        }

          setProfileName(e) {
            if (this.session && this.session.balances.insufficientFunds) {
                this.profileStore.dispatch(new modalActions.OpenFundingModal(true));
                return;
                }
            this.profileStore.dispatch(new profileActions.StartConfirmName(this.profileNameTemp));
        }

          get isEditingProfile(): boolean {
            return this.isEditProfile;
        }

        get activeProfileName(): string {
            if (this.confirmNameTarget !== null && this.confirmNameTarget !== '') {
                return this.confirmNameTarget;
            }
            return this.profileName;
        }

        get rawProfileName(): string | null {
            const name = this.profiles[this.viewingUserProfileAddressLegacy] &&
                    this.profiles[this.viewingUserProfileAddressLegacy].username &&
                    this.profiles[this.viewingUserProfileAddressLegacy].username !== '' ?
                    this.profiles[this.viewingUserProfileAddressLegacy].username : '';

            return name;
        }

      get isNameMempool(): boolean {
        return this.currentUser && this.currentUser.isUsernameMempool;
    }

    get nameTx(): string {
        return this.currentUser.usernameTx;
    }

    get nameTxLink(): string {
        return UrlUtils.getTxLink(this.currentUser.usernameTx);
    }

    get nameMempoolUrl(): string {
        return this.currentUser.username;
    }
    get currentUser(): any {
      return this.profiles[this.viewingUserProfileAddressLegacy];
  }
    updateProfileName(e) {
        this.profileNameTemp = e.target.value;
    }
  isConfirmingEdits(): boolean {
    return this.isConfirmPhoto || this.isConfirmAvatar || this.isConfirmName;
  }

  startEditProfile() {
    this.profileStore.dispatch(new profileActions.StartEditProfile());
  }

  closeEditProfile() {
    this.profileStore.dispatch(new profileActions.CloseEditProfile());
  }

  cancelConfirmPhoto() {
    this.profileStore.dispatch(new profileActions.CancelConfirmPhoto());
  }

  saveConfirmPhoto() {
    if (this.session && this.session.balances.insufficientFunds) {
      this.profileStore.dispatch(new modalActions.OpenFundingModal(true));
      return;
    }
    this.profileStore.dispatch(new profileActions.SaveConfirmPhoto(this.confirmPhotoTarget));
  }

  cancelConfirmAvatar() {
    this.profileStore.dispatch(new profileActions.CancelConfirmAvatar());
  }

  saveConfirmAvatar() {
    if (this.session && this.session.balances.insufficientFunds) {
      this.profileStore.dispatch(new modalActions.OpenFundingModal(true));
      return;
    }
    this.profileStore.dispatch(new profileActions.SaveConfirmAvatar(this.confirmAvatarTarget));
  }

  cancelConfirmName() {
    this.profileStore.dispatch(new profileActions.CancelConfirmName());
  }

  saveConfirmName() {
    if (this.session && this.session.balances.insufficientFunds) {
      this.profileStore.dispatch(new modalActions.OpenFundingModal(true));
      return;
    }
    this.profileStore.dispatch(new profileActions.SaveConfirmName(this.confirmNameTarget));
  }

  followUser() {
    if (this.session && this.session.balances.insufficientFunds) {
      this.profileStore.dispatch(new modalActions.OpenFundingModal(true));
      return;
    }
    if (this.followActionPerformed) {
      return;
    }
    this.profileStore.dispatch(new profileActions.FollowUser(this.viewingUserProfileAddressLegacy));

    this.followActionPerformed = true;
    const that = this;

    setTimeout(function() {
      that.followActionPerformed = false;
    }, 10000);
  }

  unfollowUser() {
    if (this.session && this.session.balances.insufficientFunds) {
      this.profileStore.dispatch(new modalActions.OpenFundingModal(true));
      return;
    }
    if (this.followActionPerformed) {
      return;
    }
    this.profileStore.dispatch(new profileActions.UnfollowUser(this.viewingUserProfileAddressLegacy));
    this.followActionPerformed = true;
    const that = this;

    setTimeout(function() {
      that.followActionPerformed = false;
    }, 10000);
  }

  get followingCount(): string | null {
    return this.profiles[this.viewingUserProfileAddressLegacy] &&
            this.profiles[this.viewingUserProfileAddressLegacy].followingCount &&
            this.profiles[this.viewingUserProfileAddressLegacy].followingCount !== '' ?
            this.profiles[this.viewingUserProfileAddressLegacy].followingCount : '-';
  }
  get followerCount(): string | null {
  return this.profiles[this.viewingUserProfileAddressLegacy] &&
          this.profiles[this.viewingUserProfileAddressLegacy].followerCount &&
          this.profiles[this.viewingUserProfileAddressLegacy].followerCount !== '' ?
          this.profiles[this.viewingUserProfileAddressLegacy].followerCount : '-';
  }

  get favsCount(): string | null {
  return this.profiles[this.viewingUserProfileAddressLegacy] &&
          this.profiles[this.viewingUserProfileAddressLegacy].favsCount &&
          this.profiles[this.viewingUserProfileAddressLegacy].favsCount !== '' ?
          this.profiles[this.viewingUserProfileAddressLegacy].favsCount : '-';
  }
  get postsCount(): string | null {
      return this.profiles[this.viewingUserProfileAddressLegacy] &&
              this.profiles[this.viewingUserProfileAddressLegacy].postsCount &&
              this.profiles[this.viewingUserProfileAddressLegacy].postsCount !== '' ?
              this.profiles[this.viewingUserProfileAddressLegacy].postsCount : '-';
  }

  gotoTab(tab) {
    if (tab) {
      this.router.navigate([this.profileId, tab]);
    } else {
      this.router.navigate([this.profileId]);
    }
  }

  isTabActive(tab) {
    return this.profilePageId === tab;
  }
  get profileIdentifier(): string | null {
    return this.profiles[this.viewingUserProfileAddressLegacy] &&
            this.profiles[this.viewingUserProfileAddressLegacy] &&
            this.profiles[this.viewingUserProfileAddressLegacy] !== '' ?
            `${this.viewingUserProfileAddressLegacy}` : '';
  }
  get profileName(): string | null {
    const name = this.profiles[this.viewingUserProfileAddressLegacy] &&
            this.profiles[this.viewingUserProfileAddressLegacy].username &&
            this.profiles[this.viewingUserProfileAddressLegacy].username !== '' ?
            this.profiles[this.viewingUserProfileAddressLegacy].username : '';

    if (name === '') {
      return this.profileIdentifier;
    }
    return name;
  }

  get isFollowMempool(): boolean {
    return this.profiles[this.viewingUserProfileAddressLegacy] &&
    this.profiles[this.viewingUserProfileAddressLegacy].currentUserFollowingMempool;
  }

  get followTx(): string {
    return this.profiles[this.viewingUserProfileAddressLegacy] ?
    UrlUtils.getTxLink(this.profiles[this.viewingUserProfileAddressLegacy].currentUserFollowingTx) : '';
  }

  get isCurrentUserFollowing(): boolean{
      return this.profiles[this.viewingUserProfileAddressLegacy] &&
        this.profiles[this.viewingUserProfileAddressLegacy].currentUserFollowing;
  }

  get isSelfUser(): boolean {
    return !!this.session.userId && this.session.addressCash === this.viewingUserProfileAddressLegacy;
  }

  userSignedIn(): boolean {
    return this.session && !!this.session.userId;
  }
  get profileBio(): string {
    return ``;
  }
}
