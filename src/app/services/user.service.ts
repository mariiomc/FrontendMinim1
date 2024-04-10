import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  constructor(private http:HttpClient) { }

  url: string = "http://127.0.0.1:3000";

  createUser(newUser : User |undefined) {
    return this.http.post<User>(this.url+'/users',newUser);
  }

  loginUser(email:string, password:string) {// we need to complete the function
    return this.http.post<any>(this.url+'/login',{email, password});
  }

  getUser(findUser : string){
    return this.http.get<User>(this.url+'/users/'+findUser);
  }

  getUsers() {
    return this.http.get<User[]>(this.url+'/users');
  }
  
  updateUser(editUser : User) {
    return this.http.put<User>(this.url+'/users/'+ editUser._id, editUser);
  }
  
  deleteUser(deleteUserId : string) {
    return this.http.delete(this.url+'/users/'+ deleteUserId);
  }

}
