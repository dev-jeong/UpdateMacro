const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();
    await page.goto('https://domeggook.com/ssl/member/mem_loginForm.php');

    await page.type('#idInput', "dtree0628");
    await page.type('#formLogin > input:nth-child(6)', "@Rnaskan1528");

    await page.click('#formLogin > input.formSubmit');

    //await browser.close();
})();