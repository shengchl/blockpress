import {
  createSelector,
  createFeatureSelector,
  ActionReducerMap,
} from '@ngrx/store';
import * as fromModals from './modals';
import * as fromRoot from '../../../reducers';

export interface ModalState {
  modals: fromModals.State;
}

export interface State extends fromRoot.State {
  modalSettings: ModalState;
}

export const reducers: ActionReducerMap<ModalState> = {
  modals: fromModals.reducer
};

export const getIsFundingModalOpen = (state: State) => {
  return state.modalSettings.modals.isFundingModalOpen;
};

export const getModalState = (state: State) => {
  return state.modalSettings.modals;
};
