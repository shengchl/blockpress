import * as moment from 'moment';

export default class DateUtils {

    /**
   * Format numbers with commas (ex: 12,000.03)
   * @param num Number to format
   */
  static formatNumberWithCommas(num: number, includeDecimal = true): string {
    if (isNaN(num) || num == null) {
      return '';
    }
    // Concat with empty string to retain the 2 decimal places
    // Since .toString() method removes last zero digit in decimal
    const parts = (num.toFixed(2) + '').split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    if (includeDecimal) {
      return parts.join('.');
    } else {
      return parts[0];
    }
  }
}
