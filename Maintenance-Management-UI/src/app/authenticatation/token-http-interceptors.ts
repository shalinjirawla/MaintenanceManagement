import { HttpInterceptorFn } from "@angular/common/http";
import { Inject } from "@angular/core";
import { inject } from "@angular/core/testing";
import { Router } from "@angular/router";
import { nextTick } from "process";

export const tokenhttpinterceptor:HttpInterceptorFn=(req,next)=>{

    if (typeof window !== 'undefined') {
        
    const token=localStorage.getItem("token");
    const expiration = localStorage.getItem("tokenExpiration");     
   
    if (token && expiration) {
        
        const expirationTime = parseInt(expiration, 10);
        const currentTime = Date.now();
        if (currentTime > expirationTime) {
            
            alert("Session has expired. Please log in again.");
            localStorage.removeItem('token'); // Clear expired token
            localStorage.removeItem('tokenExpiration');
            localStorage.removeItem('islogin');
        }
        else{

            const clonedReq = req.clone({
                setHeaders: { 'Authorization': `Bearer ${token}` }
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