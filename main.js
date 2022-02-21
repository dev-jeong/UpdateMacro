const puppeteer = require('puppeteer');

(async () => {
    console.log('hi')

    const browser = await puppeteer.launch({
        headless: false,
        executablePath: './chromium/chrome.exe'
    });
    const page = await browser.newPage();
    await page.goto('https://domeggook.com/ssl/member/mem_loginForm.php');

    await page.type('#idInput', "dtree0628");
    await page.type('#formLogin > input:nth-child(6)', "@Rnaskan1528");

    await page.click('#formLogin > input.formSubmit');

    //await browser.close();
})();