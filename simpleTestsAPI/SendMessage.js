import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
    // stages: [
    //         { target: 20, duration: '1m' },
    //         { target: 15, duration: '1m' },
    //         { target: 0, duration: '1m' },
    // ],
    "iterations": 10,
    "vus": 10,
    thresholds: {
        http_req_failed: ['rate < 0.1'], //request failure rate < 10%
    },
};

export default function () {

    var headerParams = {
        headers: { "Content-Type": "application/json" },
      };

    let data = 
    {
        name: "Load Tested",
        email: "Loadinho@email.com",
        phone: "01402 619211",
        subject: "Booking enquiry",
        description: "I would like to book a room at your place"
    }

    const res = http.post("https://automationintesting.online/message/", JSON.stringify(data), headerParams);

    console.log(res.json(["messageid"]));

    
    check(res, {
        "is status 201": (r) => r.status === 201,
        "is message ID > 0": (r) => r.json(["messageid"]) > 0,
        "is message correct": (r) => r.json(["description"]) === data.description    
        }
    );

    sleep(1);
}
