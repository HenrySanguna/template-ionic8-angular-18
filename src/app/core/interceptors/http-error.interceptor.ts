import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
// import { ModalService } from '../../shared/components/modal/modal.service';
import { inject } from '@angular/core';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  // const modal$: ModalService = inject(ModalService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status !== 403) {
        // modal$.open({
        //   title: 'state.error',
        //   type: 'error',
        //   message: err.error.detail ? err.error.detail : err.message
        // });
      }
      return throwError(() => new Error(err.message));
    })
  );
};
