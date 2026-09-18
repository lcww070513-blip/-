import { Link } from 'react-router-dom';
import { processSteps } from '@/data/processes';
import { useApp } from '@/store/store';
import { Icon, ProgressBar } from '@/components/ui';

export default function ProcessList() {
  const { state } = useApp();
  const done = processSteps.filter((p) => state.completed[`process:${p.id}`]).length;

  return (
    <div>
      <div className="page-head">
        <h1>반도체 8대 공정</h1>
        <p>
          웨이퍼 제조부터 패키징까지 전체 흐름을 먼저 보고, 각 공정을 목적·원리·장비·변수·불량·직무별 확인사항 순서로
          들어갑니다. 회사와 교재에 따라 8대 공정을 세는 방식이 조금씩 다르므로 여기서는 흐름 전체를 9단계로 나누어
          다룹니다.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <ProgressBar pct={Math.round((done / processSteps.length) * 100)} label={`공정 학습 진도 (${done}/${processSteps.length})`} />
      </div>

      <section className="card" style={{ marginBottom: 18 }}>
        <h2 className="card-title">전체 공정 흐름</h2>
        <div className="flow">
          {processSteps.map((p) => (
            <Link
              key={p.id}
              to={`/process/${p.id}`}
              className={`flow-step${state.completed[`process:${p.id}`] ? ' done' : ''}`}
            >
              <span className="n">{p.order}</span>
              {p.title}
            </Link>
          ))}
        </div>
        <p className="tiny muted" style={{ marginTop: 10, marginBottom: 0 }}>
          포토, 식각, 증착은 한 번으로 끝나지 않고 층마다 수십 번 반복됩니다. 각 공정의 작은 편차가 누적되면 수율에
          크게 영향을 줍니다.
        </p>
      </section>

      <div className="grid grid-2">
        {processSteps.map((p) => {
          const isDone = Boolean(state.completed[`process:${p.id}`]);
          return (
            <Link key={p.id} to={`/process/${p.id}`} className="list-card">
              <div className="row" style={{ justifyContent: 'space-between', marginBottom: 2 }}>
                <span className="badge badge-accent">{p.order}단계</span>
                {isDone && (
                  <span className="badge badge-good">
                    <Icon.Check size={12} /> 완료
                  </span>
                )}
              </div>
              <h3>
                {p.title} <span className="tiny muted">{p.en}</span>
              </h3>
              <p>{p.purpose}</p>
              <div className="list-card-meta">
                <span className="tiny muted">주요 장비 {p.equipment.length}종</span>
                <span className="tiny muted">대표 불량 {p.defects.length}가지</span>
                <span className="tiny muted">예상 질문 {p.questions.length}개</span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <h2 className="card-title">이어서 볼 내용</h2>
        <div className="btn-row">
          <Link to="/backend" className="btn">
            후공정·패키징 학습
          </Link>
          <Link to="/equipment" className="btn">
            장비·설비 CS 학습
          </Link>
          <Link to="/quiz?category=8대 공정" className="btn">
            8대 공정 문제 풀기
          </Link>
        </div>
      </div>
    </div>
  );
}
