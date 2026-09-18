import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { troubleCases } from '@/data/equipment';
import type { TroubleOption } from '@/data/types';
import { Icon } from '@/components/ui';

const verdictMeta: Record<TroubleOption['verdict'], { label: string; cls: string; icon: React.ReactNode }> = {
  good: { label: '적절한 판단', cls: 'badge-good', icon: <Icon.Check size={12} /> },
  caution: { label: '주의가 필요한 선택', cls: 'badge-warn', icon: <Icon.Alert size={12} /> },
  danger: { label: '해서는 안 되는 선택', cls: 'badge-bad', icon: <Icon.X size={12} /> },
};

export default function Simulation() {
  const [caseIdx, setCaseIdx] = useState(0);
  const [picked, setPicked] = useState<string[]>([]);
  const cur = troubleCases[caseIdx];

  const reset = () => setPicked([]);
  const selectCase = (i: number) => {
    setCaseIdx(i);
    setPicked([]);
  };

  const remaining = cur.options.filter((o) => !picked.includes(o.id));
  const correctOrder = cur.options.filter((o) => o.rank > 0).sort((a, b) => a.rank - b.rank);
  const pickedGood = picked.filter((id) => cur.options.find((o) => o.id === id)?.rank ?? 0 > 0);
  const finished = remaining.length === 0 || pickedGood.length >= correctOrder.length;

  return (
    <div>
      <div className="page-head">
        <p className="crumb">
          <Link to="/equipment">장비와 설비 CS</Link> <Icon.Chevron size={12} /> 트러블슈팅 시뮬레이션
        </p>
        <h1>트러블슈팅 시뮬레이션</h1>
        <p>
          제시된 상황에서 확인할 항목을 하나씩 선택하면, 그 판단이 적절한지와 안전상 문제가 없는지, 현장에서는 어떤
          순서로 접근하는지, 면접에서는 어떻게 말하면 좋은지를 바로 확인할 수 있습니다.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <p className="tiny muted" style={{ marginBottom: 7, fontWeight: 700 }}>
          상황 선택
        </p>
        <div className="chip-row">
          {troubleCases.map((c, i) => (
            <button key={c.id} className="chip" aria-pressed={i === caseIdx} onClick={() => selectCase(i)}>
              {i + 1}. {c.title}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <h2 className="card-title">
          <Icon.Alert /> 상황
        </h2>
        <p className="lead">{cur.situation}</p>
        <p className="tiny muted" style={{ marginTop: 12, marginBottom: 5, fontWeight: 700 }}>
          알려진 정보
        </p>
        <ul className="small" style={{ color: 'var(--text-2)', marginBottom: 0 }}>
          {cur.context.map((c) => (
            <li key={c.slice(0, 20)}>{c}</li>
          ))}
        </ul>
      </div>

      <section aria-labelledby="pick-h">
        <h2 id="pick-h">확인할 항목을 선택하세요</h2>
        <div className="grid grid-2" style={{ marginBottom: 18 }}>
          {cur.options.map((o) => {
            const chosen = picked.includes(o.id);
            return (
              <button
                key={o.id}
                className="list-card"
                style={{
                  textAlign: 'left',
                  cursor: chosen ? 'default' : 'pointer',
                  opacity: chosen ? 0.55 : 1,
                  borderColor: chosen ? 'var(--border)' : undefined,
                }}
                disabled={chosen}
                onClick={() => setPicked((p) => [...p, o.id])}
              >
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <h3 style={{ margin: 0 }}>{o.label}</h3>
                  {chosen && <span className="badge">선택함</span>}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {picked.length > 0 && (
        <section aria-labelledby="fb-h" aria-live="polite">
          <h2 id="fb-h">선택에 대한 피드백</h2>
          {picked.map((id, i) => {
            const o = cur.options.find((x) => x.id === id)!;
            const meta = verdictMeta[o.verdict];
            return (
              <div className="card" key={id}>
                <div className="row" style={{ marginBottom: 8 }}>
                  <span className="badge">{i + 1}번째 선택</span>
                  <span className={`badge ${meta.cls}`}>
                    {meta.icon} {meta.label}
                  </span>
                  {o.rank > 0 && <span className="badge badge-accent">현장 순서 {o.rank}번</span>}
                  {o.rank < 0 && <span className="badge badge-bad">순서에 포함되지 않음</span>}
                </div>
                <h3 style={{ marginBottom: 10 }}>{o.label}</h3>
                <dl className="kv" style={{ marginBottom: 0 }}>
                  <dt>안전 관점</dt>
                  <dd>{o.safety}</dd>
                  <dt>현장에서는</dt>
                  <dd>{o.field}</dd>
                  <dt>면접에서는</dt>
                  <dd style={{ color: 'var(--text)' }}>{o.interview}</dd>
                </dl>
              </div>
            );
          })}
        </section>
      )}

      {finished && (
        <section aria-labelledby="sum-h" style={{ marginTop: 20 }}>
          <h2 id="sum-h">정리</h2>
          <div className="card">
            <h3 className="card-title">현장에서 일반적으로 접근하는 순서</h3>
            <ol>
              {correctOrder.map((o) => (
                <li key={o.id}>{o.label}</li>
              ))}
            </ol>
            <p style={{ color: 'var(--text-2)', marginBottom: 0 }}>{cur.wrapUp}</p>
          </div>
          <div className="card">
            <h3 className="card-title">이 상황을 면접에서 말할 때 쓰는 뼈대</h3>
            <p className="small" style={{ color: 'var(--text-2)' }}>
              어떤 고장 상황을 받아도 아래 순서로 답하면 논리적으로 들립니다.
            </p>
            <div className="flow">
              {['현상 확인', '안전 확보', '알람·로그', '최근 변경', '원인 축소', '조치', '시험가동', '기록·인수인계'].map((s, i) => (
                <div className="flow-step" key={s}>
                  <span className="n">{i + 1}</span>
                  {s}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="btn-row" style={{ marginTop: 18 }}>
        <button className="btn" onClick={reset} disabled={picked.length === 0}>
          <Icon.Refresh /> 이 상황 다시 하기
        </button>
        {caseIdx < troubleCases.length - 1 && (
          <button className="btn btn-primary" onClick={() => selectCase(caseIdx + 1)}>
            다음 상황으로
          </button>
        )}
        <Link to="/equipment/troubleshooting-basic" className="btn">
          트러블슈팅 기본 흐름 학습
        </Link>
      </div>
    </div>
  );
}
