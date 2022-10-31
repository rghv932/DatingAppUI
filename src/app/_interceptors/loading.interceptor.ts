import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { delay, finalize, tap } from 'rxjs/operators';

import { BusyService } from '../_services/busy.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  //variable:number=1;
  constructor(private busyService: BusyService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    this.busyService.busy();
    return next.handle(request).pipe(
      tap((response)=>{
        //console.log('number : ',this.variable++);
        console.log(response instanceof HttpResponse,'this is the response:\n',response);
        //const headers=response.headers.get;
        if(response instanceof HttpResponse){
          const res=response as HttpResponse<any>;
          const headersList=res.headers;
          console.log(headersList);
          const result=res.headers.get('content-type');
          console.log('\n\n\n',result);
          const authResult=res.headers.get('access-control-allow-headers');
          console.log('\n\n\n',authResult);
        }
      }),
      delay(1000),
      finalize(() => {
        this.busyService.idle();
      })
    );
  }
}
