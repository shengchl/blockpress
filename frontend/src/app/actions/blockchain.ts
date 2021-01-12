import { Action } from '@ngrx/store';

export const RETRIEVE =         '[Blockchain] Retrieve';
export const RETRIEVE_SUCCESS = '[Blockchain] Retrieve Success';

export class RetrieveAction implements Action {
  readonly type = RETRIEVE;

  constructor(public payload: { txId: string }) { }
}

export class RetrieveSuccessAction implements Action {
  readonly type = RETRIEVE_SUCCESS;

  constructor(public payload: any) { }
}

export type Actions
  = RetrieveAction
  | RetrieveSuccessAction;
