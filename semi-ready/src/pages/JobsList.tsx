import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { jobMetricLabels, jobMetricOrder, jobs } from '@/data/jobs';
import { useApp } from '@/store/store';
import { EmptyState, Icon } from '@/components/ui';

const LEVEL_TEXT = ['', '매우 낮음', '낮음', '보통', '높음', '매우 높음'];

function MetricCell({ value }: { value: number }) {
  return (
    <span className="row" style={{ gap: 6, flexWrap: 'nowrap' }}>
      <span aria-hidden="true" style={{ display: 'flex', gap: 2 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            style={{
              width: 7,
              height: 7,
              borderRadius: 2,
              background: i <= value ? 'var(--series-1)' : 'var(--surface-3)',
            }}
          />
        ))}
      </span>
      <span className="tiny" style={{ color: 'var(--text-2)', whiteSpace: 'nowrap' }}>
        {LEVEL_TEXT[value]}
      </span>
    </span>
  );
}

export default function JobsList() {
  const { state } = useApp();
  const [selected, setSelected] = useState<string[]>([]);
  const [q, setQ] = useState('');

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return jobs;
    return jobs.filter(
      (j) =>
        j.title.toLowerCase().includes(needle) ||
        j.oneLine.toLowerCase().includes(needle) ||
        j.duties.some((d) => d.toLowerCase().includes(needle)),
    );
  }, [q]);

  const toggle = (id: string) => {
    setSelected((s) => {
      if (s.includes(id)) return s.filter((x) => x !== id);
      if (s.length >= 3) return s;
      return [...s, id];
    });
  };

  const compared = selected.map((id) => jobs.find((j) => j.id === id)!).filter(Boolean);

  return (
    <div>
      <div className="page-head">
        <h1>직무 탐색</h1>
        <p>
          반도체 제조 현장의 주요 직무를 실제 업무와 근무 환경, 필요한 지식과 성향, 고졸 신입 지원 가능성까지 정리했습니다.
          최대 3개를 선택해 표로 비교할 수 있습니다.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="field" style={{ marginBottom: 0 }}>
          <label htmlFor="job-q">직무 검색</label>
          <input
            id="job-q"
            className="input"
            placeholder="예: 설비, CS, 품질, 테스트"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      {selected.length > 0 && (
        <section className="card" style={{ marginBottom: 18 }} aria-labelledby="cmp-h">
          <div className="spread" style={{ marginBottom: 10 }}>
            <h2 id="cmp-h" className="card-title" style={{ margin: 0 }}>
              직무 비교 ({selected.length}/3)
            </h2>
            <button className="btn btn-sm" onClick={() => setSelected([])}>
              <Icon.X /> 선택 해제
            </button>
          </div>

          <p className="note note-warn" style={{ marginBottom: 12 }}>
            <Icon.Alert /> 아래 수치는 확정된 사실이 아니라 <b>일반적인 경향</b>을 5단계로 나타낸 것입니다. 회사,
            사업장, 공정, 팀에 따라 실제와 다를 수 있으므로 참고 자료로만 쓰시고 반드시 채용 공고와 현직자 이야기로
            확인하세요.
          </p>

          <div className="table-wrap">
            <table>
              <caption className="sr-only">선택한 직무의 항목별 비교</caption>
              <thead>
                <tr>
                  <th scope="col">비교 항목</th>
                  {compared.map((j) => (
                    <th key={j.id} scope="col">
                      {j.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {jobMetricOrder.map((m) => (
                  <tr key={m}>
                    <th scope="row">{jobMetricLabels[m]}</th>
                    {compared.map((j) => (
                      <td key={j.id}>
                        <MetricCell value={j.metrics[m]} />
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <th scope="row">교대근무</th>
                  {compared.map((j) => (
                    <td key={j.id} className="small">
                      {j.shift}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">고졸 신입 지원</th>
                  {compared.map((j) => (
                    <td key={j.id} className="small">
                      {j.hsChance}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      <p className="small muted" role="status" aria-live="polite">
        {list.length}개 직무
      </p>

      {list.length === 0 ? (
        <EmptyState
          title="검색 결과가 없습니다"
          desc="다른 단어로 검색하거나 검색어를 지워 전체 직무를 확인해 보세요."
          action={
            <button className="btn" onClick={() => setQ('')}>
              <Icon.Refresh /> 검색어 지우기
            </button>
          }
        />
      ) : (
        <div className="grid grid-2">
          {list.map((j) => {
            const isSel = selected.includes(j.id);
            const isDone = Boolean(state.completed[`job:${j.id}`]);
            return (
              <div className="list-card" key={j.id}>
                <div className="row" style={{ justifyContent: 'space-between', marginBottom: 2 }}>
                  <span className="badge">{j.en}</span>
                  {isDone && (
                    <span className="badge badge-good">
                      <Icon.Check size={12} /> 완료
                    </span>
                  )}
                </div>
                <h3>
                  <Link to={`/jobs/${j.id}`}>{j.title}</Link>
                </h3>
                <p>{j.oneLine}</p>
                <div className="list-card-meta">
                  <Link to={`/jobs/${j.id}`} className="btn btn-sm">
                    자세히 보기
                  </Link>
                  <button
                    className="btn btn-sm"
                    aria-pressed={isSel}
                    onClick={() => toggle(j.id)}
                    disabled={!isSel && selected.length >= 3}
                    style={isSel ? { borderColor: 'var(--accent)', color: 'var(--accent-strong)' } : undefined}
                  >
                    {isSel ? <Icon.Check /> : <Icon.Plus />}
                    {isSel ? '비교 목록에 있음' : '비교에 추가'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
