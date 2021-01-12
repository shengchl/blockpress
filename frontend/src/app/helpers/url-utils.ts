import { environment } from '../../environments/environment';

export default class ImgUtils {
  static ipfsLink(param: string): string {
    return `${environment.ipfsGatewayBase}/${param}`;
  }

  static defaultProfileImage(): string {
    return `https://s3.amazonaws.com/bpdev/static/profileicon.png`;
    // return `${environment.ipfsGatewayBase}/QmXCR2D5QDWrjS5pkhw6n1QDe4Cv1JbFpNCHycJkr6fhX5`;
  }

  static getTxLink(tx: string): string {
    return `https://explorer.bitcoin.com/bch/tx/${tx}`;
  }
}

