import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Entrymodel } from '../app/entry.model'
import { v4 as uuidv4 } from 'uuid';
import { PersistService } from './Persistance/persist.service';
import { Specialdates } from '../app/specialdates.model'
import { CalendarEvent } from 'angular-calendar';
@Injectable({
  providedIn: 'root'
})
export class EntryService {

  constructor(private firestore: AngularFirestore,
    private persist: PersistService) { }

  getEntry() {
    return this.firestore.collection('entry').snapshotChanges();
  }

  getMemberEntry() {
    return this.firestore.collection('entry', x => x.where('surname' , '==', this.persist.memberinfo.surname)).snapshotChanges();
  }


  getAventry(){
    return this.firestore.collection<CalendarEvent>('entry', x => x.where('status' , '==', 'Attending')).snapshotChanges();
  }

  getPersonalEntry() {
    return this.firestore.collection('entry', x => x.where('surname', '==', this.persist.memberinfo.surname)).snapshotChanges();
  }

  getSpecialDates(){
    return this.firestore.collection('special').snapshotChanges();
  }

  getEasterDates(){
    return this.firestore.collection('easter').snapshotChanges();
  }
  
  createEntry(entry: Entrymodel){
    console.log(entry);
    return this.firestore.collection('entry').doc(entry.id).set(entry);
    
  }

  createSpecialDates(special: Specialdates){
    return this.firestore.collection('special').doc(special.id).set(special);
  }
  
  updateMember(entry: Entrymodel){
 
    
    this.firestore.doc('entry/' + entry.id).update(entry);
  }
  
  deleteMember(entryiD: string){
    this.firestore.doc('entry/' + entryiD).delete();
  }
}

