import { Time } from "@angular/common";

export class Token {
    accessToken: string;
    apiKey: string;
    refreshToken: string;
    expirationTime: Time;
}