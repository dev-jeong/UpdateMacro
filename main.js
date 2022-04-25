require('dotenv').config();
const puppeteer = require('puppeteer');

let browser, page1, page2, page3, page4, page5

(async () => {
    browser = await puppeteer.launch({ headless: process.env.HIDE_BROWSER === '0' ? false : true })

    await login()

    while(true){
        process.env.ACTION1 === '1' ? await soldout() : null
        process.env.ACTION2 === '1' ? await reinventory() : null
        process.env.ACTION3 === '1' ? await update() : null
        process.env.ACTION4 === '1' ? await send() : null
    }

})();

async function login() {
    page1 = await browser.newPage()
    await page1.goto('https://domeggook.com/ssl/member/mem_loginForm.php')
    await page1.type('#idInput', process.env.ID)
    await page1.type('#formLogin > input:nth-child(6)', process.env.PW)
    await page1.click('#formLogin > input.formSubmit')
    await page1.waitForNavigation();
    await page1.goto('https://domemedb.domeggook.com')
}

async function soldout() {
    if (page2 === undefined) { page2 = await browser.newPage() }
    await page2.setDefaultNavigationTimeout(0);
    await page2.goto('https://domemedb.domeggook.com/index/popup_sender/popup_soldOut.php?b2bStatus=0&sstore=0')
    await page2.evaluate(() => {
        sendSoldout()
    });
    await new Promise(resolve => setTimeout(resolve, parseInt(process.env.INTERVAL) * 1000));
}

async function reinventory() {
    if (page3 === undefined) { page3 = await browser.newPage() }
    await page3.setDefaultNavigationTimeout(0);
    await page3.goto('https://domemedb.domeggook.com/index/popup_sender/popup_reInventory.php?b2bStatus=0&sstore=0')
    await page3.evaluate(() => {
        sendReinventory()
    });
    await new Promise(resolve => setTimeout(resolve, parseInt(process.env.INTERVAL) * 1000));
}

async function update() {
    if (page4 === undefined) { page4 = await browser.newPage() }
    await page4.setDefaultNavigationTimeout(0);
    await page4.goto('https://domemedb.domeggook.com/index/popup_sender/popup_updateProduct.php?arr=all&b2bStatus=0&status=PRICE&fromOversea=0&sf=&sw=&itemNos=&pageLimit=50&b2bStatus=0&template=&sender_date1=&sender_date2=&dateType=3&template=&sstore=0&update=ok&&nmChkVal=1')
    await new Promise(resolve => setTimeout(resolve, parseInt(process.env.INTERVAL) * 1000));
}

async function send() {
    if (page5 === undefined) { page5 = await browser.newPage() }
    page5.on('dialog', async dialog => {
        await dialog.accept();
    });
    await page5.setDefaultNavigationTimeout(0);
    await page5.goto('https://domemedb.domeggook.com/index/popup_sender/popup_updateProduct.php?arr=all&b2bStatus=0&status=SUCCESS&fromOversea=0&sf=&sw=&itemNos=&pageLimit=50&b2bStatus=0&template=&sender_date1=&sender_date2=&dateType=7&template=&sstore=0&update=ok&&nmChkVal=0')

    await page5.goto('https://domemedb.domeggook.com/index/popup_sender/popup_updateProduct.php?error=ok&so=0')
    const text = await page5.$eval('#bigDiv2 > div > div.col-md-12 > table > tbody > tr > td:nth-child(4) > div:nth-child(1)', element => element.textContent)
    if (text.replace(/ /gi, '') != '0건\n') {
        await page5.click('#bigDiv2 > div > div.col-md-12 > table > tbody > tr > td:nth-child(4) > div.fr > button')
    }
    await new Promise(resolve => setTimeout(resolve, parseInt(process.env.INTERVAL) * 1000));
}