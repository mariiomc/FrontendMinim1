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
createMode:boolean=false;

userForm = new FormGroup({
  first_name: new FormControl('', Validators.required),
  middle_name: new FormControl(''),
  last_name: new FormControl('', Validators.required),
  email: new FormControl('', Validators.required),
  phone_number: new FormControl('', Validators.required),
  gender: new FormControl('', Validators.required),
  user_rating: new FormControl(''),
  photo: new FormControl(''),
  description: new FormControl(''),
  dni: new FormControl(''),
  personality: new FormControl(''),
  password: new FormControl('', Validators.required),
  birth_date: new FormControl('', Validators.required),
  address: new FormControl(''),
  emergency_contact: new FormGroup({
    full_name: new FormControl(''),
    telephone: new FormControl('')
  })
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
  this.createMode = false;
}
createUserBtn(): void{
this.createMode = true;
}

onSubmit(): void {
  if (this.userForm.valid) {
    // Extract form values
    const formValues = this.userForm.value;
    
    // Check if birth_date is a valid date string
    const birthDate = formValues.birth_date ? new Date(formValues.birth_date) : null;

    // Create a new user object from form values
    const newUser: User = {
      first_name: formValues.first_name || '',
      middle_name: formValues.middle_name || '',
      last_name: formValues.last_name || '', 
      email: formValues.email || '', 
      phone_number: formValues.phone_number || '',
      gender: formValues.gender || '',
      user_rating: formValues.user_rating || '',
      photo: formValues.photo || '',
      description: formValues.description || '',
      dni: formValues.dni || '',
      personality: formValues.personality || '',
      password: formValues.password || '',
      birth_date: birthDate || new Date(),
      address: formValues.address || '', 
      emergency_contact: {
        full_name: (formValues.emergency_contact?.full_name || ''), // Ensure full_name is a string or empty string
        telephone: (formValues.emergency_contact?.telephone || '') // Ensure telephone is a string or empty string
      }
      // Include other properties similarly
    };

    this.userService.createUser(newUser).subscribe({
      next: (createdUser: User) => {
        console.log('User created:', createdUser);
        // Optionally, reset the form after successful submission
        this.refreshUserList();
        this.userForm.reset();
        this.createMode = false;
        // You may also want to navigate the user back to the user list view or perform any other action
      },
      error: (error: any) => {
        console.error('Error creating user:', error);
        // Handle error cases
      }
    });
    
  }
}

refreshUserList(): void {
  // Fetch the updated user list from the server
  this.userService.getUsers().subscribe(users => {
    this.users = users;
    console.log('User list updated:', this.users);
  });

}
}
