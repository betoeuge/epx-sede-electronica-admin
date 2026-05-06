'use client';

import { useState, useEffect } from 'react';
import { Clock, Eye, FileText, Globe2, Palette, ShieldCheck } from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner';

// ── Constants ────────────────────────────────────────────────────────────────

const ACTIVITY_TYPES = {
  all:     { label: 'Todo',        icon: Clock },
  content: { label: 'Contenido',   icon: FileText },
  design:  { label: 'Diseño',      icon: Palette },
  publish: { label: 'Publicación', icon: Globe2 },
  access:  { label: 'Acceso',      icon: ShieldCheck },
};

const TYPE_ACCENTS = {
  content: '#56CCF2',
  design:  '#BB86FC',
  publish: '#6FCF97',
  access:  '#F2C94C',
};

// ── Time helpers ─────────────────────────────────────────────────────────────

function formatRelativeTime(isoDate) {
  if (!isoDate) return '';
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1)  return 'Ahora';
  if (minutes < 60) return `Hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24)   return `Hace ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 7)     return `Hace ${days} d`;
  return new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: '2-digit', year: '2-digit' }).format(new Date(isoDate));
}

function getDateGroup(isoDate) {
  if (!isoDate) return 'Antes';
  const diff = Date.now() - new Date(isoDate).getTime();
  const hours = diff / 3600000;
  if (hours < 24)  return 'Hoy';
  if (hours < 48)  return 'Ayer';
  if (hours < 168) return 'Esta semana';
  return 'Antes';
}

// ── Sub-components ───────────────────────────────────────────────────────────

function ActorAvatar({ name }) {
  const initials = (name ?? '?')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
  return (
    <div style={{
      width: '2rem', height: '2rem', borderRadius: '50%', flexShrink: 0,
      background: 'linear-gradient(135deg, rgba(86,204,242,0.9), rgba(111,207,151,0.9))',
      color: '#071015', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '0.6875rem', fontWeight: 800,
    }}>
      {initials}
    </div>
  );
}

function ActivityItem({ entry }) {
  const typeKey = entry.type ?? 'content';
  const TypeIcon = ACTIVITY_TYPES[typeKey]?.icon ?? Clock;
  const accent = TYPE_ACCENTS[typeKey] ?? '#56CCF2';
  const typeLabel = ACTIVITY_TYPES[typeKey]?.label ?? typeKey;

  return (
    <article style={{
      display: 'grid', gridTemplateColumns: '2rem 1fr auto', gap: '0.875rem',
      alignItems: 'start', padding: '1rem 0', borderBottom: '1px solid #2d2d2d',
    }}>
      <ActorAvatar name={entry.actorName ?? entry.actor ?? 'Sistema'} />

      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '0.375rem' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#ffffff' }}>
            {entry.actorName ?? entry.actor ?? 'Sistema'}
          </span>
          <span style={{ fontSize: '0.8125rem', color: '#828282' }}>
            {entry.action ?? entry.description ?? ''}
          </span>
          {entry.target && (
            <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#ffffff' }}>
              {entry.target}
            </span>
          )}
        </div>
        {entry.detail && (
          <p style={{ margin: 0, fontSize: '0.8125rem', lineHeight: 1.45, color: '#828282' }}>
            {entry.detail}
          </p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
            height: '1.5rem', padding: '0 0.625rem', borderRadius: '999px',
            background: 'rgba(255,255,255,0.06)', color: '#828282', fontSize: '0.75rem',
          }}>
            <TypeIcon size={13} color={accent} strokeWidth={2} />
            {typeLabel}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem', minWidth: '6.25rem' }}>
        <span style={{ fontSize: '0.75rem', color: '#4f4f4f' }}>
          {formatRelativeTime(entry.createdAt ?? entry.timestamp)}
        </span>
        {entry.status && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', minHeight: '1.5rem',
            padding: '0 0.625rem', borderRadius: '999px', border: '1px solid #2d2d2d',
            color: '#828282', fontSize: '0.75rem',
          }}>
            {entry.status}
          </span>
        )}
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div style={{
      minHeight: '16rem', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#828282',
    }}>
      <Eye size={28} strokeWidth={1.6} />
      <p style={{ margin: '0.75rem 0 0', color: '#ffffff', fontWeight: 500 }}>No hay actividad registrada aún</p>
      <p style={{ margin: '0.4rem 0 0', fontSize: '0.8125rem' }}>
        Los cambios del sitio aparecerán aquí cuando estén disponibles.
      </p>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function ActivityPanel({ siteId }) {
  const [entries, setEntries]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [activeType, setActiveType] = useState('all');

  useEffect(() => {
    if (!siteId) { setLoading(false); return; }

    let cancelled = false;
    setLoading(true);

    const token = typeof window !== 'undefined' ? localStorage.getItem('sede_token') : null;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    fetch(`/api/v1/sites/${siteId}/activity`, { headers })
      .then((res) => {
        if (!res.ok) {
          // 404 or any other error → empty state, no crash
          return [];
        }
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          // Accept array directly or wrapped in { items: [...] }
          setEntries(Array.isArray(data) ? data : (data?.items ?? []));
        }
      })
      .catch(() => {
        if (!cancelled) setEntries([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [siteId]);

  // Filter by type
  const filtered = activeType === 'all'
    ? entries
    : entries.filter((e) => e.type === activeType);

  // Group by date bucket
  const groups = filtered.reduce((acc, entry) => {
    const bucket = getDateGroup(entry.createdAt ?? entry.timestamp);
    return { ...acc, [bucket]: [...(acc[bucket] ?? []), entry] };
  }, {});

  const counts = entries.reduce(
    (acc, e) => ({ ...acc, all: acc.all + 1, [e.type ?? 'content']: (acc[e.type ?? 'content'] ?? 0) + 1 }),
    { all: 0 }
  );

  return (
    <div style={{ display: 'flex', flex: 1, minWidth: 0, background: '#181818', color: '#ffffff', overflow: 'hidden', height: '100%' }}>

      {/* Left type filter */}
      <aside style={{ width: '200px', flexShrink: 0, background: '#181818', borderRight: '1px solid #2d2d2d', padding: '1rem', boxSizing: 'border-box' }}>
        <h2 style={{ margin: '0 0 1rem', fontSize: '0.875rem', fontWeight: 600, color: '#ffffff' }}>
          Actividad
        </h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {Object.entries(ACTIVITY_TYPES).map(([id, item]) => {
            const Icon = item.icon;
            const isActive = activeType === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveType(id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.625rem',
                  width: '100%', minHeight: '2.125rem', border: 'none', borderRadius: '0.375rem',
                  background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: isActive ? '#ffffff' : '#828282',
                  cursor: 'pointer', padding: '0 0.75rem', textAlign: 'left', fontSize: '0.8125rem',
                }}
              >
                <Icon size={15} strokeWidth={1.8} />
                <span style={{ flex: 1 }}>{item.label}</span>
                <span style={{ color: isActive ? 'rgba(255,255,255,0.6)' : '#4f4f4f', fontSize: '0.75rem' }}>
                  {counts[id] ?? 0}
                </span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ maxWidth: '46rem', boxSizing: 'border-box', padding: '2rem 2rem 4rem', margin: '0 auto' }}>

          <header style={{ marginBottom: '1.75rem' }}>
            <h1 style={{ margin: 0, fontSize: '1.0625rem', fontWeight: 500, color: '#ffffff' }}>
              Registro de actividad
            </h1>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem', lineHeight: 1.5, color: '#828282' }}>
              Historial de cambios del sitio — colaboración, revisión editorial y publicación.
            </p>
          </header>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '4rem' }}>
              <Spinner size="lg" />
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState />
          ) : (
            <section style={{ borderTop: '1px solid #2d2d2d' }}>
              {Object.entries(groups).map(([date, items]) => (
                <div key={date}>
                  <div style={{ position: 'sticky', top: 0, zIndex: 1, padding: '1rem 0 0.25rem', background: '#181818' }}>
                    <h2 style={{ margin: 0, fontSize: '0.75rem', fontWeight: 500, color: '#828282', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {date}
                    </h2>
                  </div>
                  {items.map((entry, i) => (
                    <ActivityItem key={entry.id ?? `${date}-${i}`} entry={entry} />
                  ))}
                </div>
              ))}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
