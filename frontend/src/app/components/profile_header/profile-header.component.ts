import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ProfileInfo } from '../../domain/profiles/models/profile-info.interface';
import { Session } from '../../domain/session/models/session.interface';
import { isEditProfile } from '../../domain/profiles/reducers';
import * as profileActions from '../../domain/profiles/actions/profiles';
import * as modalActions from '../../domain/modals/actions/modals';
import { Store, select } from '@ngrx/store';
import * as fromProfiles from '../../domain/profiles/reducers';
import { IpfsService } from '../../services/ipfs.service';
import { environment } from '../../../environments/environment';
import UrlUtils from '../../helpers/url-utils';

declare const Buffer;

@Component({
  selector: 'app-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.sass']
})
export class ProfileHeaderComponent {

    @Input() session: Session;
    @Input() profiles: any;
    @Input() viewingUserProfileAddressLegacy: any;
    @Input() isEditProfile: boolean;
    @Input() isConfirmPhoto: boolean;
    @Input() confirmPhotoTarget: string;
    @Input() isConfirmAvatar: boolean;
    @Input() confirmAvatarTarget: string;
    @Input() isConfirmName: boolean;

    fileInputElement = null;
    fileAvatarInputElement = null;
    MAX_25_MB = 6214400;
    NO_FILE_CHOSEN = 'No file chosen';
    fileName = this.NO_FILE_CHOSEN;

    fileblob = '';
    fileAvatarBlob = '';

    headerUrl = '';
    avatarUrl = '';

    useIpfs = false;

    constructor(private router: Router,
        private profileStore: Store<fromProfiles.State>,
        private ipfsService: IpfsService) {}

    selectHeaderUrl(e) {
        this.headerUrl = e.target.value;
    }

    setHeaderUrl(e) {
        if (this.session && this.session.balances.insufficientFunds) {
            this.profileStore.dispatch(new modalActions.OpenFundingModal(true));
            return;
          }
        this.profileStore.dispatch(new profileActions.StartConfirmPhoto(this.headerUrl));
    }

    selectAvatarUrl(e) {
        this.avatarUrl = e.target.value;
    }

    setAvatarUrl(e) {

        if (this.session && this.session.balances.insufficientFunds) {
            this.profileStore.dispatch(new modalActions.OpenFundingModal(true));
            return;
          }
        this.profileStore.dispatch(new profileActions.StartConfirmAvatar(this.avatarUrl));
    }

    get hasActiveBackground(): boolean {
        if (this.isConfirmPhoto || this.currentProfileImage() || this.isValidChosenUrl()) {
            return true;
        }
        return false;
    }

    get activeBackground(): string {
        if (this.isConfirmPhoto && this.useIpfs) {
            return this.chosenImage();
        }
        if (this.isConfirmPhoto && this.isValidChosenUrl()) {
            return this.confirmPhotoTarget;
        }
        if (this.isEditProfile) {
            return this.currentProfileImage();
        }
        return this.currentProfileImage();
    }

    isValidChosenUrl(): string {
        return this.headerUrl;
    }

    get hasActiveAvatar(): boolean {
        if (this.isConfirmAvatar || this.currentProfileAvatar()) {
            return true;
        }
        return false;
    }

    get activeAvatar(): string {
        if (this.isConfirmAvatar && this.useIpfs) {
            return this.chosenAvatarImage();
        }
        if (this.isConfirmAvatar && this.isValidChosenAvatarUrl()) {
            return this.confirmAvatarTarget;
        }

        if (this.isEditProfile) {
            return this.currentProfileAvatar();
        }
        return this.currentProfileAvatar();
    }

    isValidChosenAvatarUrl(): string {
        return this.avatarUrl;
    }

    chosenImage(): any {
        return this.isConfirmPhoto && this.fileblob;
    }

    chosenAvatarImage(): any {
        return this.isConfirmAvatar && this.fileAvatarBlob;
    }

    currentProfileImage(): any {
        if (this.profileHeader) {
            if (/^qm/i.test(this.profileHeader)) {
                return `${environment.ipfsGatewayBase}/${this.profileHeader}`;
            } else {
                return this.profileHeader;
            }
        }
        return null;
    }

    currentProfileAvatar(): any {
        if (this.profileAvatar) {
            if (/^qm/i.test(this.profileAvatar)) {
                return `${environment.ipfsGatewayBase}/${this.profileAvatar}`;
            } else {
                return this.profileAvatar;
            }
        }
        return UrlUtils.defaultProfileImage();
    }

    get profileHeader(): string | null {
        return this.profiles[this.viewingUserProfileAddressLegacy] &&
                this.profiles[this.viewingUserProfileAddressLegacy].header &&
                this.profiles[this.viewingUserProfileAddressLegacy].header !== '' ?
                this.profiles[this.viewingUserProfileAddressLegacy].header : null;
    }

    get currentUser(): any {
        return this.profiles[this.viewingUserProfileAddressLegacy];
    }

    get isHeaderMempool(): boolean {
        return this.currentUser && this.currentUser.isHeaderMempool;
    }

    get headerTx(): string {
        return this.currentUser.headerTx;
    }

    get headerTxLink(): string {
        return UrlUtils.getTxLink(this.headerTx);
    }

    get headerMempoolUrl(): string {
        return this.currentUser.header;
    }

    get isAvatarMempool(): boolean {
        return  this.currentUser && this.currentUser.isAvatarMempool;
    }

    get avatarTx(): string {
        return this.currentUser.avatarTx;
    }

    get avatarTxLink(): string {
        return UrlUtils.getTxLink(this.avatarTx);
    }

    get avatarMempoolUrl(): string {
        return this.currentUser.avatar;
    }

    selectFile(event) {
        this.fileblob = null;

        const that = this;
        if (event.target && event.target.files && event.target.files[0]) {
            this.fileInputElement = event.target;
            this.fileName = event.target.files[0].name;

            const readerPreview = new FileReader();
            readerPreview.onload = function (e) {
                that.fileblob = e.target['result'];
            };
            readerPreview.readAsDataURL(this.fileInputElement.files[0]);

            const reader = new FileReader();
            reader.onload = function (e) {
                const buffer = Buffer.from(e.target['result']);
                that.ipfsService.addBuffer(buffer, (status, message, result) => {
                    if (!status) {
                        console.error('error', status, message);
                        return;
                    }
                    that.profileStore.dispatch(new profileActions.StartConfirmPhoto(result));
                });
            };
            reader.readAsArrayBuffer(this.fileInputElement.files[0]);

        } else {
            this.fileInputElement = null;
        }
    }

    isValidFileChosen(): boolean {
        if (this.fileInputElement &&
            this.fileInputElement.files &&
            this.fileInputElement.files[0] &&
            this.fileInputElement.files[0].size < this.MAX_25_MB) {
            return true;
        }
        return false;
    }


    selectAvatarFile(event) {
        this.fileAvatarBlob = null;

        const that = this;
        if (event.target && event.target.files && event.target.files[0]) {
            this.fileAvatarInputElement = event.target;
            this.fileName = event.target.files[0].name;

            const readerPreview = new FileReader();
            readerPreview.onload = function (e) {
                that.fileAvatarBlob = e.target['result'];
            };
            readerPreview.readAsDataURL(this.fileAvatarInputElement.files[0]);

            const reader = new FileReader();
            reader.onload = function (e) {
                const buffer = Buffer.from(e.target['result']);
                that.ipfsService.addBuffer(buffer, (status, message, result) => {
                    if (!status) {
                        console.error('error', status, message);
                        return;
                    }
                    that.profileStore.dispatch(new profileActions.StartConfirmAvatar(result));
                });
            };
            reader.readAsArrayBuffer(this.fileAvatarInputElement.files[0]);

        } else {
            this.fileAvatarInputElement = null;
        }
    }


    get profileAvatar(): string | null {
        return this.profiles[this.viewingUserProfileAddressLegacy] &&
                this.profiles[this.viewingUserProfileAddressLegacy].avatar &&
                this.profiles[this.viewingUserProfileAddressLegacy].avatar !== '' ?
                this.profiles[this.viewingUserProfileAddressLegacy].avatar : null;
    }

}
