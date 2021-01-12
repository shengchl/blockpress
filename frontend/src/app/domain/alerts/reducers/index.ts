import {
  createSelector,
  createFeatureSelector,
  ActionReducerMap,
} from '@ngrx/store';
import * as fromAlerts from './alerts';
import * as fromRoot from '../../../reducers';

export interface AlertsState {
  alerts: fromAlerts.State;
}

export interface State extends fromRoot.State {
  alertsInfo: AlertsState;
}

export const reducers: ActionReducerMap<AlertsState> = {
  alerts: fromAlerts.reducer
};

export const getAlerts = (state: State) => {
  return state.alertsInfo.alerts.list;
};
