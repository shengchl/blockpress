import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { IpfsService } from '../../services/ipfs.service';
import { Post } from '../../domain/posts/models/post.interface';
import { ProfileInfo } from '../../domain/profiles/models/profile-info.interface';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Session } from '../../domain/session/models/session.interface';
import * as moment from 'moment';
import * as fromStore from '../../reducers';
import * as fromPosts from '../../domain/posts/reducers';
import * as fromAlerts from '../../domain/alerts/reducers';
import * as postsActions from '../../domain/posts/actions/posts';
import { Alert } from '../../domain/alerts/models/alert.interface';
import { Store } from '@ngrx/store';
import * as alertsActions from '../../domain/alerts/actions/alerts';
import * as modalActions from '../../domain/modals/actions/modals';

@Component({
  selector: 'app-tip-giving',
  templateUrl: './tip-giving.component.html',
  styleUrls: ['./tip-giving.component.sass'],
})
export class TipGivingComponent implements AfterViewInit {

  @Input() alertsList: Array<Alert>;
  @Input() post: Post;
  @Input() profiles: any;
  @Input() session: Session;
  @Input() currentUserProfile: ProfileInfo;
  @Input() replyingToName: string;
  @Output() close = new EventEmitter<any>();
  @Input() openedTxLikeTips: any;

  messageBody: string;
  minTipAmount = 546;

  constructor(
              private ipfsService: IpfsService,
              private http: HttpClient,
              private router: Router,
              private postsStore: Store<fromPosts.State>) {
  }

  get alertSelectKey(): string {
    if (this.post) {
      return 'tip-giving-alert-' + this.post.txId;
    }
    return 'tip-giving-alert-static';
  }

  get isSubmitting(): string {
    return this.openedTxLikeTips &&
    this.openedTxLikeTips[this.post.txId] &&
    this.openedTxLikeTips[this.post.txId].submitting;
  }

  get passwordInput(): string {
    return this.openedTxLikeTips &&
    this.openedTxLikeTips[this.post.txId] ?
    this.openedTxLikeTips[this.post.txId].password : '';
  }

  get tipAmountInput(): string {
    return this.openedTxLikeTips &&
    this.openedTxLikeTips[this.post.txId] ?
    this.openedTxLikeTips[this.post.txId].tipAmount : this.minTipAmount;
  }

  get hasTip(): boolean {
    return this.openedTxLikeTips &&
    this.openedTxLikeTips[this.post.txId] &&
    this.openedTxLikeTips[this.post.txId].tipsOpen;
  }

  addTip() {

    this.postsStore.dispatch(new postsActions.ChangeLikeOrTip({
      txId: this.post.txId,
      tipsOpen: true
    }));
  }

  removeTip() {
    this.postsStore.dispatch(new postsActions.ChangeLikeOrTip({
      txId: this.post.txId,
      tipsOpen: false
    }));
  }


  ngAfterViewInit() {
  }

  deleteAlert(data: {id: number, domSource: any}) {
    this.postsStore.dispatch(new alertsActions.DeleteAlert(data.id));
    data.domSource.stopPropagation();
  }

  updateTipAmount(event) {
    this.postsStore.dispatch(new postsActions.UpdateLikeTipAmount({
      txId: this.post.txId,
      tipAmount: event.target.value
    }));
  }

  updatePassword(event) {
    this.postsStore.dispatch(new postsActions.UpdateLikePassword({
      txId: this.post.txId,
      password: event.target.value
    }));
  }

  isValidTipForm(): boolean {
    return true;
  }

  get charLimit(): number {
    return 44 - 0;
  }

  isOverLimit(): boolean {
    if (this.charLimit < 0) {
      return true;
    }
  }

  isAddTip(): boolean {
    return false;
  }

  get postedAt(): string {
    return this.formatDate(this.post.createdAt);
  }

  formatDate(date): string {
    return moment(date * 1000).fromNow(true);
  }

  get insufficientBalance(): boolean {
    return this.session && this.session.balances.insufficientFunds;
  }
  createLikeReply($event) {

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

  createLikeReplyWithTip($event) {
    if (this.insufficientBalance) {
      this.postsStore.dispatch(new postsActions.ClosePostModals());
      this.postsStore.dispatch(new modalActions.OpenFundingModal(true));
      return;
    }
    this.postsStore.dispatch(new postsActions.PublishLike({
      txId: this.post.txId,
      body: null,
      tip: this.tipAmountInput,
      password: this.passwordInput,
    }));
    $event.stopPropagation();
  }


  get postAuthorName(): string | null {
      return this.profiles && this.profiles[this.post.authorId] &&
              this.profiles[this.post.authorId].username &&
              this.profiles[this.post.authorId].username !== '' ?
              this.profiles[this.post.authorId].username : this.post.authorId;
  }

  get postAvatarLink(): string {
    return this.profiles && this.profiles[this.post.authorId] &&
      this.profiles[this.post.authorId].avatar &&
      this.profiles[this.post.authorId].avatar !== '' ?
      this.profiles[this.post.authorId].avatar : `https://s3.amazonaws.com/bpdev/static/profileicon.png`;
  }

  get likesCount(): any {
    return this.post.likes ? this.post.likes : '';
  }

  get tipsCount(): any {
    return this.post.tips ? this.post.tips : '';
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
    return this.currentUserProfile && this.currentUserProfile.likeTxs &&
      !!this.currentUserProfile.likeTxs[this.post.txId];
  }

  get userLikeTxLink(): any {
    if (this.didCurrentUserLike) {
      return `https://explorer.bitcoin.com/bch/tx/${this.currentUserProfile.likeTxs[this.post.txId]}`;
    }
  }

  get tipsText(): string {
    let tips = 0;
    if (this.tipsCount !== '') {
      tips = this.tipsCount;
    }
    return `${tips} sats gifted`;
  }

  gotoProfile() {
    this.router.navigate([this.post.authorId]);
  }

  userSignedIn(): boolean {
    return this.session && !!this.session.userId;
  }

  blockchainLink(): string {
    return `https://explorer.bitcoin.com/bch/tx/${this.post.txId}`;
  }
}
