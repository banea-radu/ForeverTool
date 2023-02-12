import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { DbAuthUser } from '../model/db-auth-user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  userData: any;

  constructor(
    private http: HttpClient,
    public router: Router,
    public angularFireAuth: AngularFireAuth,
    public angularFireStore: AngularFirestore,
  ) {
    // Save user data in localstorage when logged in, set null when logged out
    this.angularFireAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  // Sign in with email/password
  SignIn(email: string, password: string) {
    return this.angularFireAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.SetUserData(result.user);
        this.angularFireAuth.authState.subscribe((user) => {
          if (user) {
            this.router.navigate(['clients']);
          }
        });
      })
      .catch((error) => {
            alert(error);
      });
  }

  // Returns true when user is looged in
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null ? true : false;
  }

  // Auth logic to run auth providers
  AuthLogin(provider: any) {
    return this.angularFireAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.router.navigate(['clients']);
        this.SetUserData(result.user);
      })
      .catch((error) => {
        window.alert(error);
      });
  }
  
  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.angularFireStore.doc(
      `users/${user.uid}`
    );
    const userData: DbAuthUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  // Sign out
  SignOut() {
    return this.angularFireAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    });
  }

  createCompleteUrl(endpoint: string, id?: string){
    const urlBase: string = environment.firebase.databaseURL + "/";
    let completeUrl: string = '';
    /* check if id was passed to this function, if yes, it is needed for a patch/delete request and we 
    need to add it to the full path */
    if (id) {
      completeUrl = urlBase + endpoint + "/" + id + ".json";
    } else {
      completeUrl = urlBase + endpoint + ".json";
    }
    let accessToken: string = "";
    const localStorageUserData: string | null = localStorage.getItem("user");
    /* check if we have data for the user in the localstorage, if not, the user is not authenticated
      and we don't need to add the access token to the full path for requests */
    if (localStorageUserData !== "null" && localStorageUserData !== null) {
      accessToken = JSON.parse(localStorage.getItem('user')!).stsTokenManager.accessToken;
      completeUrl = completeUrl + "?auth=" + accessToken;
    }
    return completeUrl;
  }

  getClients(){
    const completeUrl = this.createCompleteUrl('clients');
    return this.http.get(completeUrl)
      // create new objects with key as id property
      .pipe(map((response: any) => {
        const newObjects = [];
        for(const key in response) {
          newObjects.push({...response[key], id: key});
        }
        return newObjects;
      }));
  }

  patchClient(bodyData: any, id: string){
    const completeUrl = this.createCompleteUrl('clients', id);
    return this.http.patch(completeUrl, bodyData);
  }

  getFilters(){
    const completeUrl = this.createCompleteUrl('filters');
    return this.http.get(completeUrl);
  }

  patchFilters(bodyData: any){
    const completeUrl = this.createCompleteUrl('filters');
    return this.http.patch(completeUrl, bodyData);
  }
 
}