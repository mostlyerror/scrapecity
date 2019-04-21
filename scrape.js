const puppeteer = require('puppeteer')
const cheerio = require('cheerio')

// Takes the name of an instagram account and returns an array of URLs
// corresponding to that account's first page of posts
const scrapePostUrls = async (igName) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  const url = `https://www.instagram.com/${igName}`

  await page.goto(url, {waitUntil: 'networkidle2'})

  let content = await page.content()
  const $ = cheerio.load(content)
  const postLinks = '#react-root section main div div div div div div a'
  const urls = $(postLinks).map((i, elem) => {
    let resource = $(elem).attr('href') // '/p/RESOURCE/'
    return resource.slice(resource.indexOf('/p/') + 3, resource.length - 1)
  })

  await browser.close()

  return urls.toArray()
}

// accepts restful resource like '/p/Bu8-3swHuCb/'
// returns object with organized post metadat
const scrapePost = async (postResource) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  const postUrl = `https://www.instagram.com/${postResource}`

  await page.goto(postUrl, {waitUntil: 'networkidle2'})

  let content = await page.content()
  const $ = cheerio.load(content)

  //const sharedDataScriptNode = $('body > script:first-of-type')
  //const scriptNode = sharedDataScriptNode[0]

  // this isn't the right scriptNode, looking for the one containing
  // window._sharedData = { blah blah big json object }
  //const scriptContent = scriptNode.children.filter(c => c.type === 'text')
    //.map(textNode => textNode.data)
  // slice the js obj text here and parse into a real object for returning
  
  const data = await page.evaluate(function (id) {
    return id
  })
  console.log(data)

  await browser.close()
  return data
}

let igName = 'indie_hackers'
scrapePostUrls(igName)
  .then(async (postIds) => {
    const postId = postIds[0]
    console.log(await scrapePost(postId))
  })
  .catch(err => {
    console.error(err)
  })
