import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { companies, companyDisclaimer } from '@/data/companies';
import { useApp } from '@/store/store';
import { companyReadiness } from '@/lib/progress';
import { CompleteButton, EmptyState, ExternalLink, Icon, ProgressBar, Section, Toc } from '@/components/ui';

/** 공식 링크가 확인되지 않은 경우 검색 링크를 제공합니다. */
const searchUrl = (kw: string) => `https://www.google.com/search?q=${encodeURIComponent(kw)}`;

export default function CompanyDetail() {
  const { id } = useParams();
  const { state, toggleComplete, toggleFav, toggleTarget, pushRecent } = useApp();
  const company = companies.find((c) => c.id === id);

  useEffect(() => {
    if (company) pushRecent({ key: `company:${company.id}`, title: company.name, to: `/companies/${company.id}` });
  }, [company?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!company) {
    return (
      <EmptyState
        title="기업을 찾을 수 없습니다"
        desc="주소가 잘못되었거나 없는 항목입니다."
        action={
          <Link to="/companies" className="btn btn-primary">
            기업 목록으로
          </Link>
        }
      />
    );
  }

  const key = `company:${company.id}`;
  const done = Boolean(state.completed[key]);
  const isFav = state.favCompanies.includes(company.id);
  const isTarget = state.targets.includes(company.id);
  const readiness = companyReadiness(state, company.id);

  const toc = [
    { id: 'overview', label: '기업 개요' },
    { id: 'products', label: '주요 제품과 고객' },
    { id: 'sites', label: '사업장과 담당 영역' },
    { id: 'direction', label: '사업 방향' },
    { id: 'swot', label: '경쟁력과 위험요인' },
    { id: 'roles', label: '직무별 역할' },
    { id: 'newbie', label: '신입이 알아야 할 내용' },
    { id: 'motive', label: '지원동기 작성 포인트' },
    { id: 'questions', label: '예상 면접 질문' },
    { id: 'news', label: '최신 뉴스와 출처' },
    { id: 'readiness', label: '나의 준비도' },
  ];

  return (
    <div className="with-toc">
      <div>
        <div className="page-head">
          <p className="crumb">
            <Link to="/companies">기업 분석</Link> <Icon.Chevron size={12} /> {company.category}
          </p>
          <h1>
            {company.name} <span className="muted" style={{ fontSize: '0.95rem', fontWeight: 500 }}>{company.en}</span>
          </h1>
          <div className="row" style={{ marginBottom: 10 }}>
            <span className="badge badge-accent">{company.category}</span>
            <span className="badge">{company.country}</span>
            <span className="badge">
              <Icon.Clock size={12} /> 정보 확인일 {company.asOf}
            </span>
          </div>
          <div className="btn-row">
            <CompleteButton done={done} onToggle={() => toggleComplete(key)} />
            <button
              className="btn"
              aria-pressed={isTarget}
              onClick={() => toggleTarget(company.id)}
              style={isTarget ? { borderColor: 'var(--accent)', color: 'var(--accent-strong)' } : undefined}
            >
              <Icon.Check /> {isTarget ? '지원 기업으로 등록됨' : '지원 기업으로 등록'}
            </button>
            <button
              className="btn"
              aria-pressed={isFav}
              onClick={() => toggleFav('favCompanies', company.id)}
              style={isFav ? { color: 'var(--warn)', borderColor: 'var(--warn)' } : undefined}
            >
              <Icon.Star filled={isFav} /> {isFav ? '즐겨찾기됨' : '즐겨찾기'}
            </button>
          </div>
        </div>

        <div className="note note-warn" style={{ marginBottom: 18 }}>
          <Icon.Alert /> 이 페이지는 사업 영역처럼 비교적 안정적인 내용만 정리한 개요입니다. 매출, 투자, 채용 규모,
          연봉, 최신 기술 로드맵은 담지 않았습니다. 지원 전 공식 자료로 반드시 직접 확인하세요.
        </div>

        <Section id="overview" title="기업 개요">
          <p className="lead">{company.overview}</p>
          <h3>반도체 산업 내 위치</h3>
          <p>{company.position}</p>
        </Section>

        <Section id="products" title="주요 제품과 고객">
          <div className="grid grid-2">
            <div className="card">
              <h3 className="card-title">주요 제품과 기술</h3>
              <ul className="small" style={{ marginBottom: 0, color: 'var(--text-2)' }}>
                {company.products.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
            <div className="card">
              <h3 className="card-title">주요 고객 또는 시장</h3>
              <p className="small" style={{ margin: 0, color: 'var(--text-2)' }}>
                {company.customers}
              </p>
              <p className="tiny muted" style={{ marginTop: 8, marginBottom: 0 }}>
                구체적인 거래 관계와 비중은 공시 자료로 확인해야 합니다.
              </p>
            </div>
          </div>
        </Section>

        <Section id="sites" title="주요 사업장과 담당 영역">
          <div className="grid grid-2">
            <div className="card">
              <h3 className="card-title">주요 사업장</h3>
              <div className="chip-row">
                {company.sites.map((s) => (
                  <span key={s} className="badge">
                    {s}
                  </span>
                ))}
              </div>
              <p className="tiny muted" style={{ marginTop: 10, marginBottom: 0 }}>
                근무지는 채용 공고에 따라 달라집니다. 지원 전 확인이 필요합니다.
              </p>
            </div>
            <div className="card">
              <h3 className="card-title">생산공정 또는 장비 영역</h3>
              <ul className="small" style={{ marginBottom: 0, color: 'var(--text-2)' }}>
                {company.area.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        <Section id="direction" title="사업 방향">
          <div className="card">
            <h3 className="card-title">최근 집중하고 있는 기술과 사업 방향</h3>
            <ul className="small" style={{ color: 'var(--text-2)' }}>
              {company.focus.map((f) => (
                <li key={f.slice(0, 18)}>{f}</li>
              ))}
            </ul>
            <p className="note" style={{ marginBottom: 0 }}>
              <Icon.Info /> 구체적인 투자 계획과 일정은 <b>최신 정보 확인 필요</b> 항목입니다. 공식 보도자료와 사업보고서를
              확인하세요.
            </p>
          </div>
          <div className="grid grid-2" style={{ marginTop: 14 }}>
            <div className="card">
              <h3 className="card-title">지원 직무와의 연결점</h3>
              <ul className="small" style={{ marginBottom: 0, color: 'var(--text-2)' }}>
                <li>생산직: {company.roles.production}</li>
                <li>설비직: {company.roles.equipment}</li>
                <li>CS 직무: {company.roles.cs}</li>
              </ul>
            </div>
            <div className="card">
              <h3 className="card-title">면접에서 주의할 과장된 표현</h3>
              <ul className="small" style={{ marginBottom: 0, color: 'var(--text-2)' }}>
                {company.overclaims.map((o) => (
                  <li key={o.slice(0, 18)}>{o}</li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        <Section id="swot" title="경쟁력과 위험요인">
          <div className="grid grid-2">
            <div className="card">
              <h3 className="card-title">
                <span className="badge badge-good">
                  <Icon.Check size={12} /> 경쟁력
                </span>
              </h3>
              <ul className="small" style={{ marginBottom: 0, color: 'var(--text-2)' }}>
                {company.strengths.map((s) => (
                  <li key={s.slice(0, 18)}>{s}</li>
                ))}
              </ul>
            </div>
            <div className="card">
              <h3 className="card-title">
                <span className="badge badge-warn">
                  <Icon.Alert size={12} /> 위험요인
                </span>
              </h3>
              <ul className="small" style={{ marginBottom: 0, color: 'var(--text-2)' }}>
                {company.risks.map((s) => (
                  <li key={s.slice(0, 18)}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="card" style={{ marginTop: 14 }}>
            <h3 className="card-title">주요 경쟁사</h3>
            <div className="chip-row">
              {company.rivals.map((r) => {
                const rival = companies.find((c) => c.name === r);
                return rival ? (
                  <Link key={r} to={`/companies/${rival.id}`} className="badge badge-accent">
                    {r}
                  </Link>
                ) : (
                  <span key={r} className="badge">
                    {r}
                  </span>
                );
              })}
            </div>
          </div>
        </Section>

        <Section id="roles" title="생산·설비·CS 직무의 역할">
          <div className="grid grid-3">
            <div className="card">
              <h3 className="card-title">생산직</h3>
              <p className="small" style={{ margin: 0, color: 'var(--text-2)' }}>
                {company.roles.production}
              </p>
            </div>
            <div className="card">
              <h3 className="card-title">설비 엔지니어</h3>
              <p className="small" style={{ margin: 0, color: 'var(--text-2)' }}>
                {company.roles.equipment}
              </p>
            </div>
            <div className="card">
              <h3 className="card-title">장비 CS</h3>
              <p className="small" style={{ margin: 0, color: 'var(--text-2)' }}>
                {company.roles.cs}
              </p>
            </div>
          </div>
        </Section>

        <Section id="newbie" title="신입 지원자가 알아야 할 내용">
          <ul>
            {company.forNewbie.map((f) => (
              <li key={f.slice(0, 20)}>{f}</li>
            ))}
          </ul>
        </Section>

        <Section id="motive" title="지원동기 작성 포인트">
          <div className="card">
            <ul className="small" style={{ marginBottom: 0, color: 'var(--text-2)' }}>
              {company.motivePoints.map((m) => (
                <li key={m.slice(0, 20)}>{m}</li>
              ))}
            </ul>
          </div>
          <div className="btn-row" style={{ marginTop: 12 }}>
            <Link to="/interview/q-why-company" className="btn btn-primary btn-sm">
              지원동기 답변 작성하러 가기
            </Link>
            <Link to="/interview/builder" className="btn btn-sm">
              내 경험으로 초안 만들기
            </Link>
          </div>
        </Section>

        <Section id="questions" title="회사별 예상 면접 질문">
          <ol>
            {company.questions.map((q) => (
              <li key={q.slice(0, 22)}>{q}</li>
            ))}
          </ol>
        </Section>

        <Section id="news" title="최신 뉴스와 출처">
          <div className="card">
            <h3 className="card-title">
              <span className="badge badge-warn">
                <Icon.Alert size={12} /> 최신 정보 확인 필요
              </span>
            </h3>
            <p className="small" style={{ color: 'var(--text-2)' }}>
              이 사이트는 뉴스 데이터와 연동되어 있지 않습니다. 실적, 투자, 채용 소식은 아래 공식 경로에서 직접
              확인하세요. 현직자 후기는 공식 사실과 구분해서 참고해야 합니다.
            </p>
            <ul className="small" style={{ marginBottom: 0 }}>
              {company.links.site ? (
                <li>
                  <ExternalLink href={company.links.site}>공식 홈페이지</ExternalLink>
                </li>
              ) : (
                <li>
                  공식 홈페이지 주소가 확인되지 않아 링크를 넣지 않았습니다.{' '}
                  <ExternalLink href={searchUrl(`${company.name} 공식 홈페이지`)}>검색으로 확인하기</ExternalLink>
                </li>
              )}
              {company.links.careers ? (
                <li>
                  <ExternalLink href={company.links.careers}>공식 채용 페이지</ExternalLink>
                </li>
              ) : (
                <li>
                  채용 페이지 주소는 수시로 바뀝니다.{' '}
                  <ExternalLink href={searchUrl(`${company.name} 채용`)}>채용 정보 검색하기</ExternalLink>
                </li>
              )}
              {company.sources.map((s) => (
                <li key={s.url + s.label}>
                  <ExternalLink href={s.url}>{s.label}</ExternalLink>
                </li>
              ))}
            </ul>
            <p className="tiny muted" style={{ marginTop: 10, marginBottom: 0 }}>
              정보 확인일: {company.asOf} · 전체 고지: {companyDisclaimer.text.slice(0, 60)}…
            </p>
          </div>
        </Section>

        {readiness && (
          <Section id="readiness" title="이 기업에 대한 나의 준비도">
            <div className="card">
              <ProgressBar pct={readiness.pct} label={`준비도 (${readiness.done}/${readiness.total} 항목 완료)`} />
              <ul style={{ marginTop: 14, marginBottom: 0, listStyle: 'none', paddingLeft: 0 }}>
                {readiness.parts.map((p) => (
                  <li key={p.label} style={{ display: 'flex', gap: 9, alignItems: 'center', marginBottom: 8 }}>
                    <span
                      className={`badge ${p.done ? 'badge-good' : ''}`}
                      style={{ minWidth: 60, justifyContent: 'center' }}
                    >
                      {p.done ? <Icon.Check size={12} /> : <Icon.X size={12} />}
                      {p.done ? '완료' : '미완료'}
                    </span>
                    <span style={{ flex: 1 }}>{p.label}</span>
                    {!p.done && (
                      <Link to={p.to} className="btn btn-sm">
                        하러 가기
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </Section>
        )}
      </div>

      <Toc items={toc} />
    </div>
  );
}
