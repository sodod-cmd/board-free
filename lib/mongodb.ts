import dns from 'node:dns'
import { MongoClient, type Db } from 'mongodb'

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB_NAME || 'board'

if (!uri) {
  throw new Error('MONGODB_URI орчны хувьсагч тодорхойлогдоогүй байна (.env файлаа шалгана уу).')
}

const FALLBACK_DNS = ['1.1.1.1', '8.8.8.8']

/** "127.0.0.1", "::1", "[::1]:53" зэргийг loopback гэж таних. */
function isLoopback(server: string): boolean {
  const host = server
    .replace(/^\[/, '')
    .replace(/\](:\d+)?$/, '')
    .split('%')[0]
  return host === '::1' || host === '0.0.0.0' || host.startsWith('127.')
}

/**
 * mongodb+srv:// холболт нь DNS-ийн SRV/TXT бичлэг уншдаг бөгөөд үүнд Node-ын дотоод
 * resolver (c-ares) ашиглагддаг. Зарим Windows / VPN орчинд энэ resolver DNS сервер болгон
 * 127.0.0.1-ийг авчихдаг ба тэнд DNS сервер байхгүй тул "querySrv ECONNREFUSED" алдаа гардаг.
 * (Бусад сайт нээгдсэн хэрнээ зөвхөн бааз холбогддоггүйн шалтгаан нь энгийн хаяг шийддэг
 * `dns.lookup` нь үйлдлийн системийн resolver-ийг ашигладагт оршино.)
 *
 * ЧУХАЛ: `dns` болон `dns.promises` нь ТУСДАА resolver-тэй. MongoDB драйвер нь
 * `dns.promises.resolve`-ыг ашигладаг тул зөвхөн `dns.setServers()` дуудвал хангалтгүй —
 * хоёуланг нь тохируулах ёстой.
 *
 * .env дотор DNS_SERVERS=192.168.1.1,1.1.1.1 гэж бичвэл тэр жагсаалтыг шууд ашиглана.
 */
function ensureUsableDnsServers() {
  const override = (process.env.DNS_SERVERS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  const apply = (servers: string[]) => {
    try {
      dns.setServers(servers)
    } catch {
      /* тохируулж чадаагүй бол хэвээр нь үлдээнэ */
    }
    try {
      dns.promises.setServers(servers)
    } catch {
      /* тохируулж чадаагүй бол хэвээр нь үлдээнэ */
    }
  }

  if (override.length) {
    apply(override)
    return
  }

  // Зөвхөн SRV холболтод л хэрэгтэй.
  if (!uri!.startsWith('mongodb+srv://')) return

  try {
    // Драйверын ашигладаг promises resolver нь гол нь, гэхдээ хоёуланг нь шалгана.
    const current = [...dns.getServers(), ...dns.promises.getServers()]
    if (current.length === 0 || current.every(isLoopback)) {
      console.warn(
        `[mongodb] Node-ын DNS сервер ашиглах боломжгүй байна (${current.join(', ') || 'хоосон'}). ` +
          `Нийтийн DNS (${FALLBACK_DNS.join(', ')}) рүү шилжлээ. .env дотор DNS_SERVERS-ээр өөрчилж болно.`,
      )
      apply(FALLBACK_DNS)
    }
  } catch {
    // DNS тохиргоог уншиж чадахгүй бол хэвээр нь үлдээнэ.
  }
}

ensureUsableDnsServers()

// Dev горимд hot-reload бүрт шинэ холболт үүсэхээс сэргийлж global дээр кэшилнэ.
const globalForMongo = globalThis as unknown as {
  _mongoClientPromise?: Promise<MongoClient>
}

function connect(): Promise<MongoClient> {
  const promise = new MongoClient(uri!, { serverSelectionTimeoutMS: 10_000 }).connect()
  // Амжилтгүй холболтыг кэшлэвэл сервер дахин асаах хүртэл дахиж оролдохгүй болно.
  promise.catch(() => {
    if (globalForMongo._mongoClientPromise === promise) {
      globalForMongo._mongoClientPromise = undefined
    }
  })
  return promise
}

function clientPromise(): Promise<MongoClient> {
  const cached = globalForMongo._mongoClientPromise ?? connect()
  globalForMongo._mongoClientPromise = cached
  return cached
}

export async function getDb(): Promise<Db> {
  const client = await clientPromise()
  return client.db(dbName)
}

export default clientPromise
