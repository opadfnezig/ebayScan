async function parseSignInText(page) {
    await page.waitForSelector('#gh-ug');
    return page.$eval('#gh-ug', el => el.innerText);
}

async function parseProductList(page) {
    return page.$$eval('.s-item.s-item__dsa-on-bottom.s-item__pl-on-bottom', items => {
        return items.map(item => {
            let title = item.querySelector('.s-item__title')?.innerText;
            const link = item.querySelector('.s-item__link')?.href;
            if (title)
                title = title.replace(/^NEW LISTING\s*/, '');
            return {
                link: link,
                title: title,
                listingDate: item.querySelector('.s-item__listingDate')?.innerText,
                priceString: item.querySelector('.s-item__price')?.innerText,
                subtitle: item.querySelector('.s-item__subtitle')?.innerText,
            };
        });
    });
}

async function parseDescription(page) {
    await page.waitForSelector('.vim.x-evo-tabs-region .tabs__content');
    return page.$eval('.vim.x-evo-tabs-region .tabs__content', el => el.innerText);
}

module.exports = {
    parseSignInText,
    parseProductList,
    parseDescription
}