import fetch from 'node-fetch'

export interface Card {
  data: CardData[]
}

export interface CardData {
  id: number
  name: string
  type: string
  desc: string
  atk: number
  def: number
  level: number
  race: string
  attribute: string
  archetype: string
  card_sets: CardSet[]
  card_images: CardImage[]
  card_prices: CardPrice[]
}

export interface CardImage {
  id: number
  image_url: string
  image_url_small: string
}

export interface CardPrice {
  cardmarket_price: string
  tcgplayer_price: string
  ebay_price: string
  amazon_price: string
  coolstuffinc_price: string
}

export interface CardSet {
  set_name: string
  set_code: string
  set_rarity: string
  set_rarity_code: string
  set_price: string
}

function newDataFromFlyweight<T>(urls: Record<string, string>) {
  const obj: Record<string, Promise<T>> = {}

  return new Proxy(obj, {
    get: async (target, key: string) => {
      console.log(` Get ${key} in ${target[key]}`)

      if (!target[key]) {
        console.log('Fetching new id info')

        const response = await fetch(
          `https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${key}`
        )

        target[key] = response.json()
      }

      return target[key]
    },
  })
}

;(async () => {
  const response = await fetch(
    'https://db.ygoprodeck.com/api/v7/cardinfo.php?name=Dark%20Magician'
  )

  const card: CardData = (await response.json()).data[0] as CardData

  const id = '46986420'

  const magicians = card.card_images.reduce(
    (acc: any, { image_url, id }) => ({
      ...acc,
      [id.toString()]: image_url,
    }),
    {}
  )

  const fly = newDataFromFlyweight<Card>(magicians)
  const data = await fly[id]
  console.log('magician\n', data)

})()
