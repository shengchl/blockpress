import { Injectable } from '@angular/core';

@Injectable()
export class DomManipulationService {

  FOOTER_SIZE = 41;

  /**
   * Reset the footer to behave as originally intended from the page
   * This is required because on app load we do not want the footer to be fixed as
   * it is during loading.
   */
  unsetFooterStyles() {
    let sc = 0;
    let wh = 0;
    if (document.body && document.body.scrollHeight) {
      sc = document.body.scrollHeight;
    }
    if (window.screen && window.screen.availHeight) {
      wh = window.screen.availHeight;
    }
    const footerContainer: HTMLElement = <HTMLScriptElement> document.querySelector('div#home:nth-child(2)');
    if (footerContainer && (sc + this.FOOTER_SIZE) >= wh) {
      footerContainer.style.position = 'static';
    } else if ((sc + this.FOOTER_SIZE) < wh && footerContainer) {
      footerContainer.style.position = 'fixed';
    }
  }

  revertSetFooterStyles() {
    const footerContainer: HTMLElement = <HTMLScriptElement> document.querySelector('div#home:nth-child(2)');
    if (footerContainer) {
      footerContainer.style.position = 'fixed';
    }
  }

}
