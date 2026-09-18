import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { processSteps } from '@/data/processes';
import { useApp } from '@/store/store';
import Figure from '@/components/Figure';
import { Accordion, CompleteButton, EmptyState, FavButton, Icon, Section, Toc } from '@/components/ui';

export default function ProcessDetail() {
  const { id } = useParams();
  const { state, toggleComplete, toggleFav, pushRecent } = useApp();
  const step = processSteps.find((p) => p.id === id);

  useEffect(() => {
    if (step) pushRecent({ key: `process:${step.id}`, title: step.title, to: `/process/${step.id}` });
  }, [step?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!step) {
    return (
      <EmptyState
        title="공정을 찾을 수 없습니다"
        desc="주소가 잘못되었거나 없는 항목입니다. 공정 목록에서 다시 선택해 주세요."
        action={
          <Link to="/process" className="btn btn-primary">
            공정 목록으로
          </Link>
        }
      />
    );
  }

  const key = `process:${step.id}`;
  const done = Boolean(state.completed[key]);
  const fav = state.favTopics.includes(key);
  const prev = processSteps.find((p) => p.order === step.order - 1);
  const next = processSteps.find((p) => p.order === step.order + 1);

  const toc = [
    { id: 'purpose', label: '공정 목적' },
    { id: 'state', label: '공정 전후 상태' },
    { id: 'principle', label: '핵심 원리' },
    { id: 'detail', label: '세부 내용' },
    { id: 'equip', label: '주요 장비' },
    { id: 'vars', label: '핵심 공정 변수' },
    { id: 'defect', label: '대표 불량과 원인' },
    { id: 'roles', label: '직무별 확인 사항' },
    { id: 'safety', label: '안전상 주의점' },
    { id: 'question', label: '면접 예상 질문' },
    { id: 'link', label: '공정 간 연결 관계' },
  ];

  return (
    <div className="with-toc">
      <div>
        <div className="page-head">
          <p className="crumb">
            <Link to="/process">반도체 8대 공정</Link> <Icon.Chevron size={12} /> {step.order}단계
          </p>
          <h1>
            {step.title} <span className="muted" style={{ fontSize: '0.95rem', fontWeight: 500 }}>{step.en}</span>
          </h1>
          <div className="btn-row" style={{ marginTop: 10 }}>
            <CompleteButton done={done} onToggle={() => toggleComplete(key)} />
            <FavButton on={fav} onToggle={() => toggleFav('favTopics', key)} label={step.title} />
            <span className="badge">
              <Icon.Clock size={12} /> 약 {step.readMinutes}분
            </span>
          </div>
        </div>

        <div className="flow" style={{ marginBottom: 18 }}>
          {processSteps.map((p) => (
            <Link key={p.id} to={`/process/${p.id}`} className={`flow-step${p.id === step.id ? ' active' : ''}${state.completed[`process:${p.id}`] ? ' done' : ''}`}>
              <span className="n">{p.order}</span>
              {p.title}
            </Link>
          ))}
        </div>

        <Section id="purpose" title="공정 목적">
          <p className="lead">{step.purpose}</p>
          <Figure name={step.figure} caption={step.figureCaption} />
        </Section>

        <Section id="state" title="공정 전후 웨이퍼 상태">
          <div className="grid grid-2">
            <div className="card">
              <h3 className="card-title">공정 전</h3>
              <p style={{ margin: 0, color: 'var(--text-2)' }}>{step.before}</p>
            </div>
            <div className="card">
              <h3 className="card-title">공정 후</h3>
              <p style={{ margin: 0, color: 'var(--text-2)' }}>{step.after}</p>
            </div>
          </div>
        </Section>

        <Section id="principle" title="핵심 원리">
          <ul>
            {step.principles.map((p) => (
              <li key={p.slice(0, 20)}>{p}</li>
            ))}
          </ul>
        </Section>

        <Section id="detail" title="세부 내용">
          {step.detail.map((d) => (
            <Accordion key={d.h} title={d.h}>
              <p>{d.body}</p>
              {d.bullets && (
                <ul>
                  {d.bullets.map((b) => (
                    <li key={b.slice(0, 20)}>{b}</li>
                  ))}
                </ul>
              )}
            </Accordion>
          ))}
        </Section>

        <Section id="equip" title="주요 장비">
          <div className="table-wrap">
            <table>
              <caption className="sr-only">{step.title}의 주요 장비</caption>
              <thead>
                <tr>
                  <th scope="col">장비</th>
                  <th scope="col">역할</th>
                </tr>
              </thead>
              <tbody>
                {step.equipment.map((e) => (
                  <tr key={e.name}>
                    <th scope="row">
                      {e.name}
                      {(e.abbr || e.en) && (
                        <div className="tiny muted" style={{ fontWeight: 500 }}>
                          {e.abbr ? `${e.abbr}, ` : ''}
                          {e.en}
                        </div>
                      )}
                    </th>
                    <td>{e.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section id="vars" title="핵심 공정 변수">
          <div className="table-wrap">
            <table>
              <caption className="sr-only">{step.title}의 핵심 공정 변수</caption>
              <thead>
                <tr>
                  <th scope="col">변수</th>
                  <th scope="col">영향</th>
                </tr>
              </thead>
              <tbody>
                {step.variables.map((v) => (
                  <tr key={v.name}>
                    <th scope="row">{v.name}</th>
                    <td>{v.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section id="defect" title="대표 불량과 원인">
          {step.defects.map((d) => (
            <div className="card" key={d.name}>
              <h3 className="card-title">
                <span className="badge badge-bad">
                  <Icon.Alert size={12} /> 불량
                </span>
                {d.name}
              </h3>
              <p className="small" style={{ color: 'var(--text-2)' }}>
                <b>증상</b> · {d.symptom}
              </p>
              <p className="small" style={{ marginBottom: 4, color: 'var(--text-3)', fontWeight: 700 }}>
                주요 원인
              </p>
              <ul className="small" style={{ marginBottom: 0, color: 'var(--text-2)' }}>
                {d.causes.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          ))}
        </Section>

        <Section id="roles" title="직무별 확인 사항">
          <div className="grid grid-3">
            <div className="card">
              <h3 className="card-title">작업자(오퍼레이터)</h3>
              <ul className="small" style={{ marginBottom: 0, color: 'var(--text-2)' }}>
                {step.checkBy.operator.map((x) => (
                  <li key={x.slice(0, 16)}>{x}</li>
                ))}
              </ul>
            </div>
            <div className="card">
              <h3 className="card-title">설비 엔지니어</h3>
              <ul className="small" style={{ marginBottom: 0, color: 'var(--text-2)' }}>
                {step.checkBy.equipment.map((x) => (
                  <li key={x.slice(0, 16)}>{x}</li>
                ))}
              </ul>
            </div>
            <div className="card">
              <h3 className="card-title">장비 CS 엔지니어</h3>
              <ul className="small" style={{ marginBottom: 0, color: 'var(--text-2)' }}>
                {step.checkBy.cs.map((x) => (
                  <li key={x.slice(0, 16)}>{x}</li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        <Section id="safety" title="안전상 주의점">
          <div className="note note-warn">
            <ul style={{ marginBottom: 0 }}>
              {step.safety.map((s) => (
                <li key={s.slice(0, 20)}>{s}</li>
              ))}
            </ul>
          </div>
        </Section>

        <Section id="question" title="면접 예상 질문">
          {step.questions.map((q) => (
            <Accordion key={q.q} title={q.q}>
              <p className="small" style={{ marginBottom: 6, color: 'var(--text-3)', fontWeight: 700 }}>
                답변 핵심 키워드
              </p>
              <div className="chip-row" style={{ marginBottom: 10 }}>
                {q.keywords.map((k) => (
                  <span key={k} className="badge badge-accent">
                    {k}
                  </span>
                ))}
              </div>
              <p style={{ marginBottom: 0 }}>{q.hint}</p>
            </Accordion>
          ))}
        </Section>

        <Section id="link" title="공정 간 연결 관계">
          <div className="grid grid-2">
            <div className="card">
              <h3 className="card-title">앞 공정과의 관계</h3>
              <p style={{ margin: 0, color: 'var(--text-2)' }}>{step.linkPrev}</p>
            </div>
            <div className="card">
              <h3 className="card-title">뒤 공정과의 관계</h3>
              <p style={{ margin: 0, color: 'var(--text-2)' }}>{step.linkNext}</p>
            </div>
          </div>
        </Section>

        <nav className="spread" style={{ marginTop: 24 }} aria-label="이전 다음 공정">
          {prev ? (
            <Link to={`/process/${prev.id}`} className="btn btn-sm">
              ← {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link to={`/process/${next.id}`} className="btn btn-sm">
              {next.title} →
            </Link>
          ) : (
            <Link to="/backend" className="btn btn-sm">
              후공정 학습으로 →
            </Link>
          )}
        </nav>
      </div>

      <Toc items={toc} />
    </div>
  );
}
