import express from 'express'
import axios from 'axios'
import { spotifydl } from './spotifydl.js'
import { ytmp3dl } from './ytmp3dl.js'
import { soundclouddl } from './soundclouddl.js'
import { ttmp3dl } from './ttmp3dl.js'
import { uploadTop4Top } from './top4top.js'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.static('public'))

app.post('/download', async (req, res) => {
  const url = req.body.url
  if (!url) {
    return res.status(400).json({ error: 'Please provide a URL.' })
  }

  try {
    const { link, title, artist = '' } =
      /spotify\.com\/track/.test(url) ? await spotifydl(url) :
      /youtu\.be\/|youtube\.com/.test(url) ? await ytmp3dl(url) :
      /soundcloud\.com/.test(url) ? await soundclouddl(url) :
      /tiktok\.com/.test(url) ? await ttmp3dl(url) :
      (() => { throw new Error('Unsupported URL.') })()

    const fileName = `${artist ? artist + ' - ' : ''}${title}.mp3`
    const fileBuffer = Buffer.from((await axios.get(link, { responseType: 'arraybuffer' })).data)
    const uploadFile = await uploadTop4Top(fileBuffer, fileName)

    res.json({ success: true, url: uploadFile })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
