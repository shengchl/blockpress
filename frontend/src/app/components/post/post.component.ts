import { Component, Input, Output, EventEmitter, AfterViewInit, OnDestroy } from '@angular/core';
import { IpfsService } from '../../services/ipfs.service';
import { Post } from '../../domain/posts/models/post.interface';
import { ProfileInfo } from '../../domain/profiles/models/profile-info.interface';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Session } from '../../domain/session/models/session.interface';
import * as moment from 'moment';
import { Store, select } from '@ngrx/store';
import * as fromStore from '../../reducers';
import * as fromPosts from '../../domain/posts/reducers';
import * as fromAlerts from '../../domain/alerts/reducers';
import * as postsActions from '../../domain/posts/actions/posts';
import * as modalActions from '../../domain/modals/actions/modals';
import * as alertsActions from '../../domain/alerts/actions/alerts';
import { Alert } from '../../domain/alerts/models/alert.interface';
import { DomSanitizer } from '@angular/platform-browser';

declare var $;
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.sass']
})
export class PostComponent {

  @Input() isInsideModal = false; // If already inside a modal, then do not render other modal
  @Input() isReply = false;
  @Input() hideActions = false;
  @Input() post: Post;
  @Input() workingPostReplies: Array<Post>;
  @Input() profiles: any;
  @Input() session: Session;
  @Input() currentUserProfile: ProfileInfo;
  @Input() alertsList: Array<Alert>;
  @Input() workingPost: Post;
  @Input() showOnLoad = false;
  @Input() openedTxLikeTips: any;

  isTipGivingVisible = false;
  messageBody: string;
  userWantedToShowImage = false;

  isShowExplorer = false;

  isModalVisible = false;

  constructor(private sanitizer: DomSanitizer,
              private ipfsService: IpfsService,
              private http: HttpClient,
              private router: Router,
              private postsStore: Store<fromPosts.State>) {
    this.isModalVisible = this.showOnLoad;
  }

  toggleExplorer() {
    this.isShowExplorer = !this.isShowExplorer;
  }

  get hasCommunity(): boolean {
    return !!this.post && !!this.post.community && this.post.community !== '';
  }

  get getCommunityName(): string {
    return `b/${this.post.community}`;
  }


  get isTipGivingOpen(): boolean {
    return this.openedTxLikeTips && this.post &&
    this.openedTxLikeTips[this.post.txId] &&
    this.openedTxLikeTips[this.post.txId].isDialogOpen;
  }

  gotoPost(postTx) {
    this.router.navigate([this.post.replyToPost.authorId, 'posts', postTx]);
  }
  get highlightActionIcon(): boolean {
    return this.didCurrentUserLike;
  }

  gotoCommunity($event) {
    this.router.navigate(['b', this.post.community]);
    $event.stopPropagation();
  }

  stopProgation($event) {
    $event.stopPropagation();
  }
  stopProp($event) {
    $event.stopPropagation();
  }


  get insufficientBalance(): boolean {
    return this.session && this.session.balances.insufficientFunds;
  }

  createLikeReply($event) {

    if (this.didCurrentUserLike) {
      return;
    }

    if (this.insufficientBalance) {
      this.postsStore.dispatch(new postsActions.ClosePostModals());
      this.postsStore.dispatch(new modalActions.OpenFundingModal(true));
      return;
    }
    this.postsStore.dispatch(new postsActions.PublishLike({
      txId: this.post.txId,
      body: null,
      tip: 0,
    }));
    $event.stopPropagation();
  }

  currentUserFollowing(): boolean {
    return this.post && this.post.isFollowingAuthor;
  }

  getYouTubeId(url) {
    let ID = '';
    url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    if (url[2] !== undefined) {
      ID = url[2].split(/[^0-9a-z_\-]/i);
      ID = ID[0];
    } else {
      ID = url;
    }
    return ID;
  }

  getYouTubeIdLong(url) {
    let ID = '';
    url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    if (url[2] !== undefined) {
      ID = url[2].split(/[^0-9a-z_\-]/i);
      ID = ID[0];
    } else {
      ID = url;
    }
    return ID;
  }

  hasVideo(): boolean {
    if (!this.post || !this.post.messageBody || this.post.messageBody === '') {
      return false;
    }
    if (/https?\:\/\/(www\.)?youtu\.be/i.test(this.post.messageBody)) {
      return true;
    }

    if (/https?\:\/\/(www\.)?youtube/i.test(this.post.messageBody)) {
     return true;
    }
    return false;
  }

  get videoLink(): string {
    if (/https?\:\/\/(www\.)?youtu\.be/i.test(this.post.messageBody)) {
      return `//www.youtube.com/embed/${this.getYouTubeId(this.post.messageBody)}`;
    }

    if (/https?\:\/\/(www\.)?youtube/i.test(this.post.messageBody)) {
      return `//www.youtube.com/embed/${this.getYouTubeIdLong(this.post.messageBody)}`;
    }
    return '';
  }

  hasImage(): boolean {
    return this.post && ((!!this.post.mediaPayload && this.post.mediaPayload !== '') || !!this.embeddedImage);
  }

  get embeddedImage(): string {
    const mediaUrl = '';
    const captureImage = /(https?\:\/\/[^\s]+?\.(jpg|jpeg|gif|png))/ig;
    const captures = captureImage.exec(this.post.messageBody);
    if (captures) {
      return captures[0];
    }
    return null;
  }

  shouldShowImage(): boolean {
    if (this.post && (this.hasImage || this.embeddedImage)) {
      return true;
    }
    return false;
  }

  toggleImage($event) {
    this.userWantedToShowImage = !this.userWantedToShowImage;
    $event.stopPropagation();
  }

  get postImageLink(): string {

    if (this.post && this.post.mediaPayload && /^https?/i.test(this.post.mediaPayload)) {
      return this.post.mediaPayload;
    }

    if (this.post && this.post.mediaPayload) {
      return `https://gateway.ipfs.io/ipfs/${this.post.mediaPayload}`;
    }

    if (this.post && this.embeddedImage) {
      return this.embeddedImage;
    }
  }

  openTipGiving($event, tipsOpen: boolean) {
    this.postsStore.dispatch(new postsActions.OpenLikeTipReplyForPost({
      txId: this.post.txId,
      tipsOpen: tipsOpen
    }));
    $event.stopPropagation();
  }

  closeTipGiving(event) {
    this.postsStore.dispatch(new postsActions.CloseLikeTipReplyForPost({
      txId: this.post.txId,
    }));
    event.stopPropagation();
  }


  modalGotClosed() {
    this.isModalVisible = false;
  }

  postReplyClicked(e) {
    e.stopPropagation();
  }

  showPostModal($event) {
    const senderElement = $event.target;

    if ($(senderElement).hasClass('tip-giving-container')) {
      return;
    }

    this.postsStore.dispatch(new postsActions.FetchPost({
      txId: this.post.txId,
    }));
    $event.stopPropagation();
    // this.postsStore.dispatch(new postsActions.FetchPostReplies(this.post.txId));
  }

  isLike(): boolean {
    return this.post && this.post.isLike;
  }
  get postModalId(): string {
    if (!this.post) {
      return '';
    }
    return 'postModal-' + this.post.id;
  }

  get hasTips(): boolean {
    return this.post.tips > 0;
  }

  get postedAt(): string {
    if (!this.post) {
      return '';
    }
    return this.formatDate(this.post.createdAt);
  }

  get replyToPost(): boolean {
    return this.post && !!this.post.replyToPost && !!this.post.replyToPost.txId;
  }

  formatDate(date): string {
    return moment(date * 1000).fromNow(true);
  }

  get postAuthorName(): string | null {

    if (!this.post) {
      return '';
    }

      return this.post && this.profiles && this.profiles[this.post.authorId] &&
              this.profiles[this.post.authorId].username &&
              this.profiles[this.post.authorId].username !== '' ?
              this.profiles[this.post.authorId].username : this.post.authorId;
  }

  get postAuthorAddress(): string | null {

    if (!this.postAuthorName || !this.post) {
      return '';
    }
    return this.post && this.profiles && this.profiles[this.post.authorId] &&
            this.profiles[this.post.authorId].addressLegacy &&
            this.profiles[this.post.authorId].addressLegacy !== '' ?
            this.profiles[this.post.authorId].addressLegacy : '';
  }

  get postAvatarLink(): string {

    if (!this.post) {
      return '';
    }

    return this.post && this.profiles && this.profiles[this.post.authorId] &&
      this.profiles[this.post.authorId].avatar &&
      this.profiles[this.post.authorId].avatar !== '' ?
      this.profiles[this.post.authorId].avatar : `https://s3.amazonaws.com/bpdev/static/profileicon.png`;
  }

  get likesCount(): any {
    return this.post && this.post.likes ? this.post.likes : '';
  }

  get tipsCount(): any {
    return this.post && this.post.tips ? this.post.tips : '';
  }

  get repliesCount(): any {
    return this.post && this.post.replies ? this.post.replies : '';
  }


  get repliesText(): any {
    let replies = 0;
    if (this.repliesCount !== '') {
      replies = this.likesCount;
    }
    return `${replies} replies`;
  }

  get likesText(): string {
    let likes = 0;
    if (this.likesCount !== '') {
      likes = this.likesCount;
    }
    return `${likes} likes`;
  }

  get alreadyLikedText(): string {
    return `You liked this post. Click to see the transaction on the blockchain.`;
  }
  get didCurrentUserLike(): boolean {
    return this.currentUserProfile && this.currentUserProfile.likeTxs && this.post &&
      !!this.currentUserProfile.likeTxs[this.post.txId];
  }

  get userLikeTxLink(): any {
    if (this.didCurrentUserLike && this.post) {
      return `https://explorer.bitcoin.com/bch/tx/${this.currentUserProfile.likeTxs[this.post.txId]}`;
    }
  }

  get postMessageBody(): string {
    if (!this.post) {
      return '';
    }
    return this.post.messageBody ? this.post.messageBody : '';
  }

  stripHtml(value: string): any {
    return value.replace(/<.*?>/g, ''); // replace tags
  }

  get hashtaggedText(): string {
      if (!this.postMessageBody) {
        return '';
      }

      return this.stripHtml(this.postMessageBody).replace(/(^|\s)*#([\u00C0-\u1FFF\w]+)/g,
      '$1<a href="https://www.blockpress.com/search?q=$2">#$2</a>');
  }

  get tipsText(): string {
    let tips = 0;
    if (this.tipsCount !== '') {
      tips = this.tipsCount;
    }
    return `${tips} sats gifted`;
  }

  deleteAlert(data: {id: number, domSource: any}) {
    this.postsStore.dispatch(new alertsActions.DeleteAlert(data.id));
    data.domSource.stopPropagation();
  }

  get tippedAmount(): number {
    return this.post.isLikeTippedAmount;
  }

  get alertSelectKey(): string {
    if (this.post) {
      return 'tip-giving-alert-' + this.post.txId;
    }
    return 'tip-giving-alert-static';
  }


  gotoProfile($event) {
    this.router.navigate([this.post.authorId]);
    $event.stopPropagation();
  }

  userSignedIn(): boolean {
    return this.session && !!this.session.userId;
  }

  blockchairLink(): string {
    if (!this.post) {
      return '';
    }
    return `https://blockchair.com/bitcoin-cash/transaction/${this.post.txId}`;
  }

  blockchainLink(): string {
    if (!this.post) {
      return '';
    }

    return `https://explorer.bitcoin.com/bch/tx/${this.post.txId}`;
  }
}
