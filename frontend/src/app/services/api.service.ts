import 'rxjs/add/observable/fromPromise';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { environment } from '../../environments/environment';
import ApiResponse from './api-response';
import { HttpClientModule, HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class ApiService {

  constructor(private http: HttpClient) { }

  private actionInvoker(baseApi, uri, method, payload, callback) {
    if (!environment.production) {
      // tslint:disable-next-line:no-console
      console.log('Remote action params', uri, method, payload);
    }

    // Log the response and callback
    const logResponseAndCallback = (res, status) => {
        if (!environment.production) {
          // tslint:disable-next-line:no-console
          console.log('Response', res, 'Status', status);
        }
        callback(res, status);
    };
    if (method === 'get') {
      const request = this.http.get(`${baseApi}${uri}`, {
        observe: 'response',
        responseType: 'json',
        withCredentials: true,
      }).subscribe(
        data => {
          logResponseAndCallback(data.body, data.status);
        },
        err => {
          logResponseAndCallback(err.error, err.status);
        }
      );

    } else if (method === 'post') {
      this.http.post(`${baseApi}${uri}`, payload, {
        observe: 'response',
        responseType: 'json',
        withCredentials: true,
      }).subscribe(
        data => {
          logResponseAndCallback(data.body, data.status);
        },
        err => {
          logResponseAndCallback(err.error, err.status);
        }
      );
    } else if (method === 'delete') {
    this.http.delete(`${baseApi}${uri}`, {
      observe: 'response',
      responseType: 'json',
      withCredentials: true,
    }).subscribe(
      data => {
        logResponseAndCallback(data.body, data.status);
      },
      err => {
        logResponseAndCallback(err.error, err.status);
      }
    );
  }
  }

  private callRemoteAction(
    baseApi: string,
    requestPayload: any,
    uri: string,
    method: string,
    skipStatusValidation = false): Observable<any> {
    const p = new Promise((res, rej) => {
      try {
        this.actionInvoker(
            baseApi,
            uri,
            method,
            requestPayload
        , function(r, status) {
          const response = new ApiResponse(r, status);
          if (response.isError) {
            rej(response.errorMessage);
          } else {
            res(response);
          }
        });
      } catch (err) {
        rej(new ApiResponse('General error', 500));
      }
    });
    return Observable.fromPromise(p);
  }

  callBlockchainApi(
    requestPayload: any,
    uri: string,
    method: string,
    skipStatusValidation = false): Observable<any> {
    const baseApi = 'https://api.blockchair.com/bitcoin-cash';
    return this.callRemoteAction(baseApi, requestPayload, uri, method, skipStatusValidation);
  }

  callBlockPressApi(
    requestPayload: any,
    uri: string,
    method: string,
    skipStatusValidation = false): Observable<any> {
    const baseApi = environment.apiBaseUrl;
    return this.callRemoteAction(baseApi, requestPayload, uri, method, skipStatusValidation);
  }
}
