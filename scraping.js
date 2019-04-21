const fs = require('fs')
const path = require('path')
const axios = require("axios");
const moment = require('moment')


const scrapeProfile = async igName => {
  // blow up if igName is bad

  const url = `https://www.instagram.com/${igName}`;
  const page = await axios.get(url)
  // .then(page => { // }) // .catch(err => console.error(err)) // how to recover from 404?

  // recover from page.data undefined
  const matches = page.data.match(/window\._sharedData = (.*);<\/script>/);
  // recover from no matches

  const profileInfo = JSON.parse(matches[1]);
  const user = profileInfo.entry_data.ProfilePage[0].graphql.user;
  const mediaArray = user.edge_owner_to_timeline_media;
  const media = mediaArray.edges.map(edge => edge.node)

  return { user, media };
};

let igName = 'indie_hackers';
scrapeProfile(igName)
  .then(data => {
    const dateString = moment().toISOString()
    const filename = `${dateString}-${data.user.id}-${data.user.username}.json`
    const filepath = path.join(__dirname, filename);
    // console.log(filepath)
    fs.open(filepath, 'wx', (err, fd) => {
      if (err) throw err

      fs.write(fd, data, err => {
        if (err) throw err
        console.log(`${filename} written.`)
      })
    })
  })
  .catch(err => console.error(err))