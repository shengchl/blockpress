export interface ProfileInfo {
    addressLegacy: string;
    avatar: string;
    username: string;
    followerCount: number;
    followingCount: number;
    favsCount: number;
    postsCount: number;
    tips: number;
    currentUserFollowing?: boolean;
    currentUserFollowingMempool?: boolean;
    currentUserFollowingTx?: string;
    likeTxs?: any;
    header?: string;
}
