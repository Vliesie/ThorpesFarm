import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {FormGroup, FormControl} from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { PersistService } from '../Persistance/persist.service'
import { dateInputsHaveChanged } from '@angular/material/datepicker/datepicker-input-base';
import { stringify } from '@angular/compiler/src/util';
import * as moment from 'moment';
import { Entrymodel, Startdate } from '../entry.model';
import {EntryService} from '../entry.service'


@Component({
  selector: 'app-dateview',
  templateUrl: './dateview.component.html',
  styleUrls: ['./dateview.component.css']
})
export class DateviewComponent implements OnInit {
  selected = 'option2';
  Entry: Entrymodel;
  entries: Entrymodel[] = [];
  constructor(
    private entryservice: EntryService,
      private router: Router,
      private persist: PersistService
  ) { }

  ngOnInit(){
    this.entryservice.getAventry().subscribe(data => {
      this.entries = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as {}
        } as Entrymodel;
      })
    });
    return this.entries.filter(i => i.status == "cancel");
  }


}
