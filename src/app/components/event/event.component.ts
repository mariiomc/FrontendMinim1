import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Event } from '../../models/event';
import { User } from '../../models/user';
import { EventService } from '../../services/event.service';
import mongoose, { mongo } from 'mongoose';
import { getLocaleDateFormat } from '@angular/common';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css'
})
export class EventComponent {
  searchBarEventString: string='';
  events: Event[] = [];
  selectedEvent: Event | null = null;
  eventSelected: boolean = false;
  createMode: boolean = false;
  searchEventMode: boolean = false;
  editMode: boolean = false;
  searchedEvent: Event | null = null;
  deactivateEventId:string='';
  eventToBeEdited: Event | null = null;


  eventForm = new FormGroup({
    ultimoLogin: new FormControl(Date),
    User: new FormControl(''),
    edicionUser: new FormControl(''),
    deactivated: new FormControl(false)
  });

  constructor( public eventService: EventService, private formBuilder: FormBuilder)
  {
  }

  

  ngOnInit(): void {
    // Fetch data from API
    console.log('fetching events');
    this.eventService.getEvents().subscribe(events => {
      this.events = events;
      console.log(this.events);
    })
    }

    onSelectEvent(event:Event): void{
      this.eventSelected = true;
      this.selectedEvent = event;
    }
    
    backToEventList(): void{
      this.eventSelected = false;
      this.selectedEvent = null;
      this.createMode = false;
      this.searchEventMode = false;
      this.searchedEvent = null;
      this.editMode = false;
    }
    
    createEventBtn(): void{
    this.createMode = true;
    }
    
    onSubmit(): void {
      console.log("onSubmit()")
      if (this.eventForm.valid) {
        console.log("válido")
        // Extract form values
        const formValues = this.eventForm.value;
            
        // Create a new user object from form values
        const newEvent: Event = {
          ultimoLogin: new Date,
          User: formValues.User || '',
          edicionUser: formValues.edicionUser || '',
          event_deactivated: false
        };
    
        this.eventService.createEvent(newEvent).subscribe({
          next: (createdEvent: Event) => {
            console.log('Event created: ', createdEvent);
            // Optionally, reset the form after successful submission
            this.refreshEventList();
            this.eventForm.reset();
            this.createMode = false;
            // You may also want to navigate the user back to the user list view or perform any other action
          },
          error: (error: any) => {
            console.error('Error creating event: ', error);
            // Handle error cases
          }
        });
        
      }
      console.log("no es válido")
    }
    
    refreshEventList(): void {
      // Fetch the updated user list from the server
      this.eventService.getEvents().subscribe(events => {
        this.events = events;
        console.log('Event list updated: ', this.events);
      });
    }
    
      searchForEvent(): void {
        this.searchEventMode = true;
        if(this.searchBarEventString != ''){
          this.eventService.getEvent(this.searchBarEventString).subscribe(event => {
            this.searchedEvent = event;
          });
        }else{
          this.searchedEvent = null;
        }
      }
    
      deactivateEvent(): void {
        if(this.selectedEvent){
          this.deactivateEventId = this.selectedEvent._id || '';
        }else if(this.searchedEvent){
          this.deactivateEventId = this.searchedEvent._id || '';
        }
        this.eventService.deleteEvent(this.deactivateEventId).subscribe(() => { // Removed empty parentheses
          this.refreshEventList();
          this.backToEventList();
        });
      }
    
      editEventMode(): void {
        this.editMode = true;
        console.log("editando...")
        if(this.selectedEvent){
          this.eventToBeEdited = this.selectedEvent;
        }else if(this.searchedEvent){
          this.eventToBeEdited = this.searchedEvent;
        }
        this.eventForm.patchValue({
          User: this.eventToBeEdited?.User || '',
          edicionUser: this.eventToBeEdited?.edicionUser || ''
        });
      }
      editEventSubmit(): void {
          // Extract form values
          console.log("mandamos edit...")
          const formValues = this.eventForm.value;
          
          // Create a new user object from form values
          const edit: Event = {
            _id: this.eventToBeEdited?._id,
            ultimoLogin: new Date,
            User: formValues.User || this.eventToBeEdited?.User || '',
            edicionUser: formValues.edicionUser || this.eventToBeEdited?.edicionUser || '',
            event_deactivated: false
          };
          console.log("edit: "+edit)
      
          this.eventService.updateEvent(edit).subscribe({
            next: (editedEvent: Event) => {
              console.log('Event created: ', editedEvent);
              // Optionally, reset the form after successful submission
              this.refreshEventList();
              this.eventForm.reset();
              this.editMode = false;
              this.backToEventList();
              // You may also want to navigate the user back to the user list view or perform any other action
            },
            error: (error: any) => {
              console.error('Error creating event: ', error);
              // Handle error cases
            }
          });
      }
}
