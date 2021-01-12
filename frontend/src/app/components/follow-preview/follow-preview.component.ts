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
  selector: 'app-follow-preview',
  templateUrl: './follow-preview.component.html',
  styleUrls: ['./follow-preview.component.sass']
})
export class FollowPreviewComponent {

  @Input() profile: ProfileInfo;
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
    if (this.profile.avatar) {
      if (/^qm/i.test(this.profile.avatar)) {
          return `${environment.ipfsGatewayBase}/${this.profile.avatar}`;
      } else {
          return this.profile.avatar;
      }
    }
    return UrlUtils.defaultProfileImage();
  }


  currentProfileImage(): any {
      if (this.profile.header) {
        if (/^qm/i.test(this.profile.header)) {
            return `${environment.ipfsGatewayBase}/${this.profile.header}`;
        } else {
            return this.profile.header;
        }
      }
      return null;
  }


  get profileName(): string | null {
    if (this.profile.username && this.profile.username !== '') {
      return this.profile.username;
    }
    return `${this.profile.addressLegacy}`;
  }

  gotoProfile() {
    this.router.navigate([this.profile.addressLegacy]);
  }

  profileIdentifier(): string | null {
    return `bitcoincash:${this.profile.addressLegacy}`;
  }

  get profileBio(): string {
    return ``;
  }
}
