import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';

import { Post } from '../../domain/posts/models/post.interface';
import { ProfileInfo } from '../../domain/profiles/models/profile-info.interface';

import { Router } from '@angular/router';
import * as moment from 'moment';
import { Session } from '../../domain/session/models/session.interface';
import { ExportKeyInfo } from '../../domain/session/models/export-key-info.interface';
import { Store, select } from '@ngrx/store';
import * as fromStore from '../../reducers';
import * as fromPosts from '../../domain/posts/reducers';
import * as fromSession from '../../domain/session/reducers';
import * as fromModal from '../../domain/modals/reducers';
import * as postsActions from '../../domain/posts/actions/posts';
import * as communitiesActions from '../../domain/communities/actions/communities';
import * as fromProfiles from '../../domain/profiles/reducers';
import * as fromCommunities from '../../domain/communities/reducers';
import * as sessionActions from '../../domain/session/actions/session';
import { Alert } from '../../domain/alerts/models/alert.interface';
import { Community } from '../../domain/communities/models/community.interface';


@Component({
  selector: 'app-communities-view',
  templateUrl: './communities-view.component.html',
  styleUrls: ['./communities-view.component.sass']
})
export class CommunitiesViewComponent {
  @Input() communities: Array<Community>;
  @Input() session: Session;

 newCommunityName = '';

  constructor(  private store: Store<fromStore.State>,
                private communitiesStore: Store<fromCommunities.State>,
                private sessionStore: Store<fromSession.State>,
                private router: Router) {
  }

  userSignedIn(): boolean {
    return !!this.session && !!this.session.userId;
  }
  formatDate(date): string {
    return moment(date * 1000).fromNow(true);
  }

  updateNewCommunityName(event) {
    if (event.keyCode === 32) {
      event.preventDefault();
      return;
    }
    this.newCommunityName = event.target.value;
  }

  gotoNewCommunity() {
    if (!this.newCommunityName || this.newCommunityName.trim() === '') {
      return;
    }
    this.router.navigate(['b', this.newCommunityName]);
  }

  gotoCommunity(community: string) {
    this.router.navigate(['b', community]);
  }
}
