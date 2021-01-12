import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IpfsService } from '../../services/ipfs.service';
import { Post } from '../../domain/posts/models/post.interface';
import { ProfileInfo } from '../../domain/profiles/models/profile-info.interface';
import { Session } from '../../domain/session/models/session.interface';
import { Alert } from 'selenium-webdriver';

@Component({
  selector: 'app-profile-page-tab',
  templateUrl: './profile-page-tab.component.html',
  styleUrls: ['./profile-page-tab.component.sass']
})
export class ProfilePageTabComponent {

  @Input() profilePageId: string;
  @Input() posts: Array<Post>;
  @Input() profiles: any;
  @Input() session: Session;
  @Input() followers: Array<any>;
  @Input() following: Array<any>;
  @Input() likes: Array<Post>;
  @Input() viewingUserProfileAddressLegacy: string;
  @Input() currentUserProfile: ProfileInfo;
  @Input() isEditProfile: boolean;
  @Input() workingPostReplies: Array<Post>;
  @Input() alertsList: Array<Alert>;
  @Input() workingPost: Post;
  @Input() openedTxLikeTips: any;
  constructor() { }

  isTabActive(tab) {
    return this.profilePageId === tab;
  }
}
