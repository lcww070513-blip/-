import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { quizCategories, quizItems, quizTypeLabels } from '@/data/quiz';
import type { QuizItem } from '@/data/types';
import { useApp } from '@/store/store';
import { EmptyState, Icon } from '@/components/ui';

/* ── 채점 ─────────────────────────────────────────────── */
const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, '').replace(/[.,!?·]/g, '');

interface Response {
  choice?: number;
  ox?: boolean;
  text?: string;
  order?: string[];
  pairs?: Record<string, string>;
}

function grade(item: QuizItem, r: Response): boolean {
  switch (item.type) {
    case 'mcq':
    case 'case':
      return r.choice === item.answer;
    case 'ox':
      return r.ox === item.ox;
    case 'fill':
    case 'short':
      return Boolean(r.text && (item.accept ?? []).some((a) => normalize(a) === normalize(r.text!)));
    case 'order':
      return Boolean(r.order && item.order && r.order.every((v, i) => v === item.order![i]));
    case 'match':
      return Boolean(item.pairs && item.pairs.every((p) => r.pairs?.[p.l] === p.r));
    case 'essay':
      return true; // 서술형은 자가 채점이므로 시도만 기록합니다
    default:
      return false;
  }
}

function shuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i -= 1) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ── 문제 하나 ────────────────────────────────────────── */
function QuizCard({
  item,
  onGraded,
  seed,
}: {
  item: QuizItem;
  onGraded: (correct: boolean) => void;
  seed: number;
}) {
  const { state, addWrongNote, removeWrongNote } = useApp();
  const [res, setRes] = useState<Response>({});
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [essaySelf, setEssaySelf] = useState<'correct' | 'wrong' | null>(null);

  const shuffledOrder = useMemo(() => (item.order ? shuffle(item.order, seed) : []), [item.order, seed]);
  const shuffledRight = useMemo(() => (item.pairs ? shuffle(item.pairs.map((p) => p.r), seed + 7) : []), [item.pairs, seed]);

  useEffect(() => {
    setRes(item.type === 'order' ? { order: shuffledOrder } : {});
    setSubmitted(false);
    setCorrect(false);
    setEssaySelf(null);
  }, [item.id, shuffledOrder, item.type]);

  const inNote = Boolean(state.wrongNotes[item.id]);

  const submit = () => {
    const ok = grade(item, res);
    setCorrect(ok);
    setSubmitted(true);
    if (item.type !== 'essay') onGraded(ok);
  };

  const retry = () => {
    setRes(item.type === 'order' ? { order: shuffle(item.order ?? [], seed + Date.now() % 100) } : {});
    setSubmitted(false);
    setEssaySelf(null);
  };

  const move = (i: number, dir: -1 | 1) => {
    setRes((r) => {
      const arr = [...(r.order ?? [])];
      const j = i + dir;
      if (j < 0 || j >= arr.length) return r;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return { ...r, order: arr };
    });
  };

  const canSubmit = (() => {
    if (item.type === 'mcq' || item.type === 'case') return res.choice !== undefined;
    if (item.type === 'ox') return res.ox !== undefined;
    if (item.type === 'fill' || item.type === 'short' || item.type === 'essay') return Boolean(res.text?.trim());
    if (item.type === 'order') return true;
    if (item.type === 'match') return item.pairs?.every((p) => res.pairs?.[p.l]) ?? false;
    return false;
  })();

  return (
    <div className="card">
      <div className="row" style={{ marginBottom: 10 }}>
        <span className="badge badge-accent">{item.category}</span>
        <span className="badge">{quizTypeLabels[item.type]}</span>
        <span className="badge">{item.level}</span>
        <span className="badge mono">{item.id}</span>
      </div>

      <p style={{ fontWeight: 700, fontSize: '1.02rem', marginBottom: 14 }}>{item.q}</p>

      {/* 객관식 · 상황판단 */}
      {(item.type === 'mcq' || item.type === 'case') && (
        <div role="radiogroup" aria-label="선택지">
          {item.choices?.map((c, i) => {
            let st: string | undefined;
            if (submitted) {
              if (i === item.answer) st = 'correct';
              else if (i === res.choice) st = 'wrong';
            } else if (i === res.choice) st = 'selected';
            return (
              <button
                key={c}
                className="choice"
                data-state={st}
                disabled={submitted}
                onClick={() => setRes({ choice: i })}
                role="radio"
                aria-checked={res.choice === i}
              >
                <span className="choice-mark" aria-hidden="true">
                  {submitted && i === item.answer ? '✓' : submitted && i === res.choice ? '✕' : i + 1}
                </span>
                <span>{c}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* OX */}
      {item.type === 'ox' && (
        <div className="btn-row">
          {[
            { v: true, label: 'O (맞다)' },
            { v: false, label: 'X (틀리다)' },
          ].map((o) => {
            let st: string | undefined;
            if (submitted) {
              if (o.v === item.ox) st = 'correct';
              else if (o.v === res.ox) st = 'wrong';
            } else if (o.v === res.ox) st = 'selected';
            return (
              <button
                key={String(o.v)}
                className="choice"
                style={{ width: 'auto', minWidth: 150 }}
                data-state={st}
                disabled={submitted}
                onClick={() => setRes({ ox: o.v })}
              >
                <span className="choice-mark" aria-hidden="true">
                  {o.v ? 'O' : 'X'}
                </span>
                <span>{o.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* 빈칸 · 단답 · 서술 */}
      {(item.type === 'fill' || item.type === 'short' || item.type === 'essay') && (
        <div className="field">
          <label htmlFor={`in-${item.id}`} className="sr-only">
            답 입력
          </label>
          {item.type === 'essay' ? (
            <textarea
              id={`in-${item.id}`}
              className="textarea"
              placeholder="답변을 작성하세요. 서술형은 아래 채점 포인트로 직접 확인합니다."
              value={res.text ?? ''}
              onChange={(e) => setRes({ text: e.target.value })}
              disabled={submitted}
            />
          ) : (
            <input
              id={`in-${item.id}`}
              className="input"
              placeholder="답을 입력하세요"
              value={res.text ?? ''}
              onChange={(e) => setRes({ text: e.target.value })}
              disabled={submitted}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && canSubmit && !submitted) submit();
              }}
            />
          )}
        </div>
      )}

      {/* 순서 배열 */}
      {item.type === 'order' && (
        <div>
          <p className="tiny muted" style={{ marginBottom: 8 }}>
            위아래 버튼으로 순서를 맞추세요.
          </p>
          {(res.order ?? []).map((o, i) => {
            const isRight = submitted && item.order?.[i] === o;
            return (
              <div
                className="order-item"
                key={o}
                style={submitted ? { borderColor: isRight ? 'var(--good)' : 'var(--bad)' } : undefined}
              >
                <span className="num">{i + 1}</span>
                <span className="grow">{o}</span>
                {submitted ? (
                  <span className={isRight ? 'verdict-good' : 'verdict-bad'} style={{ display: 'flex' }}>
                    {isRight ? <Icon.Check /> : <Icon.X />}
                  </span>
                ) : (
                  <>
                    <button className="mini-btn" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`${o} 위로`}>
                      <Icon.Up size={14} />
                    </button>
                    <button
                      className="mini-btn"
                      onClick={() => move(i, 1)}
                      disabled={i === (res.order?.length ?? 0) - 1}
                      aria-label={`${o} 아래로`}
                    >
                      <Icon.Down size={14} />
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 용어 연결 */}
      {item.type === 'match' && (
        <div>
          {item.pairs?.map((p) => {
            const picked = res.pairs?.[p.l];
            const isRight = submitted && picked === p.r;
            return (
              <div className="field" key={p.l}>
                <label htmlFor={`m-${item.id}-${p.l}`}>{p.l}</label>
                <select
                  id={`m-${item.id}-${p.l}`}
                  className="select"
                  value={picked ?? ''}
                  disabled={submitted}
                  onChange={(e) => setRes((r) => ({ ...r, pairs: { ...(r.pairs ?? {}), [p.l]: e.target.value } }))}
                  style={submitted ? { borderColor: isRight ? 'var(--good)' : 'var(--bad)' } : undefined}
                >
                  <option value="">설명을 고르세요</option>
                  {shuffledRight.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                {submitted && !isRight && (
                  <p className="hint" style={{ color: 'var(--bad)' }}>
                    ✕ 정답: {p.r}
                  </p>
                )}
                {submitted && isRight && (
                  <p className="hint" style={{ color: 'var(--good)' }}>
                    ✔ 정답입니다
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!submitted ? (
        <button className="btn btn-primary" onClick={submit} disabled={!canSubmit} style={{ marginTop: 10 }}>
          <Icon.Check /> 정답 확인
        </button>
      ) : (
        <div style={{ marginTop: 14 }} role="status" aria-live="polite">
          {item.type === 'essay' ? (
            <div>
              <p className="verdict" style={{ color: 'var(--text-2)' }}>
                <Icon.Info /> 서술형은 아래 채점 포인트로 직접 확인하세요
              </p>
              <ul className="small" style={{ color: 'var(--text-2)' }}>
                {item.points?.map((p) => (
                  <li key={p.slice(0, 18)}>{p}</li>
                ))}
              </ul>
              <div className="btn-row" style={{ marginBottom: 10 }}>
                <button
                  className="btn btn-sm"
                  aria-pressed={essaySelf === 'correct'}
                  onClick={() => {
                    setEssaySelf('correct');
                    onGraded(true);
                  }}
                  disabled={essaySelf !== null}
                  style={essaySelf === 'correct' ? { borderColor: 'var(--good)', color: 'var(--good)' } : undefined}
                >
                  <Icon.Check /> 포인트를 대부분 담았다
                </button>
                <button
                  className="btn btn-sm"
                  aria-pressed={essaySelf === 'wrong'}
                  onClick={() => {
                    setEssaySelf('wrong');
                    onGraded(false);
                  }}
                  disabled={essaySelf !== null}
                  style={essaySelf === 'wrong' ? { borderColor: 'var(--bad)', color: 'var(--bad)' } : undefined}
                >
                  <Icon.X /> 빠뜨린 부분이 많다
                </button>
              </div>
            </div>
          ) : (
            <p className={`verdict ${correct ? 'verdict-good' : 'verdict-bad'}`}>
              {correct ? <Icon.Check /> : <Icon.X />}
              {correct ? '정답입니다' : '오답입니다'}
            </p>
          )}

          {(item.type === 'fill' || item.type === 'short') && !correct && (
            <p className="small" style={{ color: 'var(--text-2)' }}>
              정답 예: {item.accept?.join(', ')}
            </p>
          )}
          {item.type === 'order' && !correct && (
            <p className="small" style={{ color: 'var(--text-2)' }}>
              정답 순서: {item.order?.join(' → ')}
            </p>
          )}

          <p className="small" style={{ color: 'var(--text-2)' }}>
            <b>해설</b> · {item.explain}
          </p>

          {item.wrongWhy && res.choice !== undefined && res.choice !== item.answer && item.wrongWhy[res.choice] && (
            <p className="small" style={{ color: 'var(--text-2)' }}>
              <b>선택한 답이 틀린 이유</b> · {item.wrongWhy[res.choice]}
            </p>
          )}

          <div className="btn-row" style={{ marginTop: 10 }}>
            <button className="btn btn-sm" onClick={retry}>
              <Icon.Refresh /> 다시 풀기
            </button>
            {item.ref && (
              <Link className="btn btn-sm" to={item.ref.to}>
                <Icon.Book /> {item.ref.label}
              </Link>
            )}
            <button
              className="btn btn-sm"
              onClick={() => (inNote ? removeWrongNote(item.id) : addWrongNote(item.id, item.category))}
              aria-pressed={inNote}
              style={inNote ? { borderColor: 'var(--warn)', color: 'var(--warn)' } : undefined}
            >
              <Icon.Note /> {inNote ? '오답노트에 있음' : '오답노트에 저장'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── 페이지 ───────────────────────────────────────────── */
export default function Quiz() {
  const { state, recordAttempt } = useApp();
  const [params, setParams] = useSearchParams();

  const [category, setCategory] = useState(params.get('category') ?? '전체');
  const [type, setType] = useState('전체');
  const [level, setLevel] = useState('전체');
  const [mode, setMode] = useState<'browse' | 'session'>('browse');
  const [sessionIdx, setSessionIdx] = useState(0);
  const [sessionResults, setSessionResults] = useState<boolean[]>([]);
  const [seed] = useState(() => Math.floor(Math.random() * 1000));
  const focusId = params.get('focus');
  const paramCategory = params.get('category');

  // 이미 문제은행 화면에 있는 상태에서 다른 분류 링크로 들어와도 필터가 반영되도록 합니다.
  useEffect(() => {
    setCategory(paramCategory ?? '전체');
    setMode('browse');
    setSessionIdx(0);
    setSessionResults([]);
  }, [paramCategory]);

  const filtered = useMemo(() => {
    return quizItems.filter((q) => {
      if (focusId) return q.id === focusId;
      if (category !== '전체' && q.category !== category) return false;
      if (type !== '전체' && quizTypeLabels[q.type] !== type) return false;
      if (level !== '전체' && q.level !== level) return false;
      return true;
    });
  }, [category, type, level, focusId]);

  const sessionItems = useMemo(() => shuffle(filtered, seed).slice(0, 10), [filtered, seed]);

  const onGraded = (item: QuizItem) => (ok: boolean) => {
    recordAttempt(item.id, item.category, ok);
    if (mode === 'session') setSessionResults((r) => [...r, ok]);
  };

  const solvedIds = new Set(state.attempts.map((a) => a.id));
  const types = ['전체', ...Array.from(new Set(quizItems.map((q) => quizTypeLabels[q.type])))];

  return (
    <div>
      <div className="page-head">
        <h1>문제은행</h1>
        <p>
          객관식, OX, 빈칸 채우기, 순서 배열, 용어 연결, 상황 판단, 단답형, 서술형까지 {quizItems.length}문항이
          준비되어 있습니다. 문제를 풀면 정답과 해설, 오답 선택지가 틀린 이유, 관련 학습 페이지를 함께 보여 줍니다.
        </p>
      </div>

      {focusId && (
        <div className="note" style={{ marginBottom: 16 }}>
          <Icon.Info /> 검색에서 선택한 문제 하나만 보고 있습니다.{' '}
          <button className="btn btn-sm btn-ghost" onClick={() => setParams({})}>
            전체 문제 보기
          </button>
        </div>
      )}

      {!focusId && (
        <div className="card" style={{ marginBottom: 16 }}>
          <p className="tiny muted" style={{ fontWeight: 700, marginBottom: 6 }}>
            분류
          </p>
          <div className="chip-row" role="group" aria-label="분류 필터">
            {['전체', ...quizCategories].map((c) => (
              <button
                key={c}
                className="chip"
                aria-pressed={category === c}
                onClick={() => {
                  setCategory(c);
                  setMode('browse');
                }}
              >
                {c}
              </button>
            ))}
          </div>

          <p className="tiny muted" style={{ fontWeight: 700, margin: '12px 0 6px' }}>
            문제 유형
          </p>
          <div className="chip-row" role="group" aria-label="유형 필터">
            {types.map((t) => (
              <button key={t} className="chip" aria-pressed={type === t} onClick={() => setType(t)}>
                {t}
              </button>
            ))}
          </div>

          <p className="tiny muted" style={{ fontWeight: 700, margin: '12px 0 6px' }}>
            난이도
          </p>
          <div className="chip-row" role="group" aria-label="난이도 필터">
            {['전체', '기초', '실전', '심화'].map((l) => (
              <button key={l} className="chip" aria-pressed={level === l} onClick={() => setLevel(l)}>
                {l}
              </button>
            ))}
          </div>

          <div className="btn-row" style={{ marginTop: 14 }}>
            <button
              className="btn btn-primary"
              onClick={() => {
                setMode(mode === 'session' ? 'browse' : 'session');
                setSessionIdx(0);
                setSessionResults([]);
              }}
              disabled={filtered.length === 0}
            >
              <Icon.Quiz /> {mode === 'session' ? '전체 목록 보기' : '10문항 연습 시작'}
            </button>
            <button
              className="btn"
              onClick={() => {
                setCategory('전체');
                setType('전체');
                setLevel('전체');
                setMode('browse');
              }}
            >
              <Icon.Refresh /> 필터 초기화
            </button>
          </div>
        </div>
      )}

      <p className="small muted" role="status" aria-live="polite">
        {filtered.length}문항 · 지금까지 {solvedIds.size}문항을 풀어 봤습니다
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          title="조건에 맞는 문제가 없습니다"
          desc="분류와 유형, 난이도 조합에 해당하는 문제가 없습니다. 필터를 하나씩 풀어 보세요."
          action={
            <button
              className="btn"
              onClick={() => {
                setCategory('전체');
                setType('전체');
                setLevel('전체');
              }}
            >
              <Icon.Refresh /> 필터 초기화
            </button>
          }
        />
      ) : mode === 'session' ? (
        <div>
          <div className="card" style={{ marginBottom: 14 }}>
            <div className="spread">
              <span style={{ fontWeight: 700 }}>
                {sessionIdx + 1} / {sessionItems.length} 문항
              </span>
              <span className="small muted">
                정답 {sessionResults.filter(Boolean).length} · 오답 {sessionResults.filter((r) => !r).length}
              </span>
            </div>
            <div className="bar" style={{ marginTop: 8 }}>
              <i style={{ width: `${((sessionIdx + 1) / sessionItems.length) * 100}%` }} />
            </div>
          </div>

          {sessionItems[sessionIdx] && (
            <QuizCard item={sessionItems[sessionIdx]} onGraded={onGraded(sessionItems[sessionIdx])} seed={seed + sessionIdx} />
          )}

          <div className="btn-row" style={{ marginTop: 14 }}>
            {sessionIdx > 0 && (
              <button className="btn" onClick={() => setSessionIdx((i) => i - 1)}>
                이전 문항
              </button>
            )}
            {sessionIdx < sessionItems.length - 1 ? (
              <button className="btn btn-primary" onClick={() => setSessionIdx((i) => i + 1)}>
                다음 문항
              </button>
            ) : (
              <Link to="/wrong-notes" className="btn btn-primary">
                오답노트에서 복습하기
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="stack">
          {filtered.map((item, i) => (
            <QuizCard key={item.id} item={item} onGraded={onGraded(item)} seed={seed + i} />
          ))}
        </div>
      )}
    </div>
  );
}
