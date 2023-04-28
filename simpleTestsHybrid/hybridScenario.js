import { chromium } from 'k6/experimental/browser';
import { expect } from 'https://jslib.k6.io/k6chaijs/4.3.4.0/index.js'
import { sleep, check } from 'k6';
import http from 'k6/http';

export const options = {
  scenarios: {
    bookRoom: {
      executor: 'ramping-vus',
      exec: 'bookRoom',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 1 },
        { duration: '10s', target: 0 },
      ],
      gracefulRampDown: '0s',
    },
    sendMessage: {
      executor: 'ramping-vus',
      exec: 'sendMessage',
      stages: [
        { duration: '1m', target: 1 },
        { duration: '10s', target: 0 },
      ],
      gracefulRampDown: '0s',
    },
    post: {
      executor: 'ramping-vus',
      exec: 'post',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 20 },
        { duration: '10s', target: 0 },
      ],
      gracefulRampDown: '0s',
    },
    get: {
      executor: 'ramping-vus',
      exec: 'get',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 50 },
        { duration: '10s', target: 0 },
      ],
      gracefulRampDown: '0s',
    },
  },
}

export function setup() {
  console.log("----==== START TEST ====----");
}

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


export async function bookRoom() {
    const browser = chromium.launch({ headless: false });
    const context = browser.newContext();
    const page = context.newPage();
    try{
        await page.goto('https://automationintesting.online/', { waitUntil: 'domcontentloaded' });
        expect(page.locator("//*[@id='collapseBanner']//h1").innerText()).to.equal("Welcome to Restful Booker Platform");
        await page.locator("(//button[text()='Book this room'])[1]").click();
        await page.locator("[name='firstname']").type("auto");
        await page.locator("[name='lastname']").type("mation");
        await page.locator("[name='email']").type("testing@testing.tt");
        await page.locator("[name='phone']").type("+13215654875");
        await page.locator("//button[text()='Book']").click();
        check(page, {
            'Alert Window displayed' : await page.locator("[class='alert alert-danger']").isVisible() == true
        })
        await page.locator("//button[text()='Cancel']").click();

    }
    finally {
        context.close();
        browser.close();
    }
}

export async function sendMessage() {
  const browser = chromium.launch({ headless: false });
  const context = browser.newContext();
  const page = context.newPage();
  try{
    await page.goto('https://automationintesting.online/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator("[class='row contact']")).to.exist;
    await page.locator("#name").type("Automator Tester");
    await page.locator("#email").type("auto@sarajevoqacrew.com");
    await page.locator("#phone").type("+13215654875");
    await page.locator("#subject").type("I just called to say I love you");
    await page.locator("#description").type("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.");
    await page.locator("#submitContact").click();
    expect(page.locator("//*[@class='row contact']//h2").innerText()).to.contain("Thanks for getting in touch");
  }
  finally {
    context.close();
    browser.close();
  }
}

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

export function teardown(data) {
    console.log("----==== TEST DONE ====----");
}