import { Link, createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Sword, Shield, Gem, Droplets, Wind, Star, Coins, Info, ChevronLeft } from 'lucide-react'
import items, { type ItemType, type Rarity, rarityConfig, typeLabels } from '../../data/items'

export const Route = createFileRoute('/products/$productId')({
  component: ItemDetailPage,
  loader: ({ params }) => {
    const item = items.find(i => i.id === Number(params.productId))
    if (!item) throw new Error('Item not found')
    return item
  },
})

const typeIcons: Record<ItemType, React.ElementType> = {
  weapon:     Sword,
  armor:      Shield,
  accessory:  Gem,
  consumable: Droplets,
  mount:      Wind,
  pet:        Star,
}

function DetailArt({ type, rarity, image, name }: { type: ItemType; rarity: Rarity; image: string; name: string }) {
  const cfg = rarityConfig[rarity]
  const Icon = typeIcons[type]
  const [imgFailed, setImgFailed] = useState(false)

  return (
    <div
      className="detail-art"
      style={{
        background: `radial-gradient(circle at 50% 45%, ${cfg.bg} 0%, var(--bg-surface) 65%)`,
        border: `1px solid ${cfg.border}`,
        boxShadow: `0 0 60px ${cfg.glow}`,
      }}
    >
      <div className="detail-art-grid" />
      {(['tl','tr','bl','br'] as const).map(pos => (
        <div
          key={pos}
          className={`item-art-corner item-art-corner-${pos}`}
          style={{
            borderColor: cfg.color,
            width: '24px',
            height: '24px',
            opacity: 0.6,
          }}
        />
      ))}
      {!imgFailed ? (
        <img
          src={image}
          alt={name}
          className="detail-art-img"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <>
          <div style={{
            position: 'absolute',
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            border: `1px solid ${cfg.border}`,
            boxShadow: `0 0 40px ${cfg.glow}`,
            zIndex: 1,
          }} />
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              filter: `drop-shadow(0 0 30px ${cfg.glow}) drop-shadow(0 0 60px ${cfg.glow})`,
            }}
          >
            <Icon size={96} color={cfg.color} strokeWidth={1} />
          </div>
        </>
      )}
    </div>
  )
}

function ItemDetailPage() {
  const item = Route.useLoaderData()
  const cfg = rarityConfig[item.rarity]
  const statEntries = Object.entries(item.stats)

  return (
    <div className="detail-page">
      <Link to="/" className="detail-back">
        <ChevronLeft size={14} />
        Zurück zum Shop
      </Link>

      <div className="detail-layout">
        {/* Left — art */}
        <div>
          <DetailArt type={item.type} rarity={item.rarity} image={item.image} name={item.name} />
        </div>

        {/* Right — info */}
        <div>
          {/* Badges */}
          <div className="detail-badges">
            <div
              className="detail-badge"
              style={{
                color:       cfg.color,
                borderColor: cfg.border,
                background:  cfg.bg,
              }}
            >
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                background: cfg.color,
                boxShadow: `0 0 8px ${cfg.glow}`,
              }} />
              {item.rarity === 'legendary'
                ? <span className="legendary-shimmer">{cfg.label}</span>
                : item.rarity === 'mythic'
                ? <span className="mythic-shimmer">{cfg.label}</span>
                : cfg.label
              }
            </div>
            <div
              className="detail-badge"
              style={{
                color:       'var(--text-mid)',
                borderColor: 'var(--border)',
                background:  'transparent',
              }}
            >
              {typeLabels[item.type]}
            </div>
          </div>

          {/* Title */}
          <h1
            className="detail-title"
            style={{
              textShadow: item.rarity === 'legendary' || item.rarity === 'mythic'
                ? `0 0 30px ${cfg.glow}`
                : undefined,
            }}
          >
            {item.name}
          </h1>

          {/* Description */}
          <p className="detail-description">{item.description}</p>

          {/* Stats */}
          {statEntries.length > 0 && (
            <div className="stats-section">
              <div className="stats-title">Item Details</div>
              <div className="stats-grid">
                {statEntries.map(([key, value]) => (
                  <div key={key} className="stat-cell">
                    <div className="stat-key">{key}</div>
                    <div className="stat-value" style={{ color: cfg.color }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Price */}
          <div className="price-section">
            <div className="price-label">Shop-Preis</div>
            <div className="price-value">
              <Coins size={24} color={cfg.color} strokeWidth={1.5} />
              <span style={{ color: cfg.color }}>
                {item.price.toFixed(2)}
              </span>
              <span style={{ fontSize: '1rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                {item.currency}
              </span>
            </div>
          </div>

          {/* Info notice */}
          <div className="preview-notice">
            <Info size={14} className="preview-notice-icon" />
            <span>
              Alle Items sind <strong style={{ color: 'var(--text-bright)' }}>rein kosmetisch</strong> und
              haben keinen Einfluss auf das Gameplay. Bezahlung via Twint, Lieferung sofort nach
              Zahlungseingang. Preise in CHF, dauerhaft ans Account gebunden.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
