
import { Session } from '../models/session.interface';

export function payloadParser(rawPayload): Session {
  return {
    userId: rawPayload.userId,
    username: rawPayload.username,
    avatar: rawPayload.avatar,
    addressLegacy: rawPayload.addressLegacy,
    addressCash: rawPayload.addressCash,
    following: rawPayload.following,
    balances: rawPayload.balances,
    badgeCount: rawPayload.badgeCount
  };
}
