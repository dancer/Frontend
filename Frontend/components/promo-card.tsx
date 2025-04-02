import Image from "next/image"

export default function PromoCard() {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-green-400 rounded-lg overflow-hidden">
      <div className="flex items-center p-6">
        <div className="flex-1 pr-4">
          <h3 className="text-2xl font-bold text-white mb-2">Win $50 000 with a free prediction</h3>
          <p className="text-white/90 text-sm mb-4">
            Predict the first goal of two different teams in two selected matches and win up to $50 000.
          </p>
          <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded text-sm">
            MORE DETAILS
          </button>
        </div>
        <div className="relative h-40 w-32 hidden md:block">
          <Image
            src="/placeholder.svg?height=160&width=128"
            alt="Football player"
            width={128}
            height={160}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  )
}

