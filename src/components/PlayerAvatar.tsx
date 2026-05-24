import Image from 'next/image'

interface Props {
  avatar: string
  size?: number
  className?: string
}

export function PlayerAvatar({ avatar, size = 32, className }: Props) {
  return (
    <Image
      src={`/player-avatars/${avatar}`}
      alt=""
      width={size}
      height={size}
      sizes={`${size}px`}
      draggable={false}
      className={className}
      style={{ objectFit: 'contain', display: 'inline-block' }}
    />
  )
}
