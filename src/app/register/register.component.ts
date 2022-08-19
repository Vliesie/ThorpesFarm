import { Component, OnInit } from '@angular/core';
import { Entrymodel } from '../entry.model';
import { MemberService } from 'src/app/member.service';
import { Member } from 'src/app/member';
import { v4 as uuidv4 } from 'uuid';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  entry: Entrymodel;
  member: Member[];
  allmembers: Member[];
  Priorty: number;
  Uid: string;
  constructor(private memberservice: MemberService,
    private router: Router,
    ) { }

  ngOnInit() {
    this.memberservice.getMember().subscribe(data => {
      this.allmembers = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as {}
        } as Member;
      })
    });
  }

  create(surName: string, pass: string, color: string){
    var x = this.allmembers.length;
    
    this.Priorty = x + 1;
    this.Uid = uuidv4();
    const member = {
      id: this.Uid,
      surname: surName,
      color: color,
      password: pass,
      priority:  this.Priorty  
    } as Member;

    this.memberservice.createMember(member)
    this.Priorty = NaN;
    this.router.navigate(['login'] , {skipLocationChange: true} );
  }
}
