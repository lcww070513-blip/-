import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { companies, companyCategories, companyDisclaimer } from '@/data/companies';
import { useApp } from '@/store/store';
import { EmptyState, ExternalLink, Icon } from '@/components/ui';

type SortKey = 'name' | 'category' | 'country';

const COMPARE_ROWS: { key: keyof (typeof companies)[number]['compare']; label: string }[] = [
  { key: 'type', label: '기업 유형' },
  { key: 'mainProduct', label: '주력 제품' },
  { key: 'mainProcess', label: '주요 공정' },
  { key: 'tech', label: '기술 방향' },
  { key: 'productionRole', label: '생산직 역할' },
  { key: 'csRole', label: '설비·CS 직무 역할' },
  { key: 'regions', label: '근무 가능 지역' },
  { key: 'shift', label: '교대근무 가능성' },
  { key: 'motive', label: '지원동기 핵심 포인트' },
  { key: 'csPrep', label: '준비해야 할 CS' },
  { key: 'topics', label: '예상 면접 주제' },
];

export default function CompaniesList() {
  const { state, toggleFav } = useApp();
  const [params] = useSearchParams();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('전체');
  const [onlyFav, setOnlyFav] = useState(false);
  const [sort, setSort] = useState<SortKey>('category');
  const [selected, setSelected] = useState<string[]>([]);
  const compareMode = params.get('compare') === '1' || selected.length > 0;

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const filtered = companies.filter((c) => {
      if (cat !== '전체' && c.category !== cat) return false;
      if (onlyFav && !state.favCompanies.includes(c.id)) return false;
      if (!needle) return true;
      return (
        c.name.toLowerCase().includes(needle) ||
        c.en.toLowerCase().includes(needle) ||
        c.products.some((p) => p.toLowerCase().includes(needle)) ||
        c.sites.some((s) => s.toLowerCase().includes(needle))
      );
    });
    const sorted = [...filtered];
    sorted.sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name, 'ko');
      if (sort === 'country') return a.country.localeCompare(b.country, 'ko') || a.name.localeCompare(b.name, 'ko');
      return (
        companyCategories.indexOf(a.category) - companyCategories.indexOf(b.category) ||
        a.name.localeCompare(b.name, 'ko')
      );
    });
    return sorted;
  }, [q, cat, onlyFav, sort, state.favCompanies]);

  const toggleCompare = (id: string) => {
    setSelected((s) => {
      if (s.includes(id)) return s.filter((x) => x !== id);
      if (s.length >= 3) return s;
      return [...s, id];
    });
  };

  const compared = selected.map((id) => companies.find((c) => c.id === id)!).filter(Boolean);
  const catCount = (c: string) => (c === '전체' ? companies.length : companies.filter((x) => x.category === c).length);

  return (
    <div>
      <div className="page-head">
        <h1>기업 분석</h1>
        <p>
          지원할 회사가 어떤 유형인지, 무엇을 만들고 어떤 직무가 어떤 일을 하는지 정리했습니다. 최대 3개를 골라 표로
          비교할 수 있습니다.
        </p>
      </div>

      <div className="note note-warn" style={{ marginBottom: 16 }}>
        <Icon.Alert /> <b>정보 기준일 {companyDisclaimer.asOf}</b> · {companyDisclaimer.text}{' '}
        <ExternalLink href={companyDisclaimer.dartUrl}>전자공시시스템(DART) 열기</ExternalLink>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="field">
          <label htmlFor="co-q">기업 검색</label>
          <input
            id="co-q"
            className="input"
            placeholder="회사명, 영문명, 제품, 사업장으로 검색"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="chip-row" role="group" aria-label="분류 필터">
          {['전체', ...companyCategories].map((c) => (
            <button key={c} className="chip" aria-pressed={cat === c} onClick={() => setCat(c)}>
              {c} ({catCount(c)})
            </button>
          ))}
        </div>
        <div className="row" style={{ marginTop: 10 }}>
          <button className="chip" aria-pressed={onlyFav} onClick={() => setOnlyFav((v) => !v)}>
            <Icon.Star size={13} filled={onlyFav} /> 즐겨찾기만 ({state.favCompanies.length})
          </button>
          <div className="row" style={{ gap: 6 }}>
            <label htmlFor="co-sort" className="tiny muted" style={{ fontWeight: 700 }}>
              정렬
            </label>
            <select id="co-sort" className="select" style={{ width: 'auto' }} value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
              <option value="category">분류순</option>
              <option value="name">이름순</option>
              <option value="country">국가순</option>
            </select>
          </div>
        </div>
      </div>

      {compareMode && (
        <section className="card" style={{ marginBottom: 18 }} aria-labelledby="ccmp-h">
          <div className="spread" style={{ marginBottom: 10 }}>
            <h2 id="ccmp-h" className="card-title" style={{ margin: 0 }}>
              기업 비교 ({selected.length}/3)
            </h2>
            {selected.length > 0 && (
              <button className="btn btn-sm" onClick={() => setSelected([])}>
                <Icon.X /> 선택 해제
              </button>
            )}
          </div>
          {selected.length === 0 ? (
            <p className="small muted" style={{ margin: 0 }}>
              아래 목록에서 비교에 추가 버튼을 눌러 최대 3개까지 선택하세요.
            </p>
          ) : (
            <div className="table-wrap">
              <table>
                <caption className="sr-only">선택한 기업 비교</caption>
                <thead>
                  <tr>
                    <th scope="col">비교 항목</th>
                    {compared.map((c) => (
                      <th key={c.id} scope="col">
                        {c.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map((row) => (
                    <tr key={row.key}>
                      <th scope="row">{row.label}</th>
                      {compared.map((c) => (
                        <td key={c.id} className="small">
                          {c.compare[row.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <th scope="row">정보 확인일</th>
                    {compared.map((c) => (
                      <td key={c.id} className="small">
                        {c.asOf} 기준 · 최신 정보 확인 필요
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      <p className="small muted" role="status" aria-live="polite">
        {list.length}개 기업
      </p>

      {list.length === 0 ? (
        <EmptyState
          title="조건에 맞는 기업이 없습니다"
          desc={
            cat === '팹리스'
              ? '팹리스 분류에는 아직 등록된 기업이 없습니다. 이 사이트는 생산·설비·CS 직무 중심이라 제조와 장비, 후공정 기업을 먼저 담았습니다.'
              : '검색어를 줄이거나 분류 필터를 전체로 되돌려 보세요.'
          }
          action={
            <button
              className="btn"
              onClick={() => {
                setQ('');
                setCat('전체');
                setOnlyFav(false);
              }}
            >
              <Icon.Refresh /> 필터 초기화
            </button>
          }
        />
      ) : (
        <div className="grid grid-2">
          {list.map((c) => {
            const isFav = state.favCompanies.includes(c.id);
            const isSel = selected.includes(c.id);
            const isDone = Boolean(state.completed[`company:${c.id}`]);
            return (
              <div className="list-card" key={c.id}>
                <div className="row" style={{ justifyContent: 'space-between', marginBottom: 4 }}>
                  <span className="row" style={{ gap: 5 }}>
                    <span className="badge badge-accent">{c.category}</span>
                    <span className="badge">{c.country}</span>
                  </span>
                  {isDone && (
                    <span className="badge badge-good">
                      <Icon.Check size={12} /> 완료
                    </span>
                  )}
                </div>
                <h3>
                  <Link to={`/companies/${c.id}`}>{c.name}</Link>{' '}
                  <span className="tiny muted" style={{ fontWeight: 500 }}>
                    {c.en}
                  </span>
                </h3>
                <p>{c.overview.length > 110 ? `${c.overview.slice(0, 110)}…` : c.overview}</p>
                <div className="list-card-meta">
                  <Link to={`/companies/${c.id}`} className="btn btn-sm">
                    자세히 보기
                  </Link>
                  <button
                    className="btn btn-sm"
                    aria-pressed={isSel}
                    disabled={!isSel && selected.length >= 3}
                    onClick={() => toggleCompare(c.id)}
                    style={isSel ? { borderColor: 'var(--accent)', color: 'var(--accent-strong)' } : undefined}
                  >
                    {isSel ? <Icon.Check /> : <Icon.Plus />}
                    {isSel ? '비교 목록에 있음' : '비교에 추가'}
                  </button>
                  <button
                    className="btn btn-sm"
                    aria-pressed={isFav}
                    aria-label={isFav ? `${c.name} 즐겨찾기 해제` : `${c.name} 즐겨찾기 추가`}
                    onClick={() => toggleFav('favCompanies', c.id)}
                    style={isFav ? { color: 'var(--warn)', borderColor: 'var(--warn)' } : undefined}
                  >
                    <Icon.Star filled={isFav} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
