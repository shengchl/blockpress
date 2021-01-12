
import { ProfileInfo } from '../models/profile-info.interface';

export function payloadParser(rawPayload): Array<ProfileInfo> {

  const records = [];
  for (const record of rawPayload) {
    records.push({
      addressLegacy: record.address_id,
      avatar: record.avatar,
      isAvatarMempool: record.isAvatarMempool,
      avatarTx: record.avatarTx,
      username: record.name,
      isUsernameMempool: record.isNameMempool,
      usernameTx: record.nameTx,
      followerCount: record.followers,
      followingCount: record.following,
      favsCount: record.likes,
      postsCount: record.posts,
      tips: record.tips,
      currentUserFollowing: record.currentUserFollowing,
      currentUserFollowingMempool: record.currentUserFollowingMempool,
      currentUserFollowingTx: record.currentUserFollowingTx,
      likeTxs: record.likeTxs,
      header: record.header,
      isHeaderMempool: record.isHeaderMempool,
      headerTx: record.headerTx
    });
  }
  return records;
}

export function miniProfileParser(rawPayload): Array<any> {
  const records = [];
  for (const record of rawPayload) {
    records.push({
      addressId: record.addressId,
      avatar: record.avatar,
      name: record.name,
      header: record.header,
      followers: record.followers
    });
  }
  return records;
}



