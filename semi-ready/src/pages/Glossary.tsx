import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { glossary, glossaryFields } from '@/data/glossary';
import { EmptyState, Icon } from '@/components/ui';

type SortMode = 'ko' | 'en';

export default function Glossary() {
  const [q, setQ] = useState('');
  const [field, setField] = useState('전체');
  const [sort, setSort] = useState<SortMode>('ko');
  const [abbrOnly, setAbbrOnly] = useState(false);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const filtered = glossary.filter((g) => {
      if (field !== '전체' && g.field !== field) return false;
      if (abbrOnly && !g.abbr) return false;
      if (!needle) return true;
      return (
        g.ko.toLowerCase().includes(needle) ||
        (g.abbr ?? '').toLowerCase().includes(needle) ||
        (g.en ?? '').toLowerCase().includes(needle) ||
        g.desc.toLowerCase().includes(needle) ||
        g.related.some((r) => r.toLowerCase().includes(needle))
      );
    });
    return [...filtered].sort((a, b) =>
      sort === 'ko'
        ? a.ko.localeCompare(b.ko, 'ko')
        : (a.abbr ?? a.en ?? a.ko).localeCompare(b.abbr ?? b.en ?? b.ko, 'en'),
    );
  }, [q, field, sort, abbrOnly]);

  return (
    <div>
      <div className="page-head">
        <h1>용어사전</h1>
        <p>
          약어, 영문 전체 명칭, 쉬운 한국어 설명을 함께 담았습니다. 연관 용어와 면접에서 쓰는 방법까지 정리해 두었으니
          모르는 단어가 나올 때마다 찾아보세요.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="field">
          <label htmlFor="gl-q">용어 검색</label>
          <input
            id="gl-q"
            className="input"
            placeholder="한글, 약어, 영문 어느 쪽으로 검색해도 됩니다"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <p className="tiny muted" style={{ fontWeight: 700, marginBottom: 6 }}>
          분야
        </p>
        <div className="chip-row" role="group" aria-label="분야 필터">
          {['전체', ...glossaryFields].map((f) => (
            <button key={f} className="chip" aria-pressed={field === f} onClick={() => setField(f)}>
              {f}
            </button>
          ))}
        </div>

        <div className="row" style={{ marginTop: 12 }}>
          <div className="row" style={{ gap: 6 }}>
            <label htmlFor="gl-sort" className="tiny muted" style={{ fontWeight: 700 }}>
              정렬
            </label>
            <select id="gl-sort" className="select" style={{ width: 'auto' }} value={sort} onChange={(e) => setSort(e.target.value as SortMode)}>
              <option value="ko">가나다순</option>
              <option value="en">영문 알파벳순</option>
            </select>
          </div>
          <button className="chip" aria-pressed={abbrOnly} onClick={() => setAbbrOnly((v) => !v)}>
            약어가 있는 용어만
          </button>
        </div>
      </div>

      <p className="small muted" role="status" aria-live="polite">
        {list.length}개 용어
      </p>

      {list.length === 0 ? (
        <EmptyState
          title="일치하는 용어가 없습니다"
          desc="검색어를 줄이거나 분야 필터를 전체로 되돌려 보세요. 학습 페이지의 관련 용어 항목에도 더 많은 용어가 있습니다."
          action={
            <button
              className="btn"
              onClick={() => {
                setQ('');
                setField('전체');
                setAbbrOnly(false);
              }}
            >
              <Icon.Refresh /> 필터 초기화
            </button>
          }
        />
      ) : (
        <div className="grid grid-2">
          {list.map((g) => (
            <div className="card" key={`${g.ko}-${g.abbr ?? ''}`}>
              <div className="row" style={{ marginBottom: 6 }}>
                {g.abbr && <span className="badge badge-accent mono">{g.abbr}</span>}
                <span className="badge">{g.field}</span>
              </div>
              <h3 style={{ marginBottom: 2 }}>{g.ko}</h3>
              {g.en && (
                <p className="tiny muted" style={{ marginBottom: 8 }}>
                  {g.en}
                </p>
              )}
              <p className="small" style={{ color: 'var(--text-2)' }}>
                {g.desc}
              </p>
              <p className="small" style={{ color: 'var(--text-2)' }}>
                <b>면접 활용</b> · {g.usage}
              </p>
              <div className="row" style={{ gap: 6 }}>
                <span className="tiny muted">연관</span>
                {g.related.map((r) => (
                  <span key={r} className="badge">
                    {r}
                  </span>
                ))}
              </div>
              {g.to && (
                <div style={{ marginTop: 10 }}>
                  <Link to={g.to} className="btn btn-sm">
                    <Icon.Book /> 관련 학습 페이지
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
