import { useState } from 'react';
import Icon from '@/components/ui/icon';

const COFFEE_IMG = 'https://cdn.poehali.dev/projects/30384ace-2599-49b8-baed-5d648f5f374c/files/2f401320-d26d-4a96-a648-e42208a3a47f.jpg';
const HIGHLAND_IMG = 'https://cdn.poehali.dev/projects/30384ace-2599-49b8-baed-5d648f5f374c/files/59aabe1e-24b5-4346-aa35-a1c477299035.jpg';
const CERAMIC_IMG = 'https://cdn.poehali.dev/projects/30384ace-2599-49b8-baed-5d648f5f374c/files/c42ac3cd-0a7e-4c8e-99e9-6934d43cfc06.jpg';

const products = [
  {
    id: 1,
    name: 'ETHIOPIA YIRGACHEFFE',
    origin: 'Эфиопия · Зона Гедео',
    altitude: '1800–2200 м',
    process: 'Мытый',
    roast: 'СВЕТЛАЯ',
    descriptors: ['◭', '◯', '△'],
    desc: 'Жасмин, бергамот, лимонный цвет',
    price: 890,
    image: COFFEE_IMG,
  },
  {
    id: 2,
    name: 'ETHIOPIA GUJI',
    origin: 'Эфиопия · Зона Гуджи',
    altitude: '1900–2100 м',
    process: 'Мытый',
    roast: 'СРЕДНЯЯ',
    descriptors: ['◭', '▽', '◯'],
    desc: 'Персик, чёрный чай, жасмин',
    price: 950,
    image: CERAMIC_IMG,
  },
  {
    id: 3,
    name: 'ETHIOPIA SIDAMO',
    origin: 'Эфиопия · Сидамо',
    altitude: '1700–2000 м',
    process: 'Натуральный',
    roast: 'СВЕТЛАЯ',
    descriptors: ['◯', '△', '◭'],
    desc: 'Черника, какао, карамель',
    price: 860,
    image: COFFEE_IMG,
  },
];

type CartItem = {
  id: number;
  name: string;
  weight: string;
  price: number;
  qty: number;
};

type Page = 'home' | 'catalog' | 'product' | 'ritual' | 'vault';

export default function Index() {
  const [page, setPage] = useState<Page>('home');
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [selectedWeight, setSelectedWeight] = useState('200 г');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [orderDone, setOrderDone] = useState(false);
  const [roastFilter, setRoastFilter] = useState<string>('ВСЕ');
  const [orderForm, setOrderForm] = useState({ name: '', phone: '', address: '' });

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const weightPrices: Record<string, number> = {
    '200 г': selectedProduct.price,
    '500 г': Math.round(selectedProduct.price * 2.2),
    '1000 г': Math.round(selectedProduct.price * 4),
  };

  function addToCart() {
    const item = {
      id: selectedProduct.id,
      name: selectedProduct.name,
      weight: selectedWeight,
      price: weightPrices[selectedWeight],
      qty: 1,
    };
    setCart(prev => {
      const ex = prev.find(i => i.id === item.id && i.weight === item.weight);
      if (ex) return prev.map(i => i.id === item.id && i.weight === item.weight ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, item];
    });
    setCartOpen(true);
  }

  function removeFromCart(id: number, weight: string) {
    setCart(prev => prev.filter(i => !(i.id === id && i.weight === weight)));
  }

  const filteredProducts = roastFilter === 'ВСЕ' ? products : products.filter(p => p.roast === roastFilter);

  const navigate = (p: Page) => { setPage(p); setMenuOpen(false); window.scrollTo(0, 0); };

  return (
    <div className="min-h-screen" style={{ background: 'var(--kaldy-ink)', color: 'var(--kaldy-cream)' }}>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-6" style={{ background: 'rgba(13,17,23,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(201,169,110,0.12)' }}>
        <button
          onClick={() => navigate('home')}
          className="font-cormorant text-2xl tracking-[0.3em] cursor-pointer bg-transparent border-none"
          style={{ color: 'var(--kaldy-gold)', fontWeight: 300 }}
        >
          КАЛДИ
        </button>

        <div className="hidden md:flex items-center gap-10">
          {(['catalog', 'ritual', 'vault'] as Page[]).map(p => (
            <button
              key={p}
              onClick={() => navigate(p)}
              className="font-montserrat text-xs tracking-[0.2em] transition-all duration-300 cursor-pointer bg-transparent border-none"
              style={{
                color: page === p ? 'var(--kaldy-gold)' : 'rgba(242,237,230,0.45)',
                fontWeight: 400,
              }}
            >
              {p === 'catalog' ? 'КАТАЛОГ' : p === 'ritual' ? 'РИТУАЛ' : 'ХРАНИЛИЩЕ'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <button onClick={() => setCartOpen(true)} className="relative cursor-pointer bg-transparent border-none p-0" style={{ color: 'var(--kaldy-gold)' }}>
            <Icon name="ShoppingBag" size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full flex items-center justify-center font-montserrat text-[9px]" style={{ background: 'var(--kaldy-terra)', color: 'var(--kaldy-cream)' }}>
                {cartCount}
              </span>
            )}
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)} className="flex flex-col gap-1.5 cursor-pointer bg-transparent border-none md:hidden">
            <span className="nav-line" />
            <span className="nav-line" />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center" style={{ background: 'rgba(13,17,23,0.97)' }}>
          {(['catalog', 'ritual', 'vault'] as Page[]).map(p => (
            <button
              key={p}
              onClick={() => navigate(p)}
              className="font-cormorant text-4xl tracking-[0.2em] mb-8 cursor-pointer bg-transparent border-none"
              style={{ color: 'var(--kaldy-gold)', fontWeight: 300 }}
            >
              {p === 'catalog' ? 'КАТАЛОГ' : p === 'ritual' ? 'РИТУАЛ' : 'ХРАНИЛИЩЕ'}
            </button>
          ))}
        </div>
      )}

      {/* CART OVERLAY */}
      <div
        onClick={() => setCartOpen(false)}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          zIndex: 999, opacity: cartOpen ? 1 : 0,
          pointerEvents: cartOpen ? 'all' : 'none',
          transition: 'opacity 0.5s ease'
        }}
      />

      {/* CART SIDEBAR */}
      <div
        style={{
          position: 'fixed', top: 0, right: cartOpen ? 0 : '-520px',
          width: '480px', maxWidth: '100vw', height: '100vh',
          background: 'var(--kaldy-indigo)',
          borderLeft: '1px solid rgba(201,169,110,0.2)',
          zIndex: 1000, transition: 'right 0.5s cubic-bezier(0.77,0,0.175,1)',
          overflowY: 'auto'
        }}
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-cormorant text-2xl tracking-[0.2em]" style={{ color: 'var(--kaldy-gold)' }}>ХРАНИЛИЩЕ</h2>
            <button onClick={() => setCartOpen(false)} style={{ color: 'var(--kaldy-gold)' }} className="cursor-pointer bg-transparent border-none">
              <Icon name="X" size={20} />
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-cormorant text-xl mb-2" style={{ color: 'rgba(201,169,110,0.4)' }}>Хранилище пусто</p>
              <p className="font-montserrat text-xs tracking-widest" style={{ color: 'rgba(242,237,230,0.3)' }}>Добавьте зерно в коллекцию</p>
            </div>
          ) : (
            <>
              <div className="space-y-6 mb-10">
                {cart.map(item => (
                  <div key={`${item.id}-${item.weight}`} className="flex items-center justify-between pb-6" style={{ borderBottom: '1px solid rgba(201,169,110,0.15)' }}>
                    <div>
                      <p className="font-cormorant text-sm tracking-widest mb-1" style={{ color: 'var(--kaldy-cream)' }}>{item.name}</p>
                      <p className="font-montserrat text-xs" style={{ color: 'rgba(201,169,110,0.6)' }}>{item.weight} · {item.qty} шт</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-cormorant text-lg" style={{ color: 'var(--kaldy-gold)' }}>{item.price * item.qty} ₽</span>
                      <button onClick={() => removeFromCart(item.id, item.weight)} style={{ color: 'rgba(201,169,110,0.4)' }} className="cursor-pointer bg-transparent border-none hover:opacity-70">
                        <Icon name="Trash2" size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className="font-montserrat text-xs tracking-widest" style={{ color: 'rgba(242,237,230,0.5)' }}>ИТОГО</span>
                <span className="font-cormorant text-2xl" style={{ color: 'var(--kaldy-gold)' }}>{cartTotal} ₽</span>
              </div>
              {cartTotal >= 3000 && (
                <p className="font-montserrat text-xs mb-4" style={{ color: 'rgba(201,169,110,0.6)' }}>Бесплатная доставка</p>
              )}

              {!orderDone ? (
                <div className="mt-8 space-y-4">
                  <p className="font-montserrat text-xs tracking-widest mb-4" style={{ color: 'rgba(242,237,230,0.4)' }}>ОФОРМЛЕНИЕ ЗАКАЗА</p>
                  <input
                    placeholder="Имя"
                    value={orderForm.name}
                    onChange={e => setOrderForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full bg-transparent py-3 font-montserrat text-sm outline-none placeholder:opacity-40"
                    style={{ borderBottom: '1px solid rgba(201,169,110,0.3)', color: 'var(--kaldy-cream)' }}
                  />
                  <input
                    placeholder="Телефон"
                    value={orderForm.phone}
                    onChange={e => setOrderForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full bg-transparent py-3 font-montserrat text-sm outline-none placeholder:opacity-40"
                    style={{ borderBottom: '1px solid rgba(201,169,110,0.3)', color: 'var(--kaldy-cream)' }}
                  />
                  <input
                    placeholder="Адрес доставки"
                    value={orderForm.address}
                    onChange={e => setOrderForm(f => ({ ...f, address: e.target.value }))}
                    className="w-full bg-transparent py-3 font-montserrat text-sm outline-none placeholder:opacity-40"
                    style={{ borderBottom: '1px solid rgba(201,169,110,0.3)', color: 'var(--kaldy-cream)' }}
                  />
                  <button
                    onClick={() => { if (orderForm.name && orderForm.phone) setOrderDone(true); }}
                    className="w-full py-4 mt-4 font-montserrat text-xs tracking-[0.2em] cursor-pointer border-none"
                    style={{ background: 'var(--kaldy-gold)', color: 'var(--kaldy-ink)' }}
                  >
                    ОФОРМИТЬ ЗАКАЗ
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="font-cormorant text-2xl mb-3" style={{ color: 'var(--kaldy-gold)' }}>Заказ принят</p>
                  <p className="font-montserrat text-xs tracking-widest" style={{ color: 'rgba(242,237,230,0.5)' }}>Мы свяжемся с вами в течение часа</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ─── HOME PAGE ─── */}
      {page === 'home' && (
        <>
          {/* HERO */}
          <section
            className="relative min-h-screen flex items-center overflow-hidden"
            style={{ background: 'var(--kaldy-mocha)' }}
          >
            {/* Texture / gradient overlay */}
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(ellipse at 25% 50%, rgba(164,119,100,0.3) 0%, transparent 55%), radial-gradient(ellipse at 75% 30%, rgba(60,35,20,0.6) 0%, transparent 50%)',
            }} />
            {/* Grain noise */}
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='0.05'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat', backgroundSize: '200px', zIndex: 1
            }} />

            {/* Left vertical title */}
            <div
              className="absolute z-10 flex"
              style={{ left: '60px', top: '50%', transform: 'translateY(-50%)', paddingTop: '80px' }}
            >
              <div style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}>
                <h1 className="font-cormorant animate-fade-up" style={{ fontSize: 'clamp(48px, 7vw, 100px)', color: 'var(--kaldy-gold)', fontWeight: 300, letterSpacing: '0.1em', lineHeight: 1 }}>
                  ПЕРВАЯ ЛЕГЕНДА О БОДРОСТИ
                </h1>
              </div>
            </div>

            {/* Center: Floating Grain Tower */}
            <div
              className="absolute z-10"
              style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)', paddingTop: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <div className="animate-float">
                <div style={{
                  width: '90px', height: '220px',
                  background: 'linear-gradient(160deg, #7A5040 0%, #3D2018 45%, #7A5040 100%)',
                  borderRadius: '6px', border: '1px solid rgba(201,169,110,0.45)',
                  position: 'relative', overflow: 'hidden',
                  boxShadow: '-12px 0 35px rgba(0,0,0,0.65), 12px 0 20px rgba(201,169,110,0.07), inset 0 0 25px rgba(0,0,0,0.35)'
                }}>
                  {[28, 56, 84, 112, 140, 170, 196].map((top, i) => (
                    <div key={i} style={{
                      position: 'absolute', left: '50%', top: `${top}px`,
                      transform: 'translateX(-50%)',
                      width: '40px', height: '5px',
                      background: 'rgba(25,45,25,0.9)', borderRadius: '3px',
                      boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.8)'
                    }}>
                      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: '5px', height: '5px', borderRadius: '50%', background: '#4a7c4a', opacity: 0.8 }} />
                    </div>
                  ))}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0.3) 0%, transparent 50%, rgba(201,169,110,0.04) 100%)' }} />
                </div>
              </div>
              <p
                className="font-montserrat animate-fade-up-delay"
                style={{ color: 'rgba(201,169,110,0.65)', fontSize: '10px', letterSpacing: '0.35em', marginTop: '28px' }}
              >
                Спешелти кофе из Эфиопии
              </p>
            </div>

            {/* Decorative vertical line right */}
            <div className="absolute z-10" style={{ right: '60px', top: '50%', transform: 'translateY(-50%)', width: '1px', height: '180px', background: 'linear-gradient(to bottom, transparent, rgba(201,169,110,0.5), transparent)' }} />

            {/* Bottom CTA */}
            <div className="absolute z-10" style={{ bottom: '64px', left: '50%', transform: 'translateX(-50%)' }}>
              <button
                onClick={() => navigate('catalog')}
                className="font-montserrat cursor-pointer animate-fade-up-delay-2"
                style={{
                  border: '1px solid var(--kaldy-gold)', color: 'var(--kaldy-gold)',
                  background: 'transparent', padding: '14px 48px',
                  fontSize: '11px', letterSpacing: '0.3em',
                  transition: 'all 0.4s ease'
                }}
                onMouseEnter={e => { const el = e.currentTarget; el.style.background = 'var(--kaldy-gold)'; el.style.color = 'var(--kaldy-ink)'; }}
                onMouseLeave={e => { const el = e.currentTarget; el.style.background = 'transparent'; el.style.color = 'var(--kaldy-gold)'; }}
              >
                ПЕРЕЙТИ В КАТАЛОГ
              </button>
            </div>
          </section>

          {/* ABOUT STRIP */}
          <section className="py-28 px-10 md:px-20" style={{ background: 'var(--kaldy-indigo)', borderTop: '1px solid rgba(201,169,110,0.12)' }}>
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-20 items-center">
              <div>
                <p className="font-montserrat text-xs tracking-[0.3em] mb-6" style={{ color: 'var(--kaldy-gold)' }}>О БРЕНДЕ</p>
                <h2 className="font-cormorant text-5xl mb-8 leading-tight" style={{ color: 'var(--kaldy-cream)', fontWeight: 300 }}>
                  Легенда рождается<br />в горах Эфиопии
                </h2>
                <p className="font-montserrat text-sm leading-8" style={{ color: 'rgba(242,237,230,0.55)' }}>
                  Калди — пастух, который открыл кофе. Его козы танцевали ночью после того, как поели красных ягод. Мы следуем этому пути — от конкретной фермы до вашей чашки.
                </p>
                <button
                  onClick={() => navigate('ritual')}
                  className="font-montserrat text-xs tracking-widest mt-10 cursor-pointer bg-transparent border-none"
                  style={{ color: 'var(--kaldy-gold)', borderBottom: '1px solid rgba(201,169,110,0.3)', paddingBottom: '2px' }}
                >
                  ЧИТАТЬ ИСТОРИЮ
                </button>
              </div>
              <div className="relative">
                <img src={HIGHLAND_IMG} alt="Эфиопское нагорье" className="w-full object-cover" style={{ height: '340px', filter: 'sepia(0.35) contrast(1.1)', border: '1px solid rgba(201,169,110,0.2)' }} />
                <div className="absolute" style={{ bottom: '-12px', right: '-12px', width: '100%', height: '100%', border: '1px solid rgba(201,169,110,0.18)', zIndex: -1 }} />
              </div>
            </div>
          </section>

          {/* PRODUCTS PREVIEW */}
          <section className="py-28 px-10 md:px-20" style={{ background: 'var(--kaldy-ink)' }}>
            <div className="max-w-6xl mx-auto">
              <div className="flex items-end justify-between mb-16">
                <div>
                  <p className="font-montserrat text-xs tracking-[0.3em] mb-4" style={{ color: 'var(--kaldy-gold)' }}>АКТУАЛЬНЫЙ ЗАВОЗ</p>
                  <h2 className="font-cormorant text-5xl" style={{ color: 'var(--kaldy-cream)', fontWeight: 300 }}>Лоты сезона</h2>
                </div>
                <button
                  onClick={() => navigate('catalog')}
                  className="font-montserrat text-xs tracking-[0.2em] cursor-pointer bg-transparent border-none"
                  style={{ color: 'var(--kaldy-gold)', borderBottom: '1px solid rgba(201,169,110,0.35)', paddingBottom: '2px' }}
                >
                  СМОТРЕТЬ ВСЕ
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {products.map((p, i) => (
                  <article
                    key={p.id}
                    onClick={() => { setSelectedProduct(p); navigate('product'); }}
                    className="cursor-pointer group"
                  >
                    <div className="relative overflow-hidden mb-5" style={{ border: '1px solid rgba(201,169,110,0.15)' }}>
                      <img
                        src={p.image} alt={p.name}
                        className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        style={{ height: '260px' }}
                      />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(13,17,23,0.85) 0%, transparent 55%)' }} />
                      <div className="absolute bottom-5 left-5 flex gap-3">
                        {p.descriptors.map((d, j) => (
                          <span key={j} style={{ color: 'var(--kaldy-gold)', fontSize: '18px' }}>{d}</span>
                        ))}
                      </div>
                      <div className="absolute top-3 right-3 font-montserrat" style={{ fontSize: '9px', background: 'rgba(13,17,23,0.75)', color: 'var(--kaldy-gold)', border: '1px solid rgba(201,169,110,0.25)', padding: '3px 8px', letterSpacing: '0.12em' }}>
                        {p.roast}
                      </div>
                    </div>
                    <p className="font-cormorant text-lg tracking-[0.15em] mb-1" style={{ color: 'var(--kaldy-cream)' }}>{p.name}</p>
                    <p className="font-montserrat text-xs mb-4" style={{ color: 'rgba(242,237,230,0.38)', fontSize: '11px' }}>{p.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-cormorant text-2xl" style={{ color: 'var(--kaldy-gold)' }}>{p.price} ₽</span>
                      <span className="font-montserrat" style={{ fontSize: '10px', letterSpacing: '0.2em', color: 'var(--kaldy-gold)', borderBottom: '1px solid rgba(201,169,110,0.3)', paddingBottom: '1px' }}>
                        ПОДРОБНЕЕ
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ─── CATALOG PAGE ─── */}
      {page === 'catalog' && (
        <section className="pt-36 pb-28 px-10 md:px-20 min-h-screen" style={{ background: 'var(--kaldy-indigo)' }}>
          <div className="max-w-6xl mx-auto">
            <div className="mb-16">
              <p className="font-montserrat text-xs tracking-[0.3em] mb-4" style={{ color: 'var(--kaldy-gold)' }}>ТЕКУЩИЙ АССОРТИМЕНТ</p>
              <h1 className="font-cormorant" style={{ fontSize: 'clamp(48px,6vw,80px)', color: 'var(--kaldy-cream)', fontWeight: 300 }}>Каталог зерна</h1>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-12">
              <span className="font-montserrat text-xs tracking-[0.2em] mr-2" style={{ color: 'rgba(201,169,110,0.5)', fontSize: '10px' }}>ОБЖАРКА:</span>
              {['ВСЕ', 'СВЕТЛАЯ', 'СРЕДНЯЯ', 'ТЁМНАЯ'].map(r => (
                <button
                  key={r}
                  onClick={() => setRoastFilter(r)}
                  className="font-montserrat cursor-pointer border-none"
                  style={{
                    fontSize: '10px', letterSpacing: '0.15em', padding: '6px 14px',
                    border: '1px solid rgba(201,169,110,0.3)',
                    color: roastFilter === r ? 'var(--kaldy-ink)' : 'rgba(201,169,110,0.6)',
                    background: roastFilter === r ? 'var(--kaldy-gold)' : 'transparent',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {filteredProducts.map(p => (
                <article
                  key={p.id}
                  className="cursor-pointer group"
                  style={{ background: 'var(--kaldy-terra)', borderRadius: '3px', overflow: 'hidden', boxShadow: 'inset 0 1px 0 rgba(201,169,110,0.12), inset 0 -1px 0 rgba(0,0,0,0.25), 0 6px 24px rgba(0,0,0,0.35)' }}
                  onClick={() => { setSelectedProduct(p); navigate('product'); }}
                >
                  <div className="relative overflow-hidden" style={{ height: '280px' }}>
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(13,17,23,0.92) 0%, rgba(13,17,23,0.15) 55%)' }} />
                    <div className="absolute bottom-5 left-5 flex gap-3">
                      {p.descriptors.map((d, j) => (
                        <span key={j} style={{ color: 'var(--kaldy-gold)', fontSize: '20px' }}>{d}</span>
                      ))}
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="font-cormorant text-xl tracking-[0.12em] mb-1" style={{ color: 'var(--kaldy-cream)' }}>{p.name}</p>
                    <p className="font-montserrat mb-5" style={{ color: 'rgba(242,237,230,0.45)', fontSize: '10px', letterSpacing: '0.08em' }}>{p.altitude} · {p.process}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-cormorant text-2xl" style={{ color: 'var(--kaldy-gold-light)' }}>{p.price} ₽ / 200 г</span>
                      <span className="font-montserrat" style={{ fontSize: '10px', letterSpacing: '0.18em', color: 'rgba(242,237,230,0.65)', borderBottom: '1px solid rgba(242,237,230,0.25)', paddingBottom: '1px' }}>
                        УЗНАТЬ ПОДРОБНЕЕ
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── PRODUCT PAGE ─── */}
      {page === 'product' && (
        <section className="min-h-screen" style={{ background: 'var(--kaldy-ink)', paddingTop: '80px' }}>
          <div className="grid md:grid-cols-2 min-h-screen">
            {/* Left: image */}
            <div className="relative overflow-hidden" style={{ minHeight: '70vh', background: 'var(--kaldy-indigo)' }}>
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" style={{ minHeight: '70vh', display: 'block' }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(13,17,23,0.45) 0%, transparent 55%)' }} />
              <button
                onClick={() => navigate('catalog')}
                className="absolute flex items-center gap-2 font-montserrat cursor-pointer bg-transparent border-none"
                style={{ top: '28px', left: '28px', color: 'rgba(201,169,110,0.65)', fontSize: '10px', letterSpacing: '0.2em' }}
              >
                <Icon name="ArrowLeft" size={14} />
                КАТАЛОГ
              </button>
            </div>

            {/* Right: details */}
            <div className="flex flex-col justify-center px-14 py-20" style={{ background: 'var(--kaldy-opal)' }}>
              <p className="font-montserrat mb-6" style={{ color: 'var(--kaldy-terra)', fontSize: '10px', letterSpacing: '0.3em' }}>{selectedProduct.roast} ОБЖАРКА</p>
              <h1 className="font-cormorant mb-10 leading-tight" style={{ color: 'var(--kaldy-ink)', fontWeight: 400, fontSize: 'clamp(32px,3.5vw,52px)' }}>
                {selectedProduct.name}
              </h1>

              <div className="space-y-4 mb-10 pb-8" style={{ borderTop: '1px solid rgba(90,55,40,0.18)', paddingTop: '28px' }}>
                {[
                  ['Происхождение', selectedProduct.origin],
                  ['Высота', selectedProduct.altitude],
                  ['Обработка', selectedProduct.process],
                ].map(([label, val]) => (
                  <div key={label} className="flex items-baseline gap-6">
                    <span className="font-montserrat w-32" style={{ fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(29,36,48,0.38)' }}>{label}</span>
                    <span className="font-montserrat text-sm" style={{ color: 'var(--kaldy-ink)' }}>{val}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4 mb-10">
                {selectedProduct.descriptors.map((d, i) => (
                  <span key={i} style={{ color: 'var(--kaldy-gold)', fontSize: '24px' }}>{d}</span>
                ))}
                <span className="font-montserrat text-sm ml-2" style={{ color: 'rgba(29,36,48,0.55)' }}>{selectedProduct.desc}</span>
              </div>

              <div className="mb-10">
                <p className="font-montserrat mb-4" style={{ fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(29,36,48,0.38)' }}>ОБЪЁМ</p>
                <div className="flex gap-3 flex-wrap">
                  {['200 г', '500 г', '1000 г'].map(w => (
                    <button
                      key={w}
                      onClick={() => setSelectedWeight(w)}
                      className="font-montserrat cursor-pointer transition-all duration-300"
                      style={{
                        fontSize: '11px', letterSpacing: '0.1em', padding: '8px 18px',
                        border: '1px solid',
                        borderColor: selectedWeight === w ? 'var(--kaldy-terra)' : 'rgba(90,55,40,0.35)',
                        background: selectedWeight === w ? 'var(--kaldy-terra)' : 'transparent',
                        color: selectedWeight === w ? 'var(--kaldy-cream)' : 'var(--kaldy-terra)',
                      }}
                    >
                      {w}
                    </button>
                  ))}
                </div>
                <p className="font-cormorant mt-5" style={{ fontSize: '36px', color: 'var(--kaldy-ink)', fontWeight: 400 }}>
                  {weightPrices[selectedWeight]} ₽
                </p>
              </div>

              <button
                onClick={addToCart}
                className="font-montserrat cursor-pointer mb-4 transition-all duration-300 border-none"
                style={{ background: 'var(--kaldy-ink)', color: 'var(--kaldy-gold)', padding: '18px', fontSize: '11px', letterSpacing: '0.25em' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#111518'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--kaldy-ink)'; }}
              >
                ДОБАВИТЬ В ХРАНИЛИЩЕ
              </button>
              <p className="font-montserrat text-center" style={{ fontSize: '11px', color: 'rgba(29,36,48,0.35)' }}>
                Бесплатная доставка при заказе от 3 000 ₽
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ─── RITUAL PAGE ─── */}
      {page === 'ritual' && (
        <div className="min-h-screen">
          {/* Stripe 1 */}
          <div className="relative flex items-center justify-center overflow-hidden" style={{ minHeight: '100vh' }}>
            <img src={HIGHLAND_IMG} alt="Эфиопское нагорье" className="absolute inset-0 w-full h-full object-cover" style={{ filter: 'grayscale(1) contrast(1.1) brightness(0.45)' }} />
            <div className="relative z-10 text-center px-10 max-w-3xl">
              <p className="font-montserrat mb-8" style={{ color: 'rgba(201,169,110,0.55)', fontSize: '10px', letterSpacing: '0.4em' }}>ФИЛОСОФИЯ · КАЛДИ</p>
              <blockquote className="font-cormorant leading-relaxed" style={{ color: 'var(--kaldy-cream)', fontWeight: 300, fontSize: 'clamp(26px,3.5vw,48px)' }}>
                «КОФЕ — ЭТО НЕ НАПИТОК<br />БОДРОСТИ. ЭТО НАПИТОК<br />ЯСНОСТИ УМА»
              </blockquote>
              <div className="mt-12 mx-auto" style={{ width: '48px', height: '1px', background: 'var(--kaldy-gold)' }} />
            </div>
          </div>

          {/* Stripe 2: Kaldi legend */}
          <div className="py-28 px-10 md:px-20 relative overflow-hidden" style={{ background: 'var(--kaldy-mocha)' }}>
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
              <div>
                <svg viewBox="0 0 220 220" className="w-full max-w-xs mx-auto" fill="none" stroke="var(--kaldy-gold)" strokeWidth="0.7" opacity="0.65">
                  <ellipse cx="95" cy="130" rx="48" ry="30" />
                  <ellipse cx="148" cy="122" rx="24" ry="20" />
                  <line x1="123" y1="122" x2="136" y2="122" />
                  <line x1="62" y1="160" x2="57" y2="185" />
                  <line x1="78" y1="160" x2="73" y2="185" />
                  <line x1="105" y1="160" x2="100" y2="185" />
                  <line x1="122" y1="158" x2="117" y2="185" />
                  <line x1="143" y1="105" x2="137" y2="82" />
                  <line x1="147" y1="105" x2="154" y2="80" />
                  <circle cx="153" cy="118" r="3.5" />
                  <line x1="95" y1="100" x2="80" y2="74" />
                  <ellipse cx="60" cy="44" rx="9" ry="14" transform="rotate(-22 60 44)" />
                </svg>
              </div>
              <div>
                <p className="font-montserrat mb-6" style={{ color: 'rgba(242,237,230,0.45)', fontSize: '10px', letterSpacing: '0.3em' }}>ЛЕГЕНДА · IX ВЕК</p>
                <h2 className="font-cormorant text-4xl mb-8" style={{ color: 'var(--kaldy-cream)', fontWeight: 300 }}>История Калди</h2>
                <div className="grid grid-cols-2 gap-6">
                  <p className="font-montserrat text-xs leading-7" style={{ color: 'rgba(242,237,230,0.6)' }}>
                    По преданию, эфиопский пастух Калди заметил, что его козы не спят по ночам и танцуют после того, как поедят ягоды с определённого дерева.
                  </p>
                  <p className="font-montserrat text-xs leading-7" style={{ color: 'rgba(242,237,230,0.6)' }}>
                    Он рассказал об этом настоятелю монастыря, который сварил отвар из ягод и обнаружил, что тот помогает бодрствовать в ночных молитвах. Так родилась традиция кофе.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stripe 3: Gallery */}
          <div className="py-28 px-10 md:px-20" style={{ background: 'var(--kaldy-indigo)' }}>
            <div className="max-w-6xl mx-auto">
              <p className="font-montserrat mb-16 text-center" style={{ color: 'var(--kaldy-gold)', fontSize: '10px', letterSpacing: '0.4em' }}>ПРОСТРАНСТВО</p>
              <div className="grid md:grid-cols-3 gap-6">
                {[HIGHLAND_IMG, COFFEE_IMG, CERAMIC_IMG].map((img, i) => (
                  <div key={i} className="overflow-hidden" style={{ height: '340px', border: '1px solid rgba(201,169,110,0.12)' }}>
                    <img
                      src={img} alt=""
                      className="photo-sepia w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contacts */}
          <div className="py-20 px-10 text-center" style={{ background: 'var(--kaldy-ink)', borderTop: '1px solid rgba(201,169,110,0.12)' }}>
            <p className="font-montserrat mb-8" style={{ color: 'rgba(201,169,110,0.45)', fontSize: '10px', letterSpacing: '0.4em' }}>КОНТАКТЫ</p>
            <p className="font-cormorant text-3xl mb-4" style={{ color: 'var(--kaldy-gold)', fontWeight: 300 }}>hello@kaldi.coffee</p>
            <p className="font-montserrat" style={{ color: 'rgba(242,237,230,0.28)', fontSize: '10px', letterSpacing: '0.2em' }}>Москва · Время ответа 24 часа</p>
          </div>
        </div>
      )}

      {/* ─── VAULT PAGE ─── */}
      {page === 'vault' && (
        <section className="min-h-screen pt-36 pb-28 px-10 md:px-20" style={{ background: 'var(--kaldy-terra)' }}>
          <div className="max-w-6xl mx-auto">
            <div className="mb-16">
              <p className="font-montserrat mb-4" style={{ color: 'rgba(242,237,230,0.45)', fontSize: '10px', letterSpacing: '0.3em' }}>ЛИЧНЫЙ КАБИНЕТ</p>
              <h1 className="font-cormorant" style={{ fontSize: 'clamp(48px,6vw,80px)', color: 'var(--kaldy-cream)', fontWeight: 300 }}>МОЁ ХРАНИЛИЩЕ</h1>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              {/* Shelf */}
              <div className="md:col-span-2">
                <p className="font-montserrat mb-8" style={{ color: 'rgba(242,237,230,0.38)', fontSize: '10px', letterSpacing: '0.2em' }}>АКТИВНЫЕ ЛОТЫ</p>
                <div className="relative pb-20">
                  <div className="absolute" style={{ bottom: '80px', left: 0, right: 0, height: '1px', background: 'rgba(242,237,230,0.18)' }} />
                  <div className="flex gap-8 items-end">
                    {(cart.length > 0 ? cart : products).map((item, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div style={{
                          width: '64px', height: '100px',
                          background: 'linear-gradient(160deg, #3D2318 0%, #1a0f0a 50%, #3D2318 100%)',
                          borderRadius: '4px 4px 0 0',
                          border: '1px solid rgba(201,169,110,0.4)',
                          position: 'relative'
                        }}>
                          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '10px', background: 'rgba(201,169,110,0.18)', borderBottom: '1px solid rgba(201,169,110,0.28)' }} />
                        </div>
                        <p className="font-montserrat mt-2 text-center" style={{ fontSize: '9px', color: 'var(--kaldy-gold)', letterSpacing: '0.08em', maxWidth: '65px', lineHeight: 1.4 }}>
                          {'name' in item ? item.name.split(' ').slice(-1)[0] : (item as typeof products[0]).name.split(' ').slice(-1)[0]}
                          <br />
                          {'weight' in item ? (item as CartItem).weight : '500 г'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => navigate('catalog')}
                  className="flex items-center gap-4 cursor-pointer group bg-transparent border-none"
                  style={{ marginTop: '8px' }}
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-105" style={{ background: 'var(--kaldy-ink)', border: '1px solid rgba(201,169,110,0.35)' }}>
                    <span style={{ color: 'var(--kaldy-gold)', fontSize: '16px' }}>◉</span>
                  </div>
                  <span className="font-montserrat" style={{ fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(242,237,230,0.55)' }}>ПОПОЛНИТЬ ЗАПАСЫ</span>
                </button>
              </div>

              {/* Order history */}
              <div style={{ background: 'rgba(13,17,23,0.28)', border: '1px solid rgba(242,237,230,0.1)', padding: '28px' }}>
                <p className="font-montserrat mb-6" style={{ color: 'rgba(242,237,230,0.38)', fontSize: '10px', letterSpacing: '0.2em' }}>ИСТОРИЯ · ФОРМУЛЯР</p>
                <div className="space-y-4">
                  {[
                    { date: '28.04.2026', name: 'YIRGACHEFFE', note: 'выдано' },
                    { date: '15.04.2026', name: 'GUJI', note: 'выдано' },
                    { date: '01.04.2026', name: 'SIDAMO', note: 'выдано' },
                    { date: '18.03.2026', name: 'YIRGACHEFFE', note: 'выдано' },
                  ].map((rec, i) => (
                    <div key={i} className="flex items-baseline justify-between pb-3" style={{ borderBottom: '1px solid rgba(242,237,230,0.07)' }}>
                      <div>
                        <p className="font-montserrat" style={{ color: 'rgba(242,237,230,0.3)', fontSize: '9px', letterSpacing: '0.08em' }}>{rec.date}</p>
                        <p className="font-cormorant text-sm tracking-widest mt-0.5" style={{ color: 'var(--kaldy-cream)' }}>{rec.name}</p>
                      </div>
                      <span className="font-montserrat" style={{ color: 'rgba(201,169,110,0.45)', fontSize: '10px', fontStyle: 'italic', letterSpacing: '0.1em' }}>{rec.note}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-5 text-center" style={{ borderTop: '1px solid rgba(201,169,110,0.18)' }}>
                  <p style={{ color: 'rgba(201,169,110,0.38)', fontSize: '13px', letterSpacing: '0.25em' }}>◯ △ ◭</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer
        className="py-10 px-10 md:px-20 flex flex-col md:flex-row items-center justify-between"
        style={{ background: 'var(--kaldy-ink)', borderTop: '1px solid rgba(201,169,110,0.1)' }}
      >
        <p className="font-cormorant text-xl tracking-[0.3em]" style={{ color: 'var(--kaldy-gold)', fontWeight: 300 }}>КАЛДИ</p>
        <p className="font-montserrat mt-3 md:mt-0" style={{ color: 'rgba(242,237,230,0.18)', fontSize: '10px', letterSpacing: '0.2em' }}>
          СПЕШЕЛТИ КОФЕ · ЭФИОПИЯ · {new Date().getFullYear()}
        </p>
        <div className="flex gap-3 mt-3 md:mt-0">
          {['◭', '△', '◯'].map((s, i) => (
            <span key={i} style={{ color: 'rgba(201,169,110,0.28)', fontSize: '11px' }}>{s}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}
