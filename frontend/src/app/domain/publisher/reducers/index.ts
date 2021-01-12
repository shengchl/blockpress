import {
  createSelector,
  createFeatureSelector,
  ActionReducerMap,
} from '@ngrx/store';
import * as fromPublisher from './publisher';
import * as fromRoot from '../../../reducers';

export interface PublisherState {
  publisherState: fromPublisher.State;
}

export interface State extends fromRoot.State {
  publisherInfo: PublisherState;
}

export const reducers: ActionReducerMap<PublisherState> = {
  publisherState: fromPublisher.reducer
};

export const getPublishers = (state: State) => {
  return state.publisherInfo.publisherState.publishers;
};

export const shouldLoadIpfsScript = (state: State) => {
  return state.publisherInfo.publisherState.loadIpfs;
};
