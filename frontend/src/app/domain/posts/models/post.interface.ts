export interface Post {
    id: number;
    txId: string;
    authorId: string;
    messageBody?: string;
    createdAt: number;
    likes: number;
    tips: number;
    replies: number;
    replyPosts?: Array<Post>;
    replyToPost?: Post;
    isLike?: boolean;
    isLikeTippedAmount?: number;
    isLikeTippedAddress?: string;
    community?: string;
    mediaType?: number;
    mediaPayload?: string;
    isFollowingAuthor?: boolean;
}
