import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { environment } from '../environments/environment';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { HttpClientModule } from '@angular/common/http';
import { LinkyModule } from 'angular2-linky';

// Routing
import { AppRoutingModule } from './routing/app-routing.module';
import { StoreRouterConnectingModule, RouterStateSerializer } from '@ngrx/router-store';
import { CustomRouterStateSerializer } from './routing/route-serializer';

// Modules
import { PostsModule } from '../app/domain/posts/posts.module';
import { SessionModule } from '../app/domain/session/session.module';
import { ProfilesModule } from '../app/domain/profiles/profiles.module';
import { ModalsModule } from '../app/domain/modals/modals.module';
import { AlertsModule } from '../app/domain/alerts/alerts.module';
import { CommunitiesModule } from '../app/domain/communities/communities.module';

// DevTools
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

// App setup and modules
import { AppComponent } from './app_container/app.component';

// Pages
import { PagesCollectionModule } from './pages';

// Directives
import { DirectiveCollectionModule } from './directives';

// reducers
import { reducers, metaReducers } from './reducers';

// Services
import { DomManipulationService } from './services/dom-manipulation.service';
import { IpfsService } from './services/ipfs.service';
import { ApiService } from './services/api.service';
import { TruncatePipe } from './pipes/truncate-pipe';
import { PublisherModule } from './domain/publisher/publisher.module';
import { SafePipe } from './pipes/safe-pipe';


@NgModule({
  declarations:  [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PostsModule,
    CommunitiesModule,
    SessionModule,
    ProfilesModule,
    ModalsModule,
    AlertsModule,
    PublisherModule,
    HttpClientModule,
    LinkyModule,
    StoreRouterConnectingModule.forRoot({
      stateKey: 'router',
    }),
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreDevtoolsModule.instrument({
      name: 'BlockPress App Devtools',
      logOnly: environment.production,
    }),
    PagesCollectionModule,
    DirectiveCollectionModule,
    EffectsModule.forRoot([]),
  ],
  providers: [
    { provide: RouterStateSerializer, useClass: CustomRouterStateSerializer },
    DomManipulationService,
    IpfsService,
    ApiService
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
