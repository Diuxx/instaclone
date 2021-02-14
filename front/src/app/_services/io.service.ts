import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as socket from 'socket.io-client';
import { Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { Post } from '../_models/post';

@Injectable({
  providedIn: 'root'
})
export class SocketIoService {
    // https://codingblast.com/chat-application-angular-socket-io/

    // variables
    private socket: Socket;

    constructor() {
        this.socket = socket.io(environment.io);
    }

    /**
     * Send to the server like informations
     */
    public sendLikeInformation(post: Post): void {
        this.socket.emit('like', post);
    }

    /**
     * Send to the server unlike informations
     */
    public sendUnLikeInformation(post: Post): void {
        this.socket.emit('unlike', post)
    }

    /**
     * send post information
     * @param post 
     */
    public sendPostInformation(post: Post): void {
        this.socket.emit('post', post);
    }

    /**
     * send informations
     */
    public sendPostDeleteInformation(post: Post): void {
        this.socket.emit('post-delete', post);
    }

    /**
     * Gett likes observable
     */
    public getLikes = () => {
        return new Observable(observer => {
            this.socket.on('like', (post: Post) => {
                observer.next(post);
            });
        });
    }

    /**
     * Get unlike observable
     */
    public getUnLikes = () => {
        return new Observable(observer => {
            this.socket.on('unlike', (post: Post) => {
                observer.next(post);
            });
        });
    }

    /**
     * Get post observable
     */
    public getPost = () => {
        return new Observable(observer => {
            this.socket.on('post', (post: Post) => {
                observer.next(post);
            });
        });
    }

    /**
     * Get deleted post
     */
    public getPostDelete = () => {
        return new Observable(observer => {
            this.socket.on('post-delete', (post: Post) => {
                observer.next(post);
            });
        });
    }
}
