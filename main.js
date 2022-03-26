require('dotenv').config();
const puppeteer = require('puppeteer');

let browser, page1, page2

(async () => {
    browser = await puppeteer.launch({ headless: process.env.BROWSER === '0' ? false : true })

    page1 = await browser.newPage()
    await login()

    page2 = await browser.newPage()
    await page2.setDefaultNavigationTimeout(0);
    while (true) {
        await soldout()
        await reinventory()
        await update()
        await send()
    }
})();

async function login() {
    await page1.goto('https://domeggook.com/ssl/member/mem_loginForm.php')
    await page1.type('#idInput', process.env.ID)
    await page1.type('#formLogin > input:nth-child(6)', process.env.PW)
    await page1.click('#formLogin > input.formSubmit')
    await page1.waitForNavigation();
    await page1.goto('https://domemedb.domeggook.com')
}

async function soldout() {
    await page2.goto('https://domemedb.domeggook.com/index/popup_sender/popup_soldOut.php?b2bStatus=0&sstore=0')
    await page2.evaluate(() => {
        sendSoldout()
    });
    await new Promise(resolve => setTimeout(resolve, parseInt(process.env.INTERVAL) * 1000));
}

async function reinventory() {
    await page2.goto('https://domemedb.domeggook.com/index/popup_sender/popup_reInventory.php?b2bStatus=0&sstore=0')
    await page2.evaluate(() => {
        sendReinventory()
    });
    await new Promise(resolve => setTimeout(resolve, parseInt(process.env.INTERVAL) * 1000));
}

async function update() {
    await page2.goto('https://domemedb.domeggook.com/index/popup_sender/popup_updateProduct.php?arr=all&b2bStatus=0&status=PRICE&fromOversea=0&sf=&sw=&itemNos=&pageLimit=50&b2bStatus=0&template=&sender_date1=&sender_date2=&dateType=3&template=&sstore=0&update=ok&&nmChkVal=1')
    await new Promise(resolve => setTimeout(resolve, parseInt(process.env.INTERVAL) * 1000));
}

async function send() {
    await page2.goto('https://domemedb.domeggook.com/index/popup_sender/popup_updateProduct.php?arr=all&b2bStatus=0&status=SUCCESS&fromOversea=0&sf=&sw=&itemNos=&pageLimit=50&b2bStatus=0&template=&sender_date1=&sender_date2=&dateType=7&template=&sstore=0&update=ok&&nmChkVal=0')
    await new Promise(resolve => setTimeout(resolve, parseInt(process.env.INTERVAL) * 1000));
}