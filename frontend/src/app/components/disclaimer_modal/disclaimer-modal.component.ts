import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-disclaimer-modal',
  templateUrl: './disclaimer-modal.component.html',
  styleUrls: ['./disclaimer-modal.component.sass']
})
export class DisclaimerModalComponent {

  @Output() hideModal = new EventEmitter<void>();
  @Output() showPrevModal = new EventEmitter<void>();
  @Output() showNextModal = new EventEmitter<void>();

}
