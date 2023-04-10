import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
    scenarios: {
        post: {
          executor: 'constant-vus',
          exec: 'post',
          vus: 1,
          duration: '10s',
        },
        get: {
          executor: 'constant-vus',
          exec: 'get',
          vus: 100,
          duration: '10s',
        },
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

export function post() {

    const resPost = http.post("https://automationintesting.online/message/", JSON.stringify(data), headerParams);
    check(resPost, {
        "is status 201": (r) => r.status === 201,  
    });

    sleep(1);

}

export function get() {

    const resGet = http.get("https://automationintesting.online/message/", headerParams);
    check(resGet, {
        "is status 200": (r) => r.status === 200,
        "is number of messages > 0": (r) => r.json(["messages"]).length > 0,
    });

    sleep(1);
}
