import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IpfsService } from '../../services/ipfs.service';
import { Post } from '../../domain/posts/models/post.interface';
import { ProfileInfo } from '../../domain/profiles/models/profile-info.interface';
import { Session } from '../../domain/session/models/session.interface';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-follow-stream',
  templateUrl: './follow-stream.component.html',
  styleUrls: ['./follow-stream.component.sass']
})
export class FollowStreamComponent {

  @Input() profiles: Array<any>;
  @Input() session: Session;

  constructor(private router: Router) {}

  gotoProfile(profile) {
    this.router.navigate([profile.addressLegacy]);
  }

  profileIdentifier(profile): string | null {
    return `bitcoincash:${profile.addressLegacy}`;
  }

  profileName(profile): string | null {
    if (profile.username && profile.username !== '') {
      return profile.username;
    }
    return `${profile.addressLegacy}`;
  }

  get profileBio(): string {
    return ``;
  }

  get getProfiles(): any {
    return this.profiles && this.profiles.length ? this.profiles : [];
  }
}
