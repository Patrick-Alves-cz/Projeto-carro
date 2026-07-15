import { useEffect, useState } from 'react'

const SIZE = 220
const CENTER = SIZE / 2
const RADIUS = 88
const START_ANGLE = -120 // degrees, left tick
const END_ANGLE = 120 // degrees, right tick

function polar(angleDeg, radius = RADIUS) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return {
    x: CENTER + radius * Math.cos(rad),
    y: CENTER + radius * Math.sin(rad),
  }
}

function arcPath(startDeg, endDeg, radius = RADIUS) {
  const start = polar(startDeg, radius)
  const end = polar(endDeg, radius)
  const largeArc = endDeg - startDeg > 180 ? 1 : 0
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`
}

const TICKS = 9

export default function FleetGauge({ percent = 0, label = 'Utilização da frota', sublabel }) {
  const clamped = Math.min(100, Math.max(0, percent))
  const [animatedAngle, setAnimatedAngle] = useState(START_ANGLE)

  useEffect(() => {
    const target = START_ANGLE + (clamped / 100) * (END_ANGLE - START_ANGLE)
    const raf = requestAnimationFrame(() => setAnimatedAngle(target))
    return () => cancelAnimationFrame(raf)
  }, [clamped])

  const needleTip = polar(animatedAngle, RADIUS - 18)

  const zoneColor = clamped >= 70 ? '#3FA772' : clamped >= 40 ? '#C9A961' : '#C9524F'

  return (
    <div className="flex flex-col items-center">
      <svg width={SIZE} height={SIZE * 0.72} viewBox={`0 0 ${SIZE} ${SIZE * 0.78}`}>
        {/* Track */}
        <path
          d={arcPath(START_ANGLE, END_ANGLE)}
          fill="none"
          stroke="#212127"
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* Value arc */}
        <path
          d={arcPath(START_ANGLE, animatedAngle)}
          fill="none"
          stroke={zoneColor}
          strokeWidth="10"
          strokeLinecap="round"
          style={{ transition: 'all 0.9s cubic-bezier(0.22,1,0.36,1)' }}
        />
        {/* Ticks */}
        {Array.from({ length: TICKS }).map((_, i) => {
          const angle = START_ANGLE + (i / (TICKS - 1)) * (END_ANGLE - START_ANGLE)
          const inner = polar(angle, RADIUS - 15)
          const outer = polar(angle, RADIUS - 6)
          return (
            <line
              key={i}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke="#3D3D46"
              strokeWidth="1.5"
            />
          )
        })}
        {/* Needle */}
        <line
          x1={CENTER}
          y1={CENTER}
          x2={needleTip.x}
          y2={needleTip.y}
          stroke="#C9A961"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ transition: 'all 0.9s cubic-bezier(0.22,1,0.36,1)' }}
        />
        <circle cx={CENTER} cy={CENTER} r="5" fill="#C9A961" />
        <circle cx={CENTER} cy={CENTER} r="9" fill="none" stroke="#8A6A2E" strokeWidth="1" />

        <text
          x={CENTER}
          y={CENTER - 26}
          textAnchor="middle"
          className="font-mono"
          fontSize="26"
          fontWeight="600"
          fill="#F3F3F1"
        >
          {Math.round(clamped)}%
        </text>
      </svg>
      <p className="-mt-1 text-[12.5px] font-medium text-mist-200">{label}</p>
      {sublabel && <p className="text-[11.5px] text-mist-400">{sublabel}</p>}
    </div>
  )
}
