import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
    "iterations": 10,
    "vus": 10,
    thresholds: {
        http_req_failed: ['rate < 0.1'], //request failure rate < 10%
    },
};

const headerParams = {
    headers: { "Content-Type": "application/json" },
};

const data = 
{
    name: "Load Tested",
    email: "Loadinho@email.com",
    phone: "01402 619211",
    subject: "Booking enquiry",
    description: "I would like to book a room at your place"
};

export default function () {

    const resPost = http.post("https://automationintesting.online/message/", JSON.stringify(data), headerParams);
    check(resPost, {
        "is status 201": (r) => r.status === 201,  
    });

    sleep(1);

    const resGet = http.get("https://automationintesting.online/message/", headerParams);
    check(resGet, {
        "is status 200": (r) => r.status === 200,
        "is number of messages > 0": (r) => r.json(["messages"]).length > 0,
    });

    sleep(1);
}
