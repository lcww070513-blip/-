import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { equipTopics } from '@/data/equipment';
import { useApp } from '@/store/store';
import { CompleteButton, EmptyState, FavButton, Icon, Section, TermList } from '@/components/ui';

export default function EquipmentDetail() {
  const { id } = useParams();
  const { state, toggleComplete, toggleFav, pushRecent } = useApp();
  const topic = equipTopics.find((t) => t.id === id);

  useEffect(() => {
    if (topic) pushRecent({ key: `equipment:${topic.id}`, title: topic.title, to: `/equipment/${topic.id}` });
  }, [topic?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!topic) {
    return (
      <EmptyState
        title="항목을 찾을 수 없습니다"
        desc="주소가 잘못되었거나 없는 항목입니다."
        action={
          <Link to="/equipment" className="btn btn-primary">
            장비·CS 목록으로
          </Link>
        }
      />
    );
  }

  const key = `equipment:${topic.id}`;
  const done = Boolean(state.completed[key]);
  const fav = state.favTopics.includes(key);
  const idx = equipTopics.findIndex((t) => t.id === topic.id);
  const prev = equipTopics[idx - 1];
  const next = equipTopics[idx + 1];

  return (
    <div>
      <div className="page-head">
        <p className="crumb">
          <Link to="/equipment">장비와 설비 CS</Link> <Icon.Chevron size={12} /> {topic.group}
        </p>
        <h1>{topic.title}</h1>
        <div className="btn-row" style={{ marginTop: 10 }}>
          <CompleteButton done={done} onToggle={() => toggleComplete(key)} />
          <FavButton on={fav} onToggle={() => toggleFav('favTopics', key)} label={topic.title} />
        </div>
      </div>

      <Section id="intro" title="한 줄 정리">
        <p className="lead">{topic.oneLine}</p>
        {topic.body.map((p) => (
          <p key={p.slice(0, 20)}>{p}</p>
        ))}
      </Section>

      {topic.bullets && topic.bullets.length > 0 && (
        <Section id="points" title="핵심 정리">
          <ul>
            {topic.bullets.map((b) => (
              <li key={b.slice(0, 20)}>{b}</li>
            ))}
          </ul>
        </Section>
      )}

      {topic.terms.length > 0 && (
        <Section id="terms" title="관련 용어">
          <TermList terms={topic.terms} />
        </Section>
      )}

      {topic.interviewTip && (
        <Section id="tip" title="면접에서 쓰는 법">
          <div className="note">
            <Icon.Info /> {topic.interviewTip}
          </div>
        </Section>
      )}

      <nav className="spread" style={{ marginTop: 24 }} aria-label="이전 다음 항목">
        {prev ? (
          <Link to={`/equipment/${prev.id}`} className="btn btn-sm">
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={`/equipment/${next.id}`} className="btn btn-sm">
            {next.title} →
          </Link>
        ) : (
          <Link to="/equipment/simulation" className="btn btn-sm">
            트러블슈팅 시뮬레이션 →
          </Link>
        )}
      </nav>
    </div>
  );
}
