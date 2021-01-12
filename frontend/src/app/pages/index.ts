import { NgModule } from '@angular/core';
import { ComponentCollectionModule } from '../components';
import { BrowserModule } from '@angular/platform-browser';

import { ProfileContainerPageComponent } from './profile_container/profile-container-page.component';
import { FeedContainerPageComponent } from './feed_container/feed-container-page.component';
import { DevsContainerPageComponent } from './devs_container/devs-container-page.component';
import { DiscoverContainerPageComponent } from './discover_container/discover-container-page.component';
import { ProfilesContainerPageComponent } from './profiles_container/profiles-container-page.component';
import { SearchContainerPageComponent } from './search_container/search-container-page.component';
import { CommunitiesContainerPageComponent } from './communities_container/communities-container-page.component';
import { TopicPostsContainerPageComponent } from './topic_posts_container/topic-posts-container-page.component';
import { PartnersContainerPageComponent } from './partners_container/partners-container-page.component';

export const PAGES = [
  ProfileContainerPageComponent,
  FeedContainerPageComponent,
  DevsContainerPageComponent,
  DiscoverContainerPageComponent,
  ProfilesContainerPageComponent,
  SearchContainerPageComponent,
  CommunitiesContainerPageComponent,
  TopicPostsContainerPageComponent,
  PartnersContainerPageComponent
];

@NgModule({
  imports: [BrowserModule, ComponentCollectionModule],
  declarations: PAGES,
  exports: PAGES
})
export class PagesCollectionModule { }
