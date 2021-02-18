import { Token } from "./token";

export class User {
    uid: string | null;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    emailVerified: boolean | null;
    stsTokenManager?: Token
}