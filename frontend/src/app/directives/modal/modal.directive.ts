import { Directive, AfterViewInit, OnDestroy, OnInit } from '@angular/core';

@Directive({ selector: '[appModal]' })
export class ModalDirective implements AfterViewInit, OnDestroy, OnInit {

  modalContainer: HTMLScriptElement;
  actualHeight = 0;
  fireEvent = true;
  eventFunction = this.checkAndHandleSizeChange.bind(this);
  initialYScroll = 0;

  checkAndHandleSizeChange(event?) {
    if (this.fireEvent && (!event || event.target === document)) {
      const body = document.body;
      const html = document.documentElement;
      const maxHeight = body.scrollHeight;

      if (this.modalContainer && maxHeight !== this.actualHeight) {
        this.modalContainer.style.minHeight = `${maxHeight}px`;
        this.actualHeight = maxHeight;
        this.fireEvent = false;
        // Give some space before fire next event handler, for performance
        setTimeout(() => {
          this.fireEvent = true;
        }, 200);
      }
    }
  }

  ngAfterViewInit() {
    this.modalContainer = <HTMLScriptElement> document.querySelector('.modal-container');
    this.checkAndHandleSizeChange();
    this.initialYScroll = window.scrollY;
    window.scrollTo(0, 0);
  }

  ngOnInit() {
    window.addEventListener('scroll', this.eventFunction, true);
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.eventFunction, true);
    window.scrollTo(0, this.initialYScroll);
  }
}
