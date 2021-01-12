import { Inject, Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/RX';
import { from } from 'rxjs/observable/from';
import { map, switchMap, mergeMap } from 'rxjs/operators';
import { ApiService } from '../../../services/api.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';

@Injectable()
export class ModalsEffects {

  constructor(
    private actions$: Actions,
    private api: ApiService) { }
}

