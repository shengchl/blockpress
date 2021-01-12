import { Component, Input, Output, EventEmitter, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import {NgForm} from '@angular/forms';
import * as fromStore from '../../reducers';
import * as fromSession from '../../domain/session/reducers';
import * as fromModals from '../../domain/modals/reducers';
import * as sessionActions from '../../domain/session/actions/session';
import * as modalActions from '../../domain/modals/actions/modals';
import { Store, select } from '@ngrx/store';
import { ProfileInfo } from '../../domain/profiles/models/profile-info.interface';
import { Session } from '../../domain/session/models/session.interface';

declare var $;
declare var QRCode;

@Component({
  selector: 'app-deposit-funds-modal',
  templateUrl: './deposit-funds-modal.component.html',
  styleUrls: ['./deposit-funds-modal.component.sass']
})
export class DepositFundsModalComponent implements AfterViewInit {
  @ViewChild('myModal') myModal;
  @Input() currentUserProfile: any;
  @Input() session: Session;
  @Input() modalState: any;

  constructor(private store: Store<fromStore.State>,
              private sessionStore: Store<fromSession.State>,
              private modalStore: Store<fromModals.State>,
              private router: Router) {

  }

  exportPrivateKey() {
    this.modalStore.dispatch(new modalActions.CloseFundingModal());

    setTimeout(function() {
     $('#viewKeyModal').modal('show');
    }, 1200);

    return false;
  }

  get isPromptedAfterAttemptedAction(): boolean {
    return this.modalState.isPromptedAfterAttemptedAction;
  }

  get effectiveBalance(): number {
    return this.session.balances.confirmedBalance + this.session.balances.unconfirmedBalance;
  }
  get modalTitle(): string {
    return `Deposit Funds`;
  }

  get hasConfirmedBalance(): boolean {
    return this.session.balances.confirmedBalance > 0;
  }

  get hasUnconfirmed(): boolean {
    return this.session.balances.unconfirmedBalance !== 0;
  }

  get getAccountLink(): string {
    return `https://explorer.bitcoin.com/bch/address/${this.currentUserProfile.address_id}`;
  }

  ngAfterViewInit() {
    $(this.myModal.nativeElement).modal('show');
    $(this.myModal.nativeElement).on('hidden.bs.modal', (e) => {
      this.modalStore.dispatch(new modalActions.CloseFundingModal());
    });

    const qrcode = new QRCode(document.getElementById('deposit-qr'), {
      text: `bitcoincash:${this.currentUserProfile.address_id}`,
      width: 125,
      height: 125,
      colorDark : '#000000',
      colorLight : '#ffffff',
    });
  }
}
