import { Component, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { NgFor, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  id?: string;
  email: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true,
  imports: [NgFor, AsyncPipe, FormsModule]   // ✅ lägg till dessa
})
export class App {
  private firestore = inject(Firestore);
  users$: Observable<User[]>;
  newEmail = '';

  constructor() {
  const usersRef = collection(this.firestore, 'users');
  this.users$ = collectionData(usersRef, { idField: 'id' }) as Observable<User[]>;

  this.users$.subscribe(data => {
    console.log("Firestore data:", data);
  });
}

  async addUser() {
    if (!this.newEmail) return;
    const usersRef = collection(this.firestore, 'users');
    await addDoc(usersRef, { email: this.newEmail });
    this.newEmail = '';
  }
}