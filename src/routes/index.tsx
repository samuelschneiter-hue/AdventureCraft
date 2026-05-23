import { Link, createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Sword, Shield, Gem, Droplets, Wind, Star, Coins,
  Check, MessageCircle, Banknote, Package, ChevronRight,
} from 'lucide-react'
import items, { type Rarity, type ItemType, rarityConfig, typeLabels } from '@/data/items'

export const Route = createFileRoute('/')({
  component: CatalogPage,
})

const typeIcons: Record<ItemType, React.ElementType> = {
  weapon:     Sword,
  armor:      Shield,
  accessory:  Gem,
  consumable: Droplets,
  mount:      Wind,
  pet:        Star,
}

const ALL_TYPES: Array<{ value: ItemType | 'all'; label: string }> = [
  { value: 'all',       label: 'Alle' },
  { value: 'pet',       label: 'Kuscheltiere' },
  { value: 'armor',     label: 'Hüte' },
  { value: 'accessory', label: 'Accessoires' },
  { value: 'weapon',    label: 'Waffen' },
  { value: 'mount',     label: 'Stiefel' },
]

const ACTIVE_RARITIES: Array<Rarity> = ['rare', 'epic', 'legendary', 'mythic']
const ALL_RARITIES: Array<Rarity | 'all'> = ['all', ...ACTIVE_RARITIES]

function ItemArt({ type, rarity, image, name }: { type: ItemType; rarity: Rarity; image: string; name: string }) {
  const cfg = rarityConfig[rarity]
  const Icon = typeIcons[type]
  const [imgFailed, setImgFailed] = useState(false)

  return (
    <div
      className="item-art"
      style={{
        background: `radial-gradient(circle at 50% 45%, ${cfg.bg} 0%, rgba(13,13,24,0.9) 70%)`,
        borderBottom: `1px solid ${cfg.border}`,
      }}
    >
      <div className="item-art-grid" />
      {!imgFailed ? (
        <img
          src={image}
          alt={name}
          className="item-art-img"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <div
          className="item-art-icon"
          style={{ filter: `drop-shadow(0 0 18px ${cfg.glow})` }}
        >
          <Icon size={56} color={cfg.color} strokeWidth={1.2} />
        </div>
      )}
      {(['tl','tr','bl','br'] as const).map(pos => (
        <div
          key={pos}
          className={`item-art-corner item-art-corner-${pos}`}
          style={{ borderColor: cfg.border }}
        />
      ))}
    </div>
  )
}

function CatalogPage() {
  const [activeType, setActiveType]     = useState<ItemType | 'all'>('all')
  const [activeRarity, setActiveRarity] = useState<Rarity | 'all'>('all')

  const filtered = items.filter(item => {
    const typeMatch   = activeType   === 'all' || item.type   === activeType
    const rarityMatch = activeRarity === 'all' || item.rarity === activeRarity
    return typeMatch && rarityMatch
  })

  return (
    <div>
      {/* Header */}
      <header className="catalog-header">
        <div className="catalog-eyebrow">
          <span>&#9670;</span>
          AdventureCraft — Offizieller Item-Shop
          <span>&#9670;</span>
        </div>
        <h1 className="catalog-title">
          <span>Item Shop</span>
        </h1>
        <p className="catalog-subtitle">
          Entdecke exklusive Kosmetik-Items — Pets, Hüte, Masken, Accessoires & Skins.
          Reiner Stil, kein Pay‑to‑Win.
        </p>
        <div className="catalog-meta">
          <span>{items.length} Items</span>
          <div className="catalog-meta-dot" />
          <span>4 Seltenheiten</span>
          <div className="catalog-meta-dot" />
          <span>Ab 1 CHF</span>
        </div>
      </header>

      <div className="catalog-divider" />

      {/* Sticky filter bar */}
      <div className="filter-bar">
        <div className="filter-bar-inner">
          {/* Type filters */}
          <div className="filter-group">
            <span className="filter-label">Typ</span>
            {ALL_TYPES.map(t => (
              <button
                key={t.value}
                onClick={() => setActiveType(t.value)}
                className={`filter-pill ${activeType === t.value ? 'active' : ''}`}
                style={activeType === t.value ? {
                  borderColor: 'rgba(139,111,255,0.5)',
                  color: '#c084fc',
                  background: 'rgba(139,111,255,0.1)',
                } : {}}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Rarity filters */}
          <div className="filter-group">
            <span className="filter-label">Seltenheit</span>
            <button
              onClick={() => setActiveRarity('all')}
              className={`filter-pill ${activeRarity === 'all' ? 'active' : ''}`}
              style={activeRarity === 'all' ? {
                borderColor: 'rgba(139,111,255,0.5)',
                color: '#c084fc',
                background: 'rgba(139,111,255,0.1)',
              } : {}}
            >
              Alle
            </button>
            {ACTIVE_RARITIES.map(r => {
              const cfg = rarityConfig[r]
              const isActive = activeRarity === r
              return (
                <button
                  key={r}
                  onClick={() => setActiveRarity(r)}
                  className="rarity-pip"
                  title={cfg.label}
                  style={{
                    borderColor: isActive ? cfg.color : cfg.border,
                    background:  isActive ? cfg.bg     : 'transparent',
                    color:       cfg.color,
                    boxShadow:   isActive ? `0 0 10px ${cfg.glow}` : 'none',
                    fontFamily:  'var(--font-mono)',
                    fontSize:    '9px',
                  }}
                >
                  {cfg.label[0]}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="results-info" style={{ marginTop: '28px' }}>
        {filtered.length === items.length
          ? `Alle ${items.length} Items`
          : `${filtered.length} von ${items.length} Items`}
      </div>

      {/* Grid */}
      <div className="items-grid">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-title">Keine Items gefunden</div>
            <div className="empty-state-sub">Filter anpassen, um mehr anzuzeigen</div>
          </div>
        ) : (
          filtered.map((item, index) => {
            const cfg = rarityConfig[item.rarity]
            return (
              <Link
                key={item.id}
                to="/products/$productId"
                params={{ productId: item.id.toString() }}
                className="item-card"
                style={{
                  animationDelay: `${index * 40}ms`,
                  '--hover-border': cfg.border,
                  '--hover-shadow': cfg.glow,
                } as React.CSSProperties}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = cfg.border
                  el.style.boxShadow = `0 8px 32px ${cfg.glow}, 0 0 0 1px ${cfg.border}`
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = ''
                  el.style.boxShadow = ''
                }}
              >
                <ItemArt type={item.type} rarity={item.rarity} image={item.image} name={item.name} />

                <div className="card-body">
                  <div className="card-rarity" style={{ color: cfg.color }}>
                    <div className="card-rarity-dot" style={{ background: cfg.color, boxShadow: `0 0 6px ${cfg.glow}` }} />
                    {item.rarity === 'legendary'
                      ? <span className="legendary-shimmer">{cfg.label}</span>
                      : item.rarity === 'mythic'
                      ? <span className="mythic-shimmer">{cfg.label}</span>
                      : cfg.label
                    }
                  </div>
                  <h3 className="card-name">{item.name}</h3>
                  <div className="card-footer">
                    <span className="card-type">{typeLabels[item.type]}</span>
                    <span className="card-price">
                      <Coins size={13} strokeWidth={1.5} />
                      {item.price.toFixed(2)} CHF
                    </span>
                  </div>
                </div>
              </Link>
            )
          })
        )}
      </div>

      {/* ── Twint Payment Section ──────────────────────────────────────────── */}
      <div className="twint-section">
        <div className="twint-inner">
          <div className="twint-eyebrow">
            <span>&#9670;</span>
            Bezahlung
            <span>&#9670;</span>
          </div>
          <h2 className="twint-title">So funktioniert's <span>(mit Twint)</span></h2>
          <p className="twint-subtitle">
            Einfach, schnell und sicher – in vier Schritten zum Item.
          </p>

          <div className="twint-steps">
            <div className="twint-step">
              <div className="twint-step-num">01</div>
              <div className="twint-step-icon-wrap"><MessageCircle size={20} /></div>
              <div>
                <div className="twint-step-title">Item auswählen</div>
                <div className="twint-step-text">Wähle ein Item aus und erstelle ein Support-Ticket im Discord</div>
              </div>
            </div>
            <ChevronRight size={16} className="twint-arrow" />
            <div className="twint-step">
              <div className="twint-step-num">02</div>
              <div className="twint-step-icon-wrap"><Coins size={20} /></div>
              <div>
                <div className="twint-step-title">Preis bestätigen</div>
                <div className="twint-step-text">Saemi_English nennt dir den Fixpreis in CHF</div>
              </div>
            </div>
            <ChevronRight size={16} className="twint-arrow" />
            <div className="twint-step">
              <div className="twint-step-num">03</div>
              <div className="twint-step-icon-wrap"><Banknote size={20} /></div>
              <div>
                <div className="twint-step-title">Twint-Code erhalten</div>
                <div className="twint-step-text">Du zahlst bequem mit der Twint-App</div>
              </div>
            </div>
            <ChevronRight size={16} className="twint-arrow" />
            <div className="twint-step">
              <div className="twint-step-num">04</div>
              <div className="twint-step-icon-wrap"><Package size={20} /></div>
              <div>
                <div className="twint-step-title">Lieferung ingame</div>
                <div className="twint-step-text">Sofort nach Zahlungseingang</div>
              </div>
            </div>
          </div>

          <div className="twint-badges">
            <div className="twint-badge">
              <Check size={14} className="twint-badge-icon" />
              Kein Account nötig
            </div>
            <div className="twint-badge">
              <Check size={14} className="twint-badge-icon" />
              Keine versteckten Gebühren
            </div>
            <div className="twint-badge">
              <Check size={14} className="twint-badge-icon" />
              Du erhältst das Item dauerhaft
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <div className="shop-footer">
        <span>Organisiert und Gehosted durch</span>
        <span className="shop-footer-name">Saemi_English+Team</span>
      </div>
    </div>
  )
}
