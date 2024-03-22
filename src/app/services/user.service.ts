import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
   url: string = "http://127.0.0.1:3000";

  constructor(private http:HttpClient) { }

  createUser(newUser : User |undefined) {
    return this.http.post(this.url+'/user',newUser);
  }

  getUser(findUser : User){
    return this.http.get<User>(this.url+'/user/'+findUser._id);

  }

  getUsers() {
    return this.http.get<User[]>(this.url+'/user');
  }
  
  updateUser(editUser : User) {
    return this.http.put(this.url+'/user/'+ editUser._id, editUser);
  }
  
  deleteUser(deleteUser : User) {
    return this.http.delete(this.url+'/user/'+ deleteUser._id);
  }

}
