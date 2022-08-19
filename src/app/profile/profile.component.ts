import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {FormGroup, FormControl} from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { PersistService } from '../Persistance/persist.service'
import { dateInputsHaveChanged } from '@angular/material/datepicker/datepicker-input-base';
import { stringify } from '@angular/compiler/src/util';
import * as moment from 'moment';
import { Entrymodel, Startdate } from '../entry.model';
import {EntryService} from '../entry.service';
import {CookieService} from 'ngx-cookie-service';
import { Persistance } from '../Persistance/persistance.model';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  selected = 'Attending';
  Entry: Entrymodel;
  entries: Entrymodel[] = [];
  personal: Entrymodel[] = [];
  isLoaded: boolean;
  attending: string = 'Attending';
  cancel: string = 'Cancel';
  matOptions: any[] = ['Attending','Cancel'];

  constructor(
    private entryservice: EntryService,
      private router: Router,
      private persist: PersistService,
      private cookieService:  CookieService,

  ) { }

  async ngOnInit(){

    const username: string = this.cookieService.get('username');
    console.log("cookie username"+ username);
    const color: string = this.cookieService.get('color');
    console.log("cookie color"+ color);
    this.persist.checkcookie(username);
   

    
    this.persist.checkcookie(username);
    if(!this.persist.cookieExists){
      alert("We Couldnt find your user details please try logging in again");
      await  this.router.navigate(['login'] , {skipLocationChange: true});
    }
    else{
      this.persist.memberinfo = new Persistance
      this.persist.memberinfo.surname = username;
      this.persist.memberinfo.color = color;
      this.persist.loggedin = true;
    }

    this.entryservice.getPersonalEntry().subscribe(data => {
      this.entries = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as {}
        } as Entrymodel;
      })
    });

   
    this.entries = this.entries.filter( s => s.status = 'Attending' );
  
  }

  setPersonal(){
    this.entries.forEach(element => {
      var y = 'Attending';
      if(element.status = y){
        this.personal.push(element);
        console.log(element);
        }
    });
    this.isLoaded = false;
  }

  update(iD, surName, startDay,startMonth,startYear,endDay,endMonth,endYear,inFo,staTus){
    
    console.log(staTus);
      this.Entry = ({
        id: iD,
        surname : surName,
        startDate: {
          day: startDay,
          month: startMonth,
          year: startYear
        },
        endDate: {
          day: endDay,
          month: endMonth,
          year: endYear
        },
        info: inFo,
        status: staTus,
        editing: true,
        color: this.persist.memberinfo.color


      });
      if(confirm("Are you sure about these changes?")) {
        this.entryservice.updateMember(this.Entry); 
       }
  }

  clickMethod(id) {
    if(confirm("Are you sure to delete ")) {
     this.entryservice.deleteMember(id);
    }
  }
}
