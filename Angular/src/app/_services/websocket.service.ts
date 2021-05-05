
import { Injectable } from "@angular/core";
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { AuthService } from './auth';
import { Router } from '@angular/router';
import { NotificationService } from '../_services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from "rxjs";

const MESSAGE_TYPE = {
    Disconnect: -1,
    Misc: 0,
    Chat: 1,
    Move: 2,
    SearchOpponent: 4,
    ShipData: 5, 
    gameOver: 6,
    StopSearch: 7
}
Object.freeze(MESSAGE_TYPE);

@Injectable()
export class WebsocketService {

    public username: string;
    public opponent: string;
    public userTurn: boolean;
    public opp = null;
    public oppMove;
    public chat: string[];

    socket: WebSocketSubject<any>;
    public update: Subject<any>;

    constructor(private authService: AuthService,
        private router: Router,
        private notif: NotificationService,
        private dialog: MatDialog,
    ) {
        this.update = new Subject<any>();
        this.oppMove = -1;
    }

    connect() {
        this.chat = [];
        this.username = this.authService.currentUserValue.username;
<<<<<<< HEAD
        this.userTurn = true;
        
=======
        this.userTurn = true
        this.opponent = null;

>>>>>>> 4d40146520aa10a23b8663fdd2e6a074767dce06
        this.socket = webSocket({
            url: 'ws://localhost:8080',
            //deserializer: msg => msg, 
            protocol: this.username
        });

        this.socket.subscribe(
            msg => this.msgReceived(msg),
            err => console.log(err)
        );
    }

    stopSearch() {
        const message = {
            username: this.username,
            type: MESSAGE_TYPE.StopSearch
        };
        this.socket.next(message);
    }

    disconnect(err) {
        console.log(err);
        this.send("", MESSAGE_TYPE.Disconnect);
        this.socket.unsubscribe();
    }

    sendChat(msg) {
        if (!this.opponent) {
            console.log("No opponent to message!");
        } else {

            this.chat.push(this.username + ': ' + msg);

            const message = {
                username: this.username,
                opponent: this.opponent,
                type: MESSAGE_TYPE.Chat,
                message: msg
            };

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
            type: type,
            message: data
        });
    }

    msgReceived(msg) {
        //console.log('Message recieved ', msg);

        switch (msg.type) {
            case MESSAGE_TYPE.Misc: {
                console.log(msg.message);
                break;
            }

            case MESSAGE_TYPE.Chat: {
                this.chat.push(this.opponent + ': ' + msg.message + '\n');
                break;
            }

            case MESSAGE_TYPE.Move: {
                this.oppMove = msg.message;
                break;
            }

            case MESSAGE_TYPE.SearchOpponent: {
                this.opponent = msg.message;
                console.log('Game Started vs ', this.opponent);
                this.router.navigate(['game']);
                this.dialog.closeAll();
                break;
            }

            case MESSAGE_TYPE.ShipData: {
                // msg.message is the players along with their boat positions
                this.userTurn = (msg.message.p1 === this.username) ? true : false;
                this.opp = (msg.message.p1 === this.username) ? {username: msg.message.p2, boats: msg.message.p2boats} : {username: msg.message.p1, boats: msg.message.p1boats};
                let turn = (this.userTurn) ? this.username : this.opponent;
                this.notif.showNotif("Game Started," + turn + "'s " + "turn!", "Ok");
                break;
            }

            default: {
                break;
            }
        }
        this.update.next(msg);
    }
}