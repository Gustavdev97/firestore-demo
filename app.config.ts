import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), provideFirebaseApp(() => initializeApp({ 
      projectId: "bror-5a23b", 
      appId: "1:744240182573:web:7c2ca63289588191628fa4", 
      storageBucket: "bror-5a23b.firebasestorage.app", 
      apiKey: "AIzaSyCZGXpLl51eEHn5R45bN3LgnlPxdac4QGw", 
      authDomain: "bror-5a23b.firebaseapp.com", 
      messagingSenderId: "744240182573" })), provideFirestore(() => getFirestore())
  ]
};
