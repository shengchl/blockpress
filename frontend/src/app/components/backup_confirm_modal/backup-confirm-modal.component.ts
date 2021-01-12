import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-backup-confirm-modal',
  templateUrl: './backup-confirm-modal.component.html',
  styleUrls: ['./backup-confirm-modal.component.sass']
})
export class BackupConfirmModalComponent {

  @Output() hideModal = new EventEmitter<void>();
  @Output() showPrevModal = new EventEmitter<void>();
  @Output() showNextModal = new EventEmitter<void>();

}
