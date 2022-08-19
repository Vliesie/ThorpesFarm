import { Router, ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';
import { Persistance } from '../app/Persistance/persistance.model'
import { PersistService } from '../app/Persistance/persist.service'
import {CookieService} from 'ngx-cookie-service'

@Injectable({
    providedIn: 'root'
  })
export class RedirectGuard {
    
    constructor(private router: Router,private persist: PersistService,private cookieService: CookieService) {}



    canActivate(routeSnapshot) {
        const username: string = this.cookieService.get('username');
        const color: string = this.cookieService.get('color');
        this.persist.checkcookie(username);
    
        if(!this.persist.cookieExists){
        this.router.navigate(['login']);
        }
        else{
        this.persist.loggedin = true;
        }

        if(!this.persist.loggedin){
            this.router.navigateByUrl(routeSnapshot.data.redirectTo, {skipLocationChange: true});
        }
        else{
            this.router.navigate(['dashboard'], {skipLocationChange : true});
        }
        
      }
  }