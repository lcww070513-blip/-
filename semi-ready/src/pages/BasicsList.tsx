import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { basicGroups, basicTopics } from '@/data/basics';
import { useApp } from '@/store/store';
import { EmptyState, Icon, ProgressBar } from '@/components/ui';

export default function BasicsList() {
  const { state } = useApp();
  const [group, setGroup] = useState<string>('전체');
  const [q, setQ] = useState('');
  const [onlyTodo, setOnlyTodo] = useState(false);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return basicTopics.filter((t) => {
      if (group !== '전체' && t.group !== group) return false;
      if (onlyTodo && state.completed[`basics:${t.id}`]) return false;
      if (!needle) return true;
      return (
        t.title.toLowerCase().includes(needle) ||
        t.oneLine.toLowerCase().includes(needle) ||
        t.terms.some((x) => `${x.ko}${x.abbr ?? ''}${x.en ?? ''}`.toLowerCase().includes(needle))
      );
    });
  }, [group, q, onlyTodo, state.completed]);

  const done = basicTopics.filter((t) => state.completed[`basics:${t.id}`]).length;

  return (
    <div>
      <div className="page-head">
        <h1>반도체 기초</h1>
        <p>
          처음 접하는 사람도 이해할 수 있는 설명에서 시작해, 면접에서 직접 말할 수 있는 수준까지 이어집니다. 각 주제는
          한 줄 정의, 쉬운 설명, 도해, 핵심 원리, 현장 중요성, 용어, 20초·60초 면접 답변, 자주 하는 실수, 확인 문제,
          심화 순서로 구성했습니다.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <ProgressBar pct={Math.round((done / basicTopics.length) * 100)} label={`반도체 기초 진도 (${done}/${basicTopics.length})`} />
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="field" style={{ marginBottom: 12 }}>
          <label htmlFor="basics-q">주제 검색</label>
          <input
            id="basics-q"
            className="input"
            placeholder="예: 트랜지스터, 수율, 클린룸, MOSFET"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="chip-row" role="group" aria-label="분류 필터">
          {['전체', ...basicGroups].map((g) => (
            <button key={g} className="chip" aria-pressed={group === g} onClick={() => setGroup(g)}>
              {g}
            </button>
          ))}
        </div>
        <div className="chip-row" style={{ marginTop: 8 }}>
          <button className="chip" aria-pressed={onlyTodo} onClick={() => setOnlyTodo((v) => !v)}>
            아직 학습하지 않은 것만
          </button>
        </div>
      </div>

      <p className="small muted" role="status" aria-live="polite">
        {list.length}개 주제
      </p>

      {list.length === 0 ? (
        <EmptyState
          title="조건에 맞는 주제가 없습니다"
          desc="검색어를 줄이거나 분류 필터를 전체로 되돌려 보세요."
          action={
            <button
              className="btn"
              onClick={() => {
                setQ('');
                setGroup('전체');
                setOnlyTodo(false);
              }}
            >
              <Icon.Refresh /> 필터 초기화
            </button>
          }
        />
      ) : (
        <div className="grid grid-2">
          {list.map((t) => {
            const isDone = Boolean(state.completed[`basics:${t.id}`]);
            return (
              <Link key={t.id} to={`/basics/${t.id}`} className="list-card">
                <div className="row" style={{ justifyContent: 'space-between', marginBottom: 2 }}>
                  <span className="badge">{t.group}</span>
                  {isDone && (
                    <span className="badge badge-good">
                      <Icon.Check size={12} /> 완료
                    </span>
                  )}
                </div>
                <h3>{t.title}</h3>
                <p>{t.oneLine}</p>
                <div className="list-card-meta">
                  <span className="tiny muted">약 {t.readMinutes}분</span>
                  <span className="tiny muted">확인 문제 {t.check.length}개</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
