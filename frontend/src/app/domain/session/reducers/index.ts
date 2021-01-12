import {
  createSelector,
  createFeatureSelector,
  ActionReducerMap,
} from '@ngrx/store';
import * as fromSession from './session';
import * as fromRoot from '../../../reducers';

import { Session } from '../models/session.interface';

export interface SessionState {
  session: fromSession.State;
}

export interface State extends fromRoot.State {
  currentSession: SessionState;
}

export const reducers: ActionReducerMap<SessionState> = {
  session: fromSession.reducer
};

export const getSession = (state: State) => {
  return state.currentSession.session.currentSession;
};

export const getExportKeyInfo = (state: State) => {
  return state.currentSession.session.exportKey;
};
