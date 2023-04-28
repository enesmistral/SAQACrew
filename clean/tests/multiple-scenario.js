import { chromium } from 'k6/experimental/browser';
import { expect } from 'https://jslib.k6.io/k6chaijs/4.3.4.0/index.js';

import { Homepage } from '../pages/homepage.js';
import { AdminPanel } from '../pages/admin-panel.js';
import { bookingData } from '../data/booking-data.js';
import { testSetup } from './setup.js';

import { Message } from '../resourceObjects/message/message.js';


const { name } = bookingData

export const options = {
  scenarios: {
    //1
    // booking: {
    //   executor: 'shared-iterations',
    //   exec: 'booking',
    //   vus: 1,
    //   iterations: 1
    // },
    // messages: {
    //   executor: 'shared-iterations',
    //   exec: 'messages',
    //   vus: 1,
    //   iterations: 1,
    // },
    // login: {
    //   executor: 'shared-iterations',
    //   exec: 'login',
    //   vus: 1,
    //   iterations: 1
    // },
    //2
    // booking: {
    //   executor: 'ramping-vus',
    //   exec: 'booking',
    //   startVUs: 0,
    //   stages: [
    //     { duration: '1m', target: 1 },
    //     { duration: '10s', target: 0 },
    //   ],
    //   gracefulRampDown: '0s',
    // },
    // messages: {
    //   executor: 'ramping-vus',
    //   exec: 'messages',
    //   stages: [
    //     { duration: '1m', target: 1 },
    //     { duration: '10s', target: 0 },
    //   ],
    //   gracefulRampDown: '0s',
    // },
    // login: {
    //   executor: 'ramping-vus',
    //   exec: 'login',
    //   startVUs: 0,
    //   stages: [
    //     { duration: '1m', target: 20 },
    //     { duration: '10s', target: 0 },
    //   ],
    //   gracefulRampDown: '0s',
    // },
    //3
    booking: {
      executor: 'constant-vus',
      exec: 'booking',
      vus: 1,
      duration: '30s'
    },
    messages: {
      executor: 'constant-vus',
      exec: 'messages',
      vus: 5,
      duration: '30s'
    },
    login: {
      executor: 'constant-vus',
      exec: 'login',
      vus: 100,
      duration: '30s'
    },
  },
}

export function setup() {
  testSetup()
}

export async function booking() {
  const browser = chromium.launch({ 
    headless: false,
    slowMo: '500ms'
  })
  const context = browser.newContext()
  const page = context.newPage()

  try {
    const homepage = new Homepage(page)
    await homepage.goto()
    homepage.submitForm()

    expect(homepage.getVerificationMessage()).to.contain(name)
  } finally {
    page.close()
    browser.close()
  }
}

export async function login() {
  const browser = chromium.launch({ 
    headless: false,
    slowMo: '500ms'
  })
  const context = browser.newContext()
  const page = context.newPage()

  try {
    const adminPanel = new AdminPanel(page)
    await adminPanel.login()
    
    expect(adminPanel.getLogoutButton()).to.equal('Logout')
  } finally {
    page.close()
    browser.close()
  }
}

export function messages() {
  const message = new Message();
  
  message.getAllMessages();
  message.postMessage();
}