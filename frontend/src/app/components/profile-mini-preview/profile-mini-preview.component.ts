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
  selector: 'app-profile-mini-preview',
  templateUrl: './profile-mini-preview.component.html',
  styleUrls: ['./profile-mini-preview.component.sass']
})
export class ProfileMiniPreviewComponent {

  @Input() profileMini: any;
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

  get countFollowers(): string {
    return this.profileMini && this.profileMini.followers ? this.profileMini.followers : ``;
  }

  get avatarImage(): string {
    if (this.profileMini.avatar) {
      if (/^qm/i.test(this.profileMini.avatar)) {
          return `${environment.ipfsGatewayBase}/${this.profileMini.avatar}`;
      } else {
          return this.profileMini.avatar;
      }
    }
    return UrlUtils.defaultProfileImage();
  }

  currentProfileImage(): any {
      if (this.profileMini.header) {
        if (/^qm/i.test(this.profileMini.header)) {
            return `${environment.ipfsGatewayBase}/${this.profileMini.header}`;
        } else {
            return this.profileMini.header;
        }
      }
      return null;
  }

  get profileName(): string | null {
    if (this.profileMini.name && this.profileMini.name !== '') {
      return this.profileMini.name;
    }
    return `${this.profileMini.addressId}`;
  }

  gotoProfile() {
    this.router.navigate([this.profileMini.addressId]);
  }

  get profileIdentifier(): string | null {
    return this.profileMini && this.profileMini.addressId ?  this.profileMini.addressId  : '';
  }

  get profileBio(): string {
    return ``;
  }
}
