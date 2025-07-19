import Image from "next/image"

export function Logo() {
  return (
    <div className="relative w-24 h-24">
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo%20sdfm-gDlxg0zxe6wVV9o5cISteykVa4LQhz.png"
        alt="SDFM 2520"
        fill
        className="object-contain"
        priority
      />
    </div>
  )
}
