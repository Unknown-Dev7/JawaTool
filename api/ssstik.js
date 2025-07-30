import { ssstik } from '../utils/scrap.js'

export default async function handler(req, res) {
  const { url } = req.query
  if (!url) return res.status(400).json({ error: 'URL is required' })

  try {
    const result = await ssstik(url)
    res.status(200).json(result)
  } catch (e) {
    res.status(500).json({ error: 'Failed to download', detail: e.message })
  }
}