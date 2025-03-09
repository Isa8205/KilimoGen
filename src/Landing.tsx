"use client"

import { useEffect, useState } from "react"
import { Leaf } from "lucide-react"
import Logo from "./pages/Widgets/Logo"

const loadingSteps = [
  "Initializing system...",
  "Fetching farm data...",
  "Analyzing crop conditions...",
  "Preparing dashboard...",
]

export default function LandingPage() {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval)
          return 100
        }
        return prevProgress + 1
      })
    }, 40) // 4000ms / 100 = 40ms per 1%

    const stepInterval = setInterval(() => {
      setCurrentStep((prevStep) => (prevStep + 1) % loadingSteps.length)
    }, 1000)

    const redirect = setTimeout(() => {
      window.location.href = "/home/dashboard"
    }, 4000)

    return () => {
      clearInterval(interval)
      clearInterval(stepInterval)
      clearTimeout(redirect)
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#EFEDE7]">
      <div className="text-center">
        <Logo />
        <h1 className="text-2xl font-bold text-[#22331D] mb-4">Kilimogen</h1>
        <div className="w-64 h-2 bg-[#6A6D69] rounded-full mb-4 overflow-hidden">
          <div
            className="h-full bg-[#F65A11] transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-[#22331D] mb-2">{progress}%</p>
        <p className="text-[#6A6D69]">{loadingSteps[currentStep]}</p>
      </div>
    </div>
  )
}


