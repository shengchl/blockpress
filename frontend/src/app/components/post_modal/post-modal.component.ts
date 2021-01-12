import { Component, Input, Output, EventEmitter, AfterViewInit, OnDestroy, OnChanges } from '@angular/core';
import { IpfsService } from '../../services/ipfs.service';
import { Post } from '../../domain/posts/models/post.interface';
import { ProfileInfo } from '../../domain/profiles/models/profile-info.interface';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Session } from '../../domain/session/models/session.interface';
import * as moment from 'moment';
import { Alert } from '../../domain/alerts/models/alert.interface';
import { Store, select } from '@ngrx/store';
import * as fromStore from '../../reducers';
import * as fromPosts from '../../domain/posts/reducers';
import * as fromPublisher from '../../domain/publisher/reducers';
import * as fromAlerts from '../../domain/alerts/reducers';
import * as postsActions from '../../domain/posts/actions/posts';
import * as publisherActions from '../../domain/publisher/actions/publisher';
import { Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { Publisher } from '../../domain/publisher/models/publisher-interface';

declare var $;

@Component({
  selector: 'app-post-modal',
  templateUrl: './post-modal.component.html',
  styleUrls: ['./post-modal.component.sass']
})
export class PostModalComponent implements AfterViewInit, OnChanges {

  @Input() post: Post;
  @Input() isModalOpen: boolean;
  @Input() profiles: any;
  @Input() session: Session;
  @Input() currentUserProfile: ProfileInfo;
  @Input() workingPostReplies: Array<Post>;
  @Input() alertsList: Array<Alert>;
  @Input() workingPost: Post;
  @Input() openedTxLikeTips: any;
  @Input() directlyNavigatedToPost?: boolean;
  @Input() publishers: {
    [key: string]: Publisher
  };
  @Output() modalClosed = new EventEmitter<void>();

  isTipGivingVisible = false;
  messageBody: string;
  modalIsShown = false;
  recentActivePost = null;
  pathToOpenWhenModalGetsClosed = null;

  constructor(
              private ipfsService: IpfsService,
              private http: HttpClient,
              private router: Router,
              private postsStore: Store<fromPosts.State>,
              private publisherStore: Store<fromPublisher.State>,
              private location: Location ) {
  }

  get publisherTxId(): string {
    return this.post ? this.post.txId : '';
  }

  get postReplies(): Array<Post> {
    if (this.post.replyPosts && this.post.replyPosts.length) {
      return this.post.replyPosts;
    }
    return [];
  }

  get replyToPostTxId(): string {
    return this.post ? this.post.txId : null;
  }

  closeModal() {
    $('#' + this.postModalId).modal('hide');
    this.modalClosed.emit();

    // If we are on the profile page, then change the route to the profile
    if (this.location.path() === '/posts/' + this.post.txId) {
      this.location.go('/' + this.post.authorId);
    }
    //

    this.publisherStore.dispatch(new publisherActions.ClosePublisher({
        txId: this.post.txId
    }));

  }

  /**
   * Prevent the click of anything generic inside the modal from trigger the dismissal of the modal.
   * Anything inside the mdoal can still be clicked since they have their own click handlers.
   */
  modalInnerClicked(e) {

    e.stopPropagation();
  }

  modalClicked(e) {
    this.closeModal();
    this.modalJustClosed();
    e.stopPropagation();
    e.preventDefault();
  }
  get postModalId(): string {
    // return this.post ? 'postModal-' + this.post.id : null;
    return 'post-modal-singleton-id';
  }

  ngAfterViewInit() {
    const that = this;
    $('#' + this.postModalId).on('hidden.bs.modal', function (e) {
      that.modalClosed.emit();
    });
  }

  firstTimeModalOpened() {
    this.pathToOpenWhenModalGetsClosed = this.location.path();
  }

  modalJustClosed() {

  }

  postChanged(newPost: Post, previousPost: Post) {

    // 4 cases:

    // newPost == null AND previousPost == null

    // Do nothing

    // newPost != null AND previousPost == null

    if (newPost != null && previousPost == null) {

      this.firstTimeModalOpened();

     /* if (this.directlyNavigatedToPost) {
        // Do nothing since we want to preserve URL
        return;
      }
*/
      // this.location.go('/posts/' + newPost.txId);
      return;
    }
    // newPost == null AND previousPost != null

    if (newPost == null && previousPost != null) {
      // Do nothing, because we know that if the newPost is null then that means the modal closed event fired (see other methods)
      // Therefore that method will be responsible for popping off the location stack
      //  this.location.back();

      this.modalJustClosed();
      return;
    }
    // (newPost != null AND previousPost != null) && newPost == previousPost
    if (newPost != null && previousPost != null && newPost.txId === previousPost.txId) {

    }
    // (newPost != null AND previousPost != null) && newPost != previousPost
    if (newPost != null && previousPost != null && newPost.txId !== previousPost.txId) {

      // Push onto stack then
       // this.location.go('/posts/' + newPost.txId);
    }
  }

  ngOnChanges() {
    if (this.post !== this.recentActivePost) {
      this.postChanged(this.post, this.recentActivePost);
      this.recentActivePost = this.post;
    }
    if (!this.isModalOpen && this.post) {
      $('div.modal-backdrop.fade.show').remove();
      $('body').removeClass('modal-open');
      $('#' + this.postModalId).modal('hide');
    } else if (this.isModalOpen && this.post) {
      $('#' + this.postModalId).modal('show');
    }
  }
  toggleTipGiving() {
    if (this.isTipGivingVisible) {
      this.isTipGivingVisible = false;
      return;
    }
    this.isTipGivingVisible = true;
  }

  closeTipGiving() {
    this.isTipGivingVisible = false;
  }

  get postedAt(): string {
    return this.formatDate(this.post.createdAt);
  }

  formatDate(date): string {
    return moment(date * 1000).fromNow(true);
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

  get repliesCount(): any {
    return this.post.replies ? this.post.replies : '';
  }

  get repliesText(): any {
    let replies = 0;
    if (this.repliesCount !== '') {
      replies = this.likesCount;
    }
    return `${replies} replies`;
  }

  get hasTips(): boolean {
    return this.post.tips > 0;
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
