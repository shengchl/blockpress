import { createSelector } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { PublisherActionTypes, PublisherActionsUnion } from '../actions/publisher';
import { Publisher } from '../models/publisher-interface';

export interface State {
  publishers: {
    [key: string]: Publisher
  };
  loadIpfs: boolean;
}

const initialState: State = {
  publishers: {},
  loadIpfs: false,
};

const emptyPublisher = {
  isPublisherOpen: false,
  contentType: 'text',
  text: '',
  imageUrlOrIpfsPayload: null,
  community: null,
  isMediaUploading: false,
  title: '',
};

export function reducer(
  state = initialState,
  action: PublisherActionsUnion,
): State {

  switch (action.type) {

    case PublisherActionTypes.LoadIpfsScript:

      return Object.assign({}, {
        publishers: state.publishers,
        loadIpfs: true,
      });

    case PublisherActionTypes.UpdateMediaUploadStatusPublisher:
      const publisherUpload = state.publishers[action.payload.txId];

      return Object.assign({}, {
        publishers: Object.assign({}, state.publishers, {
          [action.payload.txId]:
            Object.assign({}, state.publishers[action.payload.txId], {
              isMediaUploading: action.payload.isMediaUploading
            })
        }),
        loadIpfs: state.loadIpfs
      });
    case PublisherActionTypes.ChangePublishContentType:
      const publisher = state.publishers[action.payload.txId];

      return Object.assign({}, {
        publishers: Object.assign({}, state.publishers, {
          [action.payload.txId]:
            Object.assign({}, state.publishers[action.payload.txId], {
              contentType: action.payload.contentType
            })
        }),
        loadIpfs: state.loadIpfs
      });

    case PublisherActionTypes.ClosePublisher:

      if (!action.payload.txId) {
        return initialState;
      }
      return Object.assign({}, {
        publishers: Object.assign({}, state.publishers, {
          [action.payload.txId]:
            Object.assign({}, state.publishers[action.payload.txId], emptyPublisher)
        }),
        loadIpfs: state.loadIpfs
      });

    case PublisherActionTypes.OpenPublisher:
      return Object.assign({}, {
        publishers: Object.assign({}, state.publishers, {
          [action.payload.txId]:
            Object.assign({}, emptyPublisher, {
              isPublisherOpen: true
            })
        }),
        loadIpfs: state.loadIpfs
      });

    case PublisherActionTypes.UpdateProperty:
      return Object.assign({}, {
        publishers: Object.assign({}, state.publishers, {
          [action.payload.txId]:
            Object.assign({}, state.publishers[action.payload.txId], {
              [action.payload.change.property]: action.payload.change.value
            })
        }),
        loadIpfs: state.loadIpfs
      });

    default: {
      return state;
    }
  }
}
