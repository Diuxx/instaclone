import { User } from 'src/app/_models/user';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AppInit {
    // --
    protected session_timeout: number = 600000; // login time 10 minutes

    private _user: User = null;
    public set user(u: User) {
        this._user = u;
    }
    public get user(): User {
        return this._user;
    }

    public constructor () {
        this._getuserSession();
    }

    _getuserSession(): void {
        // check if user session exist
        if(localStorage.getItem('user_session') && this._checkTimeOut()) {
            this.user = JSON.parse(localStorage.getItem('user_session'));
            // if user stay in app refresh timeout
            localStorage.setItem('user_session_timeout', JSON.stringify({ value: Date.now() }));
            console.log('> refresh session timeout');
        } else {
            // if not connected user is guest
            this.user = {
                uid: 'string',
                email: 'string',
                displayName: 'string',
                photoURL: 'string',
                emailVerified: true,
            };

            // remove if exist user informations
            localStorage.removeItem('user_session');
            localStorage.removeItem('user_session_timeout');
        }
    }

    _checkTimeOut(): boolean {
        // if it not exist logout connected user
        if(!localStorage.getItem('user_session_timeout')) return false;

        let diff = Date.now() - JSON.parse(localStorage.getItem('user_session_timeout')).value;
        if(diff >= this.session_timeout) {
            // disconnect user
            return false;
        }
        return true;
    }
}