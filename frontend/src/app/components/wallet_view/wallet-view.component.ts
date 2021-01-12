import { Component, Input, Output, EventEmitter} from '@angular/core';
import { DomManipulationService } from '../../services/dom-manipulation.service';


@Component({
  selector: 'app-wallet-view',
  templateUrl: './wallet-view.component.html',
  styleUrls: ['./wallet-view.component.sass']
})
export class WalletViewComponent {

  @Output() showCreateWalletModal = new EventEmitter<void>();
  constructor() { }
}
