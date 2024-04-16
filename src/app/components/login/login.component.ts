import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormsModule, ReactiveFormsModule,FormControl, FormGroup,Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import {Event} from '../../models/event';
import { EventService } from '../../services/event.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  token: string | null = null;
  loggedIn: boolean = false;

  constructor( public userService: UserService,public eventService: EventService, public authService: AuthService)
{
  
}

loginForm = new FormGroup({
  email: new FormControl('', [Validators.required, Validators.email]),
  password: new FormControl('', [Validators.required])
});

ngOnInit():void{
  this.token = this.authService.getToken();
  console.log('token'+this.token);
  if(this.token){
    this.loggedIn = true;
  }
}

login(){
  if (this.loginForm.value.email && this.loginForm.value.password) {
    console.log('email'+this.loginForm.value.email);
    console.log('password'+this.loginForm.value.password);

    const event: Event = {
      ultimoLogin: new Date,
      User: 'No se ha creado ningún usuario',
      edicionUser: 'No se ha editado ningún usuario', 
      event_deactivated: false
    };

    this.userService.loginUser(this.loginForm.value.email, this.loginForm.value.password).subscribe((data) => {
      console.log(data);
      this.authService.setToken(data);
      this.loggedIn = true;
    });

    this.eventService.createEvent(event).subscribe({
      next: (createdEvent: Event) => {
        console.log('Event created: ', createdEvent);
        // Optionally, reset the form after successful submission
        // You may also want to navigate the user back to the user list view or perform any other action
      },
      error: (error: any) => {
        console.error('Error creating event: ', error);
        // Handle error cases
      }
    });
  }
}

logout(){
  this.authService.logout();
  this.loggedIn = false;
}

}
