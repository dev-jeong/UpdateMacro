'use strict';

require('dotenv').config();
const puppeteer = require('puppeteer');

let browser;
let page1;
let page2;
let page3;
let page4;
let page5;

async function login() {
    page1 = await browser.newPage();
    page1.on('console', (msg) => console.log('PAGE1 LOG:', msg.text()));

    await page1.goto('https://domeggook.com/ssl/member/mem_loginForm.php');
    await page1.type('#idInput', process.env.ID);
    await page1.type('#formLogin > input:nth-child(6)', process.env.PW);
    await page1.click('#formLogin > input.formSubmit');
    await page1.waitForNavigation();
    await page1.goto('https://domemedb.domeggook.com');
}

async function soldout() {
    if (page2 === undefined) {
        page2 = await browser.newPage();
        page2.on('console', (msg) => console.log('PAGE2 LOG:', msg.text()));
    }
    await page2.setDefaultNavigationTimeout(0);
    await page2.goto('https://domemedb.domeggook.com/index/popup_sender/popup_soldOut.php?b2bStatus=0&sstore=0');
    await page2.evaluate('sendSoldout()');
    setTimeout(() => { soldout(); }, parseInt(process.env.INTERVAL, 10) * 1000);
}

async function reinventory() {
    if (page3 === undefined) {
        page3 = await browser.newPage();
        page3.on('console', (msg) => console.log('PAGE3 LOG:', msg.text()));
    }
    await page3.setDefaultNavigationTimeout(0);
    await page3.goto('https://domemedb.domeggook.com/index/popup_sender/popup_reInventory.php?b2bStatus=0&sstore=0');
    await page3.evaluate('sendReinventory()');
    setTimeout(() => { reinventory(); }, parseInt(process.env.INTERVAL, 10) * 1000);
}

async function update() {
    if (page4 === undefined) {
        page4 = await browser.newPage();
        page4.on('dialog', async dialog => { await dialog.accept(); });
        page4.on('console', (msg) => console.log('PAGE4 LOG:', msg.text()));
    }
    await page4.setDefaultNavigationTimeout(0);
    await page4.goto(
        `https://domemedb.domeggook.com/index/popup_sender/popup_updateProduct.php?
         update=ok&arr=priceall&b2bStatus=0&nmChkVal=0`
    );
    await page4.goto('https://domemedb.domeggook.com/index/popup_sender/popup_updateProduct.php?error=ok&so=0')
    await page4.evaluate('delDataError()');
    setTimeout(() => { update(); }, parseInt(process.env.INTERVAL, 10) * 1000);
}

async function send() {
    if (page5 === undefined) {
        page5 = await browser.newPage();
        page5.on('dialog', async dialog => { await dialog.accept(); });
        page5.on('console', (msg) => console.log('PAGE5 LOG:', msg.text()));
    }
    await page5.setDefaultNavigationTimeout(0);
    await page5.goto(
        `https://domemedb.domeggook.com/index/popup_sender/popup_updateProduct.php?
        arr=all&b2bStatus=0&status=SUCCESS&fromOversea=0&sf=&sw=&itemNos=&pageLimit=50&b2bStatus=0&
        template=&sender_date1=&sender_date2=&dateType=7&template=&sstore=0&update=ok&&nmChkVal=0`
    );
    await page5.goto('https://domemedb.domeggook.com/index/popup_sender/popup_updateProduct.php?error=ok&so=0')
    await page5.evaluate('delDataError()');
    setTimeout(() => { send(); }, parseInt(process.env.INTERVAL, 10) * 1000);
}

(async () => {
    browser = await puppeteer.launch({ headless: process.env.HIDE_BROWSER !== '0' });

    await login();

    Promise.all([
        process.env.ACTION1 === '1' ? soldout() : null,
        process.env.ACTION2 === '1' ? reinventory() : null,
        process.env.ACTION3 === '1' ? update() : null,
        process.env.ACTION4 === '1' ? send() : null,
    ]);
})();
