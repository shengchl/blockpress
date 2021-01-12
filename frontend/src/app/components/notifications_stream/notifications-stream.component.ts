import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IpfsService } from '../../services/ipfs.service';
import { Post } from '../../domain/posts/models/post.interface';
import { ProfileInfo } from '../../domain/profiles/models/profile-info.interface';
import { Session } from '../../domain/session/models/session.interface';
import * as fromStore from '../../reducers';
import * as postsActions from '../../domain/posts/actions/posts';
import { Store } from '@ngrx/store';
import { Alert } from '../../domain/alerts/models/alert.interface';
import { UserNotification } from '../../domain/posts/models/user-notification-interface';

@Component({
  selector: 'app-notifications-stream',
  templateUrl: './notifications-stream.component.html',
  styleUrls: ['./notifications-stream.component.sass']
})
export class NotificationsStreamComponent {

  @Input() notifications: Array<UserNotification>;
  @Input() workingPostReplies: Array<Post>;
  @Input() profiles: any;
  @Input() session: Session;
  @Input() currentUserProfile: ProfileInfo;
  @Input() alertsList: Array<Alert>;
  @Input() workingPost: Post;
  @Input() openedTxLikeTips: any;
  @Input() withHeader?: boolean;

  constructor(private store: Store<fromStore.State>) { }

  get getNotifications(): Array<UserNotification> {
    return this.notifications && this.notifications.length ? this.notifications : [];
  }

  isMyPost(post: any): boolean {
    return true;
  }

  isPostFromFollower(post: any): boolean {

    return false;
  }

  isLikeOfMyPost(post: any): boolean {
    return false;
  }

  isReplyToMyPost(post: any): boolean {
    return false;
  }

  isSomeoneFollowedMe(post: any): boolean {
    return true;
  }

  loadMore() {
   let offsetId = this.notifications && this.notifications[0] ? this.notifications[0].sequence : 9999999999;
    for (const note of this.notifications) {
      if (note.sequence < offsetId) {
        offsetId = note.sequence;
      }
    }

    // Todo: Fetch notifications
    this.store.dispatch(new postsActions.FetchNotifications({
      offsetId: offsetId
    }));
  }
}
