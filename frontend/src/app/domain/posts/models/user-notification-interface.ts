import { Post } from './post.interface';

export interface UserNotification {
    txId: string;
    entityType: string; // 'post', 'reply', 'like', 'likewithtip', 'follow'
    entity: Post;
    sequence?: number;
}
