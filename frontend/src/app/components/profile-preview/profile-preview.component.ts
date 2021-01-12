import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Post } from '../../domain/posts/models/post.interface';
import { ProfileInfo } from '../../domain/profiles/models/profile-info.interface';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Session } from '../../domain/session/models/session.interface';
import * as moment from 'moment';
import * as fromModal from '../../domain/modals/reducers';
import * as modalActions from '../../domain/modals/actions/modals';
import { Store } from '@ngrx/store';
import {environment} from '../../../environments/environment';
import UrlUtils from '../../helpers/url-utils';

@Component({
  selector: 'app-profile-preview',
  templateUrl: './profile-preview.component.html',
  styleUrls: ['./profile-preview.component.sass']
})
export class ProfilePreviewComponent {

  @Input() currentUserProfile: any;
  @Input() session: Session;

  constructor(private router: Router, private modalStore: Store<fromModal.State>) {
  }

  get hasActiveBackground(): boolean {
    if (this.currentProfileImage()) {
        return true;
    }
    return false;
  }

  get activeBackground(): string {
      return this.currentProfileImage();
  }

  get avatarImage(): string {
    if (this.currentUserProfile.avatar) {
      if (/^qm/i.test(this.currentUserProfile.avatar)) {
          return `${environment.ipfsGatewayBase}/${this.currentUserProfile.avatar}`;
      } else {
          return this.currentUserProfile.avatar;
      }
    }
    return UrlUtils.defaultProfileImage();
  }

  currentProfileImage(): any {
      if (this.currentUserProfile.header) {
        if (/^qm/i.test(this.currentUserProfile.header)) {
            return `${environment.ipfsGatewayBase}/${this.currentUserProfile.header}`;
        } else {
            return this.currentUserProfile.header;
        }

      }
      return null;
  }

  userSignedIn(): boolean {
    return this.session && !!this.session.userId;
  }

  showPersonalMessage(): boolean {
    return this.userSignedIn() &&
            this.currentUserProfile &&
            this.currentUserProfile.name !== '';
  }
  gotoProfile(tab: any | undefined) {
    if (tab) {
      this.router.navigate([this.currentUserProfile.address_id, `${tab}`]);
      return;
    }
    this.router.navigate([this.currentUserProfile.address_id]);
  }

  get getNamePlaceholder(): string {
    return this.currentUserProfile.name;
  }

  get profileIdentifier(): string | null {
    return `bitcoincash:${this.currentUserProfile.address_id}`;
  }

  get profileName(): string | null {
 
    const name = this.currentUserProfile.name;

    if (!name) {
      return `${this.currentUserProfile.address_id}`;
    }
    return name;
  }

  get profileBio(): string {
    return ``;
  }

  effectiveBalance(): number {
    return this.session.balances.confirmedBalance + this.session.balances.unconfirmedBalance;
  }

  openFundingModal() {
     this.modalStore.dispatch(new modalActions.OpenFundingModal());
  }
}
