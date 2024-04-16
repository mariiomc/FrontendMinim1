import * as mongoose from 'mongoose';

export interface Event {

    //Cada vez que hay un login, se crea un user o se edita un 
    //User, se crea un evento

    //Login --> Date ultimoLogin (ultimo login realizado por un usuario)
    //Creación user --> User user (último usuario creado)
    //Edicion User --> Un String con los cambios que se han hecho a 
    //ese usuario

    _id?: string; // Optional _id field
    ultimoLogin?: Date;
    User?: string;    
    edicionUser?: string;
    event_deactivated: boolean;
}