const puppeteer = require("puppeteer");
var fs = require("fs");

const PAGE_URL =
  "https://www.hansimmo.be/appartement-te-koop-in-borgerhout/10161";

const main = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(PAGE_URL);

  const items = await page.evaluate(() => {
    // write your querySelectors here
    var description = $('#description').text();
    var title = $('#detail-description-container > h2').text();
    var price = $('#detail-title > .price').text();
    var address = $('#detail-title > .address').text();

    return {
      description: typeof(description) === 'string' && description.trim().length > 0 ? description.trim() : '',
      title: typeof(title) === 'string' && title.trim().length > 0 ? title.trim() : '',
      price: typeof(price) === 'string' && price.trim().length > 0 ? price.trim() : '',
      address: typeof(address) === 'string' && address.trim().length > 0 ? address.trim() : '',
    };
  });

  let data = JSON.stringify(items, null, 2);

  fs.writeFile("items.json", data, (err) => {
    if (err) throw err;
    console.log("Data written to file");
  });

  console.log(items);

  await browser.close();

  return items;
};

main().then((data) => console.log(data));
