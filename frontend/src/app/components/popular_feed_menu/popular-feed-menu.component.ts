import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Post } from '../../domain/posts/models/post.interface';
import { ProfileInfo } from '../../domain/profiles/models/profile-info.interface';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Session } from '../../domain/session/models/session.interface';
import * as moment from 'moment';
import { Store, select } from '@ngrx/store';
import * as fromStore from '../../reducers';
import * as fromPosts from '../../domain/posts/reducers';
import * as postsActions from '../../domain/posts/actions/posts';

@Component({
  selector: 'app-popular-feed-menu',
  templateUrl: './popular-feed-menu.component.html',
  styleUrls: ['./popular-feed-menu.component.sass']
})
export class PopularFeedMenuComponent implements AfterViewInit {

  @Input() feedType: string;
  @Input() routerState: any;

  constructor(private router: Router, private postsStore: Store<fromPosts.State>) {
  }

  ngAfterViewInit() {

  }

  get isToday(): boolean {
    if (/^\/top$/i.test(this.routerState.url)) {
      return true;
    }
    return false;
  }

  get isWeek(): boolean {
    if (/^\/top.*(week)/i.test(this.routerState.url)) {
      return true;
    }
    return false;
  }


  get isMonth(): boolean {
    if (/^\/top.*(month)/i.test(this.routerState.url)) {
      return true;
    }
    return false;
  }

  get isAllTime(): boolean {
    if (/^\/top.*(all)/i.test(this.routerState.url)) {
      return true;
    }
    return false;
  }

  gotoTop() {
    /*this.postsStore.dispatch(new postsActions.FetchFeed({
      offsetId: 0,
      isTop: true,
      range: 'today'
    }));*/
    this.router.navigate(['top']);
  }

  gotoTopWeek() {
    /*this.postsStore.dispatch(new postsActions.FetchFeed({
      offsetId: 0,
      isTop: true,
      range: 'week'
    }));
    console.log('========== LOGT TO TIP WEEK');*/
    this.router.navigate(['top'], { queryParams: { t: 'week' }});
  }

  gotoTopMonth() {
    /*this.postsStore.dispatch(new postsActions.FetchFeed({
      offsetId: 0,
      isTop: true,
      range: 'month'
    }));*/
    this.router.navigate(['top'], { queryParams: { t: 'month' }});
  }

  gotoTopAll() {
   /* this.postsStore.dispatch(new postsActions.FetchFeed({
      offsetId: 0,
      isTop: true,
      range: 'all'
    }));*/
    this.router.navigate(['top'], { queryParams: { t: 'all' }});
  }
 
}
