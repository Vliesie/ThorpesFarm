import {
  Component,
  HostListener,
  OnInit,
  Output,
  EventEmitter
} from "@angular/core";
import { Router, ActivatedRoute } from '@angular/router';
import { Persistance } from '../Persistance/persistance.model'
import { PersistService } from '../Persistance/persist.service'
import {CookieService} from 'ngx-cookie-service'
import { ThrowStmt } from '@angular/compiler';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  navElement: HTMLElement;

  isDrawerOpen: boolean;
  membername: string;
  constructor(
    private router: Router,
    private persist: PersistService,
    private cookieService:  CookieService
  ) { }



  ngOnInit(){
    const username: string = this.cookieService.get('username');
    const color: string = this.cookieService.get('color');
   

    if(this.persist.loggedin){
      this.persist.memberinfo = new Persistance
      this.persist.memberinfo.surname = username;
      this.persist.memberinfo.color = color;
      this.membername = username;
    }
  }

  logout(){
    this.persist.loggedin = false;
    this.router.navigate(['login']);
    this.persist.memberinfo = null;
    this.cookieService.deleteAll();
  }

  ngAfterViewInit() {
    this.navElement = <HTMLElement> document.getElementById("navbar");
  }

  @HostListener("window:scroll", ["$event"])
  onScroll($event: Event) {
    let scrollFactor = 200;
    let opacity = (window.pageYOffset / scrollFactor);
    opacity = opacity < 1 ? opacity : 1;

    if (opacity <= 1) {
      this.navElement.style.backgroundColor = "rgba(255, 255, 255, " + opacity + ")";
    }

    if (window.pageYOffset / scrollFactor > 1) {
      this.navElement.classList.add("navbar-shadow");
    } else {
      this.navElement.classList.remove("navbar-shadow");
    }
  }

  toggleNavDrawer(isDrawerOpen: boolean) {
    this.isDrawerOpen = isDrawerOpen;
  
  }

}
