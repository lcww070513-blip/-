import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { interviewQuestions } from '@/data/interview';
import { companies } from '@/data/companies';
import { useApp, type MockResult } from '@/store/store';
import { Icon, Section } from '@/components/ui';

/* ============================================================
   모의면접은 질문은행 기반 시뮬레이션입니다.
   생성형 AI와 연결되어 있지 않으므로 데모 모드임을 분명히 표시하고,
   점수는 답변 길이·구조 같은 확인 가능한 지표에서만 계산합니다.
   ============================================================ */

const EVAL_AXES = [
  { id: 'job', label: '직무 이해도' },
  { id: 'base', label: '반도체 기초지식' },
  { id: 'solve', label: '문제해결력' },
  { id: 'safety', label: '안전의식' },
  { id: 'quality', label: '품질의식' },
  { id: 'team', label: '협업 태도' },
  { id: 'company', label: '회사 이해도' },
  { id: 'concrete', label: '답변 구체성' },
  { id: 'logic', label: '말의 논리성' },
  { id: 'honest', label: '과장 및 모순 여부' },
] as const;

/** 답변 텍스트에서 확인 가능한 신호만 본다. 내용 판단이 아니라 점검 항목이다. */
const KEYWORDS: Record<string, string[]> = {
  job: ['직무', '업무', '담당', '역할', '공정', '설비', '장비', '생산'],
  base: ['반도체', '웨이퍼', '공정', '트랜지스터', '수율', '포토', '식각', '증착', '패키지'],
  solve: ['확인', '원인', '분석', '순서', '먼저', '점검', '그다음', '판단'],
  safety: ['안전', '보호구', 'LOTO', '인터록', '절차', '규정', '위험'],
  quality: ['품질', '불량', '기준', '검사', '수율', '규격'],
  team: ['동료', '선배', '보고', '협업', '인수인계', '공유', '함께'],
  company: ['회사', '귀사', '제품', '사업', '고객'],
  concrete: ['때', '경험', '했습니다', '개월', '년', '직접'],
  logic: ['먼저', '그다음', '따라서', '그래서', '왜냐하면', '첫째', '둘째'],
  honest: ['최고', '완벽', '무조건', '절대', '누구보다'],
};

function scoreAnswer(axis: string, text: string): number {
  const t = text.trim();
  if (t.length === 0) return 0;
  const words = KEYWORDS[axis] ?? [];
  const hits = words.filter((w) => t.includes(w)).length;

  if (axis === 'honest') {
    // 과장 표현이 많을수록 낮게 본다
    return Math.max(1, 5 - hits);
  }
  if (axis === 'concrete') {
    const lengthScore = t.length >= 220 ? 3 : t.length >= 120 ? 2 : 1;
    return Math.min(5, lengthScore + Math.min(2, hits));
  }
  return Math.min(5, 1 + hits);
}

export default function MockInterview() {
  const { state, addMock } = useApp();
  const [phase, setPhase] = useState<'setup' | 'run' | 'result'>('setup');

  const [company, setCompany] = useState('');
  const [job, setJob] = useState('생산');
  const [level, setLevel] = useState('실전');
  const [ratio, setRatio] = useState<'balanced' | 'personality' | 'technical' | 'cs'>('balanced');
  const [count, setCount] = useState(5);
  const [usePressure, setUsePressure] = useState(false);
  const [useFollow, setUseFollow] = useState(true);

  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [followShown, setFollowShown] = useState<Record<string, boolean>>({});
  const [result, setResult] = useState<MockResult | null>(null);

  const picked = useMemo(() => {
    let pool = interviewQuestions.filter((q) => q.jobs.includes(job as never));
    if (!usePressure) pool = pool.filter((q) => q.level !== '압박');
    if (level !== '전체') pool = pool.filter((q) => q.level === level || q.essential);

    const byArea = (areas: string[]) => pool.filter((q) => areas.includes(q.area));
    const personality = byArea(['인성면접', '자기소개', '교대근무', '마지막 할 말']);
    const technical = byArea(['직무면접', '상황면접', '안전면접']);
    const cs = byArea(['반도체 CS']);
    const motive = byArea(['지원동기', '회사별 질문']);

    const take = (arr: typeof pool, n: number) => arr.slice(0, n);
    let selected: typeof pool = [];
    if (ratio === 'personality') selected = [...take(personality, count - 1), ...take(motive, 1)];
    else if (ratio === 'technical') selected = [...take(technical, count - 1), ...take(cs, 1)];
    else if (ratio === 'cs') selected = [...take(cs, count - 1), ...take(technical, 1)];
    else
      selected = [
        ...take(personality, Math.ceil(count * 0.3)),
        ...take(cs, Math.ceil(count * 0.3)),
        ...take(technical, Math.ceil(count * 0.2)),
        ...take(motive, Math.ceil(count * 0.2)),
      ];

    const dedup = Array.from(new Map(selected.map((q) => [q.id, q])).values());
    if (dedup.length < count) {
      for (const q of pool) {
        if (dedup.length >= count) break;
        if (!dedup.find((x) => x.id === q.id)) dedup.push(q);
      }
    }
    return dedup.slice(0, count);
  }, [job, level, ratio, count, usePressure]);

  const start = () => {
    setIdx(0);
    setAnswers({});
    setFollowShown({});
    setPhase('run');
  };

  const finish = () => {
    const answered = picked.filter((q) => (answers[q.id] ?? '').trim().length > 0).length;
    const scores: Record<string, number> = {};
    EVAL_AXES.forEach((ax) => {
      const per = picked.map((q) => scoreAnswer(ax.id, answers[q.id] ?? ''));
      const avg = per.reduce((a, b) => a + b, 0) / (per.length || 1);
      scores[ax.id] = Math.round(avg * 10) / 10;
    });
    const total = Math.round((Object.values(scores).reduce((a, b) => a + b, 0) / (EVAL_AXES.length * 5)) * 100);
    const r: MockResult = {
      id: `mock-${Date.now()}`,
      ts: Date.now(),
      company: company || '미지정',
      job,
      level,
      questionCount: picked.length,
      answered,
      scores,
      total,
    };
    setResult(r);
    addMock(r);
    setPhase('result');
  };

  const cur = picked[idx];
  const curAnswer = cur ? (answers[cur.id] ?? '') : '';

  return (
    <div>
      <div className="page-head">
        <p className="crumb">
          <Link to="/interview">면접 준비</Link> <Icon.Chevron size={12} /> 모의면접
        </p>
        <h1>모의면접</h1>
      </div>

      <div className="note note-warn" style={{ marginBottom: 18 }}>
        <Icon.Alert /> <b>데모 모드입니다.</b> 이 모의면접은 생성형 AI와 연결되어 있지 않습니다. 질문은행에서 조건에 맞는
        질문을 골라 순서대로 제시하고, 종합평가는 답변 길이와 핵심어 포함 여부처럼 기계적으로 확인 가능한 지표만
        계산합니다. 답변 내용의 사실성이나 설득력을 판단하지는 못하므로, 점수보다 아래에 나오는 점검 항목과 다시 학습할
        내용을 활용하시기 바랍니다.
      </div>

      {phase === 'setup' && (
        <Section id="setup" title="면접 조건 설정">
          <div className="card">
            <div className="grid grid-2">
              <div className="field">
                <label htmlFor="mk-co">지원 기업</label>
                <select id="mk-co" className="select" value={company} onChange={(e) => setCompany(e.target.value)}>
                  <option value="">미지정</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="mk-job">지원 직무</label>
                <select id="mk-job" className="select" value={job} onChange={(e) => setJob(e.target.value)}>
                  {['생산', '설비', '장비 CS', '공정', '품질', '테스트'].map((j) => (
                    <option key={j} value={j}>
                      {j}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="mk-lv">면접 난이도</label>
                <select id="mk-lv" className="select" value={level} onChange={(e) => setLevel(e.target.value)}>
                  {['기초', '실전', '심화', '전체'].map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="mk-cnt">질문 수</label>
                <select id="mk-cnt" className="select" value={count} onChange={(e) => setCount(Number(e.target.value))}>
                  {[3, 5, 7, 10].map((n) => (
                    <option key={n} value={n}>
                      {n}개
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field">
              <label>인성 · 직무 · CS 비중</label>
              <div className="chip-row">
                {[
                  { id: 'balanced', label: '균형' },
                  { id: 'personality', label: '인성 중심' },
                  { id: 'technical', label: '직무 중심' },
                  { id: 'cs', label: '반도체 CS 중심' },
                ].map((r) => (
                  <button key={r.id} className="chip" aria-pressed={ratio === r.id} onClick={() => setRatio(r.id as typeof ratio)}>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="chip-row">
              <button className="chip" aria-pressed={usePressure} onClick={() => setUsePressure((v) => !v)}>
                압박 질문 포함
              </button>
              <button className="chip" aria-pressed={useFollow} onClick={() => setUseFollow((v) => !v)}>
                꼬리질문 사용
              </button>
            </div>

            <p className="hint">현재 조건으로 {picked.length}개 질문이 준비됩니다.</p>

            <button className="btn btn-primary" onClick={start} disabled={picked.length === 0}>
              <Icon.Mic /> 모의면접 시작
            </button>
          </div>
        </Section>
      )}

      {phase === 'run' && cur && (
        <Section id="run" title={`질문 ${idx + 1} / ${picked.length}`}>
          <div className="card">
            <div className="row" style={{ marginBottom: 10 }}>
              <span className="badge badge-accent">{cur.area}</span>
              <span className="badge">{cur.level}</span>
              {company && <span className="badge">{company}</span>}
              <span className="badge">{job}</span>
            </div>
            <h2 style={{ marginBottom: 14 }}>{cur.q}</h2>

            <div className="field">
              <label htmlFor="mk-ans">답변을 입력하세요</label>
              <textarea
                id="mk-ans"
                className="textarea"
                placeholder="실제 면접처럼 말하듯이 작성해 보세요."
                value={curAnswer}
                onChange={(e) => setAnswers((a) => ({ ...a, [cur.id]: e.target.value }))}
              />
              <p className="hint">{curAnswer.length}자</p>
            </div>

            {useFollow && curAnswer.trim().length > 20 && (
              <div className="card" style={{ background: 'var(--surface-2)' }}>
                <div className="spread">
                  <h3 className="card-title" style={{ margin: 0 }}>
                    꼬리질문
                  </h3>
                  {!followShown[cur.id] && (
                    <button className="btn btn-sm" onClick={() => setFollowShown((f) => ({ ...f, [cur.id]: true }))}>
                      꼬리질문 받기
                    </button>
                  )}
                </div>
                {followShown[cur.id] && (
                  <ul className="small" style={{ marginTop: 10, marginBottom: 0, color: 'var(--text-2)' }}>
                    {cur.follow.map((f) => (
                      <li key={f.slice(0, 18)}>{f}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div className="btn-row" style={{ marginTop: 14 }}>
              {idx > 0 && (
                <button className="btn" onClick={() => setIdx((i) => i - 1)}>
                  이전 질문
                </button>
              )}
              {idx < picked.length - 1 ? (
                <button className="btn btn-primary" onClick={() => setIdx((i) => i + 1)}>
                  다음 질문
                </button>
              ) : (
                <button className="btn btn-primary" onClick={finish}>
                  면접 종료하고 평가 보기
                </button>
              )}
              <button className="btn btn-ghost" onClick={() => setPhase('setup')}>
                중단하고 조건 다시 설정
              </button>
            </div>
          </div>
        </Section>
      )}

      {phase === 'result' && result && (
        <>
          <Section id="score" title="종합평가">
            <div className="card">
              <div className="row" style={{ marginBottom: 12 }}>
                <span className="badge badge-accent">{result.company}</span>
                <span className="badge">{result.job}</span>
                <span className="badge">{result.level}</span>
                <span className="badge">
                  {result.answered}/{result.questionCount}문항 답변
                </span>
              </div>
              <div className="table-wrap">
                <table>
                  <caption className="sr-only">모의면접 항목별 평가</caption>
                  <thead>
                    <tr>
                      <th scope="col">평가 항목</th>
                      <th scope="col">점수 (5점 만점)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {EVAL_AXES.map((ax) => (
                      <tr key={ax.id}>
                        <th scope="row">{ax.label}</th>
                        <td>{result.scores[ax.id]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="tiny muted" style={{ marginTop: 10 }}>
                이 점수는 답변 길이와 핵심어 포함 여부로 계산한 참고값입니다. 실제 면접 평가와는 다릅니다.
              </p>
            </div>
          </Section>

          <Section id="feedback" title="점검 결과">
            <div className="grid grid-2">
              <div className="card">
                <h3 className="card-title">
                  <span className="badge badge-good">
                    <Icon.Check size={12} /> 잘한 점
                  </span>
                </h3>
                <ul className="small" style={{ marginBottom: 0, color: 'var(--text-2)' }}>
                  {EVAL_AXES.filter((a) => result.scores[a.id] >= 4).map((a) => (
                    <li key={a.id}>{a.label} 관련 표현이 답변에 충분히 담겨 있습니다.</li>
                  ))}
                  {EVAL_AXES.filter((a) => result.scores[a.id] >= 4).length === 0 && (
                    <li>아직 두드러지는 항목이 없습니다. 답변을 더 구체적으로 써 보세요.</li>
                  )}
                </ul>
              </div>
              <div className="card">
                <h3 className="card-title">
                  <span className="badge badge-warn">
                    <Icon.Alert size={12} /> 부족한 점
                  </span>
                </h3>
                <ul className="small" style={{ marginBottom: 0, color: 'var(--text-2)' }}>
                  {EVAL_AXES.filter((a) => result.scores[a.id] <= 2).map((a) => (
                    <li key={a.id}>{a.label} 관련 내용이 답변에 거의 보이지 않습니다.</li>
                  ))}
                  {EVAL_AXES.filter((a) => result.scores[a.id] <= 2).length === 0 && <li>크게 비어 있는 항목은 없습니다.</li>}
                </ul>
              </div>
            </div>

            <div className="card" style={{ borderColor: 'var(--bad)' }}>
              <h3 className="card-title">
                <span className="badge badge-bad">
                  <Icon.Alert size={12} /> 위험할 수 있는 답변
                </span>
              </h3>
              {result.scores.honest <= 3 ? (
                <p className="small" style={{ margin: 0, color: 'var(--text-2)' }}>
                  최고, 완벽, 무조건, 절대, 누구보다 같은 단정적 표현이 답변에 들어 있습니다. 근거 없이 쓰면 과장으로
                  읽히고 꼬리질문에서 반박당하기 쉽습니다. 수치나 구체적 사실로 바꾸거나 표현을 덜어 내세요.
                </p>
              ) : (
                <p className="small" style={{ margin: 0, color: 'var(--text-2)' }}>
                  과장으로 읽힐 만한 단정적 표현은 발견되지 않았습니다. 다만 사실과 다른 경험을 쓰지 않았는지는 본인이
                  직접 확인해야 합니다.
                </p>
              )}
            </div>

            <div className="card">
              <h3 className="card-title">더 구체화할 부분과 개선 방향</h3>
              <ul className="small" style={{ color: 'var(--text-2)' }}>
                <li>
                  답변이 100자 미만인 질문이 {picked.filter((q) => (answers[q.id] ?? '').trim().length < 100).length}개
                  있습니다. 결론, 근거 경험, 직무 연결의 세 부분이 모두 들어갔는지 확인해 보세요.
                </li>
                <li>
                  본인이 무엇을 했는지 드러나지 않으면 평가하기 어렵습니다. 우리가 아니라 제가 무엇을 했다는 문장이
                  있는지 확인하세요.
                </li>
                <li>
                  안전과 품질 관점은 제조 직무 면접에서 특히 중요합니다. 관련 질문이 아니어도 한 문장 덧붙이면 인상이
                  달라집니다.
                </li>
              </ul>
            </div>

            <div className="card">
              <h3 className="card-title">다시 학습할 CS 항목</h3>
              <div className="chip-row">
                {result.scores.base <= 3 && (
                  <Link className="badge badge-accent" to="/basics">
                    반도체 기초 다시 보기
                  </Link>
                )}
                {result.scores.job <= 3 && (
                  <Link className="badge badge-accent" to="/jobs">
                    직무 이해 다시 보기
                  </Link>
                )}
                {result.scores.safety <= 3 && (
                  <Link className="badge badge-accent" to="/basics/safety">
                    안전이 중요한 이유
                  </Link>
                )}
                {result.scores.quality <= 3 && (
                  <Link className="badge badge-accent" to="/basics/yield">
                    수율과 품질
                  </Link>
                )}
                {result.scores.company <= 3 && (
                  <Link className="badge badge-accent" to="/companies">
                    기업 분석
                  </Link>
                )}
                {result.scores.solve <= 3 && (
                  <Link className="badge badge-accent" to="/equipment/troubleshooting-basic">
                    트러블슈팅 기본 흐름
                  </Link>
                )}
              </div>
            </div>

            <div className="card">
              <h3 className="card-title">예상 후속 질문</h3>
              <ul className="small" style={{ marginBottom: 0, color: 'var(--text-2)' }}>
                {picked.flatMap((q) => q.follow.slice(0, 1)).map((f) => (
                  <li key={f.slice(0, 20)}>{f}</li>
                ))}
              </ul>
            </div>
          </Section>

          <div className="btn-row" style={{ marginTop: 16 }}>
            <button className="btn btn-primary" onClick={() => setPhase('setup')}>
              <Icon.Refresh /> 다시 면접 보기
            </button>
            <Link to="/dashboard" className="btn">
              학습 대시보드에서 기록 보기
            </Link>
          </div>
        </>
      )}

      {state.mocks.length > 0 && phase === 'setup' && (
        <Section id="history" title="지난 모의면접 기록">
          <div className="table-wrap">
            <table>
              <caption className="sr-only">지난 모의면접 기록</caption>
              <thead>
                <tr>
                  <th scope="col">일시</th>
                  <th scope="col">기업</th>
                  <th scope="col">직무</th>
                  <th scope="col">답변</th>
                  <th scope="col">종합</th>
                </tr>
              </thead>
              <tbody>
                {state.mocks.slice(0, 8).map((m) => (
                  <tr key={m.id}>
                    <th scope="row">{new Date(m.ts).toLocaleDateString('ko-KR')}</th>
                    <td>{m.company}</td>
                    <td>{m.job}</td>
                    <td>
                      {m.answered}/{m.questionCount}
                    </td>
                    <td>{m.total}점</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}
    </div>
  );
}
