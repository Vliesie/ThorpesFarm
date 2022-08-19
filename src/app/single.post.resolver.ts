import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {EntryService} from "../app/entry.service";
import { Entrymodel } from "./entry.model";

@Injectable()
export class SinglePostResolver implements Resolve<any>{
 entries :Entrymodel[] = [];
  constructor(
    private entry:EntryService,
  ){

  }

  resolve(): Observable<any>{    
      return this.entry.getAventry()
  }

}
