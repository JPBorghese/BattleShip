
import { Injectable } from "@angular/core";
import {webSocket, WebSocketSubject } from 'rxjs/webSocket';
import {AuthService} from './auth';

@Injectable()
export class WebsocketService {

    socket: WebSocketSubject<any> = webSocket({
        url:'ws://localhost:8080',
        deserializer: msg => msg, 
        protocol: this.authService.currentUserValue.username});
    
    constructor(private authService: AuthService) {
        this.socket.subscribe(
            msg => this.msgReceived(msg),
            err => console.log(err)
        );
    }

    send(data: string) {
        this.socket.next({
            username: this.authService.currentUserValue.username,
            message: data
        });
    }

    msgReceived(msg) {
        console.log(msg);
    }
}