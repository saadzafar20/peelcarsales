import { chromium } from 'playwright'

const BASE_URL = 'https://www.peelcarsales.com'
const LISTING_URL = `${BASE_URL}/used-cars/`
const CRAWL_DELAY_MS = 3000
const MAX_PAGES = 30
const MAX_SCROLLS = 40
const FETCH_TIMEOUT_MS = 15000
const MAX_RETRIES = 3

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function normalizeUrl(url) {
  if (!url) return null
  if (url.startsWith('//')) return `https:${url}`
  if (url.startsWith('/')) return `${BASE_URL}${url}`
  if (url.startsWith('http')) return url
  return null
}

function extractLinks(html) {
  const links = new Set()
  const hrefRegex = /href\s*=\s*["']([^"']+)["']/gi
  let match
  while ((match = hrefRegex.exec(html))) {
    const url = normalizeUrl(match[1])
    if (url) links.add(url)
  }
  return Array.from(links)
}

function extractVehicleLinks(html) {
  const links = new Set()
  const regex = /(https?:\/\/www\.peelcarsales\.com)?(\/cars\/used\/[^\s"'>]+)/gi
  let match
  while ((match = regex.exec(html))) {
    const url = normalizeUrl(match[0])
    if (url) links.add(url)
  }
  return Array.from(links)
}

function extractMetaContent(html, property) {
  const regex = new RegExp(`<meta[^>]+property=\"${property}\"[^>]+content=\"([^\"]+)\"`, 'i')
  const match = html.match(regex)
  return match ? match[1] : ''
}

function extractFirstMatch(html, regex) {
  const match = html.match(regex)
  return match ? match[1] : ''
}

function extractAllMatches(html, regex) {
  const results = []
  let match
  while ((match = regex.exec(html))) {
    results.push(match[1])
  }
  return results
}

function parsePrice(html) {
  const price = extractFirstMatch(html, /\$([0-9,]{4,})/)
  return price ? Number(price.replace(/,/g, '')) : 0
}

function parseMileage(html) {
  const km = extractFirstMatch(html, /([0-9,]{1,})\s*Km/i)
  return km ? Number(km.replace(/,/g, '')) : 0
}

function parseField(html, label) {
  const regex = new RegExp(`${label}\s*:?\s*([^<\n]+)`, 'i')
  return extractFirstMatch(html, regex).trim()
}

function mapFuel(value) {
  const lower = value.toLowerCase()
  if (lower.includes('diesel')) return 'diesel'
  if (lower.includes('hybrid')) return 'hybrid'
  if (lower.includes('electric')) return 'electric'
  return 'gasoline'
}

function mapBodyType(value) {
  const lower = value.toLowerCase()
  if (lower.includes('suv')) return 'suv'
  if (lower.includes('coupe')) return 'coupe'
  if (lower.includes('hatch')) return 'hatchback'
  if (lower.includes('truck')) return 'truck'
  if (lower.includes('convert')) return 'convertible'
  if (lower.includes('wagon')) return 'wagon'
  return 'sedan'
}

function mapTransmission(value) {
  return value.toLowerCase().includes('manual') ? 'manual' : 'automatic'
}

function parseTitle(title) {
  const yearMatch = title.match(/(19|20)\d{2}/)
  const year = yearMatch ? Number(yearMatch[0]) : 0
  const afterYear = yearMatch ? title.slice(title.indexOf(yearMatch[0]) + 4).trim() : title
  const parts = afterYear.split(' ').filter(Boolean)
  const make = parts.shift() || ''
  const model = parts.join(' ').trim()
  return { year, make, model }
}

function extractImages(html) {
  const urls = new Set()
  const imgRegex = /https?:\/\/[^"\s>]+\.(?:jpg|jpeg|png|webp)/gi
  let match
  while ((match = imgRegex.exec(html))) {
    urls.add(match[0])
  }
  return Array.from(urls).slice(0, 12)
}

function extractFeatures(html) {
  const features = new Set()
  const listItemRegex = /<li[^>]*>([^<]+)<\/li>/gi
  let match
  while ((match = listItemRegex.exec(html))) {
    const text = match[1].trim()
    if (text.length > 2 && text.length < 64) {
      features.add(text)
    }
  }
  return Array.from(features).slice(0, 20)
}

function toVehicle(url, html) {
  const ogTitle = extractMetaContent(html, 'og:title')
  const ogDescription = extractMetaContent(html, 'og:description')
  const pageTitle = ogTitle || extractFirstMatch(html, /<title>([^<]+)<\/title>/i)
  const { year, make, model } = parseTitle(pageTitle)

  const bodyStyle = parseField(html, 'Body Style')
  const fuelType = parseField(html, 'Fuel Type')
  const transmission = parseField(html, 'Transmission')
  const exterior = parseField(html, 'Exterior')
  const interior = parseField(html, 'Interior')
  const vin = parseField(html, 'VIN')
  const status = /sale pending|sold/i.test(html) ? 'pending' : 'available'

  return {
    id: url.split('/').pop() || url,
    make,
    model,
    year,
    price: parsePrice(html),
    mileage: parseMileage(html),
    fuel: mapFuel(fuelType || 'gasoline'),
    transmission: mapTransmission(transmission || 'automatic'),
    bodyType: mapBodyType(bodyStyle || 'sedan'),
    exteriorColor: exterior || '',
    interiorColor: interior || '',
    vin: vin || '',
    images: extractImages(html),
    features: extractFeatures(html),
    description: ogDescription || '',
    status,
    createdAt: new Date().toISOString(),
  }
}

async function fetchHtml(url) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    const response = await fetch(url, {
      headers: {
        'user-agent': 'PeelInventoryBot/1.0 (+https://peelcarsales.com)',
        accept: 'text/html,application/xhtml+xml',
      },
      signal: controller.signal,
    })
    if (!response.ok) {
      throw new Error(`Failed ${response.status} for ${url}`)
    }
    return response.text()
  } finally {
    clearTimeout(timeout)
  }
}

async function fetchHtmlWithRetry(url) {
  let attempt = 0
  while (attempt < MAX_RETRIES) {
    try {
      return await fetchHtml(url)
    } catch (error) {
      attempt += 1
      if (attempt >= MAX_RETRIES) {
        throw error
      }
      await sleep(1000 * attempt)
    }
  }
  throw new Error(`Failed to fetch ${url}`)
}

async function crawlListingPages() {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({
    userAgent: 'PeelInventoryBot/1.0 (+https://peelcarsales.com)',
  })

  await page.goto(LISTING_URL, { waitUntil: 'networkidle' })

  let previousCount = 0
  let stagnantRounds = 0

  for (let i = 0; i < MAX_SCROLLS && stagnantRounds < 4; i += 1) {
    await page.evaluate(() => window.scrollBy(0, window.innerHeight * 2))
    await page.waitForTimeout(1200)

    const count = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a'))
        .map((link) => link.getAttribute('href') || '')
        .filter((href) => href.includes('/cars/used/')).length
    })

    if (count === previousCount) {
      stagnantRounds += 1
    } else {
      stagnantRounds = 0
      previousCount = count
    }
  }

  const vehicleLinks = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a'))
      .map((link) => link.getAttribute('href') || '')
      .filter((href) => href.includes('/cars/used/'))
  })

  await page.close()
  await browser.close()

  const normalized = vehicleLinks
    .map((href) => normalizeUrl(href))
    .filter(Boolean)
    .map((link) => link.split('#')[0])

  return {
    listingPages: [LISTING_URL],
    vehiclePages: Array.from(new Set(normalized)),
  }
}

function toCsvRow(vehicle) {
  const columns = [
    'id',
    'make',
    'model',
    'year',
    'price',
    'mileage',
    'fuel',
    'transmission',
    'bodyType',
    'exteriorColor',
    'interiorColor',
    'vin',
    'images',
    'features',
    'description',
    'status',
    'createdAt',
  ]
  const escape = (value) => {
    const stringValue = String(value ?? '')
    return `"${stringValue.replace(/"/g, '""')}"`
  }
  return columns.map((key) => escape(Array.isArray(vehicle[key]) ? vehicle[key].join('|') : vehicle[key])).join(',')
}

async function writeOutputs(vehicles) {
  const fs = await import('node:fs/promises')
  const jsonPath = new URL('../data/inventory.json', import.meta.url)
  const csvPath = new URL('../data/inventory.csv', import.meta.url)

  await fs.writeFile(jsonPath, JSON.stringify(vehicles, null, 2))
  const header = 'id,make,model,year,price,mileage,fuel,transmission,bodyType,exteriorColor,interiorColor,vin,images,features,description,status,createdAt\n'
  await fs.writeFile(csvPath, header + vehicles.map(toCsvRow).join('\n'))
}

async function run() {
  console.log('Crawling listing pages...')
  const { vehiclePages } = await crawlListingPages()
  console.log(`Found ${vehiclePages.length} vehicle pages.`)

  const vehicles = []
  for (const [index, url] of vehiclePages.entries()) {
    try {
      const html = await fetchHtmlWithRetry(url)
      const vehicle = toVehicle(url, html)
      vehicles.push(vehicle)
      console.log(`[${index + 1}/${vehiclePages.length}] ${vehicle.make} ${vehicle.model}`)
      await writeOutputs(vehicles)
    } catch (error) {
      console.error(`Failed to parse ${url}`, error.message)
    }
    await sleep(CRAWL_DELAY_MS)
  }

  await writeOutputs(vehicles)
  console.log(`Saved ${vehicles.length} vehicles to data/inventory.json and data/inventory.csv`)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
