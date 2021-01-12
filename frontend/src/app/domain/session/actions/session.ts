import { Action } from '@ngrx/store';
import { Session } from '../models/session.interface';

export enum SessionActionTypes {
    Fetch = '[Session] Fetch',
    FetchComplete = '[Session] Fetch Complete',
    FetchExportKey = '[Session] Fetch Key',
    FetchExportKeySuccess= '[Session] Fetch Key Success',
    FetchExportKeyError = '[Session] Fetch Key Error',
}

export class Fetch implements Action {
  readonly type = SessionActionTypes.Fetch;
  constructor() {
  }
}

export class FetchComplete implements Action {
  readonly type = SessionActionTypes.FetchComplete;

  constructor(public payload: any) {}
}

export class FetchExportKey implements Action {
  readonly type = SessionActionTypes.FetchExportKey;

  constructor(public payload: {username: string; password: string}) {}
}

export class FetchExportKeySuccess implements Action {
  readonly type = SessionActionTypes.FetchExportKeySuccess;

  constructor(public payload: any) {}
}

export class FetchExportKeyError implements Action {
  readonly type = SessionActionTypes.FetchExportKeyError;

  constructor(public payload: any) {}
}

export type SessionActionsUnion =
| Fetch
| FetchComplete
| FetchExportKey
| FetchExportKeySuccess
| FetchExportKeyError;


