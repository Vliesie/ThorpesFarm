import { Component, OnInit } from '@angular/core';
import { Entrymodel, Startdate } from '../entry.model';
import {EntryService} from '../entry.service'
import { Router, ActivatedRoute } from '@angular/router';
import {FormGroup, FormControl} from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { PersistService } from '../Persistance/persist.service'
import { dateInputsHaveChanged } from '@angular/material/datepicker/datepicker-input-base';
import { stringify } from '@angular/compiler/src/util';


import * as moment from 'moment';
import { Persistance } from '../Persistance/persistance.model'
import {CookieService} from 'ngx-cookie-service'
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import {  Specialdates } from '../specialdates.model';
import { query } from '@angular/animations';
import { isObject } from 'util';
import { isThisMinute } from 'date-fns';
import {  Easterdates } from '../easterdates.model';
import { isEmpty } from 'rxjs/operators';
import { Console } from 'console';
import Swal from 'sweetalert2';
import az from 'date-fns/locale/az';
import { resourceLimits } from 'worker_threads';

@Component({
  selector: 'app-createentry',
  templateUrl: './createentry.component.html',
  styleUrls: ['./createentry.component.css']
})
export class CreateentryComponent implements OnInit {
    range = new FormGroup({
      start: new FormControl(),
      end: new FormControl()
    });
    uniqueID: string;
    Entry: Entrymodel;
    entries: Entrymodel[] = [];
    takendates: any[] = [];
    datesCompiled : Inbetween[] = [];
    specialDates : Specialdates[] = [];
    noconflic: boolean;
    banperiod: boolean = false;
    specialRange: string[] = [];
     personalEntries: Entrymodel[] = [];
      easterDatesInit: Easterdates [] = [];
      easterDates: string[] = [];
      easterYear: string;
     banTime;
     index = 0;
     isShown: boolean = false ;
     errorType: string;
     coolDown;
     dayMonthYear: string[] = [];
    constructor(private entryservice: EntryService,
      private router: Router,
      private persist: PersistService,
      private cookieService:  CookieService)
    { }

    ngOnInit(){
      const username: string = this.cookieService.get('username');
   
      const color: string = this.cookieService.get('color');
    
      this.persist.checkcookie(username);
      this.banTime = this.cookieService.get('ban')
      console.log("Cookie Ban" + this.banTime);
      if(!this.persist.cookieExists){
       this.router.navigate(['login']);
      }
      else{
         this.persist.loggedin = true;
         this.persist
      }
        this.persist.memberinfo = new Persistance
        this.persist.memberinfo.surname = username;
        this.persist.memberinfo.color = color;
     
      
        this.entryservice.getSpecialDates().subscribe(data => {
          this.specialDates = data.map(e => {
            return {
              id: e.payload.doc.id,
              ...e.payload.doc.data() as {}
            } as Specialdates;
          })
        });
       
      this.entryservice.getAventry().subscribe(data => {
        this.entries = data.map(e => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data() as {}
          } as Entrymodel;
        })
      });

      this.entryservice.getPersonalEntry().subscribe(data => {
        this.personalEntries = data.map(e => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data() as {}
          } as Entrymodel;
        })
      });
      this.entryservice.getEasterDates().subscribe(data => {
        this.easterDatesInit = data.map(e => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data() as {}
          } as Easterdates;
        })
      });
    }

    toggleShow() {

      this.isShown = ! this.isShown;
      
    }

    createEntry(startDate, endDate,  entryinfo: string){ 
   
      var difFormat: any[] = [];
      var dayMonth: Special[] = [];
      var dmY: Special[] = [];
      var taken =  this.takendates;
       var displayTaken: any = [];
       var datesLess: any[] = [];

      for(var element of this.entries){
        for(var dates of element.inbet){
          this.datesCompiled.push({
            day: dates.day,
            month: dates.month,
            year: dates.year,
          });
        }
      }
    var currentYear = new Date().getFullYear();
  
    var startValue = startDate.split("/");
    var startDay = startValue[0];
    var startMonth = startValue[1];
    var startYear = startValue[2];

    var endValue = endDate.split("/");
    var endDay = endValue[0];
    var endMonth = endValue[1];
    var endYear = endValue[2];
  
      for(var x of this.datesCompiled){
      
          var y = (x.day+x.month+x.year);
          datesLess.push(y);
     
      } 
   
    /*   if(this.entries == null || this.entries.length == 0){
      this.logentry(startDay,startMonth,startYear,endDay,endMonth,endYear,entryinfo);
    }
    else{ */
      var startD = startDate.replace(/\//g, "");
      var endD = endDate.replace(/\//g, "");
      let difSorting: Inbetween[] = [];
      var startdate: string = startDay.toString();
      let start = startYear+ "-" + startMonth + "-" + startDay;
      let end = endYear + "-" + endMonth + "-" + endDay;

      var firstDate = new Date(start); 
      var lastDate = new Date(end);

      var currentDate = moment(firstDate);
      var stopDate = moment(lastDate);
     
      while (currentDate <= stopDate) {

        var current = currentDate.format('YYYY-MM-DD').toString();
        var datesplit = current.split("-");
        var d = datesplit[2];
        var m = datesplit[1];
        var y = datesplit[0];
        
        difSorting.push({
          day: d,
          month: m,
          year: y,
        });

          currentDate = moment(currentDate).add(1, 'days');
      }

      var currentSur = this.persist.memberinfo.surname;

      for(var q of difSorting){
        var g = q.day.toString();
          g = g.padStart(2, "0");
      
        var datesConcat = (g+q.month+q.year);
          difFormat.push(datesConcat);
        
        var dM = (q.month+q.day);
        dayMonth.push({
          dates: dM,
          surname: currentSur
        });
        var dayMonthYear = (q.month+q.day+q.year);
        dmY.push({
          dates: dayMonthYear,
          surname: currentSur
        })
      }

      if(datesLess.length == 0 || datesLess == null){
        this.logentry(startDay,startMonth,startYear,endDay,endMonth,endYear,entryinfo,startYear);
      }else{
    
        this.checkSpecial(dayMonth, startYear, endDay, startDay, endMonth, dmY, startYear,startMonth,startDay,endYear,endMonth,endDay);
      
        this.index = 0;
        this.checkinbetween(datesLess, difFormat);
        console.log(this.noconflic + " noConflict Result")
        
        if(this.noconflic && this.banperiod == false){
          console.log("No Faults Entry Log Attempt")
          this.logentry(startDay,startMonth,startYear,endDay,endMonth,endYear,entryinfo,this.easterYear);
        } 
        else if(taken.length >= 1 || this.banperiod) {
          console.log(taken);
          for(var tak of taken){
            var value = tak;
            var day = value.substring(0,2);
            var month = value.substring(2,4);
            var year = value.substring(4,8);
            displayTaken.push(day+"/"+month+"/"+year);
            
          }
          if(this.errorType != 'easterError' && this.errorType != 'specialError' && this.errorType != 'decPhaseError'){
            this.errorType = 'stdError';
          }
     
            this.checkError();
      
          
            this.takendates.length = 0;
            datesLess.length = 0;
            difFormat.length = 0;
            this.entries.length = 0;
      } 
    }    
  } 

  checkError(){
    console.log("Inside Check Error :" + this.errorType)
        switch(this.errorType){
          case 'easterError':
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Easter Weekends can only be booked in a 4 year cycle, Your next avaialbility is in ' + this.coolDown + ' years',
            })
            this.errorType = "";
            this.banperiod = false;
            this.noconflic = true;
          break;
          case 'specialError':
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'You cannot rebook a peak season spot during your ' + this.banTime + ' year waiting period!',
            })
            this.errorType = "";
            this.banperiod = false;
            this.noconflic = true;
          break;
          case 'stdError':
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'These Dates Are Taken, Please Refer to the calendar for exact dates',
            })
            this.errorType = "";
            this.banperiod = false;
            this.noconflic = true;
          break;
          case 'decPhaseError':
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'You have already booked one of the december Slots this year',
            })
            this.errorType = "";
            this.banperiod = false;
            this.noconflic = true;
          break;


          
        }
  }

  checkSpecial(dmArray, year, cDay, cEday, cMonth, daymonthyearArray?, sy?, sm?, sd?, ey?,em? ,ed? ){//Implement
    // Check if current dates are in the Special Dates and then check if year is within year+Ban period (Membercount - 1);
     var dayMonth: string[] = [];
     
     var tempEasterdates: string[] = [];
     this.specialDates.forEach(ag => {
     ag.range.forEach(az => {
        this.specialRange.push(az.toString())
      });
      
    });
    this.easterDatesInit.forEach(ag => {
      ag.range.forEach(az => {
         this.easterDates.push(az.toString())
       });
       
     });



  

  
     dayMonth = dmArray.map(ag => ag.dates)
     this.dayMonthYear = daymonthyearArray.map(ag => ag.dates)
   
     this.easterDates.forEach(az => {
      const editedText = az.slice(0, -4) //'abcde'
      tempEasterdates.push(az)
     });
  

    var index = 1;
    for(let v of dayMonth){
      if(this.specialRange.includes(v) && index <= 1){
        index++;
        console.log("sy Up " + sy);
        console.log("ey Up " + ed)
        this.checkBan(sy, sm, sd, ey,em ,ed )
        console.log("hit Special Check");
        this.easterYear = "";
      }
      else {
        this.easterYear = "";
      }
      
    }
    var easterindex = 1;
    for(let v of this.dayMonthYear){
      if(this.easterDates.find(x => x === v)&& easterindex <= 1){
        easterindex++;
        console.log("Easter Check In")
        this.checkEaster(year, cDay, cMonth)
      }
      else{
        this.easterYear = "";
        return;
      }
    }
  }
  checkEaster(year, cDay,cMonth){

    var showerror = false;
    var banYear;
    var userEasteryear;
    var personalInbet : any[] = [];

    if(this.personalEntries && this.personalEntries.length){
          var easterindex = 1;
          var userEasterindex = 1;
    
          var latestEasterEntry = this.personalEntries.reduce((a,b)=>a['easterYear']>b['easterYear']?a:b);
          userEasteryear = latestEasterEntry.easterYear;
          easterindex = 1;
      
           //if(yeartoCompare >= 4){
           //   userEasteryear = az.easterYear;
           //   easterindex++;
           // }
           //Easter Year Exsist Need to see if its been 4 years  if so do something
       
      
        var d;
        var m;
        var y;
        var inbetformat: string[] = [];
        personalInbet.forEach(bet => {
          
          var datesplit = bet.split("-");
          d = datesplit[1];
          m = datesplit[0];
          y = datesplit[2];
          var x = (m+d);
          inbetformat.push(x); //Formatting the Array so it can be read by d/m/y This is the Entries from the user
        });

    
         
          var x = 0;
      
          var b = parseInt(userEasteryear);

          var z = b + parseInt(this.banTime);
          console.log("easter b " + b)
          console.log("bantime " + this.banTime)

          console.log("easter Z " + z)
        
          var currenYear = parseInt(year);
          var banYearz = z;
        
          for(let v of this.easterDates){
           
          
              if(currenYear < banYearz){
                showerror = true;
                this.banperiod = true;
                this.easterYear = "";
                console.log("Is In Easter Ban Period")
              }
              else{
                console.log("Outside Easter Ban Period")
                this.banperiod = false;
                this.easterYear = year.toString();
              
              }
            
          }
     
        
        this.coolDown = z - currenYear;
        if(showerror && this.index < 1){
          
            this.errorType = 'easterError';
            this.index++;
          

        }
    }
    else{
      this.easterYear = year;
      return;
    }
  }
  checkBan(sy, sm, sd, ey,em ,ed ){
    var difference: any[] = [];
    var tempInb: any[] = [];
    
    console.log(sy + "sy");
    console.log(sm + "sm");
    console.log(sd + "sd");
    console.log(ey + "ey");
    console.log(em + "em");
    console.log(ed + "ed");
    let start = sy+ "-" + sm + "-" + sd;
    let end = ey + "-" + em + "-" + ed;

      var firstDate = new Date(start); 
      console.log(firstDate+ "firstdate");
      var lastDate = new Date(end);
      console.log(lastDate + " lastDate");

      var currentDate = moment(firstDate);
      var stopDate = moment(lastDate);
      
      while (currentDate <= stopDate) {

        var current = currentDate.format('YYYY-MM-DD').toString();
        var datesplit = current.split("-");
        var d = datesplit[2];
        var m = datesplit[1];
        var y = datesplit[0];
        var x = m+d;
        difference.push(x);

          currentDate = moment(currentDate).add(1, 'days'); 
      }
    var tempDiff : any[];
 
      console.log(difference);
      console.log("logged Difference");

    var showerror = false;
    var hasEntry = false;
    var reduceArray: any[] = [];

    var LatestBanYear;
   
    this.personalEntries.forEach(az => {
      az.inbet.forEach(i => {
        var x = i.month+i.day;
        tempInb.push(x);
        if(i.year === sy){
          console.log("in i.year");
          if(i.month === "12"){
         
            this.errorType = 'decPhaseError';
            this.banperiod = true;
            return false;
          }
        }
      });
    });

    this.personalEntries.forEach(az => {
      console.log("tempInb Logging")
      console.log(tempInb);
      console.log("logging difference");
      console.log(difference);
      console.log("logged Difference");
         const found = tempInb.some(r=> difference.includes(r))
        if(found){
          if(az.status != "Cancel"){
            console.log("It Found a Entry"); 
            hasEntry = true;
            reduceArray.push(az)
          }
      }
    });
    console.log("Reduce Array before Reduce");
    console.log(reduceArray);
  
    if(!reduceArray || reduceArray.length > 0 ){
      var latestSpecial = reduceArray.reduce((a,b)=>a.startDate.year>b.startDate.year?a:b);
      //var latestSpecial2 = reduceArray.reduce((a,b)=>a>b?a:b);
      LatestBanYear = latestSpecial.startDate.year;
    }


    console.log("LatestSpecial");
    console.log(latestSpecial)
    // console.log("LatestSpecial2");
    console.log("LatestBanYear" + LatestBanYear);
    //console.log(latestSpecial2)


      
    if (LatestBanYear != null || LatestBanYear != "0"){
      var b = parseInt(LatestBanYear);
    }else{
      b = sy;
    }


    var z = b + parseInt(this.banTime);
  
    var currenYear = parseInt(sy);
    var banYearz = z;

    if(!hasEntry){
      return;
    }else{
      if(currenYear >= banYearz){
         
    
        this.banperiod = false;
      }
      else{
        this.errorType = 'specialError';
        this.banperiod = true;
    
      }
    }

    if(showerror && this.index < 1){
      this.errorType = 'specialError';
      this.index++;
    }

    // console.log("hit Check Ban")
    // var j = 1;
    // 

  //cMonth == i.month && cSday == i.day || cMonth == az.startDate.month && cSday == az.startDate.day || cMonth == az.endDate.month && cSday == az.endDate.day || cMonth == az.startDate.month && cEday == az.startDate.day ||  cMonth == az.endDate.month && cEday == az.endDate.day
    // console.log("personalEntries");
    // console.log(this.personalEntries)
    // var personalInbet : any[] = [];

    // console.log("CmOnnth " +cMonth)
    // this.personalEntries.forEach(az => {
    //   if(az.status != "Cancel"){
    //   az.inbet.forEach(i => {
    //     console.log("Check Ban az.Inbet: ");
    //     console.log(az.inbet);
    //     var x = (i.month+"-"+i.day+"-"+i.year);
    //     personalInbet.push(x);
    //     console.log("i.month: " +i.month)
    //     if(i.month == cMonth){
    //       console.log("inside Month check")
       
    //       if(i.day == cDay){
    //           banYear = i.year;
    //           console.log("i.log " + i.year);
    //       }
         
    //     }
    //     else{
         
    //       console.log('Error: Banned Year Couldnt be logged')
    //     }
    //   });
    //   }
    // });

    
    // var d;
    // var m;
    // var y;
    // var inbetformat: string[] = [];
    // personalInbet.forEach(bet => {
      
    //   var datesplit = bet.split("-");
    //    d = datesplit[1];
    //    m = datesplit[0];
    //    y = datesplit[2];
    //   var x = (m+d);
    //   inbetformat.push(x);
    // });

    //   var x = 0;

   
      
    //   for(let v of this.specialRange){
    //    if(inbetformat.includes(v)){
       
    //   }
    // }
     
      
    
    //Check to see if daysArray = personalInbet if they do they have dates in those special dates then check the year
  }

  checkinbetween(lessdates, format){
      console.log(lessdates)
      console.log(format)
      console.log("Before Filter")
      var filteredArray = lessdates.filter(value => format.includes(value)); // This isnt filling the array on special/weekend dates
      console.log("after Format");
      console.log(filteredArray)
      
       for(var a of filteredArray){ 
        this.takendates.push(a);   //Nothing Is getting Filled here  Cause Filtered Array is Empty 
       }
 

   // Issue with Bans Error is here somewhere with taken being empty
    filteredArray = [];
    lessdates = [];
    format = [];
    filteredArray.length = 0;

    if(this.takendates.length == 0 || this.takendates.length < 1 || this.takendates == null){
      this.noconflic = true;
      console.log("conflict True")
      this.takendates.length = 0;
      console.log(this.banperiod)
      if(!this.banperiod){
        console.log(this.banperiod)
        this.banperiod = false;
      }
      
    }
    else{
      filteredArray.length = 0;
      console.log("conflict false")
      this.noconflic = false;
    }
  }
    
  logentry(sd, sm, sy, ed, em, ey, info, easterY){ 
    let difference: Inbetween[] = [];
    var startdate: string = sd.toString();
    
    let start = sy+ "-" + sm + "-" + sd;
    let end = ey + "-" + em + "-" + ed;

      var firstDate = new Date(start); 
      var lastDate = new Date(end);

      var currentDate = moment(firstDate);
      var stopDate = moment(lastDate);
      
      while (currentDate <= stopDate) {

        var current = currentDate.format('YYYY-MM-DD').toString();
        var datesplit = current.split("-");
        var d = datesplit[2];
        var m = datesplit[1];
        var y = datesplit[0];
        
        difference.push({
          day: d,
          month: m,
          year: y,
        });

          currentDate = moment(currentDate).add(1, 'days'); 
      }
    this.noconflic = null;
    Swal.fire({
      title: 'Are you sure?',
      text: "Ensure the correct dates are selected",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Book me!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.uniqueID = uuidv4();
         const newEntry = {
         id: this.uniqueID,
         surname: this.persist.memberinfo.surname,
          color: this.persist.memberinfo.color,
          startDate: {
            day: sd,
            month: sm,
            year: sy
          },
          endDate: {
            day: ed,
            month: em,
            year: ey
          },
          inbet: difference,
          info: info,
          status: 'Attending',
          editing: false,
          easterYear: easterY,
      } as Entrymodel;
      this.entryservice.createEntry(newEntry);  
        Swal.fire(
          'Success!',
          'Your booking Has been made.',
          'success'
        )
      }
      else{
          console.log("Something Went Wrong booking could not be made")
      }
    })
  } 

  createSpecial(startDate, endDate){
    let difference: any[] = []

    var startValue = startDate.split("/");
    var startDay = startValue[0];
    var startMonth = startValue[1];
    var startYear = startValue[2];
   
    var endValue = endDate.split("/");
    var endDay = endValue[0];
    var endMonth = endValue[1];
    var endYear = endValue[2];

    let start = startYear+ "-" + startMonth + "-" + startDay;
    let end = endYear + "-" + endMonth + "-" + endDay;

      var firstDate = new Date(start); 
      var lastDate = new Date(end); 
      var currentDate = moment(firstDate);
      var stopDate = moment(lastDate);
     
      while (currentDate <= stopDate) {

        var current = currentDate.format('YYYY-MM-DD').toString();
        var datesplit = current.split("-");
        var d = datesplit[2];
        var m = datesplit[1];
        var y = datesplit[0];
        
        difference.push(m+d);
          currentDate = moment(currentDate).add(1, 'days');
      }
    this.uniqueID = uuidv4();
    const special = {
       id: this.uniqueID,
        range: difference,
    } as Specialdates;
   this.entryservice.createSpecialDates(special); 
   }
} 
  
export interface specialDatez{
  dates: string[];
}

export class Inbetween{
  day: string;
  month?: string;
  year?: string;
}

export interface Special{
  dates: string;
  surname: string;
}



/* for (const element of this.entries) {
     
  if(startYear == element.startDate.year){

    console.log("Year || Has Entries");

    if(startMonth === element.startDate.month || endMonth == element.endDate.month){
      console.log("Month || Was Taken");

       if(startDay <= element.startDate.day || endDay >= element.endDate.day){
        //Okay  
        console.log("Day || Okay");
        this.logentry(startDay,startMonth,startYear,endDay,endMonth,endYear,entryinfo);
        return;
        
       }
       else{
        console.log("Something Went wrong");
        return;
       }
    }
    else{
      this.logentry(startDay,startMonth,startYear,endDay,endMonth,endYear,entryinfo);
      console.log("Month || Okay");
      return;
    }

  }else{
    console.log("Year || Okay");
    this.logentry(startDay,startMonth,startYear,endDay,endMonth,endYear,entryinfo);
    return
  }

 
} */