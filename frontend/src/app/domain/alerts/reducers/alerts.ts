import { createSelector } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { AlertsActionTypes, AlertsActionsUnion } from '../actions/alerts';
import { Alert } from '../models/alert.interface';

export interface State {
  list: Array<Alert>;
}

const initialState: State = {
  list: []
};

export function reducer(
  state = initialState,
  action: AlertsActionsUnion,
): State {

  switch (action.type) {

    case AlertsActionTypes.PushAlert:
      // tslint:disable-next-line:curly
      const incrementedAlertArray = [];
      for (const alert of state.list) {
        incrementedAlertArray.push(alert);
      }
      let foundMatchingAlert = null;
      if (action.payload.imperative) {
        // If it is imperative, then only display one of the same message type
        foundMatchingAlert = state.list.find(function(existingAlert) {
          if (action.payload.message &&
              existingAlert.message === action.payload.message) {
            return true;
          }
        });
      }
      if (!foundMatchingAlert) {
        incrementedAlertArray.push({ id: new Date().getTime(), ...action.payload});
      }
      return Object.assign({}, state,
        {
          list: incrementedAlertArray,
        }
      );

    case AlertsActionTypes.DeleteAlert:
      const reducedAlertArray = state.list.filter(ele => ele.id !== action['id']);
      return Object.assign({}, { list: reducedAlertArray });

    case AlertsActionTypes.RemoveAll:
      return Object.assign({}, { list: [] });

    default: {
      return state;
    }
  }
}
