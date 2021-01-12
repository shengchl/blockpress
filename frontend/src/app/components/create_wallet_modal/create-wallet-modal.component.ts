import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-create-wallet-modal',
  templateUrl: './create-wallet-modal.component.html',
  styleUrls: ['./create-wallet-modal.component.sass']
})
export class CreateWalletModalComponent {

  @Output() hideCreateWalletModal = new EventEmitter<void>();
  @Output() showNextModal = new EventEmitter<void>();

}
