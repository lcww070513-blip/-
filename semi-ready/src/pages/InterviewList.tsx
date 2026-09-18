import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { interviewAreas, interviewLevels, interviewQuestions, jobFilters } from '@/data/interview';
import { companies } from '@/data/companies';
import { useApp } from '@/store/store';
import { EmptyState, Icon } from '@/components/ui';

export default function InterviewList() {
  const { state, toggleFav } = useApp();
  const [params, setParams] = useSearchParams();

  const [q, setQ] = useState('');
  const [area, setArea] = useState(params.get('area') ?? '전체');
  const [level, setLevel] = useState('전체');
  const [job, setJob] = useState(params.get('job') ?? '전체');
  const [company, setCompany] = useState('전체');
  const [onlyEssential, setOnlyEssential] = useState(false);
  const [onlyFav, setOnlyFav] = useState(false);
  const [onlyUnanswered, setOnlyUnanswered] = useState(false);

  const paramArea = params.get('area');
  const paramJob = params.get('job');

  // 이미 이 화면에 있는 상태에서 다른 필터 링크로 들어와도 반영되도록 합니다.
  useEffect(() => {
    setArea(paramArea ?? '전체');
    setJob(paramJob ?? '전체');
  }, [paramArea, paramJob]);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return interviewQuestions.filter((item) => {
      if (area !== '전체' && item.area !== area) return false;
      if (level !== '전체' && item.level !== level) return false;
      if (job !== '전체' && !item.jobs.includes(job as (typeof jobFilters)[number])) return false;
      if (company !== '전체' && item.companies.length > 0 && !item.companies.includes(company)) return false;
      if (company !== '전체' && item.companies.length === 0 && item.area === '회사별 질문') return false;
      if (onlyEssential && !item.essential) return false;
      if (onlyFav && !state.favQuestions.includes(item.id)) return false;
      if (onlyUnanswered && state.answers[item.id]?.text.trim()) return false;
      if (!needle) return true;
      return item.q.toLowerCase().includes(needle) || item.intent.toLowerCase().includes(needle);
    });
  }, [q, area, level, job, company, onlyEssential, onlyFav, onlyUnanswered, state.favQuestions, state.answers]);

  const reset = () => {
    setQ('');
    setArea('전체');
    setLevel('전체');
    setJob('전체');
    setCompany('전체');
    setOnlyEssential(false);
    setOnlyFav(false);
    setOnlyUnanswered(false);
    setParams({});
  };

  const answered = Object.values(state.answers).filter((a) => a.text.trim()).length;
  const practiced = Object.values(state.answers).filter((a) => a.practiced).length;

  return (
    <div>
      <div className="page-head">
        <h1>면접 준비</h1>
        <p>
          질문마다 의도와 평가요소, 답변 구조, 반드시 포함할 내용과 피해야 할 표현, 좋은 답변과 부족한 답변 예시,
          꼬리질문을 정리했습니다. 답변을 직접 써서 저장하고 연습 완료를 표시할 수 있습니다.
        </p>
      </div>

      <div className="grid grid-3" style={{ marginBottom: 16 }}>
        <Link to="/interview/builder" className="list-card">
          <h3>
            <Icon.Note /> 답변 작성 도우미
          </h3>
          <p>내 경험 정보를 입력하면 STAR 구조 초안을 만들어 줍니다. 없는 경험은 절대 채워 넣지 않습니다.</p>
        </Link>
        <Link to="/interview/mock" className="list-card">
          <h3>
            <Icon.Mic /> 모의면접 (데모 모드)
          </h3>
          <p>질문은행 기반으로 면접을 진행하고 종합평가를 확인합니다. AI 연동 없이 동작합니다.</p>
        </Link>
        <div className="list-card">
          <h3>
            <Icon.Chart /> 나의 답변 현황
          </h3>
          <p>
            작성한 답변 {answered}개 · 연습 완료 {practiced}개 · 즐겨찾기 {state.favQuestions.length}개
          </p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="field">
          <label htmlFor="iv-q">질문 검색</label>
          <input id="iv-q" className="input" placeholder="예: 자기소개, 교대, 불량, 지원동기" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        <p className="tiny muted" style={{ fontWeight: 700, marginBottom: 6 }}>
          영역
        </p>
        <div className="chip-row" role="group" aria-label="면접 영역 필터">
          {['전체', ...interviewAreas].map((a) => (
            <button key={a} className="chip" aria-pressed={area === a} onClick={() => setArea(a)}>
              {a}
            </button>
          ))}
        </div>

        <p className="tiny muted" style={{ fontWeight: 700, margin: '12px 0 6px' }}>
          난이도
        </p>
        <div className="chip-row" role="group" aria-label="난이도 필터">
          {['전체', ...interviewLevels].map((l) => (
            <button key={l} className="chip" aria-pressed={level === l} onClick={() => setLevel(l)}>
              {l}
            </button>
          ))}
        </div>

        <p className="tiny muted" style={{ fontWeight: 700, margin: '12px 0 6px' }}>
          직무
        </p>
        <div className="chip-row" role="group" aria-label="직무 필터">
          {['전체', ...jobFilters].map((j) => (
            <button key={j} className="chip" aria-pressed={job === j} onClick={() => setJob(j)}>
              {j}
            </button>
          ))}
        </div>

        <div className="row" style={{ marginTop: 12 }}>
          <div className="row" style={{ gap: 6 }}>
            <label htmlFor="iv-co" className="tiny muted" style={{ fontWeight: 700 }}>
              기업
            </label>
            <select id="iv-co" className="select" style={{ width: 'auto' }} value={company} onChange={(e) => setCompany(e.target.value)}>
              <option value="전체">전체 기업</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <button className="chip" aria-pressed={onlyEssential} onClick={() => setOnlyEssential((v) => !v)}>
            필수 질문만
          </button>
          <button className="chip" aria-pressed={onlyFav} onClick={() => setOnlyFav((v) => !v)}>
            <Icon.Star size={13} filled={onlyFav} /> 즐겨찾기만
          </button>
          <button className="chip" aria-pressed={onlyUnanswered} onClick={() => setOnlyUnanswered((v) => !v)}>
            아직 답변 안 쓴 질문만
          </button>
          <button className="btn btn-sm btn-ghost" onClick={reset}>
            <Icon.Refresh /> 초기화
          </button>
        </div>
      </div>

      <p className="small muted" role="status" aria-live="polite">
        {list.length}개 질문
      </p>

      {list.length === 0 ? (
        <EmptyState
          title="조건에 맞는 질문이 없습니다"
          desc="필터를 하나씩 풀어 보세요. 기업 필터를 선택하면 회사별 질문만 좁혀서 볼 수 있습니다."
          action={
            <button className="btn" onClick={reset}>
              <Icon.Refresh /> 필터 초기화
            </button>
          }
        />
      ) : (
        <div className="stack">
          {list.map((item) => {
            const saved = state.answers[item.id];
            const isFav = state.favQuestions.includes(item.id);
            return (
              <div className="card" key={item.id}>
                <div className="row" style={{ marginBottom: 7 }}>
                  <span className="badge badge-accent">{item.area}</span>
                  <span className="badge">{item.level}</span>
                  {item.essential && <span className="badge badge-violet">필수</span>}
                  {saved?.text.trim() && (
                    <span className="badge badge-good">
                      <Icon.Check size={12} /> 답변 작성됨
                    </span>
                  )}
                  {saved?.practiced && <span className="badge badge-good">연습 완료</span>}
                </div>
                <h3 style={{ marginBottom: 6 }}>
                  <Link to={`/interview/${item.id}`}>{item.q}</Link>
                </h3>
                <p className="small" style={{ color: 'var(--text-2)' }}>
                  {item.intent}
                </p>
                <div className="btn-row">
                  <Link to={`/interview/${item.id}`} className="btn btn-sm btn-primary">
                    답변 구조 보고 작성
                  </Link>
                  <button
                    className="btn btn-sm"
                    aria-pressed={isFav}
                    aria-label={isFav ? '즐겨찾기 해제' : '즐겨찾기 추가'}
                    onClick={() => toggleFav('favQuestions', item.id)}
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
