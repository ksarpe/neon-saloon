'use client'

export function PulsingDots({ color }: { color: string }) {
  return (
    <div className="flex justify-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-2 w-2 rounded-full"
          style={{
            backgroundColor: color,
            animation: `pulsing-dot 1.4s ease-in-out ${i * 0.25}s infinite`,
          }}
        />
      ))}
    </div>
  )
}
