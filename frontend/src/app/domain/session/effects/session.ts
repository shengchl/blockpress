import { Inject, Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/RX';
import { from } from 'rxjs/observable/from';
import { map, switchMap, mergeMap } from 'rxjs/operators';
import { SessionActionTypes, Fetch, FetchExportKey, FetchExportKeySuccess, FetchExportKeyError} from '../actions/session';
import { Session } from '../models/session.interface';
import * as sessionActions from '../actions/session';
import * as profileActions from '../../profiles/actions/profiles';

import mockData from '../helpers/mock-data';
import { ApiService } from '../../../services/api.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';

@Injectable()
export class SessionEffects {

@Effect()
  fetch$: Observable<Action> = this.actions$
  .ofType<Fetch>(SessionActionTypes.Fetch)
  .map((action: sessionActions.Fetch) => null)
  .mergeMap(() => {
    return this.api.callBlockPressApi(null, '/api/sessions', 'get')
        .mergeMap((response) => {
          if (!response.responseBody.userId) {
            return [];
          }
          return [
            new sessionActions.FetchComplete(response.responseBody),
            new profileActions.FetchProfileExtendedInfo({
              addresses: [response.responseBody.addressCash], isCurrentUser: true, forceLoad: true})
          ];
        })
        .catch((err) => from([
        ]));
    });

@Effect()
  fetchExportKey$: Observable<Action> = this.actions$
  .ofType<FetchExportKey>(SessionActionTypes.FetchExportKey)
  .map((action: sessionActions.FetchExportKey) => action.payload)
  .mergeMap((payload: {username: string, password: string}) => {
    return this.api.callBlockPressApi({password: payload.password}, '/api/sessions/export', 'post')
        .mergeMap((response) => {
          return [
            new sessionActions.FetchExportKeySuccess(response.responseBody),
          ];
        })
        .catch((err) => from([
          new sessionActions.FetchExportKeyError(err),
        ]));
    });

  constructor(
    private actions$: Actions,
    private api: ApiService) { }
}

