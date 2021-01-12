import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Post } from '../../domain/posts/models/post.interface';
import { ProfileInfo } from '../../domain/profiles/models/profile-info.interface';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Session } from '../../domain/session/models/session.interface';
import * as moment from 'moment';

@Component({
  selector: 'app-info-lead',
  templateUrl: './info-lead.component.html',
  styleUrls: ['./info-lead.component.sass']
})
export class InfoLeadComponent {

  @Input() currentUserProfile: any;
  @Input() session: Session;

  constructor(private router: Router) {
  }


  userSignedIn(): boolean {
    return this.session && !!this.session.userId;
  }

  showPersonalMessage(): boolean {
    return this.userSignedIn() &&
            this.currentUserProfile &&
            this.currentUserProfile.name !== '';
  }
  gotoProfile() {
    this.router.navigate([this.currentUserProfile.address_id]);
  }
  gotoSignUp() {
    window.location.href = 'http://lvh.me:3027/users/sign_up';
  }
}
