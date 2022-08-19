import { Injectable } from '@angular/core';
import { Persistance} from '../Persistance/persistance.model'
import {CookieService} from 'ngx-cookie-service'
@Injectable({
  providedIn: 'root'
})
export class PersistService {
  
  ban:number;
  loggedin: boolean;
  Membercount: number;
  memberinfo?: Persistance;
  persist: Persistance = new Persistance();
  cookieExists : boolean;
  private cookieValue: string;
  constructor(private cookieService:  CookieService) { }

  setPersistence(surname : string, color: string, memberCount){
    this.memberinfo = {surname, color};
    this.returnLoggedin();
    this.cookieService.set('username' , surname );
    this.cookieService.set('color', color);
    this.ban = memberCount - 1;
    this.cookieService.set('ban', this.ban.toString());

  }

  persistLogin(surname){
      
    this.cookieService.set(surname,'loggedin')
    
  }

  checkcookie(surname) {
    this.cookieExists = this.cookieService.check(surname);
  
  }

  deletecookie(surname){
    this.cookieService.delete(surname);
  }
  returnLoggedin(): boolean{
    return this.loggedin = true;
  }
}

