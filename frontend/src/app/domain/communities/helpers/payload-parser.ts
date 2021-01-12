
import { Community } from '../models/community.interface';

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

export function communityPayloadParser(rawPayload: any): Community {
  if (!rawPayload) {
    return null;
  }

  return {
    id: rawPayload.id,
    name: rawPayload.name,
    subscribers: rawPayload.subscribers ? rawPayload.subscribers : 0,
    posts: rawPayload.posts ? rawPayload.posts : 0,
    recentPostAt: rawPayload.recentPostAt
  };

}
export function communitiesPayloadParser(rawPayload): Array<Community> {
  const canvas = {
    communities: []
  };

  if (rawPayload && Array.isArray(rawPayload)) {
    for (let index = 0; index < rawPayload.length; index++) {
      canvas.communities.push(communityPayloadParser(rawPayload[index]));
    }
  }
  return canvas.communities;
}
