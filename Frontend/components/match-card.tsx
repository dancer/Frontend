import Image from "next/image"
import { Bookmark } from "lucide-react"

export default function MatchCard() {
  return (
    <div className="bg-zinc-800 rounded-lg overflow-hidden">
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-zinc-400">
            <div className="font-medium">UEFA Champions League</div>
            <div className="text-xs">Second leg | 1 of 4</div>
          </div>
          <div className="bg-red-500 text-white text-xs px-2 py-1 rounded">LIVE</div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 relative mb-2">
              <Image
                src="/placeholder.svg?height=48&width=48"
                alt="Real Madrid"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <div className="text-sm font-medium">Real Madrid</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold mb-1">2 : 2</div>
            <div className="text-xs text-zinc-400">56'</div>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 relative mb-2">
              <Image
                src="/placeholder.svg?height=48&width=48"
                alt="PSG"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <div className="text-sm font-medium">PSG</div>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded flex-1">
            BET
          </button>
          <button className="bg-zinc-700 hover:bg-zinc-600 text-white font-medium py-2 px-4 rounded flex-1">
            WATCH
          </button>
          <button className="bg-zinc-700 hover:bg-zinc-600 text-white p-2 rounded">
            <Bookmark className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-zinc-700 py-2 px-4 text-sm text-zinc-400">Match Details</div>
    </div>
  )
}

