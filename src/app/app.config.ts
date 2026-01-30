import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), 
    provideFirebaseApp(() => initializeApp({ 
      projectId: "join-70d12", 
      appId: "1:663559193457:web:333562150e2375c669acd0", 
      storageBucket: "join-70d12.firebasestorage.app", 
      apiKey: "AIzaSyDtJzE_92zgvwjKa80_735rTBq5-IKvdso", 
      authDomain: "join-70d12.firebaseapp.com", 
      messagingSenderId: "663559193457"})), 
    provideFirestore(() => getFirestore())
  ]
};
