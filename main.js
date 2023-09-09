'use strict';

require('dotenv').config();
const puppeteer = require('puppeteer');

const login = async (page) => {
    await page.goto('https://domeggook.com/ssl/member/mem_loginForm.php');
    await page.type('#idInput', process.env.ID);
    await page.type('#pwInput', process.env.PW);
    await page.click('#formLogin > input.formSubmit');
    await page.waitForNavigation();
    await page.goto('https://domemedb.domeggook.com');
};

const soldout = async (page) => {
    await page.goto('https://domemedb.domeggook.com/index/popup_sender/popup_soldOut.php?b2bStatus=0&sstore=0');
    await page.evaluate('sendSoldout()');
    setTimeout(() => { soldout(page); }, parseInt(process.env.INTERVAL, 10) * 1000);
};

const reinventory = async (page) => {
    await page.goto('https://domemedb.domeggook.com/index/popup_sender/popup_reInventory.php?b2bStatus=0&sstore=0');
    await page.evaluate('sendReinventory()');
    setTimeout(() => { reinventory(page); }, parseInt(process.env.INTERVAL, 10) * 1000);
};

const update = async (page, init) => {
    if (init) page.on('dialog', async (dialog) => { await dialog.accept(); });
    await page.goto(
        `https://domemedb.domeggook.com/index/popup_sender/popup_updateProduct.php?
         update=ok&arr=priceall&b2bStatus=0&nmChkVal=0`
    );
    await page.goto('https://domemedb.domeggook.com/index/popup_sender/popup_updateProduct.php?error=ok&so=0');
    await page.evaluate('delDataError()');
    setTimeout(() => { update(page, false); }, parseInt(process.env.INTERVAL, 10) * 1000);
};

const send = async (page, init) => {
    if (init) page.on('dialog', async (dialog) => { await dialog.accept(); });
    await page.goto(
        `https://domemedb.domeggook.com/index/popup_sender/popup_updateProduct.php?
         arr=all&b2bStatus=0&status=SUCCESS&fromOversea=0&sf=&sw=&itemNos=&pageLimit=50&b2bStatus=0&
         template=&sender_date1=&sender_date2=&dateType=7&template=&sstore=0&update=ok&&nmChkVal=0`
    );
    await page.goto(
        'https://domemedb.domeggook.com/index/popup_sender/popup_updateProduct.php?error=ok&so=0'
    );
    await page.evaluate('delDataError()');
    setTimeout(() => { send(page, false); }, parseInt(process.env.INTERVAL, 10) * 1000);
};

const main = async () => {
    const browser = await puppeteer.launch({
        headless: process.env.SHOW_BROWSER !== '1' ? 'new' : false,
    });

    await login(await browser.newPage());
    Promise.all([
        process.env.ACTION1 === '1' ? soldout(await browser.newPage()) : null,
        process.env.ACTION2 === '1' ? reinventory(await browser.newPage()) : null,
        process.env.ACTION3 === '1' ? update(await browser.newPage(), true) : null,
        process.env.ACTION4 === '1' ? send(await browser.newPage(), true) : null,
    ]);
};

main();
