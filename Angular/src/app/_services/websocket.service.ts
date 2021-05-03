
import { Injectable, OnDestroy } from "@angular/core";
import {webSocket, WebSocketSubject } from 'rxjs/webSocket';
import {AuthService} from './auth';

const MESSAGE_TYPE = {
    Misc:0,
    Chat:1,
    Move:2,
    OpponentFound:3
}
Object.freeze(MESSAGE_TYPE);

@Injectable()
export class WebsocketService{

    private username: string = (this.authService.currentUserValue) ? this.authService.currentUserValue.username : 'Guest';
    private opponent: string = null;

    socket: WebSocketSubject<any> = webSocket({
            url:'ws://localhost:8080',
            //deserializer: msg => msg, 
            protocol: this.username
        });
    
    constructor(private authService: AuthService) {
        this.socket.subscribe(
            msg => this.msgReceived(msg),
            err => console.log(err)
        );
    }

    ngOnDestroy() {
        this.socket.unsubscribe();
    }

    sendChat(msg) {
        if (!this.opponent) {
            console.log("No opponent to message!");
        } else {
            const message = {
                username: this.username,
                opponent: this.opponent,
                type: MESSAGE_TYPE.Chat,
                message: msg
            };

            console.log('sent: ', message);

            this.socket.next(message);
        }
    }

    send(data: string, type = MESSAGE_TYPE.Misc) {
        this.socket.next({
            username: this.username,
            opponent: this.opponent,
            type:type,
            message: data
        });
    }

    msgReceived(msg) {
        switch (msg.type) {
            case MESSAGE_TYPE.Misc: {
                console.log(msg.message);
                break;
            }

            case MESSAGE_TYPE.Chat: {
                console.log(this.opponent, ': ', msg.message);
                break;
            }

            case MESSAGE_TYPE.Move: {
                break;
            }

            case MESSAGE_TYPE.OpponentFound: {
                this.opponent = msg.message;
                console.log('Game Started vs ', this.opponent);
                this.sendChat('Hello Breh!');
            }

            default: {
                break;
            }
        }
    }

    close() {
        this.socket.unsubscribe();
    }
}