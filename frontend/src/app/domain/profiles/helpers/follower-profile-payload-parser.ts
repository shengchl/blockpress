
import { ProfileInfo } from '../models/profile-info.interface';

export function followerProfilePayloadParser(rawPayload): ProfileInfo {
  return {
    addressLegacy: rawPayload.address_id,
    avatar: rawPayload.avatar,
    username: rawPayload.name,
    followerCount: rawPayload.followerCount,
    followingCount: rawPayload.followingCount,
    favsCount: rawPayload.favsCount,
    postsCount: rawPayload.postsCount,
    tips: rawPayload.tips,
    header: rawPayload.header
  };
}
