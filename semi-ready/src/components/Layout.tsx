import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '@/store/store';
import { search, type SearchDoc } from '@/lib/search';
import { Icon } from './ui';

interface NavItem {
  to: string;
  label: string;
  end?: boolean;
}

const NAV: NavItem[] = [
  { to: '/', label: '홈', end: true },
  { to: '/basics', label: '반도체 기초' },
  { to: '/process', label: '반도체 공정' },
  { to: '/jobs', label: '직무 탐색' },
  { to: '/companies', label: '기업 분석' },
  { to: '/interview', label: '면접 준비' },
  { to: '/quiz', label: '문제은행' },
  { to: '/wrong-notes', label: '오답노트' },
  { to: '/dashboard', label: '학습 대시보드' },
];

const EXTRA: NavItem[] = [
  { to: '/backend', label: '후공정·패키징' },
  { to: '/equipment', label: '장비·설비 CS' },
  { to: '/glossary', label: '용어사전' },
];

/* ── 통합검색 패널 ───────────────────────────────────── */
function SearchPanel({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState('');
  const [cursor, setCursor] = useState(0);
  const nav = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const results: SearchDoc[] = q.trim() ? search(q) : [];

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const go = (doc: SearchDoc) => {
    nav(doc.to);
    onClose();
  };

  return (
    <div className="search-panel" role="dialog" aria-modal="true" aria-label="사이트 통합검색" onMouseDown={onClose}>
      <div className="search-box" onMouseDown={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          className="search-input"
          placeholder="용어, 공정, 장비, 기업, 직무, 면접 질문, 문제를 검색하세요"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setCursor(0);
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setCursor((c) => Math.min(c + 1, results.length - 1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setCursor((c) => Math.max(c - 1, 0));
            } else if (e.key === 'Enter' && results[cursor]) {
              go(results[cursor]);
            }
          }}
          aria-label="검색어"
          aria-describedby="search-help"
        />
        <div className="search-results">
          <p id="search-help" className="tiny muted" style={{ padding: '4px 12px' }} role="status" aria-live="polite">
            {q.trim() === ''
              ? '검색어를 입력하면 사이트 전체에서 찾습니다. 화살표 키로 이동하고 엔터로 열 수 있습니다.'
              : `검색 결과 ${results.length}건`}
          </p>
          {q.trim() !== '' && results.length === 0 && (
            <p className="small muted" style={{ padding: '14px 12px' }}>
              일치하는 내용을 찾지 못했습니다. 약어 대신 한글 이름으로, 또는 더 짧은 단어로 다시 검색해 보세요.
            </p>
          )}
          {results.map((r, i) => (
            <button
              key={r.id}
              className={`search-item${i === cursor ? ' active' : ''}`}
              onClick={() => go(r)}
              onMouseEnter={() => setCursor(i)}
            >
              <div className="k">{r.kind}</div>
              <div className="t">{r.title}</div>
              <div className="d">{r.desc.length > 90 ? `${r.desc.slice(0, 90)}…` : r.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── 온보딩 ──────────────────────────────────────────── */
function Onboarding() {
  const { state, finishOnboarding } = useApp();
  const [step, setStep] = useState(0);
  if (state.onboarded) return null;

  const steps = [
    {
      title: 'SEMI READY에 오신 것을 환영합니다',
      body: [
        '이 사이트는 반도체 생산·설비·장비 CS 직무를 준비하는 분들을 위한 학습 플랫폼입니다.',
        '기초 개념부터 8대 공정, 직무와 기업 분석, 면접 답변 작성과 퀴즈까지 한곳에서 진행할 수 있습니다.',
      ],
    },
    {
      title: '학습 기록은 이 브라우저에 저장됩니다',
      body: [
        '진도, 퀴즈 기록, 오답노트, 면접 답변은 로그인 없이 이 브라우저의 저장소에 보관됩니다.',
        '다른 기기에서는 이어지지 않고, 브라우저 데이터를 지우면 기록도 함께 사라집니다.',
      ],
    },
    {
      title: '기업 정보는 반드시 직접 확인하세요',
      body: [
        '기업 페이지는 사업 영역처럼 비교적 안정적인 내용만 정리했습니다.',
        '매출, 투자, 채용 규모, 연봉 같은 변동 정보는 담지 않았으니 공식 홈페이지와 채용 공고로 확인해 주세요.',
      ],
    },
    {
      title: '이렇게 시작해 보세요',
      body: [
        '1. 반도체 기초에서 ‘반도체란 무엇인가’부터 읽습니다.',
        '2. 8대 공정 흐름을 훑고 관심 있는 공정을 깊게 봅니다.',
        '3. 직무와 기업을 비교해 지원 방향을 정합니다.',
        '4. 면접 질문에 답변을 써 보고 퀴즈로 복습합니다.',
      ],
    },
  ];
  const cur = steps[step];

  return (
    <div className="modal-back" role="dialog" aria-modal="true" aria-labelledby="ob-title">
      <div className="modal">
        <p className="tiny muted" style={{ marginBottom: 4 }}>
          {step + 1} / {steps.length}
        </p>
        <h2 id="ob-title">{cur.title}</h2>
        {cur.body.map((b) => (
          <p key={b} style={{ color: 'var(--text-2)' }}>
            {b}
          </p>
        ))}
        <div className="spread" style={{ marginTop: 18 }}>
          <button className="btn btn-ghost btn-sm" onClick={finishOnboarding}>
            건너뛰기
          </button>
          <div className="btn-row">
            {step > 0 && (
              <button className="btn btn-sm" onClick={() => setStep((s) => s - 1)}>
                이전
              </button>
            )}
            {step < steps.length - 1 ? (
              <button className="btn btn-primary btn-sm" onClick={() => setStep((s) => s + 1)}>
                다음
              </button>
            ) : (
              <button className="btn btn-primary btn-sm" onClick={finishOnboarding}>
                시작하기
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 레이아웃 ────────────────────────────────────────── */
export default function Layout({ children }: { children: React.ReactNode }) {
  const { state, setTheme } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [loc.pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const allNav = [...NAV, ...EXTRA];

  return (
    <div className="shell">
      <a className="skip-link" href="#main">
        본문으로 바로가기
      </a>
      <header className="header">
        <div className="container header-inner">
          <Link to="/" className="brand" aria-label="SEMI READY 홈">
            <svg className="brand-mark" viewBox="0 0 28 28" aria-hidden="true">
              <rect x="6" y="6" width="16" height="16" rx="3" fill="none" stroke="var(--accent)" strokeWidth="2" />
              <rect x="11" y="11" width="6" height="6" rx="1" fill="var(--accent)" />
              <g stroke="var(--accent)" strokeWidth="2" strokeLinecap="round">
                <path d="M11 2v4M17 2v4M11 22v4M17 22v4M2 11h4M2 17h4M22 11h4M22 17h4" />
              </g>
            </svg>
            <span>
              SEMI READY
              <span className="brand-sub"> | 반도체 취업·면접 준비</span>
            </span>
          </Link>

          <nav className="nav" aria-label="주요 메뉴">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => (isActive ? 'active' : '')}>
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="header-actions">
            <button className="icon-btn" onClick={() => setSearchOpen(true)} aria-label="통합검색 열기">
              <Icon.Search size={18} />
            </button>
            <button
              className="icon-btn"
              onClick={() => setTheme(state.theme === 'dark' ? 'light' : 'dark')}
              aria-label={state.theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
            >
              {state.theme === 'dark' ? <Icon.Sun /> : <Icon.Moon />}
            </button>
            <button
              className="icon-btn menu-btn"
              onClick={() => setMenuOpen((m) => !m)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label="메뉴 열기"
            >
              <Icon.Menu />
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="mobile-nav" id="mobile-nav" aria-label="모바일 메뉴">
            <div className="container">
              {allNav.map((n) => (
                <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => (isActive ? 'active' : '')}>
                  {n.label}
                </NavLink>
              ))}
            </div>
          </nav>
        )}
      </header>

      <main id="main" className="page">
        <div className="container">{children}</div>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="spread" style={{ alignItems: 'flex-start' }}>
            <div style={{ maxWidth: '60ch' }}>
              <p style={{ marginBottom: 6 }}>
                <b style={{ color: 'var(--text-2)' }}>SEMI READY</b> · 반도체 취업·면접 준비 학습 플랫폼 (임시 명칭)
              </p>
              <p style={{ margin: 0 }}>
                학습 콘텐츠는 공개된 기술 자료를 바탕으로 정리했습니다. 기업 정보는 변동될 수 있으므로 반드시 공식
                홈페이지와 채용 공고로 확인하세요. 면접 예시 답변은 정답이 아니라 참고용입니다.
              </p>
            </div>
            <nav aria-label="보조 메뉴" style={{ display: 'grid', gap: 4 }}>
              {EXTRA.map((e) => (
                <Link key={e.to} to={e.to}>
                  {e.label}
                </Link>
              ))}
              <Link to="/settings">설정과 데이터 관리</Link>
            </nav>
          </div>
        </div>
      </footer>

      {searchOpen && <SearchPanel onClose={() => setSearchOpen(false)} />}
      <Onboarding />
    </div>
  );
}
