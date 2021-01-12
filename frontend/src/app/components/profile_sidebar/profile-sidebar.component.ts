import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ProfileInfo } from '../../domain/profiles/models/profile-info.interface';
import { Session } from '../../domain/session/models/session.interface';

import * as profileActions from '../../domain/profiles/actions/profiles';
import * as modalActions from '../../domain/modals/actions/modals';
import { Store, select } from '@ngrx/store';
import * as fromProfiles from '../../domain/profiles/reducers';
import { environment } from '../../../environments/environment';
import UrlUtils from '../../helpers/url-utils';

declare var QRCode;

@Component({
  selector: 'app-profile-sidebar',
  templateUrl: './profile-sidebar.component.html',
  styleUrls: ['./profile-sidebar.component.sass']
})
export class ProfileSidebarComponent implements OnInit {
    @Input() profiles: any;
    @Input() viewingUserProfileAddressLegacy: any;
    @Input() isEditProfile: boolean;
    @Input() isConfirmPhoto: boolean;
    @Input() isConfirmAvatar: boolean;
    @Input() isConfirmName: boolean;
    @Input() confirmNameTarget: string;
    @Input() session: Session;

    profileNameTemp = '';

    constructor(private router: Router, private profilesStore: Store<fromProfiles.State>) {}

    get isEditingProfile(): boolean {
        return this.isEditProfile;
    }

    get profileIdentifier(): string | null {
        return this.profiles[this.viewingUserProfileAddressLegacy] &&
                this.profiles[this.viewingUserProfileAddressLegacy] &&
                this.profiles[this.viewingUserProfileAddressLegacy] !== '' ?
                `bitcoincash:${this.viewingUserProfileAddressLegacy}` : '';
    }

    get activeProfileName(): string {
        if (this.confirmNameTarget !== null && this.confirmNameTarget !== '') {
            return this.confirmNameTarget;
        }
        return this.profileName;
    }

    get profileName(): string | null {
        const name = this.profiles[this.viewingUserProfileAddressLegacy] &&
                this.profiles[this.viewingUserProfileAddressLegacy].username &&
                this.profiles[this.viewingUserProfileAddressLegacy].username !== '' ?
                this.profiles[this.viewingUserProfileAddressLegacy].username : '';

        if (!name || name === '') {
            return this.viewingUserProfileAddressLegacy;
        }
        return name;
    }

    get rawProfileName(): string | null {
        const name = this.profiles[this.viewingUserProfileAddressLegacy] &&
                this.profiles[this.viewingUserProfileAddressLegacy].username &&
                this.profiles[this.viewingUserProfileAddressLegacy].username !== '' ?
                this.profiles[this.viewingUserProfileAddressLegacy].username : '';

        return name;
    }

    get currentUser(): any {
        return this.profiles[this.viewingUserProfileAddressLegacy];
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

    updateProfileName(e) {
        this.profileNameTemp = e.target.value;
    }

    setProfileName(e) {
        if (this.session && this.session.balances.insufficientFunds) {
            this.profilesStore.dispatch(new modalActions.OpenFundingModal(true));
            return;
          }
        this.profilesStore.dispatch(new profileActions.StartConfirmName(this.profileNameTemp));
    }

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

    get profileBio(): string {
        return ``;
    }

    ngOnInit() {
        // Generate QR code
        const qrcode2 = new QRCode(document.getElementById('profile-qr'), {
            text: `bitcoincash:${this.viewingUserProfileAddressLegacy}`,
            width: 125,
            height: 125,
            colorDark : '#000000',
            colorLight : '#ffffff',
            // correctLevel : QRCode.CorrectLevel.H
        });
    }
}
