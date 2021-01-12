import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-warning-modal',
  templateUrl: './warning-modal.component.html',
  styleUrls: ['./warning-modal.component.sass']
})
export class WarningModalComponent {

  @Output() hideModal = new EventEmitter<void>();
  @Output() showNextModal = new EventEmitter<void>();

}
