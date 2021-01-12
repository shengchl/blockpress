
import { ActivatedRoute, Router, Params, NavigationEnd} from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { IpfsService } from '../services/ipfs.service';
import * as fromStore from '../reducers';
import * as fromPosts from '../domain/posts/reducers';
import * as fromPublisher from '../domain/publisher/reducers';
import * as fromModal from '../domain/modals/reducers';
import * as fromSession from '../domain/session/reducers';
import * as fromProfiles from '../domain/profiles/reducers';
import * as postsActions from '../domain/posts/actions/posts';
import * as modalActions from '../domain/modals/actions/modals';
import * as publisherActions from '../domain/publisher/actions/publisher';

declare var $;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  appLoading$: Observable<boolean>;
  constructor(private activatedRoute: ActivatedRoute,
              private ipfsService: IpfsService,
              private router: Router,
              private postsStore: Store<fromPosts.State>,
              private publisherStore: Store<fromPublisher.State>,
              private modalStore: Store<fromModal.State>) {
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
            return;
        }
        // This is required because we may navigate away from a modal inside a link
        $('div.modal-backdrop.fade.show').remove();
        $('body').removeClass('modal-open');
        if ($('.post-view.modal').length) {
          $('.post-view.modal').modal('hide');
        }
       // this.postsStore.dispatch(new postsActions.ClosePostModals());
        this.modalStore.dispatch(new modalActions.CloseFundingModal());
        this.publisherStore.dispatch(new publisherActions.ClosePublisher({
          txId: null
        }));
    });
  }
}
