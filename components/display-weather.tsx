'use client'

import { useEffect, useState } from 'react'
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Sun,
  CloudSun,
  type LucideIcon,
} from 'lucide-react'

// Улаанбаатар хотын байршил
const LATITUDE = 47.9187
const LONGITUDE = 106.9176

type WeatherState = {
  temperature: number
  code: number
} | null

// WMO цаг агаарын кодыг Монгол тайлбар + icon руу хөрвүүлэх
function describeWeather(code: number): { label: string; Icon: LucideIcon } {
  if (code === 0) return { label: 'Цэлмэг', Icon: Sun }
  if (code === 1 || code === 2) return { label: 'Багавтар үүлтэй', Icon: CloudSun }
  if (code === 3) return { label: 'Үүлэрхэг', Icon: Cloud }
  if (code === 45 || code === 48) return { label: 'Манантай', Icon: CloudFog }
  if (code >= 51 && code <= 57) return { label: 'Шиврээ бороо', Icon: CloudDrizzle }
  if (code >= 61 && code <= 67) return { label: 'Бороотой', Icon: CloudRain }
  if (code >= 71 && code <= 77) return { label: 'Цастай', Icon: CloudSnow }
  if (code >= 80 && code <= 82) return { label: 'Аадар бороо', Icon: CloudRain }
  if (code >= 85 && code <= 86) return { label: 'Их цас', Icon: CloudSnow }
  if (code >= 95) return { label: 'Аянга цахилгаан', Icon: CloudLightning }
  return { label: 'Тодорхойгүй', Icon: Cloud }
}

export function DisplayWeather() {
  const [weather, setWeather] = useState<WeatherState>(null)

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${LATITUDE}&longitude=${LONGITUDE}&current=temperature_2m,weather_code`,
        )
        if (!res.ok) return
        const data = await res.json()
        if (!active || !data?.current) return
        setWeather({
          temperature: Math.round(data.current.temperature_2m),
          code: data.current.weather_code,
        })
      } catch {
        // Сүлжээний алдааг чимээгүй алгасах — самбар үргэлжлэн ажиллана
      }
    }

    load()
    // 10 минут тутам шинэчлэх
    const timer = setInterval(load, 10 * 60 * 1000)
    return () => {
      active = false
      clearInterval(timer)
    }
  }, [])

  if (!weather) {
    return (
      <div className="flex items-center gap-2 text-primary-foreground/70">
        <Cloud className="h-6 w-6 md:h-8 md:w-8" aria-hidden />
        <span className="text-sm md:text-base">Улаанбаатар</span>
      </div>
    )
  }

  const { label, Icon } = describeWeather(weather.code)

  return (
    <div className="flex items-center gap-2 md:gap-3">
      <Icon className="h-7 w-7 md:h-9 md:w-9" aria-hidden />
      <div className="flex flex-col items-start leading-tight">
        <span className="text-xl font-bold tabular-nums md:text-2xl lg:text-3xl">
          {weather.temperature}°C
        </span>
        <span className="text-xs text-primary-foreground/80 md:text-sm">
          Улаанбаатар · {label}
        </span>
      </div>
    </div>
  )
}
