interface CoinProps {
  /** true = 背（阳），false = 字（阴） */
  face: boolean
  flipping: boolean
  delay?: number
}

export default function Coin({ face, flipping, delay = 0 }: CoinProps) {
  return (
    <div
      className={`coin ${flipping ? 'coin-flip' : ''}`}
      style={flipping ? { animationDelay: `${delay}ms` } : undefined}
    >
      {!flipping && (
        <span className={`coin-face ${face ? 'coin-back' : 'coin-front'}`}>
          {face ? '背' : '字'}
        </span>
      )}
    </div>
  )
}
