import * as moment from 'moment';

export default class PostHelpers {

  static getUnixFromRange(range: string): number {
    let rangeTime = moment().subtract(1, 'days');
    if (range) {
      if (range === 'week') {
        rangeTime = rangeTime.subtract(7, 'days');
      }
      if (range === 'month') {
        rangeTime = rangeTime.subtract(30, 'days');
      }
      if (range === 'all') {
        rangeTime = rangeTime.subtract(5, 'years');
      }
    }
    return rangeTime.unix();
  }
}
