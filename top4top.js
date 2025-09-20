import axios from 'axios'
import FormData from 'form-data'
import { load } from 'cheerio'

export async function uploadTop4Top(buffer, filename = 'file.bin') {
  if (!Buffer.isBuffer(buffer) || !buffer.length)
    throw new TypeError('Invalid buffer. Provide a non-empty Buffer.')
  if (buffer.length > 209715200)
    throw new RangeError('File exceeds the 200 MB limit.')

  const form = new FormData()
  form.append('file_0_', buffer, { filename })
  form.append('submitr', '[ رفع الملفات ]')

  const { data } = await axios.post('https://top4top.io/index.php', form, {
    headers: {
      ...form.getHeaders(),
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      Origin: 'https://top4top.io',
      Referer: 'https://top4top.io/index.php',
      Connection: 'keep-alive'
    },
    maxBodyLength: Infinity
  })

  const link = load(data)('input.all_boxes').attr('value')?.trim()
  if (!/^https?:\/\/(?:\w+\.)?top4top\.io\/.+$/i.test(link || ''))
    throw new Error('Upload failed. Download link not found.')

  return link.replace(/^https:/, 'http:')
}
