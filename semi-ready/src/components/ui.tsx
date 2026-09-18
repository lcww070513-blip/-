import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

/* ── 아이콘 (선 아이콘, currentColor) ─────────────────── */
type IconProps = { size?: number } & React.SVGProps<SVGSVGElement>;
const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.9,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false as const,
});

export const Icon = {
  Check: ({ size = 16, ...p }: IconProps) => (
    <svg {...base(size)} {...p}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
  X: ({ size = 16, ...p }: IconProps) => (
    <svg {...base(size)} {...p}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  ),
  Alert: ({ size = 16, ...p }: IconProps) => (
    <svg {...base(size)} {...p}>
      <path d="M12 9v4M12 17h.01" />
      <path d="M10.3 3.9 2.4 17a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
    </svg>
  ),
  Info: ({ size = 16, ...p }: IconProps) => (
    <svg {...base(size)} {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  ),
  Star: ({ size = 16, filled = false, ...p }: IconProps & { filled?: boolean }) => (
    <svg {...base(size)} fill={filled ? 'currentColor' : 'none'} {...p}>
      <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6-5.4-2.9-5.4 2.9 1-6L3.2 9.4l6.1-.9Z" />
    </svg>
  ),
  Search: ({ size = 16, ...p }: IconProps) => (
    <svg {...base(size)} {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  ),
  Menu: ({ size = 20, ...p }: IconProps) => (
    <svg {...base(size)} {...p}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  ),
  Sun: ({ size = 18, ...p }: IconProps) => (
    <svg {...base(size)} {...p}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  ),
  Moon: ({ size = 18, ...p }: IconProps) => (
    <svg {...base(size)} {...p}>
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
    </svg>
  ),
  Chevron: ({ size = 16, ...p }: IconProps) => (
    <svg {...base(size)} {...p}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  ),
  Down: ({ size = 16, ...p }: IconProps) => (
    <svg {...base(size)} {...p}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  ),
  Up: ({ size = 16, ...p }: IconProps) => (
    <svg {...base(size)} {...p}>
      <path d="m18 15-6-6-6 6" />
    </svg>
  ),
  Book: ({ size = 16, ...p }: IconProps) => (
    <svg {...base(size)} {...p}>
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v16H6.5A2.5 2.5 0 0 0 4 20.5Z" />
      <path d="M4 18.5h16" />
    </svg>
  ),
  Chip: ({ size = 16, ...p }: IconProps) => (
    <svg {...base(size)} {...p}>
      <rect x="7" y="7" width="10" height="10" rx="2" />
      <path d="M10 2v3M14 2v3M10 19v3M14 19v3M2 10h3M2 14h3M19 10h3M19 14h3" />
    </svg>
  ),
  Flow: ({ size = 16, ...p }: IconProps) => (
    <svg {...base(size)} {...p}>
      <rect x="3" y="4" width="6" height="6" rx="1.5" />
      <rect x="15" y="14" width="6" height="6" rx="1.5" />
      <path d="M9 7h4a2 2 0 0 1 2 2v8" />
    </svg>
  ),
  Wrench: ({ size = 16, ...p }: IconProps) => (
    <svg {...base(size)} {...p}>
      <path d="M15.5 3.5a5 5 0 0 0-6.2 6.4L3 16.2V21h4.8l6.3-6.3a5 5 0 0 0 6.4-6.2L17 11l-4-4Z" />
    </svg>
  ),
  Users: ({ size = 16, ...p }: IconProps) => (
    <svg {...base(size)} {...p}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20a6 6 0 0 1 12 0M16.5 5.2a3.2 3.2 0 0 1 0 6M18 20a6 6 0 0 0-2.3-4.7" />
    </svg>
  ),
  Building: ({ size = 16, ...p }: IconProps) => (
    <svg {...base(size)} {...p}>
      <path d="M4 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16M15 21V9h3a2 2 0 0 1 2 2v10M2 21h20M8 7h3M8 11h3M8 15h3" />
    </svg>
  ),
  Mic: ({ size = 16, ...p }: IconProps) => (
    <svg {...base(size)} {...p}>
      <rect x="9" y="2" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v4M8 22h8" />
    </svg>
  ),
  Quiz: ({ size = 16, ...p }: IconProps) => (
    <svg {...base(size)} {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.3 9.2a2.8 2.8 0 0 1 5.4.9c0 1.9-2.7 2.4-2.7 4M12 17.5h.01" />
    </svg>
  ),
  Note: ({ size = 16, ...p }: IconProps) => (
    <svg {...base(size)} {...p}>
      <path d="M5 3h10l4 4v14H5Z" />
      <path d="M15 3v4h4M8 12h8M8 16h5" />
    </svg>
  ),
  Chart: ({ size = 16, ...p }: IconProps) => (
    <svg {...base(size)} {...p}>
      <path d="M3 21h18M7 21V10M12 21V4M17 21v-7" />
    </svg>
  ),
  Home: ({ size = 16, ...p }: IconProps) => (
    <svg {...base(size)} {...p}>
      <path d="M4 10.5 12 3l8 7.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1Z" />
    </svg>
  ),
  Clock: ({ size = 16, ...p }: IconProps) => (
    <svg {...base(size)} {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
  Link: ({ size = 14, ...p }: IconProps) => (
    <svg {...base(size)} {...p}>
      <path d="M10 13a4 4 0 0 0 5.7 0l2.6-2.6a4 4 0 1 0-5.7-5.7L11.2 6" />
      <path d="M14 11a4 4 0 0 0-5.7 0l-2.6 2.6a4 4 0 1 0 5.7 5.7L12.8 18" />
    </svg>
  ),
  Empty: ({ size = 34, ...p }: IconProps) => (
    <svg {...base(size)} strokeWidth={1.4} {...p}>
      <rect x="3" y="5" width="18" height="15" rx="2.5" />
      <path d="M3 10h18M8 15h8" />
    </svg>
  ),
  Refresh: ({ size = 16, ...p }: IconProps) => (
    <svg {...base(size)} {...p}>
      <path d="M20 11a8 8 0 1 0-1.3 5.4" />
      <path d="M20 5v6h-6" />
    </svg>
  ),
  Trash: ({ size = 16, ...p }: IconProps) => (
    <svg {...base(size)} {...p}>
      <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" />
    </svg>
  ),
  Plus: ({ size = 16, ...p }: IconProps) => (
    <svg {...base(size)} {...p}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
};

/* ── 상태 화면 ────────────────────────────────────────── */
export function EmptyState({
  title,
  desc,
  action,
}: {
  title: string;
  desc: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="state">
      <div className="state-icon">
        <Icon.Empty />
      </div>
      <h3>{title}</h3>
      <p>{desc}</p>
      {action}
    </div>
  );
}

export function LoadingState({ label = '학습 기록을 불러오는 중입니다' }: { label?: string }) {
  return (
    <div role="status" aria-live="polite">
      <p className="muted small">{label}</p>
      <div className="skeleton" style={{ height: 96, marginBottom: 12 }} />
      <div className="grid grid-3">
        <div className="skeleton" style={{ height: 82 }} />
        <div className="skeleton" style={{ height: 82 }} />
        <div className="skeleton" style={{ height: 82 }} />
      </div>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="state" role="alert">
      <div className="state-icon" style={{ color: 'var(--bad)' }}>
        <Icon.Alert size={32} />
      </div>
      <h3>문제가 생겼습니다</h3>
      <p>{message}</p>
      {onRetry && (
        <button className="btn" onClick={onRetry}>
          <Icon.Refresh /> 다시 시도
        </button>
      )}
    </div>
  );
}

/* ── 진행률 ──────────────────────────────────────────── */
export function ProgressBar({ pct, label }: { pct: number; label?: string }) {
  return (
    <div>
      {label && (
        <div className="spread" style={{ marginBottom: 5 }}>
          <span className="small muted">{label}</span>
          <span className="small" style={{ fontWeight: 700 }}>
            {pct}%
          </span>
        </div>
      )}
      <div
        className="bar"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? '진행률'}
      >
        <i style={{ width: `${Math.max(pct, 0)}%` }} />
      </div>
    </div>
  );
}

export function ProgressRing({ pct, size = 108 }: { pct: number; size?: number }) {
  const r = size / 2 - 9;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} role="img" aria-label={`전체 학습 진도 ${pct}퍼센트`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-3)" strokeWidth="9" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--series-1)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray={`${(c * pct) / 100} ${c}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy="0.36em"
        fontSize={size / 3.6}
        fontWeight="800"
        fill="var(--text)"
        fontFamily="inherit"
      >
        {pct}%
      </text>
    </svg>
  );
}

/* ── 통계 타일 ───────────────────────────────────────── */
export function Stat({
  label,
  value,
  unit,
  sub,
}: {
  label: string;
  value: React.ReactNode;
  unit?: string;
  sub?: string;
}) {
  return (
    <div className="stat">
      <div className="stat-label">{label}</div>
      <div className="stat-value">
        {value}
        {unit && <span className="stat-unit">{unit}</span>}
      </div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

/* ── 아코디언 ────────────────────────────────────────── */
export function Accordion({
  title,
  children,
  defaultOpen = false,
  badge,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useMemo(() => `acc-${Math.random().toString(36).slice(2, 9)}`, []);
  return (
    <div className="acc">
      <button className="acc-head" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
        <span style={{ color: 'var(--text-3)', display: 'flex' }}>{open ? <Icon.Up /> : <Icon.Down />}</span>
        <span style={{ flex: 1 }}>{title}</span>
        {badge}
      </button>
      {open && (
        <div className="acc-body" id={id}>
          {children}
        </div>
      )}
    </div>
  );
}

/* ── 완료 체크 버튼 ──────────────────────────────────── */
export function CompleteButton({ done, onToggle }: { done: boolean; onToggle: () => void }) {
  return (
    <button
      className={done ? 'btn btn-primary' : 'btn'}
      onClick={onToggle}
      aria-pressed={done}
      style={done ? { background: 'var(--good)', borderColor: 'var(--good)' } : undefined}
    >
      <Icon.Check />
      {done ? '학습 완료됨' : '학습 완료로 표시'}
    </button>
  );
}

/* ── 즐겨찾기 버튼 ───────────────────────────────────── */
export function FavButton({ on, onToggle, label }: { on: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      className="btn btn-sm"
      onClick={onToggle}
      aria-pressed={on}
      aria-label={on ? `${label} 즐겨찾기 해제` : `${label} 즐겨찾기 추가`}
      style={on ? { color: 'var(--warn)', borderColor: 'var(--warn)' } : undefined}
    >
      <Icon.Star filled={on} />
      {on ? '즐겨찾기됨' : '즐겨찾기'}
    </button>
  );
}

/* ── 목차 ────────────────────────────────────────────── */
export interface TocItem {
  id: string;
  label: string;
}

export function Toc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? '');
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-80px 0px -65% 0px', threshold: 0 },
    );
    items.forEach((i) => {
      const el = document.getElementById(i.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className="toc" aria-label="이 페이지의 목차">
      <p className="tiny muted" style={{ margin: '0 0 6px 8px', fontWeight: 700 }}>
        목차
      </p>
      <ol>
        {items.map((i) => (
          <li key={i.id}>
            <a href={`#${i.id}`} className={active === i.id ? 'active' : ''} aria-current={active === i.id ? 'true' : undefined}>
              {i.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ── 섹션 ────────────────────────────────────────────── */
export function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section className="section" id={id} aria-labelledby={`${id}-h`}>
      <h2 id={`${id}-h`}>{title}</h2>
      {children}
    </section>
  );
}

/* ── 용어 목록 ───────────────────────────────────────── */
export function TermList({ terms }: { terms: { ko: string; abbr?: string; en?: string; desc: string }[] }) {
  if (!terms.length) return null;
  return (
    <div className="grid grid-2">
      {terms.map((t) => (
        <div className="term" key={t.ko + (t.abbr ?? '')}>
          <b>
            {t.abbr ? `${t.abbr}` : t.ko}
            {t.abbr && <span className="en"> ({t.en}, {t.ko})</span>}
            {!t.abbr && t.en && <span className="en"> ({t.en})</span>}
          </b>
          <div className="small" style={{ color: 'var(--text-2)', marginTop: 3 }}>
            {t.desc}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── 참고용 답변 안내 ────────────────────────────────── */
export function AnswerDisclaimer() {
  return (
    <p className="note" style={{ marginTop: 10 }}>
      <Icon.Info /> 아래 답변은 정답이 아니라 구조를 보여 주는 참고용 예시입니다. 반드시 본인의 실제 경험과 표현으로
      바꿔서 연습하세요.
    </p>
  );
}

/* ── 다시 쓰는 링크 카드 ─────────────────────────────── */
export function LinkCard({
  to,
  title,
  desc,
  meta,
}: {
  to: string;
  title: string;
  desc?: string;
  meta?: React.ReactNode;
}) {
  return (
    <Link to={to} className="list-card">
      <h3>{title}</h3>
      {desc && <p>{desc}</p>}
      {meta && <div className="list-card-meta">{meta}</div>}
    </Link>
  );
}

/* ── 외부 링크 ───────────────────────────────────────── */
export function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children} <Icon.Link />
      <span className="sr-only">(새 창에서 열림)</span>
    </a>
  );
}

/* ── 스크롤 시 상단 이동 ─────────────────────────────── */
export function useScrollTop(dep: unknown) {
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [dep]);
}
