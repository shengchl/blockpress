import { Action } from '@ngrx/store';

export enum ModalActionTypes {
  OpenFundingModal = '[Modal] Open Funding Modal',
  CloseFundingModal = '[Modal] Close Funding Modal'
}

export class OpenFundingModal implements Action {
  readonly type = ModalActionTypes.OpenFundingModal;
  constructor(public payload?: boolean) {
  }
}

export class CloseFundingModal implements Action {
  readonly type = ModalActionTypes.CloseFundingModal;
  constructor() {
  }
}

export type ModalActionsUnion =
| OpenFundingModal
| CloseFundingModal;


