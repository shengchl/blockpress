import { PostPublish } from '../models/post-publish.interface';
import { Post } from '../models/post.interface';
import { PostPublishResult } from '../models/post-publish-result.interface';
import { UserNotification } from '../models/user-notification-interface';

function parseNumber(rawData: any): number | '' {
  // tslint:disable:curly
  if (typeof(rawData) === 'number') return rawData;

  if (isNaN(rawData) || typeof(rawData) === 'undefined') return '';

  if (typeof(rawData) === 'string' && isNaN(Number(rawData))) {
    return '';
  } else if (typeof(rawData) === 'string') {
    return Number(rawData);
  }

  return '';
  // tslint:enable:curly
}

export function postPayloadParser(rawPayload: any): Post {
  if (!rawPayload) {
    return null;
  }

  return {
    id: rawPayload.id,
    txId: rawPayload.actionTx,
    messageBody: rawPayload.messageBody,
    authorId: rawPayload.authorId,
    likes: rawPayload.likes,
    tips: rawPayload.tips,
    replies: rawPayload.replies,
    createdAt: rawPayload.createdAt,
    replyToPost: postPayloadParser(rawPayload.replyToPost),
    isLike: rawPayload.isLike,
    isLikeTippedAmount: rawPayload.isLikeTippedAmount,
    isLikeTippedAddress: rawPayload.isLikeTippedAddress,
    community: rawPayload.community,
    mediaType: rawPayload.mediaType,
    mediaPayload: rawPayload.mediaPayload,
    isFollowingAuthor: rawPayload.isFollowingAuthor
  };

}
export function postsPayloadParser(rawPayload): Array<Post> {
  const canvas = {
    posts: []
  };

  if (rawPayload && Array.isArray(rawPayload)) {
    for (let index = 0; index < rawPayload.length; index++) {
      canvas.posts.push(postPayloadParser(rawPayload[index]));
    }
  }
  return canvas.posts;
}

export function userNotificationPayloadParser(rawPayload: any): UserNotification {
  if (!rawPayload) {
    return null;
  }
  return {
    txId: rawPayload.txId,
    entityType: rawPayload.entityType,
    entity: postPayloadParser(rawPayload.entity),
    sequence: rawPayload.sequence
  };
}

export function userNotificationsPayloadParser(rawPayload): Array<UserNotification> {
  const canvas = {
    notifications: []
  };

  if (rawPayload && Array.isArray(rawPayload)) {
    for (let index = 0; index < rawPayload.length; index++) {
      canvas.notifications.push(userNotificationPayloadParser(rawPayload[index]));
    }
  }
  return canvas.notifications;
}
