import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import {NgForm} from '@angular/forms';
import * as fromStore from '../../reducers';
import * as fromSession from '../../domain/session/reducers';
import * as sessionActions from '../../domain/session/actions/session';
import { Store, select } from '@ngrx/store';
import { ExportKeyInfo } from '../../domain/session/models/export-key-info.interface';

@Component({
  selector: 'app-view-key-modal',
  templateUrl: './view-key-modal.component.html',
  styleUrls: ['./view-key-modal.component.sass']
})
export class ViewKeyModalComponent {
  @Input() exportKeyInfo: ExportKeyInfo;

  constructor(private store: Store<fromStore.State>,
              private sessionStore: Store<fromSession.State>,
              private router: Router) {

  }
  password = '';
  submitted = false;

  exportKey() {
    this.sessionStore.dispatch(new sessionActions.FetchExportKey({
      username: '',
      password: this.password
    }));
    this.submitted = true;
    return false;
  }

  update(event: any) {
    this.password = event.target.value;
  }

  isInvalidPassword(): boolean {
    return this.exportKeyInfo && this.exportKeyInfo.errorCode === 'invalid_password';
  }

  isSuccess(): boolean {
    return this.submitted === true &&
            this.exportKeyInfo &&
            this.exportKeyInfo.errorCode == null &&
            !!this.exportKeyInfo.wif && this.exportKeyInfo.success;
  }
  hasPhrase(): boolean {
    return !!this.exportKeyInfo.phrase;
  }
}
