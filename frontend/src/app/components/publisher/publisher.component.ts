import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DomManipulationService } from '../../services/dom-manipulation.service';
import { IpfsService } from '../../services/ipfs.service';
import { Post } from '../../domain/posts/models/post.interface';
import { Store, select } from '@ngrx/store';
import * as fromStore from '../../reducers';
import * as fromPosts from '../../domain/posts/reducers';
import * as fromAlerts from '../../domain/alerts/reducers';
import * as fromPublisher from '../../domain/publisher/reducers';
import * as postsActions from '../../domain/posts/actions/posts';
import * as publisherActions from '../../domain/publisher/actions/publisher';
import * as alertsActions from '../../domain/alerts/actions/alerts';
import * as modalActions from '../../domain/modals/actions/modals';
import { Session } from '../../domain/session/models/session.interface';
import { ProfileInfo } from '../../domain/profiles/models/profile-info.interface';
import { Alert } from '../../domain/alerts/models/alert.interface';
import { Publisher } from '../../domain/publisher/models/publisher-interface';
import { PublisherActionTypes } from '../../domain/publisher/actions/publisher';
import * as resizeImage from 'resize-image';

declare var $;
declare var Buffer;

@Component({
  selector: 'app-publisher',
  templateUrl: './publisher.component.html',
  styleUrls: ['./publisher.component.sass']
})
export class PublisherComponent {

  @Input() startCharLimit = 217;
  @Input() publisherTxId = ''; // Required to determine which publishe this is (ie: main or for a post/reply)
  @Input() replyToTxId = null;
  @Input() session: Session;
  @Input() workingPost: Post;
  @Input() currentUserProfile: ProfileInfo;
  @Input() alertsList: Array<Alert>;
  @Input() postCommunityName?: string;
  @Input() publisherType: string;
  @Input() disableImagePublish?: boolean;
  @Input() publishers: {
    [key: string]: Publisher
  };

  @Output() close = new EventEmitter<void>();
  @Output() startPostEdit = new EventEmitter<void>();
  @Output() update = new EventEmitter<any>();

  fileInputElement = null;
  fileAvatarInputElement = null;
  MAX_25_MB = 2100000;
  NO_FILE_CHOSEN = 'No file chosen';
  fileName = this.NO_FILE_CHOSEN;
  fileChosen = false;

  activeTab = 'text';
  fileblob = '';
  fileAvatarBlob = '';

  usingIpfs = false;
  didIpfsUpload = false;
  uploadError = false;
  uploadErrorMessage = '';

  constructor(private ipfsService: IpfsService,
              private store: Store<fromStore.State>,
              private postsStore: Store<fromPosts.State>,
              private publisherStore: Store<fromPublisher.State>,
              private alertStore: Store<fromAlerts.State>,
              private ipfs: IpfsService) {
  }

  get publisherIdUnique(): string {
    return `publisher-textarea-${this.publisherTxId}`;
  }

  get isPublisherImage(): boolean {
    return this.selfPublisherState && this.selfPublisherState.contentType === 'image';
  }

  get isMediaUploading(): boolean {
    return this.selfPublisherState && this.selfPublisherState.isMediaUploading;
  }

  get publisherText(): string {
    return this.selfPublisherState && this.selfPublisherState.text;
  }

  get publisherTitle(): string {
    return this.selfPublisherState && this.selfPublisherState.title;
  }

  get selfPublisherState(): Publisher {
    return this.publishers[this.publisherTxId];
  }

  get isPublisherOpen(): boolean {
    return this.selfPublisherState && this.selfPublisherState.isPublisherOpen;
  }

  isActiveTab(tabName: string): boolean {
    return tabName === this.activeTab;
  }

  isValidPost(): boolean {
    if (this.isActiveTab('image')) {
      if (this.usingIpfs) {
        return this.didIpfsUpload && this.hasActiveBackground && !this.uploadError && !this.isMediaUploading && this.charLimit >= 0;
      }
      return this.hasActiveBackground && this.charLimit >= 0;
    }
    if (this.isActiveTab('text')) {
      return this.isValidMessage();
    }
    return false;
  }

  gotoTab(tabName: string) {
    this.activeTab = tabName;
    this.publisherStore.dispatch(new publisherActions.ChangePublishContentType({
      txId: this.publisherTxId,
      contentType: tabName
    }));

    this.publisherStore.dispatch(new publisherActions.UpdateProperty({
      txId: this.publisherTxId,
      change: {
        property: 'imageUrlOrIpfsPayload',
        value: null,
      }
    }));

    if (this.activeTab === 'image') {
      this.publisherStore.dispatch(new publisherActions.LoadIpfsScript({
        payload: null
      }));
    } else {
      this.fileChosen = false;
    }
  }

  get hasActiveBackground(): boolean {
    return !!this.selfPublisherState && !!this.selfPublisherState.imageUrlOrIpfsPayload;
  }

  get activeBackground(): any {
    // return this.fileblob;
    return this.selfPublisherState.imageUrlOrIpfsPayload;
  }

  chosenImage(): any {
    return this.fileblob;
  }

  clearImage() {
    this.fileblob = null;
    this.fileChosen = false;
    this.publisherStore.dispatch(new publisherActions.UpdateProperty({
      txId: this.publisherTxId,
      change: {
        property: 'imageUrlOrIpfsPayload',
        value: null,
      }
    }));
    this.publisherStore.dispatch(new publisherActions.UpdateMediaUploadStatusPublisher({
      txId: this.publisherTxId,
      isMediaUploading: false
    }));
  }

  chooseUrl(event) {
    const that = this;
    that.publisherStore.dispatch(new publisherActions.UpdateProperty({
      txId: that.publisherTxId,
      change: {
        property: 'imageUrlOrIpfsPayload',
        value: event.target.value,
      }
    }));
  }

  /* Utility function to convert a canvas to a BLOB */
 dataURLToBlob(dataURL) {
  const BASE64_MARKER = ';base64,';
  let parts = null;
  let contentType = null;
  let raw = null;
  if (dataURL.indexOf(BASE64_MARKER) === -1) {
    parts = dataURL.split(',');
    contentType = parts[0].split(':')[1];
    raw = parts[1];

    return new Blob([raw], {type: contentType});
  }

  parts = dataURL.split(BASE64_MARKER);
  contentType = parts[0].split(':')[1];
  raw = window.atob(parts[1]);
  const rawLength = raw.length;

  const uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], {type: contentType});
}
get isIpfsEnabled(): boolean {
  return false;
}
/* End Utility function to convert a canvas to a BLOB      */
selectFile(event) {
  this.fileblob = null;
  const that = this;
  if (!(event.target && event.target.files && event.target.files[0])) {
    this.fileInputElement = null;
  }

  this.fileInputElement = event.target;

  if (!this.isValidFileChosen()) {
    that.publisherStore.dispatch( new alertsActions.PushAlert({
      type: 'danger',
      message: 'Oops...Please upload a valid image type (jpg/gif/png) and less than 2MB in size',
      permanent: false,
      imperative: false
    }));
    return;
  }
  this.fileName = event.target.files[0].name;
  const readerPreview = new FileReader();
  readerPreview.onload = function (e) {
      that.fileblob = e.target['result'];
      that.fileChosen = true;
      if (that.isIpfsEnabled) {
          const img = new Image();
          img.onload = function () {
            const data = resizeImage.resize(img, 500, 500, resizeImage.JPG);
           // that.beginIpfsUpload(Buffer.from(dataUriToBuffer(data)));
          };
          img.src = e.target['result']; // local image url
      } else {
        that.publisherStore.dispatch(new publisherActions.UpdateProperty({
          txId: that.publisherTxId,
          change: {
            property: 'imageUrlOrIpfsPayload',
            value: event.target.value,
          }
        }));
      }
   };
    readerPreview.readAsDataURL(this.fileInputElement.files[0]);
    /*const reader = new FileReader();
    reader.onload = function (e) {
    };
    reader.readAsArrayBuffer(this.fileInputElement.files[0]);*/
  }

  beginIpfsUpload(buffer: any) {

    this.usingIpfs = true;
    this.publisherStore.dispatch(new publisherActions.UpdateMediaUploadStatusPublisher({
      txId: this.publisherTxId,
      isMediaUploading: true
    }));
    this.ipfsService.addBuffer(buffer, (status, message, result) => {
        if (!status) {
          this.uploadError = true;
            console.error('error', status, message);
            this.publisherStore.dispatch( new alertsActions.PushAlert({
              type: 'danger',
              message: 'Oops...an error occurred uploading to IPFS. Please try again ' +
              'or paste a link in below directly instead. Our team has been notified',
              permanent: false,
              imperative: false
            }));
            this.publisherStore.dispatch(new publisherActions.UpdateMediaUploadStatusPublisher({
              txId: this.publisherTxId,
              isMediaUploading: false
            }));
            return;
        }

        this.publisherStore.dispatch(new publisherActions.UpdateMediaUploadStatusPublisher({
          txId: this.publisherTxId,
          isMediaUploading: false
        }));
        this.uploadError = false;
        this.didIpfsUpload = true;
        this.publisherStore.dispatch(new publisherActions.UpdateProperty({
          txId: this.publisherTxId,
          change: {
            property: 'imageUrlOrIpfsPayload',
            value: result,
          }
        }));
    });
  }
  isValidFileChosen(): boolean {

    if (this.fileInputElement &&
        this.fileInputElement.files &&
        this.fileInputElement.files[0] &&
        this.fileInputElement.files[0].size < this.MAX_25_MB &&
        (/(jpe?g|gif|png)/i.test(this.fileInputElement.files[0].name))) {
        return true;
    }
    return false;
  }

  expandPoster() {
    if (this.session.balances.insufficientFunds) {
      this.postsStore.dispatch(new postsActions.ClosePostModals());
      const that = this;
      setTimeout(function() {
        that.store.dispatch(new modalActions.OpenFundingModal(true));
      }, 1000);
      return;
    }

    this.publisherStore.dispatch(new publisherActions.OpenPublisher({
      txId: this.publisherTxId
    }));

    setTimeout(function() {
      $('#' + this.publisherIdUnique).focus();
    }, 0);
  }

  closePoster() {
    this.activeTab = 'text';
    this.clearImage();
    this.publisherStore.dispatch(new publisherActions.ClosePublisher({
      txId: this.publisherTxId
    }));
  }

  userSignedIn(): boolean {
    return this.session && !!this.session.userId;
  }

  deleteAlert(data: {id: number, domSource: string}) {
    this.store.dispatch(new alertsActions.DeleteAlert(data.id));
  }

  createPost() {
    if (this.replyToTxId) {
      let publishBodyWithImage = this.selfPublisherState.text;
      if (this.selfPublisherState.imageUrlOrIpfsPayload) {
        publishBodyWithImage = `${publishBodyWithImage} ${this.selfPublisherState.imageUrlOrIpfsPayload}`;
      }
      this.postsStore.dispatch(new postsActions.PublishReply({
        body: publishBodyWithImage,
        txId: this.replyToTxId
      }));
    } else if (this.postCommunityName && this.postCommunityName.trim() !== '') {
      let publishBodyWithImage = this.selfPublisherState.text;
      if (this.selfPublisherState.imageUrlOrIpfsPayload) {
        publishBodyWithImage = `${publishBodyWithImage} ${this.selfPublisherState.imageUrlOrIpfsPayload}`;
      }
      this.postsStore.dispatch(new postsActions.PublishCommunity({
        body: publishBodyWithImage,
        communityName: this.postCommunityName,
        imageUrlOrIpfs: null
      }));
    } else {
      this.postsStore.dispatch(new postsActions.Publish({
        body: this.selfPublisherState.text,
        imageUrlOrIpfs: this.selfPublisherState.imageUrlOrIpfsPayload
      }));
    }
  }

  get currentUserProfileAvatar(): string | null {
    return this.currentUserProfile.avatar && this.currentUserProfile.avatar !== '' ?
      this.currentUserProfile.avatar : 'https://s3.amazonaws.com/bpdev/static/profileicon.png';
  }

  get lengthOfImageIfSet(): number {
    if (this.isPublisherImage) {
      return this.selfPublisherState &&
        this.selfPublisherState.imageUrlOrIpfsPayload ? this.selfPublisherState.imageUrlOrIpfsPayload.length + 2 : 0;
    } else {
      return 0;
    }
  }

  get charLimit(): number {
    if (this.postCommunityName && this.postCommunityName.trim() !== '') {
      return this.startCharLimit - this.postCommunityName.length - this.publisherText.length - this.lengthOfImageIfSet;
    }

    if (!this.publisherText) {
      return this.startCharLimit - this.lengthOfImageIfSet;
    }
    return this.startCharLimit - this.publisherText.length - this.lengthOfImageIfSet;
  }

  isValidMessage(): boolean {
    return this.selfPublisherState && this.publisherText.length > 0 &&
      this.publisherText.length <= this.startCharLimit && this.charLimit >= 0;
  }

  isOverLimit(): boolean {
    if (this.charLimit < 0) {
      return true;
    }
  }

  updateProperty(event) {
    this.postsStore.dispatch(new publisherActions.UpdateProperty({
      txId: this.publisherTxId,
      change: {
        property: event.target.attributes.name.nodeValue,
        value: event.target.value,
      }
    }));
  }
}
