import { createSelector } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Session } from '../models/session.interface';
import { SessionActionTypes, SessionActionsUnion } from '../actions/session';
import { payloadParser } from '../helpers/payload-parser';
import { exportKeyPayloadParser } from '../helpers/export-key-payload-parser';
import { ExportKeyInfo } from '../models/export-key-info.interface';

export interface State {
  currentSession: Session | {};
  exportKey?: ExportKeyInfo;
}

const initialState: State = {
  currentSession: {},
  exportKey: null
};

function checkBadSession(code) {
  if (code && code === 'bad_session') {
    window.location.href = 'http://lvh.me:3027/users/sign_in';
  }
}
export function reducer(
  state = initialState,
  action: SessionActionsUnion,
): State {

  switch (action.type) {
    case SessionActionTypes.FetchComplete:
      return Object.assign({}, state,
        {
          currentSession: payloadParser(action.payload),
          exportKey: state.exportKey
        }
      );

    case SessionActionTypes.FetchExportKeySuccess:
      checkBadSession(action.payload.errorCode);
      return Object.assign({}, state,
        {
          currentSession: state.currentSession,
          exportKey: exportKeyPayloadParser(action.payload),
        }
      );

    default: {
      return state;
    }
  }
}
