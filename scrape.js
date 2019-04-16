const puppeteer = require('puppeteer')
const cheerio = require('cheerio')

// Takes the name of an instagram account and returns an array of URLs
// corresponding to that account's first page of posts
const scrapePostUrls = async (igName) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  const url = `https://www.instagram.com/${igName}`

  await page.goto(url, {waitUntil: 'networkidle2'}) // waiting until network traffic has stalled is important for the react-app to finish rendering the virtual DOM

  let content = await page.content()
  const $ = cheerio.load(content)
  const postLinks = '#react-root section main div div div div div div a'
  const urls = $(postLinks).map((i, elem) => {
    return $(elem).attr('href')
  })

  await browser.close()

  return urls.toArray()
}

let igName = 'indie_hackers'
scrapePostUrls(igName).then(val => {
  console.log(val)
})
