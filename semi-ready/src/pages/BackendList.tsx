import { Link } from 'react-router-dom';
import { backendSteps } from '@/data/backend';
import { useApp } from '@/store/store';
import Figure from '@/components/Figure';
import { Icon, ProgressBar } from '@/components/ui';

export default function BackendList() {
  const { state } = useApp();
  const done = backendSteps.filter((b) => state.completed[`backend:${b.id}`]).length;

  return (
    <div>
      <div className="page-head">
        <h1>후공정과 패키징</h1>
        <p>
          웨이퍼 테스트에서 양품으로 판정된 다이를 제품으로 만드는 과정입니다. 각 단계마다 생산직, 장비직, 품질직이
          실제로 어떤 부분을 담당하는지 구분해 정리했습니다.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <ProgressBar pct={Math.round((done / backendSteps.length) * 100)} label={`후공정 학습 진도 (${done}/${backendSteps.length})`} />
      </div>

      <div className="card" style={{ marginBottom: 18 }}>
        <h2 className="card-title">후공정 전체 흐름</h2>
        <Figure name="package-flow" caption="웨이퍼 테스트 통과 후 제품이 되기까지" />
      </div>

      <div className="grid grid-2">
        {backendSteps.map((b) => {
          const isDone = Boolean(state.completed[`backend:${b.id}`]);
          return (
            <Link key={b.id} to={`/backend/${b.id}`} className="list-card">
              <div className="row" style={{ justifyContent: 'space-between', marginBottom: 2 }}>
                <span className="badge">{b.order}</span>
                {isDone && (
                  <span className="badge badge-good">
                    <Icon.Check size={12} /> 완료
                  </span>
                )}
              </div>
              <h3>
                {b.title} <span className="tiny muted">{b.en}</span>
              </h3>
              <p>{b.oneLine}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
