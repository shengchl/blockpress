import { Action } from '@ngrx/store';
import { PropertyPair } from '../../../helpers/property-pair.interface';


export enum PublisherActionTypes {
  ChangePublishContentType = '[Publisher] Change Publisher Content Type',
  ClosePublisher = '[Publisher] Close Publisher',
  OpenPublisher = '[Publisher] Open Publisher',
  UpdateProperty = '[Publisher] Update Property',
  LoadIpfsScript = '[Publisher] Load ipfs Property',
  UpdateMediaUploadStatusPublisher = '[Publisher] Update Media upload status',
}

export class ChangePublishContentType implements Action {
  readonly type = PublisherActionTypes.ChangePublishContentType;
  constructor(public payload: { txId?: string, contentType: string }) {}
}

export class UpdateMediaUploadStatusPublisher implements Action {
  readonly type = PublisherActionTypes.UpdateMediaUploadStatusPublisher;
  constructor(public payload: { txId?: string, isMediaUploading: boolean}) {}
}

export class ClosePublisher implements Action {
  readonly type = PublisherActionTypes.ClosePublisher;
  constructor(public payload: { txId?: string }) {}
}

export class OpenPublisher implements Action {
  readonly type = PublisherActionTypes.OpenPublisher;

  constructor(public payload: { txId?: string }) {}
}

export class LoadIpfsScript implements Action {
  readonly type = PublisherActionTypes.LoadIpfsScript;

  constructor(public payload: any) {}
}

export class UpdateProperty implements Action {
  readonly type = PublisherActionTypes.UpdateProperty;

  constructor(public payload: { txId?: string, change: PropertyPair}) {}
}

export type PublisherActionsUnion =
| ChangePublishContentType
| ClosePublisher
| OpenPublisher
| UpdateProperty
| LoadIpfsScript
| UpdateMediaUploadStatusPublisher;



