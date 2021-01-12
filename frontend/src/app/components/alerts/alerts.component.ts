import { Component, Input, Output, EventEmitter } from '@angular/core';

import domParser from '../../helpers/dom-parser';
import { Alert } from '../../domain/alerts/models/alert.interface';

@Component({
  selector: 'app-alerts-messages',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.sass']
})
export class AlertMessagesComponent {

  @Input() alerts: Array<Alert>;
  @Input() selectKey: string;

  @Output() deleteAlert = new EventEmitter<{id: number, domSource: any}>();

  getAlerClass(alertType) {
    return {
      'alert-info': (alertType === 'info'),
      'alert-danger': (alertType === 'danger'),
      'alert-success': (alertType === 'success')
    };
  }

  stopPropagation($click) {
    $click.stopPropagation();
  }

  formatAlertMessage(message: string): string {
    return domParser(message);
  }

  filterAlerts(): Array<Alert> {
    if (this.selectKey) {
      const reducedAlertArray = this.alerts.filter(ele => ele.selectiveDisplay && ele.selectKey === this.selectKey);
      return reducedAlertArray;
    } else {
      const reducedAlertArray = this.alerts.filter(ele => !ele.selectiveDisplay);
      return reducedAlertArray;
    }
  }
}
