import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DomManipulationService } from '../../services/dom-manipulation.service';
import { IpfsService } from '../../services/ipfs.service';
import { Post } from '../../domain/posts/models/post.interface';
import { Store, select } from '@ngrx/store';
import * as fromStore from '../../reducers';
import * as fromPosts from '../../domain/posts/reducers';
import * as fromAlerts from '../../domain/alerts/reducers';
import * as postsActions from '../../domain/posts/actions/posts';
import * as alertsActions from '../../domain/alerts/actions/alerts';
import * as modalActions from '../../domain/modals/actions/modals';
import { Session } from '../../domain/session/models/session.interface';
import { ProfileInfo } from '../../domain/profiles/models/profile-info.interface';
import { Alert } from '../../domain/alerts/models/alert.interface';

declare var $;

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.sass']
})
export class SearchInputComponent {

  constructor(private store: Store<fromStore.State>,
              private postsStore: Store<fromPosts.State>,
              private alertStore: Store<fromAlerts.State>) {
  }

}
