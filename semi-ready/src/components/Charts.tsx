import { useId, useState } from 'react';

/* ============================================================
   차트는 모두 실제로 저장된 학습 데이터만 그립니다.
   - 단일 계열이므로 범례 없이 제목이 계열을 설명합니다.
   - 모든 막대에 값 라벨을 직접 붙여, 라이트 모드의 낮은 대비
     구간에서도 수치를 읽을 수 있게 합니다(relief rule).
   - 표 보기를 함께 제공해 색에만 의존하지 않도록 합니다.
   ============================================================ */

export interface BarDatum {
  label: string;
  value: number;
  sub?: string;
}

/** 가로 막대: 분야별 진도·정답률처럼 항목이 많고 라벨이 긴 경우 */
export function HBarChart({
  title,
  data,
  unit = '%',
  max = 100,
  color = 'var(--series-1)',
  emptyLabel = '아직 기록이 없습니다.',
}: {
  title: string;
  data: BarDatum[];
  unit?: string;
  max?: number;
  color?: string;
  emptyLabel?: string;
}) {
  const [showTable, setShowTable] = useState(false);
  const tableId = useId();
  const hasData = data.some((d) => d.value > 0);

  return (
    <div>
      <div className="spread" style={{ marginBottom: 10 }}>
        <h3 style={{ margin: 0, fontSize: '0.98rem' }}>{title}</h3>
        <button
          className="btn btn-sm btn-ghost"
          onClick={() => setShowTable((s) => !s)}
          aria-expanded={showTable}
          aria-controls={tableId}
        >
          {showTable ? '그래프 보기' : '표로 보기'}
        </button>
      </div>

      {!hasData && <p className="small muted">{emptyLabel}</p>}

      {!showTable ? (
        <div>
          {data.map((d) => {
            const pct = max > 0 ? Math.min(100, Math.round((d.value / max) * 100)) : 0;
            return (
              <div key={d.label} style={{ marginBottom: 11 }} title={`${d.label}: ${d.value}${unit}`}>
                <div className="spread" style={{ marginBottom: 4, gap: 8 }}>
                  <span className="small" style={{ color: 'var(--text-2)' }}>
                    {d.label}
                    {d.sub && <span className="muted tiny"> · {d.sub}</span>}
                  </span>
                  <span className="small" style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                    {d.value}
                    {unit}
                  </span>
                </div>
                <div className="bar">
                  <i style={{ width: `${pct}%`, background: color }} />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="table-wrap" id={tableId}>
          <table>
            <caption className="sr-only">{title}</caption>
            <thead>
              <tr>
                <th scope="col">항목</th>
                <th scope="col">값</th>
                {data.some((d) => d.sub) && <th scope="col">비고</th>}
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.label}>
                  <th scope="row">{d.label}</th>
                  <td>
                    {d.value}
                    {unit}
                  </td>
                  {data.some((x) => x.sub) && <td>{d.sub ?? '-'}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/** 세로 막대: 최근 7일 학습 시간 */
export function WeekBars({ data }: { data: { label: string; minutes: number; day: string }[] }) {
  const [showTable, setShowTable] = useState(false);
  const tableId = useId();
  const max = Math.max(10, ...data.map((d) => d.minutes));
  const h = 96;

  return (
    <div>
      <div className="spread" style={{ marginBottom: 10 }}>
        <h3 style={{ margin: 0, fontSize: '0.98rem' }}>최근 7일 학습 시간</h3>
        <button
          className="btn btn-sm btn-ghost"
          onClick={() => setShowTable((s) => !s)}
          aria-expanded={showTable}
          aria-controls={tableId}
        >
          {showTable ? '그래프 보기' : '표로 보기'}
        </button>
      </div>

      {!showTable ? (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: h + 44 }}>
          {data.map((d) => {
            const bh = d.minutes > 0 ? Math.max(4, Math.round((d.minutes / max) * h)) : 2;
            return (
              <div key={d.day} style={{ flex: 1, textAlign: 'center' }} title={`${d.day}: ${d.minutes}분`}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-3)', marginBottom: 3, fontWeight: 700 }}>
                  {d.minutes > 0 ? d.minutes : ''}
                </div>
                <div
                  style={{
                    height: bh,
                    background: d.minutes > 0 ? 'var(--series-1)' : 'var(--surface-3)',
                    borderRadius: '4px 4px 0 0',
                    margin: '0 auto',
                    width: '100%',
                    maxWidth: 36,
                  }}
                />
                <div style={{ fontSize: '0.76rem', color: 'var(--text-3)', marginTop: 6 }}>{d.label}</div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="table-wrap" id={tableId}>
          <table>
            <caption className="sr-only">최근 7일 학습 시간</caption>
            <thead>
              <tr>
                <th scope="col">날짜</th>
                <th scope="col">학습 시간(분)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.day}>
                  <th scope="row">{d.day}</th>
                  <td>{d.minutes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="tiny muted" style={{ marginTop: 8, marginBottom: 0 }}>
        이 사이트를 열어 둔 채 실제로 머문 시간만 기록합니다. 다른 탭으로 이동하면 집계되지 않습니다.
      </p>
    </div>
  );
}

/** 정답·오답 비율. 색만이 아니라 아이콘과 텍스트로 구분합니다. */
export function CorrectRatio({ correct, wrong }: { correct: number; wrong: number }) {
  const total = correct + wrong;
  if (total === 0) return <p className="small muted">아직 푼 문제가 없습니다.</p>;
  const cp = Math.round((correct / total) * 100);
  return (
    <div>
      <div style={{ display: 'flex', height: 14, borderRadius: 999, overflow: 'hidden', gap: 2 }}>
        <div style={{ width: `${cp}%`, background: 'var(--good)' }} />
        <div style={{ width: `${100 - cp}%`, background: 'var(--bad)' }} />
      </div>
      <div className="row" style={{ marginTop: 9, gap: 16 }}>
        <span className="small" style={{ color: 'var(--good)', fontWeight: 700 }}>
          ✔ 정답 {correct}문항 ({cp}%)
        </span>
        <span className="small" style={{ color: 'var(--bad)', fontWeight: 700 }}>
          ✕ 오답 {wrong}문항 ({100 - cp}%)
        </span>
      </div>
    </div>
  );
}
