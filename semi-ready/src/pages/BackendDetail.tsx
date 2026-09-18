import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { backendSteps } from '@/data/backend';
import { useApp } from '@/store/store';
import Figure from '@/components/Figure';
import { CompleteButton, EmptyState, FavButton, Icon, Section, TermList } from '@/components/ui';

export default function BackendDetail() {
  const { id } = useParams();
  const { state, toggleComplete, toggleFav, pushRecent } = useApp();
  const step = backendSteps.find((b) => b.id === id);

  useEffect(() => {
    if (step) pushRecent({ key: `backend:${step.id}`, title: step.title, to: `/backend/${step.id}` });
  }, [step?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!step) {
    return (
      <EmptyState
        title="후공정 항목을 찾을 수 없습니다"
        desc="주소가 잘못되었거나 없는 항목입니다."
        action={
          <Link to="/backend" className="btn btn-primary">
            후공정 목록으로
          </Link>
        }
      />
    );
  }

  const key = `backend:${step.id}`;
  const done = Boolean(state.completed[key]);
  const fav = state.favTopics.includes(key);
  const prev = backendSteps.find((b) => b.order === step.order - 1);
  const next = backendSteps.find((b) => b.order === step.order + 1);

  return (
    <div>
      <div className="page-head">
        <p className="crumb">
          <Link to="/backend">후공정과 패키징</Link> <Icon.Chevron size={12} /> {step.order}단계
        </p>
        <h1>
          {step.title} <span className="muted" style={{ fontSize: '0.95rem', fontWeight: 500 }}>{step.en}</span>
        </h1>
        <div className="btn-row" style={{ marginTop: 10 }}>
          <CompleteButton done={done} onToggle={() => toggleComplete(key)} />
          <FavButton on={fav} onToggle={() => toggleFav('favTopics', key)} label={step.title} />
        </div>
      </div>

      <Section id="intro" title="한 줄 정의">
        <p className="lead">{step.oneLine}</p>
        {step.body.map((p) => (
          <p key={p.slice(0, 20)}>{p}</p>
        ))}
        <Figure name={step.figure} />
      </Section>

      <Section id="points" title="핵심 포인트">
        <ul>
          {step.points.map((p) => (
            <li key={p.slice(0, 20)}>{p}</li>
          ))}
        </ul>
      </Section>

      <Section id="roles" title="직군별 담당 범위">
        <div className="grid grid-3">
          <div className="card">
            <h3 className="card-title">생산직</h3>
            <p className="small" style={{ margin: 0, color: 'var(--text-2)' }}>
              {step.byRole.production}
            </p>
          </div>
          <div className="card">
            <h3 className="card-title">장비·설비직</h3>
            <p className="small" style={{ margin: 0, color: 'var(--text-2)' }}>
              {step.byRole.equipment}
            </p>
          </div>
          <div className="card">
            <h3 className="card-title">품질직</h3>
            <p className="small" style={{ margin: 0, color: 'var(--text-2)' }}>
              {step.byRole.quality}
            </p>
          </div>
        </div>
      </Section>

      <Section id="defects" title="대표 불량">
        <div className="chip-row">
          {step.defects.map((d) => (
            <span key={d} className="badge badge-bad">
              <Icon.Alert size={12} /> {d}
            </span>
          ))}
        </div>
      </Section>

      {step.terms.length > 0 && (
        <Section id="terms" title="관련 용어">
          <TermList terms={step.terms} />
        </Section>
      )}

      <nav className="spread" style={{ marginTop: 24 }} aria-label="이전 다음 단계">
        {prev ? (
          <Link to={`/backend/${prev.id}`} className="btn btn-sm">
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={`/backend/${next.id}`} className="btn btn-sm">
            {next.title} →
          </Link>
        ) : (
          <Link to="/equipment" className="btn btn-sm">
            장비·CS 학습으로 →
          </Link>
        )}
      </nav>
    </div>
  );
}
