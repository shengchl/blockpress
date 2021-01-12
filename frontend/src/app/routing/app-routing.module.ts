import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '../../environments/environment';

import { AppComponent } from '../app_container/app.component';
import { ProfileContainerPageComponent } from '../pages/profile_container/profile-container-page.component';
import { FeedContainerPageComponent } from '../pages/feed_container/feed-container-page.component';
import { DevsContainerPageComponent } from '../pages/devs_container/devs-container-page.component';
import { DiscoverContainerPageComponent } from '../pages/discover_container/discover-container-page.component';
import { SearchContainerPageComponent } from '../pages/search_container/search-container-page.component';
import { ProfilesContainerPageComponent } from '../pages/profiles_container/profiles-container-page.component';
import { TopicPostsContainerPageComponent } from '../pages/topic_posts_container/topic-posts-container-page.component';
import { CommunitiesContainerPageComponent } from '../pages/communities_container/communities-container-page.component';
import { PartnersContainerPageComponent } from '../pages/partners_container/partners-container-page.component';

const routes: Routes = [
  { path: '', component: FeedContainerPageComponent },
  { path: 'replies', component: FeedContainerPageComponent},
  { path: 'feed', component: FeedContainerPageComponent},
  { path: 'top', component: FeedContainerPageComponent },
  { path: 'developers/blockpress-protocol', component: DevsContainerPageComponent},
  { path: 'partners', component: PartnersContainerPageComponent},
  { path: 'notifications', component: DiscoverContainerPageComponent},
  { path: 'profiles', component: ProfilesContainerPageComponent },
  { path: 'posts/:directTxId', component: ProfileContainerPageComponent },
  { path: 'search', component: SearchContainerPageComponent },
  { path: 'communities', component: CommunitiesContainerPageComponent },
  { path: 'b/:communityName', component: CommunitiesContainerPageComponent },
  { path: 'profiles', component: ProfilesContainerPageComponent },
  { path: ':tabId', component: ProfileContainerPageComponent },
  { path: ':tabId/posts/:txId', component: ProfileContainerPageComponent},
  { path: ':tabId/:profilePageId', component: ProfileContainerPageComponent},
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { useHash: false }) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}
