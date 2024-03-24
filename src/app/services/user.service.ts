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
    return this.http.post(this.url+'/users',newUser);
  }

  getUser(findUser : User){
    return this.http.get<User>(this.url+'/users/'+findUser._id);

  }

  getUsers() {
    return this.http.get<User[]>(this.url+'/users');
  }
  
  updateUser(editUser : User) {
    return this.http.put(this.url+'/users/'+ editUser._id, editUser);
  }
  
  deleteUser(deleteUser : User) {
    return this.http.delete(this.url+'/users/'+ deleteUser._id);
  }

}
