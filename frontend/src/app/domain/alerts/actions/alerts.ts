import { Action } from '@ngrx/store';
import { Alert } from '../models/alert.interface';

export enum AlertsActionTypes {
  PushAlert = '[Alerts] Push',
  DeleteAlert = '[Alerts] Delete',
  RemoveAll = '[Alerts] Remove All',
}

export class PushAlert implements Action {
  readonly type = AlertsActionTypes.PushAlert;
  constructor(public payload: Alert) { }
}

export class DeleteAlert implements Action {
  readonly type = AlertsActionTypes.DeleteAlert;
  constructor(public id: number) { }
}

export class RemoveAll implements Action {
  readonly type = AlertsActionTypes.RemoveAll;
}

export type AlertsActionsUnion =
| PushAlert
| DeleteAlert
| RemoveAll;


