
import { Persistance } from '../Persistance/persistance.model'
import { Entrymodel, Startdate } from '../entry.model';
import {EntryService} from '../entry.service';
import {
  
  CalendarMonthViewBeforeRenderEvent,
  CalendarWeekViewBeforeRenderEvent,
  CalendarDayViewBeforeRenderEvent,
  
} from 'angular-calendar';
import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  startOfISOWeekYear,
  addHours,
  differenceInDays
} from 'date-fns';
import { combineLatest, merge, Observable, Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { map, catchError,finalize, tap } from 'rxjs/operators';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, ActivatedRoute} from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { startOfYear, subYears } from 'date-fns';
import { Console } from 'console';


const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

// get your own key from https://holidayapi.com/
const HOLIDAY_API_KEY = '0bbf2e0e-c47f-4626-8d32-52d774f252b3';

// change this to your own country
const COUNTRY_CODE = 'ZAF';

interface Holiday {
  date: string;
  name: string;
}

type CalendarEventWithMeta = CalendarEvent<
  { type: 'holiday'; holiday: Holiday } | { type: 'normal' }
>;

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  Entry: Entrymodel;
  eventz: CalendarEvent[];
  view: CalendarView = CalendarView.Month;
  events: Observable<CalendarEventWithMeta[]>;

  CalendarView = CalendarView;
  loading: boolean;
  allAsyncRequestsComplete: boolean;
  viewDate: Date = startOfYear(subYears(new Date(), 1));
  entries: Observable<any>;


  constructor(private modal: NgbModal,
    private entryservice: EntryService,
    private route: ActivatedRoute,
    private http: HttpClient, 
    private cdr: ChangeDetectorRef
    ) {}

  modalData: {
    action: string;
    event: CalendarEvent;
  };

ngOnInit() : void{

  this.loading = true;
  this.events  = combineLatest([this.fetchEvents(), this.fetchHolidays()]).pipe(tap(console.log),map(([events, holidays]) => [...events, ...holidays]),finalize(() => this.loading = false));
 
}
 
  fetchEvents(){
    return this.entryservice.getAventry().pipe(
      map(data => {
      return data.map(e => {
          return {
         id: e.payload.doc.id,
          ...e.payload.doc.data() as {}
         } as Entrymodel;
         })
       }),
      map(this.setCalendar),
    );
  }

  fetchHolidays(){
   
    return this.http
    .get<{ items: Holiday[] }>('https://www.googleapis.com/calendar/v3/calendars/en.sa%23holiday%40group.v.calendar.google.com/events?key=AIzaSyC1h50qrKKYq3ENyhUE5LQV2pjyhBMAHws', {
      params: {
  
      },
    }).pipe(tap(console.log),map(({items}) => items.map((items) => {
        return {
          start: new Date(items.start.date),
          end: new Date(items.end.date),
          title: items.summary,
          allDay: true,
          meta: {
            type: 'holiday',
            items,
          },
        };
      })))
      
  }



  setCalendar(entries){
     return entries.map(element => {
      let start = element.startDate.year + "-" + element.startDate.month + "-" + element.startDate.day;
      let end = element.endDate.year + "-" + element.endDate.month + "-" + element.endDate.day;

      var startDate = new Date(start); 
      var endDate = new Date(end); 
   
      var title = element.info + " - " + element.surname;
       return {
          title: title ,
                                                                                                                                                       
          start: startOfDay(startDate),
          end: endOfDay( endDate),
          color: {
            primary: element.color,
           secondary: element.color
          },
          draggable: false,
          resizable: {
            beforeStart: false,
            afterEnd: false,
          },
          cssClass: element.surname,
        }
    });
 
   
   /*  this.entries.forEach(element => {
      var startDate = new Date(parseInt(element.startDate.month), parseInt(), parseInt()); 
      var endDate = new Date(parseInt(element.endDate.month), parseInt(element.endDate.day), parseInt(element.endDate.year)); 

      let event = {} as CalendarEvent;
      event.id = element.id,
      event.start = startDate,
      event.end = endDate,
      event.title = element.info,
      event.color = {
        primary: element.color,
        secondary: element.color
      },
      event.actions = this.actions,
      event.resizable = {
        beforeStart: false,
        afterEnd: false,
      },
      event.draggable = false,
      event.allDay =  true,
      this.events.push(event);
     console.log(event);
     console.log("Assign Starting");

    });
  */
  }
  hideloader() { 
  
    // Setting display of spinner 
    // element to none 
   
  } 
  
 
}

