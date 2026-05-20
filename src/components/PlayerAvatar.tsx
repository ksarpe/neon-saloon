interface Props {
  avatar: string
  size?: number
  className?: string
}

export function PlayerAvatar({ avatar, size = 32, className }: Props) {
  return (
    <img
      src={`/player-avatars/${avatar}`}
      alt=""
      width={size}
      height={size}
      draggable={false}
      className={className}
      style={{ objectFit: 'contain', display: 'inline-block' }}
    />
  )
}
