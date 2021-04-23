
import { Injectable } from "@angular/core";
import {webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable()
export class WebsocketService {

    socket: WebSocketSubject<any> = webSocket({url:'ws://localhost:8080',
    deserializer: msg => msg});
    
    constructor() {
        this.socket.subscribe(
            msg => this.msgReceived(msg),
            err => console.log(err)
        );
    }

    send(data: string) {
        this.socket.next({message: data});
    }

    msgReceived(msg) {
        console.log(msg);
    }
}