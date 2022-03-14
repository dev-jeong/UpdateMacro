require('dotenv').config();
const puppeteer = require('puppeteer');

let browser, page1, page2, page3, page4, page5
let promises = [];

(async () => {
    browser = await puppeteer.launch({ headless: process.env.BROWSER === '0' ? false : true })

    await login()

    await Promise.all([
        soldout(),
        reinventory(),
        update(),
        send()
    ])
})();

async function login() {
    page1 = await browser.newPage();
    await page1.goto('https://domeggook.com/ssl/member/mem_loginForm.php')
    await page1.type('#idInput', process.env.ID)
    await page1.type('#formLogin > input:nth-child(6)', process.env.PW)
    await page1.click('#formLogin > input.formSubmit')
    await page1.waitForNavigation();
    await page1.goto('https://domemedb.domeggook.com')
}

async function soldout() {
    page2 = await browser.newPage();
    await page2.goto('https://domemedb.domeggook.com/index/popup_sender/popup_soldOut.php?b2bStatus=0&sstore=0')
    await page2.evaluate(() => {
        sendSoldout();
    });
    await page2.close();
    await new Promise(resolve => setTimeout(resolve, parseInt(process.env.INTERVAL1) * 1000));
    soldout()
}

async function reinventory() {
    page3 = await browser.newPage();
    await page3.goto('https://domemedb.domeggook.com/index/popup_sender/popup_reInventory.php?b2bStatus=0&sstore=0')
    await page3.evaluate(() => {
        sendReinventory();
    });
    await page3.close();
    await new Promise(resolve => setTimeout(resolve, parseInt(process.env.INTERVAL1) * 1000));
    reinventory()
}

async function update() {
    page4 = await browser.newPage();
    await page4.goto('https://domemedb.domeggook.com/index/popup_sender/popup_updateProduct.php?arr=all&b2bStatus=0&status=PRICE&fromOversea=0&sf=&sw=&itemNos=&pageLimit=50&b2bStatus=0&template=&sender_date1=2022-01-27&sender_date2=2022-02-27&dateType=3&template=&sstore=0&update=ok&&nmChkVal=1')
    await page4.close();
    await new Promise(resolve => setTimeout(resolve, parseInt(process.env.INTERVAL1) * 1000));
    update()
}

async function send() {
    page5 = await browser.newPage();
    page5.on('dialog', async dialog => {
        await dialog.accept();
    });
    await page5.goto('https://domemedb.domeggook.com/index/sender/sender_productList.php?sstore=0&fromOversea=0&dateType=3&sender_date1=2022-01-27&sender_date2=2022-02-27&status=SUCCESS')
    await page5.click('body > div:nth-child(3) > div:nth-child(6) > table > tbody > tr > td > div:nth-child(2) > a')
    await page5.close();
    await new Promise(resolve => setTimeout(resolve, parseInt(process.env.INTERVAL2) * 1000));
    send()
}