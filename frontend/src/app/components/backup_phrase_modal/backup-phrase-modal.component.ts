import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-backup-phrase-modal',
  templateUrl: './backup-phrase-modal.component.html',
  styleUrls: ['./backup-phrase-modal.component.sass']
})
export class BackupPhraseModalComponent {

  @Output() hideModal = new EventEmitter<void>();
  @Output() showNextModal = new EventEmitter<void>();

}
