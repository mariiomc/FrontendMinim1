import { Component, Output, Input, EventEmitter } from '@angular/core';
import { User } from '../../models/user';
import {FormsModule} from '@angular/forms';
import { UserService } from '../../services/user.service';
import { FormBuilder,FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent{
searchBarUserString: string='';
users: User[] = [];//users retrieved from the server
selectedUser: User | null = null;
userSelected: boolean = false;
editMode:boolean=false;

userForm = new FormGroup({
  name: new FormControl('', Validators.required),
  email: new FormControl('', Validators.required),
});

constructor( public userService: UserService, private formBuilder: FormBuilder)
{
  
} // Inyectamos el FormBuilder

ngOnInit(): void {
// Fetch data from API
console.log('fetching users');
this.userService.getUsers().subscribe(users => {
  this.users = users;
  console.log(this.users);
})
}

onSelectUser(user:User): void{
  this.userSelected = true;
  this.selectedUser = user;
}

backToUserList(): void{
  this.userSelected = false;
  this.selectedUser = null;
}


}
