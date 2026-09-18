import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { quizItems } from '@/data/quiz';
import { interviewQuestions } from '@/data/interview';
import { learnUnits, mostWrongCategories, recentWrongs } from '@/lib/progress';
import { addDays, todayKey, useApp, type WrongNote } from '@/store/store';
import { EmptyState, Icon, Section } from '@/components/ui';

const REVIEW_OPTIONS = [
  { label: '오늘 복습', days: 0 },
  { label: '3일 후', days: 3 },
  { label: '7일 후', days: 7 },
  { label: '14일 후', days: 14 },
];

const IMPORTANCE = [
  { v: 1 as const, label: '낮음' },
  { v: 2 as const, label: '보통' },
  { v: 3 as const, label: '높음' },
];

function NoteCard({ note }: { note: WrongNote }) {
  const { updateWrongNote, removeWrongNote, recordAttempt } = useApp();
  const item = quizItems.find((q) => q.id === note.quizId);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(note.reason);
  const [pick, setPick] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  if (!item) {
    return (
      <div className="card">
        <p className="small muted" style={{ margin: 0 }}>
          이 문제({note.quizId})는 더 이상 문제은행에 없습니다.{' '}
          <button className="btn btn-sm" onClick={() => removeWrongNote(note.quizId)}>
            노트에서 삭제
          </button>
        </p>
      </div>
    );
  }

  const today = todayKey();
  const due = note.reviewAt <= today;
  const canAnswer = item.type === 'mcq' || item.type === 'case' || item.type === 'ox';

  const submitRetry = () => {
    const ok = item.type === 'ox' ? (pick === 1) === item.ox : pick === item.answer;
    setChecked(true);
    recordAttempt(item.id, item.category, ok);
  };

  return (
    <div className="card" style={due && !note.resolved ? { borderColor: 'var(--warn)' } : undefined}>
      <div className="row" style={{ marginBottom: 8 }}>
        <span className="badge badge-accent">{item.category}</span>
        <span className="badge">{item.level}</span>
        {note.resolved ? (
          <span className="badge badge-good">
            <Icon.Check size={12} /> 복습 완료
          </span>
        ) : due ? (
          <span className="badge badge-warn">
            <Icon.Alert size={12} /> 오늘 복습
          </span>
        ) : (
          <span className="badge">복습 예정 {note.reviewAt}</span>
        )}
        {note.wrongCount > 0 && <span className="badge badge-bad">틀린 횟수 {note.wrongCount}회</span>}
        <span className="badge">
          중요도 {IMPORTANCE.find((i) => i.v === note.importance)?.label}
        </span>
      </div>

      <p style={{ fontWeight: 700, marginBottom: 10 }}>{item.q}</p>

      {!open ? (
        <div className="btn-row">
          <button className="btn btn-sm btn-primary" onClick={() => setOpen(true)}>
            <Icon.Refresh /> 다시 풀기
          </button>
          {item.ref && (
            <Link className="btn btn-sm" to={item.ref.to}>
              <Icon.Book /> 관련 개념 보기
            </Link>
          )}
          <button className="btn btn-sm" onClick={() => removeWrongNote(note.quizId)}>
            <Icon.Trash /> 노트에서 제거
          </button>
        </div>
      ) : (
        <div>
          {canAnswer && (
            <div style={{ marginBottom: 10 }}>
              {item.type === 'ox'
                ? [
                    { i: 1, label: 'O (맞다)' },
                    { i: 0, label: 'X (틀리다)' },
                  ].map((o) => {
                    let st: string | undefined;
                    if (checked) {
                      const isAnswer = (o.i === 1) === item.ox;
                      if (isAnswer) st = 'correct';
                      else if (o.i === pick) st = 'wrong';
                    } else if (o.i === pick) st = 'selected';
                    return (
                      <button key={o.i} className="choice" data-state={st} disabled={checked} onClick={() => setPick(o.i)}>
                        <span className="choice-mark" aria-hidden="true">
                          {o.i === 1 ? 'O' : 'X'}
                        </span>
                        <span>{o.label}</span>
                      </button>
                    );
                  })
                : item.choices?.map((c, i) => {
                    let st: string | undefined;
                    if (checked) {
                      if (i === item.answer) st = 'correct';
                      else if (i === pick) st = 'wrong';
                    } else if (i === pick) st = 'selected';
                    return (
                      <button key={c} className="choice" data-state={st} disabled={checked} onClick={() => setPick(i)}>
                        <span className="choice-mark" aria-hidden="true">
                          {checked && i === item.answer ? '✓' : checked && i === pick ? '✕' : i + 1}
                        </span>
                        <span>{c}</span>
                      </button>
                    );
                  })}
              {!checked && (
                <button className="btn btn-primary btn-sm" onClick={submitRetry} disabled={pick === null}>
                  정답 확인
                </button>
              )}
            </div>
          )}

          {(!canAnswer || checked) && (
            <div className="note" style={{ marginBottom: 10 }}>
              <b>해설</b> · {item.explain}
              {item.accept && (
                <div style={{ marginTop: 6 }}>
                  <b>정답 예</b> · {item.accept.join(', ')}
                </div>
              )}
              {item.order && (
                <div style={{ marginTop: 6 }}>
                  <b>정답 순서</b> · {item.order.join(' → ')}
                </div>
              )}
              {item.points && (
                <ul style={{ marginTop: 6, marginBottom: 0 }}>
                  {item.points.map((p) => (
                    <li key={p.slice(0, 16)}>{p}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {checked && !note.resolved && (
            <p className="small" style={{ color: 'var(--text-2)' }}>
              연속 2회 정답을 맞히면 복습 완료로 바뀝니다. 현재 {note.solvedAfter}회 연속 정답입니다.
            </p>
          )}

          <div className="field">
            <label htmlFor={`why-${note.quizId}`}>헷갈린 이유 기록</label>
            <textarea
              id={`why-${note.quizId}`}
              className="textarea"
              style={{ minHeight: 70 }}
              placeholder="예: 건식과 습식 산화의 성장 속도를 반대로 외우고 있었다"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              onBlur={() => updateWrongNote(note.quizId, { reason })}
            />
          </div>

          <div className="field">
            <label>중요도</label>
            <div className="chip-row">
              {IMPORTANCE.map((i) => (
                <button
                  key={i.v}
                  className="chip"
                  aria-pressed={note.importance === i.v}
                  onClick={() => updateWrongNote(note.quizId, { importance: i.v })}
                >
                  {i.label}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label htmlFor={`date-${note.quizId}`}>다음 복습일</label>
            <div className="chip-row" style={{ marginBottom: 8 }}>
              {REVIEW_OPTIONS.map((o) => (
                <button
                  key={o.label}
                  className="chip"
                  aria-pressed={note.reviewAt === addDays(o.days)}
                  onClick={() => updateWrongNote(note.quizId, { reviewAt: addDays(o.days) })}
                >
                  {o.label}
                </button>
              ))}
            </div>
            <input
              id={`date-${note.quizId}`}
              type="date"
              className="input"
              value={note.reviewAt}
              onChange={(e) => updateWrongNote(note.quizId, { reviewAt: e.target.value })}
            />
          </div>

          <div className="btn-row">
            <button className="btn btn-sm" onClick={() => setOpen(false)}>
              접기
            </button>
            {item.ref && (
              <Link className="btn btn-sm" to={item.ref.to}>
                <Icon.Book /> 관련 개념 보기
              </Link>
            )}
            <button className="btn btn-sm" onClick={() => removeWrongNote(note.quizId)}>
              <Icon.Trash /> 노트에서 제거
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function WrongNotes() {
  const { state } = useApp();
  const [tab, setTab] = useState<'due' | 'all' | 'recent' | 'resolved'>('due');

  const notes = Object.values(state.wrongNotes);
  const today = todayKey();
  const due = notes.filter((n) => !n.resolved && n.reviewAt <= today);
  const recent = recentWrongs(state);
  const resolved = notes.filter((n) => n.resolved);
  const active = notes.filter((n) => !n.resolved);

  const shown = useMemo(() => {
    const list = tab === 'due' ? due : tab === 'recent' ? recent : tab === 'resolved' ? resolved : active;
    return [...list].sort((a, b) => b.importance - a.importance || a.reviewAt.localeCompare(b.reviewAt));
  }, [tab, due, recent, resolved, active]);

  const worst = mostWrongCategories(state);
  const favTopicUnits = state.favTopics
    .map((k) => learnUnits.find((u) => u.key === k))
    .filter(Boolean) as typeof learnUnits;
  const favQuestions = state.favQuestions
    .map((id) => interviewQuestions.find((q) => q.id === id))
    .filter(Boolean);
  const unpracticed = Object.values(state.answers).filter((a) => !a.practiced && a.text.trim());

  return (
    <div>
      <div className="page-head">
        <h1>오답노트와 복습</h1>
        <p>
          틀린 문제는 자동으로 저장됩니다. 헷갈린 이유를 기록하고 중요도와 복습일을 정해 두면, 정답을 연속 두 번 맞힐
          때까지 반복해서 볼 수 있습니다.
        </p>
      </div>

      <div className="grid grid-4" style={{ marginBottom: 16 }}>
        <div className="stat">
          <div className="stat-label">오늘 복습</div>
          <div className="stat-value">{due.length}</div>
        </div>
        <div className="stat">
          <div className="stat-label">복습 중</div>
          <div className="stat-value">{active.length}</div>
        </div>
        <div className="stat">
          <div className="stat-label">최근 7일 오답</div>
          <div className="stat-value">{recent.length}</div>
        </div>
        <div className="stat">
          <div className="stat-label">복습 완료</div>
          <div className="stat-value">{resolved.length}</div>
        </div>
      </div>

      <div className="chip-row" style={{ marginBottom: 16 }} role="group" aria-label="오답노트 보기 전환">
        {[
          { id: 'due', label: `오늘 복습 (${due.length})` },
          { id: 'all', label: `전체 복습 중 (${active.length})` },
          { id: 'recent', label: `최근 7일 (${recent.length})` },
          { id: 'resolved', label: `복습 완료 (${resolved.length})` },
        ].map((t) => (
          <button key={t.id} className="chip" aria-pressed={tab === t.id} onClick={() => setTab(t.id as typeof tab)}>
            {t.label}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <EmptyState
          title={tab === 'due' ? '오늘 복습할 오답이 없습니다' : '해당하는 오답이 없습니다'}
          desc={
            notes.length === 0
              ? '아직 틀린 문제가 없습니다. 문제은행에서 문제를 풀면 틀린 문제가 자동으로 여기에 모입니다.'
              : '다른 탭을 확인하거나 문제를 더 풀어 보세요.'
          }
          action={
            <Link to="/quiz" className="btn btn-primary">
              <Icon.Quiz /> 문제 풀러 가기
            </Link>
          }
        />
      ) : (
        <div className="stack">
          {shown.map((n) => (
            <NoteCard key={n.quizId} note={n} />
          ))}
        </div>
      )}

      {worst.length > 0 && (
        <Section id="weak" title="가장 많이 틀린 분야">
          <div className="table-wrap">
            <table>
              <caption className="sr-only">분야별 오답 횟수</caption>
              <thead>
                <tr>
                  <th scope="col">분야</th>
                  <th scope="col">틀린 횟수</th>
                  <th scope="col">복습</th>
                </tr>
              </thead>
              <tbody>
                {worst.map((w) => (
                  <tr key={w.category}>
                    <th scope="row">{w.category}</th>
                    <td>{w.count}회</td>
                    <td>
                      <Link to={`/quiz?category=${encodeURIComponent(w.category)}`} className="btn btn-sm">
                        이 분야 문제 풀기
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      <Section id="stuck" title="면접에서 자주 막힌 질문">
        {unpracticed.length === 0 ? (
          <p className="small muted">
            연습 완료 표시가 없는 답변이 없습니다. 면접 질문에 답변을 작성하면 여기에 모입니다.
          </p>
        ) : (
          <ul>
            {unpracticed.slice(0, 8).map((a) => {
              const q = interviewQuestions.find((x) => x.id === a.questionId);
              return (
                <li key={a.questionId}>
                  <Link to={`/interview/${a.questionId}`}>{q?.q ?? a.questionId}</Link>{' '}
                  <span className="tiny muted">(답변은 썼지만 연습 완료 표시 없음)</span>
                </li>
              );
            })}
          </ul>
        )}
      </Section>

      <Section id="fav" title="즐겨찾기한 학습 내용">
        {favTopicUnits.length === 0 && favQuestions.length === 0 ? (
          <p className="small muted">
            아직 즐겨찾기한 항목이 없습니다. 학습 페이지와 면접 질문에서 별 버튼을 눌러 모아 둘 수 있습니다.
          </p>
        ) : (
          <div className="grid grid-2">
            {favTopicUnits.length > 0 && (
              <div className="card">
                <h3 className="card-title">학습 항목</h3>
                <ul style={{ marginBottom: 0 }}>
                  {favTopicUnits.map((u) => (
                    <li key={u.key}>
                      <Link to={u.to}>{u.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {favQuestions.length > 0 && (
              <div className="card">
                <h3 className="card-title">면접 질문</h3>
                <ul style={{ marginBottom: 0 }}>
                  {favQuestions.map((q) => (
                    <li key={q!.id}>
                      <Link to={`/interview/${q!.id}`}>{q!.q}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Section>
    </div>
  );
}
