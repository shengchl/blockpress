
export default class ApiResponse {
    private responseBody: any;
    private status: any;
    constructor(serverResponse: any, status: any) {
      this.responseBody = serverResponse;
      this.status = status;
    }

    get isSuccess(): boolean {
      return !this.isError;
    }

    get isError(): boolean {
      if (!this.status || !(this.status === 200 || this.status === 201 || this.status === 304)) {
        console.error('Response status not valid', this.status);
        return true;
      }

      if (this.responseBody.success !== undefined && this.responseBody.success !== null && !this.responseBody.success) {
        console.error('Response success false', this.responseBody);
        return true;
      }

      return false;
    }

    get errorMessage(): string {
      let option1 = '';
      if (this.responseBody &&
          typeof(this.responseBody) === 'object' &&
          this.responseBody.message) {
          option1 = this.responseBody.message;
      }
      let option2 = '';
      if (this.responseBody.status) {
        // tslint:disable:max-line-length
          option2 = `${this.responseBody.status}... NOTE: Please make sure you have AT LEAST 1 unspent output of size 800 sats. We do not combine UTXOs at moment, so even if your balance is > 800 sats, you may not have a UTXO large enough. SOLUTION: Put another small deposit into your account. We are busy fixing this to combine UTXOs. Thank you`;
      }
      // tslint:disable:max-line-length
      const option3 = 'Oops. Something went wrong... NOTE: Please make sure you have AT LEAST 1 unspent output of size 800 sats. We do not combine UTXOs at moment, so even if your balance is > 800 sats, you may not have a UTXO large enough. SOLUTION: Put another small deposit into your account. We are busy fixing this to combine UTXOs. Thank you';
      return option1 || option2 || option3;
    }

  }
