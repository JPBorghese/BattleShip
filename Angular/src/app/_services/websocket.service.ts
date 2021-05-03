
import { Injectable, OnDestroy } from "@angular/core";
import {webSocket, WebSocketSubject } from 'rxjs/webSocket';
import {AuthService} from './auth';
import {Router} from '@angular/router';

const MESSAGE_TYPE = {
    Disconnect:-1,
    Misc:0,
    Chat:1,
    Move:2,
    OpponentFound:3,
    SearchOpponent:4,
    ShipData:5
}
Object.freeze(MESSAGE_TYPE);

@Injectable()
export class WebsocketService{

    public username: string;
    public opponent: string = null;

    socket: WebSocketSubject<any>;
    
    constructor(private authService: AuthService,
    private router : Router
        ) {
    }

    connect() {
        this.username = this.authService.currentUserValue.username;

        this.socket = webSocket({
            url:'ws://localhost:8080',
            //deserializer: msg => msg, 
            protocol: this.username
        });

        this.socket.subscribe(
            msg => this.msgReceived(msg),
            err => console.log(err)
        );
    }

    disconnect() {
        this.send("", MESSAGE_TYPE.Disconnect);
        this.socket.unsubscribe();
    }

    ngOnDestroy() {
        console.log('destroy called');
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

    searchForOpponent() {
        const message = {
            username: this.username,
            type: MESSAGE_TYPE.SearchOpponent
        }

        this.socket.next(message);
    }

    send(data, type = MESSAGE_TYPE.Misc) {
        this.socket.next({
            username: this.username,
            opponent: this.opponent,
            type:type,
            message: data
        });
    }

    msgReceived(msg) {
        console.log('Message recieved ', msg);

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
                this.router.navigate(['game']);
            }

            case MESSAGE_TYPE.SearchOpponent: {
                console.log(msg.message);
                break;
            }

            case MESSAGE_TYPE.ShipData: {
                console.log("shipData: " + msg.message);
            }

            default: {
                break;
            }
        }
    }
}