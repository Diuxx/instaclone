import { Token } from "src/app/_models/token";

export interface User {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    emailVerified: boolean;
    stsTokenManager?: Token
}
