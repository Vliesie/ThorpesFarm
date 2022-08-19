import { Component, OnInit } from '@angular/core';
import { MemberService } from 'src/app/member.service';
import { Member } from 'src/app/member';
import { Router, ActivatedRoute } from '@angular/router';
import { Entrymodel } from '../entry.model';
import { PersistService } from '../Persistance/persist.service'
import { Persistance } from '../Persistance/persistance.model'
import {CookieService} from 'ngx-cookie-service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

   members: Member[];

   entry: Entrymodel;
  constructor(private memberservice: MemberService,
    private router: Router,
    private route: ActivatedRoute,
    private persist: PersistService,
    private cookieservice: CookieService,
    ){}

  ngOnInit(){
    this.memberservice.getMember().subscribe(data => {
      this.members = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as {}
        } as Member;
      })
    });
    this.cookieservice.deleteAll();
  }

  login(surName: string, passWord){   
    
   this.persist.Membercount = this.members.length;
   var setban = this.persist.Membercount - 1;
   this.persist.ban = setban;
    const name = this.members.find( x => x.surname.toLowerCase().trim() === surName.trim().toLowerCase())
    const pass = this.members.find( x => x.password.toLowerCase().trim() === passWord.trim().toLowerCase())
    console.log(name + "name")
    console.log(pass + "pass")
    if(name && pass){
      for (const element of this.members) {
        if(element.surname === surName){
            this.persist.setPersistence(surName, element.color,this.members.length);
            this.persist.persistLogin(surName);
            this.router.navigate(['dashboard'], {skipLocationChange: true});
            return;
        }
    }
    }else{
      alert("User Details are incorrect please make sure your username and password is correct");
    }
  }
}
