import { HttpInterceptorFn } from '@angular/common/http';
import Swal from 'sweetalert2';

export const tokenhttpinterceptor: HttpInterceptorFn = (req, next) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('tokenExpiration');

    if (token && expiration) {
      const expirationTime = parseInt(expiration, 10);
      const currentTime = Date.now();
      if (currentTime > expirationTime) {
        //alert("Session has expired. Please log in again.");
        Swal.fire({
          icon: 'error',
          title: 'Session has expired',
          text: 'Session has expired. Please log in again..',
          confirmButtonColor: '#d33',
        }).then((result) => {
          localStorage.removeItem('token'); // Clear expired token
          localStorage.removeItem('tokenExpiration');
          localStorage.removeItem('islogin');
          location.reload();
        });
      } else {
        const clonedReq = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` },
        });
        return next(clonedReq);
      }
    } else {
      localStorage.clear();
      return next(req);
    }
  }
  return next(req);
};
