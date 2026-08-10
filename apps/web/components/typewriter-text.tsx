"use client"

import { useEffect, useState } from "react"

const phrases = [
  "just a prompt.",
  "your words.",
  "a single sentence.",
  "one idea.",
  "a feeling.",
]

export function TypewriterText() {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [text, setText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const current = phrases[phraseIndex] ?? ""
    const speed = isDeleting ? 50 : 100

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setText(current.slice(0, text.length + 1))
        if (text.length + 1 === current.length) {
          setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        setText(current.slice(0, text.length - 1))
        if (text.length === 0) {
          setIsDeleting(false)
          setPhraseIndex((prev) => (prev + 1) % phrases.length)
        }
      }
    }, speed)

    return () => clearTimeout(timeout)
  }, [text, isDeleting, phraseIndex])

  return (
    <span className="block bg-gradient-to-r from-primary via-violet-500 to-blue-500 bg-clip-text text-transparent animate-gradient-shift md:text-8xl">
      {text}
      <span className="animate-blink text-primary">|</span>
    </span>
  )
}
