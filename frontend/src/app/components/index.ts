import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LinkyModule } from 'angular2-linky';
import { ModalDirective } from '../directives/modal/modal.directive';

import { ImageBannerComponent } from './image_banner/image-banner.component';
import { NavigationTabsComponent } from './navigation_tabs/navigation-tabs.component';
import { PublisherComponent } from './publisher/publisher.component';
import { WalletViewComponent } from './wallet_view/wallet-view.component';
import { CreateWalletModalComponent } from './create_wallet_modal/create-wallet-modal.component';
import { WarningModalComponent } from './warning_modal/warning-modal.component';
import { BackupPhraseModalComponent } from './backup_phrase_modal/backup-phrase-modal.component';
import { BackupConfirmModalComponent } from './backup_confirm_modal/backup-confirm-modal.component';
import { DisclaimerModalComponent } from './disclaimer_modal/disclaimer-modal.component';
import { CompleteModalComponent } from './complete_modal/complete-modal.component';
import { StandardNavComponent } from './standard_nav/standard-nav.component';
import { PostStreamComponent } from './post_stream/post-stream.component';
import { PostComponent } from './post/post.component';
import { ProfileHeaderComponent } from './profile_header/profile-header.component';
import { ProfileSidebarComponent } from './profile_sidebar/profile-sidebar.component';
import { InfoLeadComponent } from './info_lead/info-lead.component';
import { ProfilePageTabComponent } from './profile_page_tab/profile-page-tab.component';
import { FollowStreamComponent } from './follow-stream/follow-stream.component';
import { ProfilePreviewComponent } from './profile-preview/profile-preview.component';
import { ViewKeyModalComponent } from './view_key_modal/view-key-modal.component';
import { DepositFundsModalComponent } from './deposit_funds_modal/deposit-funds-modal.component';
import { PageFeedViewComponent } from './page_feed_view/page-feed-view.component';
import { AlertMessagesComponent } from './alerts/alerts.component';
import { WalletPreviewComponent } from './wallet-preview/wallet-preview.component';
import { TipGivingComponent } from './tip-giving/tip-giving.component';
import { PostModalComponent } from './post_modal/post-modal.component';
import { TruncatePipe } from '../pipes/truncate-pipe';
import { FollowPreviewComponent } from './follow-preview/follow-preview.component';
import { PageProfileViewComponent } from './page_profile_view/page-profile-view.component';
import { WelcomeInfoComponent } from './welcome-info/welcome-info.component';
import { FooterNavComponent } from './footer_nav/footer-nav.component';
import { PageDevsViewComponent } from './page_devs_view/page-devs-view.component';
import { PageDiscoverViewComponent } from './page_discover_view/page-discover-view.component';
import { NotificationsStreamComponent } from './notifications_stream/notifications-stream.component';
import { PageSearchViewComponent } from './page_search_view/page-search-view.component';
import { SearchInputComponent } from './search_input/search-input.component';
import { CommunitiesViewComponent } from './communities_view/communities-view.component';
import { PageCommunitiesViewComponent } from './page-communities-view/page-communities-view.component';
import { ProfileMiniPreviewComponent } from './profile-mini-preview/profile-mini-preview.component';
import { PageProfilesViewComponent } from './page_profiles_view/page-profiles-view.component';
import { PopularFeedMenuComponent } from './popular_feed_menu/popular-feed-menu.component';
import { ProfileFullPreviewComponent } from './profile_full_preview/profile-full-preview.component';
import { SafePipe } from '../pipes/safe-pipe';
import { StripHtmlPipe } from '../pipes/strip-html';
import { PagePartnersViewComponent } from './page_partners_view/page-partners-view.component';

export const COMPONENTS = [
  ModalDirective,
  ImageBannerComponent,
  NavigationTabsComponent,
  PublisherComponent,
  WalletViewComponent,
  CreateWalletModalComponent,
  WarningModalComponent,
  BackupPhraseModalComponent,
  BackupConfirmModalComponent,
  DisclaimerModalComponent,
  CompleteModalComponent,
  StandardNavComponent,
  PostStreamComponent,
  PostComponent,
  ProfileHeaderComponent,
  ProfileSidebarComponent,
  InfoLeadComponent,
  ProfilePageTabComponent,
  FollowStreamComponent,
  ProfilePreviewComponent,
  ViewKeyModalComponent,
  DepositFundsModalComponent,
  PageFeedViewComponent,
  AlertMessagesComponent,
  WalletPreviewComponent,
  TipGivingComponent,
  PostModalComponent,
  TruncatePipe,
  SafePipe,
  FollowPreviewComponent,
  PageProfileViewComponent,
  WelcomeInfoComponent,
  FooterNavComponent,
  PageDevsViewComponent,
  PageDiscoverViewComponent,
  NotificationsStreamComponent,
  PageSearchViewComponent,
  SearchInputComponent,
  CommunitiesViewComponent,
  PageCommunitiesViewComponent,
  ProfileMiniPreviewComponent,
  PageProfilesViewComponent,
  PopularFeedMenuComponent,
  ProfileFullPreviewComponent,
  StripHtmlPipe,
  PagePartnersViewComponent
];

@NgModule({
  imports: [BrowserModule, LinkyModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class ComponentCollectionModule { }

