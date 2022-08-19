import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Persistance } from '../Persistance/persistance.model'
import { PersistService } from '../Persistance/persist.service'
import {CookieService} from 'ngx-cookie-service'
import { Entrymodel, Startdate } from '../entry.model';
import {EntryService} from '../entry.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  

  constructor( 
    private entryservice: EntryService,
    private router: Router,
    private persist: PersistService,
    private cookieService:  CookieService
    ) { }

  ngOnInit() {
    
    
     const username: string = this.cookieService.get('username');
     console.log("cookie username"+ username);
     const color: string = this.cookieService.get('color');
     console.log("cookie color"+ color);
     this.persist.checkcookie(username);
    
     if(!this.persist.cookieExists){
      this.router.navigate(['login']);
     }
     else{
        this.persist.loggedin = true;
     }

    
  }

  
}

  

