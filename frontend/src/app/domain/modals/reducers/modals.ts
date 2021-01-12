import { createSelector } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { ModalActionTypes, ModalActionsUnion } from '../actions/modals';

declare var $;
export interface State {
  isFundingModalOpen: boolean;
  isPromptedAfterAttemptedAction: boolean;
}

const initialState: State = {
  isFundingModalOpen: false,
  isPromptedAfterAttemptedAction: false  // Whether to show the default or a variant that tells them they need to deposit
};

export function reducer(
  state = initialState,
  action: ModalActionsUnion,
): State {

  switch (action.type) {
    case ModalActionTypes.OpenFundingModal:

      return Object.assign({}, state,
        {
          isFundingModalOpen: true,
          isPromptedAfterAttemptedAction: action.payload ? true : false
        }
      );

    case ModalActionTypes.CloseFundingModal:
      $('div.modal-backdrop.fade.show').remove();
      $('body').removeClass('modal-open');

      if ($('.modal').length) {
        $('.modal').modal('hide');
      }
      return Object.assign({}, state,
        {
          isFundingModalOpen: false,
          isPromptedAfterAttemptedAction: initialState.isPromptedAfterAttemptedAction
        }
      );

    default: {
      return state;
    }
  }
}
