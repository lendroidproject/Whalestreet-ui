import { useState, useEffect } from 'react'

export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => {
      clearTimeout(handler)
    }
  }, [value])
  return debouncedValue
}

export function useTicker() {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now())
    }, 1000)
    return () => clearInterval(timer)
  }, [])
  return [now]
}

export function getDuration(start, end) {
  if (start >= end) return false
  let remaining = parseInt((end - start) / 1000)
  const seconds = `00${remaining % 60}`.slice(-2)
  remaining = (remaining - (remaining % 60)) / 60
  const mins = `00${remaining % 60}`.slice(-2)
  const hours = `00${(remaining - (remaining % 60)) / 60}`.slice(-2)
  return `${hours}:${mins}:${seconds}`
}
