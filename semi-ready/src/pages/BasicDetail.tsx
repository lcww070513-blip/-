import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { basicTopics } from '@/data/basics';
import { useApp } from '@/store/store';
import Figure from '@/components/Figure';
import MiniQuiz from '@/components/MiniQuiz';
import {
  AnswerDisclaimer,
  CompleteButton,
  EmptyState,
  FavButton,
  Icon,
  Section,
  TermList,
  Toc,
} from '@/components/ui';

export default function BasicDetail() {
  const { id } = useParams();
  const { state, toggleComplete, toggleFav, pushRecent } = useApp();
  const topic = basicTopics.find((t) => t.id === id);

  useEffect(() => {
    if (topic) pushRecent({ key: `basics:${topic.id}`, title: topic.title, to: `/basics/${topic.id}` });
    // pushRecent는 안정적인 콜백이므로 주제가 바뀔 때만 실행합니다.
  }, [topic?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!topic) {
    return (
      <EmptyState
        title="주제를 찾을 수 없습니다"
        desc="주소가 잘못되었거나 삭제된 항목입니다. 목록에서 다시 선택해 주세요."
        action={
          <Link to="/basics" className="btn btn-primary">
            반도체 기초 목록으로
          </Link>
        }
      />
    );
  }

  const key = `basics:${topic.id}`;
  const done = Boolean(state.completed[key]);
  const fav = state.favTopics.includes(key);

  const toc = [
    { id: 'define', label: '한 줄 정의' },
    { id: 'easy', label: '쉬운 설명' },
    { id: 'principle', label: '핵심 원리' },
    { id: 'field', label: '현장에서 중요한 이유' },
    { id: 'terms', label: '관련 용어' },
    { id: 'answer', label: '면접 답변 예시' },
    { id: 'mistake', label: '자주 하는 실수' },
    { id: 'check', label: '확인 문제' },
    { id: 'deep', label: '추가 심화 내용' },
  ];

  const related = topic.related.map((r) => basicTopics.find((t) => t.id === r)).filter(Boolean);
  const idx = basicTopics.findIndex((t) => t.id === topic.id);
  const prev = basicTopics[idx - 1];
  const next = basicTopics[idx + 1];

  return (
    <div className="with-toc">
      <div>
        <div className="page-head">
          <p className="crumb">
            <Link to="/basics">반도체 기초</Link> <Icon.Chevron size={12} /> {topic.group}
          </p>
          <h1>{topic.title}</h1>
          <div className="btn-row" style={{ marginTop: 10 }}>
            <CompleteButton done={done} onToggle={() => toggleComplete(key)} />
            <FavButton on={fav} onToggle={() => toggleFav('favTopics', key)} label={topic.title} />
            <span className="badge">
              <Icon.Clock size={12} /> 약 {topic.readMinutes}분
            </span>
          </div>
        </div>

        <Section id="define" title="한 줄 정의">
          <p className="lead">{topic.oneLine}</p>
        </Section>

        <Section id="easy" title="쉬운 설명">
          {topic.easy.map((p) => (
            <p key={p.slice(0, 20)}>{p}</p>
          ))}
          <Figure name={topic.figure} caption={topic.figureCaption} />
        </Section>

        <Section id="principle" title="핵심 원리">
          <ul>
            {topic.principles.map((p) => (
              <li key={p.slice(0, 20)}>{p}</li>
            ))}
          </ul>
        </Section>

        <Section id="field" title="현장에서 중요한 이유">
          <ul>
            {topic.whyField.map((p) => (
              <li key={p.slice(0, 20)}>{p}</li>
            ))}
          </ul>
        </Section>

        <Section id="terms" title="관련 용어">
          <TermList terms={topic.terms} />
        </Section>

        <Section id="answer" title="면접 답변 예시">
          <AnswerDisclaimer />
          <div className="grid grid-2" style={{ marginTop: 12 }}>
            <div className="card">
              <h3 className="card-title">
                <span className="badge badge-accent">20초</span> 핵심 답변
              </h3>
              <p style={{ margin: 0, color: 'var(--text-2)' }}>{topic.answer.sec20}</p>
            </div>
            <div className="card">
              <h3 className="card-title">
                <span className="badge badge-violet">60초</span> 상세 답변
              </h3>
              <p style={{ margin: 0, color: 'var(--text-2)' }}>{topic.answer.sec60}</p>
            </div>
          </div>
        </Section>

        <Section id="mistake" title="자주 하는 실수">
          <ul>
            {topic.mistakes.map((m) => (
              <li key={m.slice(0, 20)}>{m}</li>
            ))}
          </ul>
        </Section>

        <Section id="check" title="확인 문제">
          <MiniQuiz items={topic.check} />
        </Section>

        <Section id="deep" title="추가 심화 내용">
          {topic.deep.map((d) => (
            <p key={d.slice(0, 20)}>{d}</p>
          ))}
        </Section>

        {related.length > 0 && (
          <section className="section">
            <h2>함께 보면 좋은 주제</h2>
            <div className="grid grid-3">
              {related.map((r) => (
                <Link key={r!.id} to={`/basics/${r!.id}`} className="list-card">
                  <h3>{r!.title}</h3>
                  <p>{r!.oneLine.slice(0, 60)}…</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <nav className="spread" style={{ marginTop: 24 }} aria-label="이전 다음 주제">
          {prev ? (
            <Link to={`/basics/${prev.id}`} className="btn btn-sm">
              ← {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link to={`/basics/${next.id}`} className="btn btn-sm">
              {next.title} →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </div>

      <Toc items={toc} />
    </div>
  );
}
