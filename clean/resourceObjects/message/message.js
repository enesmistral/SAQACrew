import http from 'k6/http';
import { check } from 'k6';
import { bookingData } from '../../data/booking-data.js';

export class Message{
    constructor(){
        this.url = "https://automationintesting.online/message/";
    }

    getAllMessages(){
        console.log(`Sending GET ${this.url}`);
        var result = http.get(this.url, { 
            headers: { "Content-Type": "application/json" }
        });

        check(result, {
            "is status 200": (r) => r.status === 200,
            "is number of messages > 0": (r) => r.json(["messages"]).length > 0,
        });
    }

    postMessage(){
        var result = http.post('https://automationintesting.online/message/', JSON.stringify(bookingData), {
            headers: { 'Content-Type': 'application/json' },
        });

        check(result, {
            "is status 201": (r) => r.status === 201,  
        });
    }
}