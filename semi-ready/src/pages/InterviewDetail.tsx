import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { answerLengths, feedbackCriteria, interviewQuestions } from '@/data/interview';
import { useApp } from '@/store/store';
import { AnswerDisclaimer, EmptyState, Icon, Section, Toc } from '@/components/ui';

export default function InterviewDetail() {
  const { id } = useParams();
  const { state, saveAnswer, deleteAnswer, toggleFav, pushRecent } = useApp();
  const item = interviewQuestions.find((q) => q.id === id);
  const saved = item ? state.answers[item.id] : undefined;

  const [text, setText] = useState(saved?.text ?? '');
  const [length, setLength] = useState(saved?.length ?? '60');
  const [checks, setChecks] = useState<string[]>(saved?.checks ?? []);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    setText(saved?.text ?? '');
    setLength(saved?.length ?? '60');
    setChecks(saved?.checks ?? []);
  }, [item?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (item) pushRecent({ key: `interview:${item.id}`, title: item.q, to: `/interview/${item.id}` });
  }, [item?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!item) {
    return (
      <EmptyState
        title="질문을 찾을 수 없습니다"
        desc="주소가 잘못되었거나 없는 질문입니다."
        action={
          <Link to="/interview" className="btn btn-primary">
            면접 질문은행으로
          </Link>
        }
      />
    );
  }

  const isFav = state.favQuestions.includes(item.id);
  const lengthInfo = answerLengths.find((l) => l.id === length) ?? answerLengths[2];

  const doSave = () => {
    saveAnswer(item.id, { text, length, checks });
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 2200);
  };

  const toc = [
    { id: 'intent', label: '질문 의도와 평가요소' },
    { id: 'structure', label: '답변 구조' },
    { id: 'must', label: '포함할 내용과 피할 표현' },
    { id: 'examples', label: '좋은 답변과 부족한 답변' },
    { id: 'follow', label: '추가 꼬리질문' },
    { id: 'write', label: '내 답변 작성' },
  ];

  return (
    <div className="with-toc">
      <div>
        <div className="page-head">
          <p className="crumb">
            <Link to="/interview">면접 준비</Link> <Icon.Chevron size={12} /> {item.area}
          </p>
          <h1>{item.q}</h1>
          <div className="row" style={{ marginBottom: 10 }}>
            <span className="badge badge-accent">{item.area}</span>
            <span className="badge">{item.level}</span>
            {item.essential && <span className="badge badge-violet">필수 질문</span>}
            {item.jobs.map((j) => (
              <span key={j} className="badge">
                {j}
              </span>
            ))}
          </div>
          <div className="btn-row">
            <button
              className="btn btn-sm"
              aria-pressed={isFav}
              onClick={() => toggleFav('favQuestions', item.id)}
              style={isFav ? { color: 'var(--warn)', borderColor: 'var(--warn)' } : undefined}
            >
              <Icon.Star filled={isFav} /> {isFav ? '즐겨찾기됨' : '즐겨찾기'}
            </button>
            <button
              className="btn btn-sm"
              aria-pressed={Boolean(saved?.practiced)}
              onClick={() => saveAnswer(item.id, { practiced: !saved?.practiced, text, length, checks })}
              style={saved?.practiced ? { borderColor: 'var(--good)', color: 'var(--good)' } : undefined}
            >
              <Icon.Check /> {saved?.practiced ? '연습 완료됨' : '연습 완료 표시'}
            </button>
          </div>
        </div>

        <Section id="intent" title="질문 의도와 평가요소">
          <p className="lead">{item.intent}</p>
          <h3>면접관이 보는 것</h3>
          <div className="chip-row">
            {item.criteria.map((c) => (
              <span key={c} className="badge badge-accent">
                {c}
              </span>
            ))}
          </div>
        </Section>

        <Section id="structure" title="답변 구조">
          <ol>
            {item.structure.map((s) => (
              <li key={s.slice(0, 20)}>{s}</li>
            ))}
          </ol>
        </Section>

        <Section id="must" title="반드시 포함할 내용과 피해야 할 표현">
          <div className="grid grid-2">
            <div className="card">
              <h3 className="card-title">
                <span className="badge badge-good">
                  <Icon.Check size={12} /> 포함할 내용
                </span>
              </h3>
              <ul className="small" style={{ marginBottom: 0, color: 'var(--text-2)' }}>
                {item.must.map((m) => (
                  <li key={m.slice(0, 18)}>{m}</li>
                ))}
              </ul>
            </div>
            <div className="card">
              <h3 className="card-title">
                <span className="badge badge-bad">
                  <Icon.X size={12} /> 피해야 할 표현
                </span>
              </h3>
              <ul className="small" style={{ marginBottom: 0, color: 'var(--text-2)' }}>
                {item.avoid.map((m) => (
                  <li key={m.slice(0, 18)}>{m}</li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        <Section id="examples" title="좋은 답변과 부족한 답변">
          <AnswerDisclaimer />
          <div className="card" style={{ marginTop: 12, borderColor: 'var(--good)' }}>
            <h3 className="card-title">
              <span className="badge badge-good">
                <Icon.Check size={12} /> 좋은 답변 예시
              </span>
            </h3>
            <p style={{ marginBottom: 0, color: 'var(--text-2)' }}>{item.good}</p>
          </div>
          <div className="card" style={{ borderColor: 'var(--bad)' }}>
            <h3 className="card-title">
              <span className="badge badge-bad">
                <Icon.X size={12} /> 부족한 답변 예시
              </span>
            </h3>
            <p style={{ marginBottom: 0, color: 'var(--text-2)' }}>{item.bad}</p>
          </div>
        </Section>

        <Section id="follow" title="추가 꼬리질문">
          <ul>
            {item.follow.map((f) => (
              <li key={f.slice(0, 20)}>{f}</li>
            ))}
          </ul>
          <p className="note">
            <Icon.Info /> 답변을 쓴 뒤 이 꼬리질문에 바로 답할 수 있는지 확인하세요. 막힌다면 그 부분이 근거가 약한
            지점입니다.
          </p>
        </Section>

        <Section id="write" title="내 답변 작성">
          <div className="card">
            <div className="field">
              <label htmlFor="ans-len">답변 길이</label>
              <div className="chip-row">
                {answerLengths.map((l) => (
                  <button key={l.id} className="chip" aria-pressed={length === l.id} onClick={() => setLength(l.id)}>
                    {l.label}
                  </button>
                ))}
              </div>
              <p className="hint" id="ans-len-hint">
                {lengthInfo.label} 분량은 {lengthInfo.chars} 정도입니다. {lengthInfo.guide}
              </p>
            </div>

            <div className="field">
              <label htmlFor="ans-text">답변</label>
              <textarea
                id="ans-text"
                className="textarea"
                aria-describedby="ans-len-hint ans-count"
                placeholder="답변 구조를 참고해 본인의 실제 경험으로 작성하세요."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <p className="hint" id="ans-count" aria-live="polite">
                현재 {text.length}자 · 목표 {lengthInfo.chars}
              </p>
            </div>

            <fieldset style={{ border: 'none', padding: 0, margin: '0 0 14px' }}>
              <legend className="tiny muted" style={{ fontWeight: 700, marginBottom: 6 }}>
                답변 자가 점검
              </legend>
              {feedbackCriteria.map((c) => (
                <label key={c.id} style={{ display: 'flex', gap: 9, alignItems: 'flex-start', marginBottom: 7 }}>
                  <input
                    type="checkbox"
                    checked={checks.includes(c.id)}
                    onChange={() =>
                      setChecks((p) => (p.includes(c.id) ? p.filter((x) => x !== c.id) : [...p, c.id]))
                    }
                    style={{ marginTop: 5 }}
                  />
                  <span>
                    <b style={{ fontSize: '0.9rem' }}>{c.label}</b>
                    <span className="tiny muted" style={{ display: 'block' }}>
                      {c.hint}
                    </span>
                  </span>
                </label>
              ))}
              <p className="hint">
                {checks.length}/{feedbackCriteria.length} 항목 확인함
              </p>
            </fieldset>

            <div className="btn-row">
              <button className="btn btn-primary" onClick={doSave} disabled={!text.trim()}>
                <Icon.Check /> 답변 저장
              </button>
              {saved && (
                <button
                  className="btn"
                  onClick={() => {
                    deleteAnswer(item.id);
                    setText('');
                    setChecks([]);
                  }}
                >
                  <Icon.Trash /> 저장한 답변 삭제
                </button>
              )}
              {savedFlash && (
                <span className="badge badge-good" role="status">
                  <Icon.Check size={12} /> 저장되었습니다
                </span>
              )}
            </div>
            {saved && (
              <p className="tiny muted" style={{ marginTop: 10, marginBottom: 0 }}>
                마지막 저장: {new Date(saved.updatedAt).toLocaleString('ko-KR')}
              </p>
            )}
          </div>
        </Section>
      </div>

      <Toc items={toc} />
    </div>
  );
}
