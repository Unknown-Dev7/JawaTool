import axios from 'axios'
import cheerio from 'cheerio'
import qs from 'qs'

export default async function handler(req, res) {
  const { url } = req.query
  if (!url) return res.status(400).json({ status: false, message: 'Masukkan URL' })

  try {
    const BASEurl = 'https://ssstik.io'
    const get = await axios.get(BASEurl, {
      headers: {
        'user-agent': 'Mozilla/5.0',
      }
    })

    const $ = cheerio.load(get.data)
    const urlPost = $('form[hx-target="#target"]').attr('hx-post')
    const tokenJSON = $('form[hx-target="#target"]').attr('include-vals')
    const tt = tokenJSON.replace(/'/g, '').replace('tt:', '').split(',')[0]
    const ts = tokenJSON.split('ts:')[1]

    const dataPost = {
      id: url,
      locale: 'en',
      tt: tt,
      ts: ts
    }

    const post = await axios.post(BASEurl + urlPost, qs.stringify(dataPost), {
      headers: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'user-agent': 'Mozilla/5.0'
      }
    })

    const $$ = cheerio.load(post.data)
    const result = {
      status: true,
      text: $$('div > p').text(),
      videonowm: BASEurl + $$('div > a.without_watermark').attr('href'),
      music: $$('div > a.music').attr('href')
    }

    res.json(result)

  } catch (e) {
    res.status(500).json({ status: false, message: e.message })
  }
}