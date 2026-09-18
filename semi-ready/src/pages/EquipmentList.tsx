import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { equipGroups, equipTopics, troubleCases } from '@/data/equipment';
import { useApp } from '@/store/store';
import { EmptyState, Icon, ProgressBar } from '@/components/ui';

export default function EquipmentList() {
  const { state } = useApp();
  const [group, setGroup] = useState('전체');
  const [q, setQ] = useState('');

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return equipTopics.filter((t) => {
      if (group !== '전체' && t.group !== group) return false;
      if (!needle) return true;
      return (
        t.title.toLowerCase().includes(needle) ||
        t.oneLine.toLowerCase().includes(needle) ||
        t.terms.some((x) => `${x.ko}${x.abbr ?? ''}${x.en ?? ''}`.toLowerCase().includes(needle))
      );
    });
  }, [group, q]);

  const done = equipTopics.filter((t) => state.completed[`equipment:${t.id}`]).length;

  return (
    <div>
      <div className="page-head">
        <h1>장비와 설비 CS 학습</h1>
        <p>
          장비 유지보수와 CS 엔지니어 직무를 준비하기 위한 영역입니다. 직무 이해, 정비 체계, 현장 업무, 안전, 장비
          구성 요소 순으로 정리했고, 실제 고장 상황을 단계별로 판단해 보는 트러블슈팅 시뮬레이션을 함께 제공합니다.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <ProgressBar pct={Math.round((done / equipTopics.length) * 100)} label={`장비·CS 학습 진도 (${done}/${equipTopics.length})`} />
      </div>

      <div className="card" style={{ marginBottom: 18, background: 'var(--info-soft)', borderColor: 'var(--accent)' }}>
        <h2 className="card-title">
          <Icon.Wrench /> 트러블슈팅 시뮬레이션
        </h2>
        <p className="small" style={{ color: 'var(--text-2)' }}>
          장비 이상 상황을 제시하면 확인 순서를 직접 선택합니다. 선택할 때마다 올바른 판단인지, 안전상 문제가 없는지,
          현장에서는 어떤 순서로 접근하는지, 면접에서는 어떻게 설명해야 하는지 피드백을 받습니다. 현재 {troubleCases.length}가지
          상황이 준비되어 있습니다.
        </p>
        <Link to="/equipment/simulation" className="btn btn-primary btn-sm">
          시뮬레이션 시작하기
        </Link>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="field" style={{ marginBottom: 12 }}>
          <label htmlFor="eq-q">항목 검색</label>
          <input
            id="eq-q"
            className="input"
            placeholder="예: PM, 진공, 인터록, PLC, MFC"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="chip-row" role="group" aria-label="분류 필터">
          {['전체', ...equipGroups].map((g) => (
            <button key={g} className="chip" aria-pressed={group === g} onClick={() => setGroup(g)}>
              {g}
            </button>
          ))}
        </div>
      </div>

      <p className="small muted" role="status" aria-live="polite">
        {list.length}개 항목
      </p>

      {list.length === 0 ? (
        <EmptyState
          title="조건에 맞는 항목이 없습니다"
          desc="검색어를 줄이거나 분류를 전체로 되돌려 보세요."
          action={
            <button
              className="btn"
              onClick={() => {
                setQ('');
                setGroup('전체');
              }}
            >
              <Icon.Refresh /> 필터 초기화
            </button>
          }
        />
      ) : (
        <div className="grid grid-2">
          {list.map((t) => {
            const isDone = Boolean(state.completed[`equipment:${t.id}`]);
            return (
              <Link key={t.id} to={`/equipment/${t.id}`} className="list-card">
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
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
