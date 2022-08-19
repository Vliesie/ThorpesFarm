import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Member } from 'src/app/member';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  constructor(private firestore: AngularFirestore) { }

  getMember() {
    return this.firestore.collection('members').snapshotChanges();
  }

  createMember(member: Member){
    return this.firestore.collection('members').add(member);
  }

  updateMember(member: Member){
    delete member.id;
    this.firestore.doc('members/' + member.id).update(member);
  }

  deleteMember(memberId: string){
    this.firestore.doc('members/' + memberId).delete();
  }
}
