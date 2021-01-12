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
  selector: 'app-welcome-info',
  templateUrl: './welcome-info.component.html',
  styleUrls: ['./welcome-info.component.sass']
})
export class WelcomeInfoComponent {

  constructor(private router: Router, private modalStore: Store<fromModal.State>) {

  }
}
