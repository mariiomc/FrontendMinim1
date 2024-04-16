import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Event } from '../models/event';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  token: string | null = null;

  constructor(private http:HttpClient, private authService:AuthService) { }

  url: string = "http://127.0.0.1:3000";
  
  getToken() {
    this.token = this.authService.getToken();
  }

  getHeaders() {
    this.getToken();
    let headers = new HttpHeaders();
    headers = headers.set('x-access-token', this.token || '');
    return headers;
  }

  createEvent(newEvent : Event |undefined) {
    return this.http.post<Event>(this.url+'/event',newEvent,{ headers: this.getHeaders() });
  }

  getEvent(findEvent : string){
    return this.http.get<Event>(this.url+'/event/'+findEvent, { headers: this.getHeaders() });
  }

  getEvents() {
    return this.http.get<Event[]>(this.url+'/event', { headers: this.getHeaders() });
  }

  updateEvent(editEvent : Event) {
    return this.http.put<Event>(this.url+'/event/'+ editEvent._id, editEvent, { headers: this.getHeaders() });
  }
  
  deleteEvent(deleteEventId : string) {
    return this.http.delete(this.url+'/event/'+ deleteEventId, { headers: this.getHeaders() });
  }
}
