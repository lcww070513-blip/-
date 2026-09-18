import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { jobMetricLabels, jobMetricOrder, jobs } from '@/data/jobs';
import { useApp } from '@/store/store';
import { CompleteButton, EmptyState, Icon, Section, Toc } from '@/components/ui';

const LEVEL_TEXT = ['', '매우 낮음', '낮음', '보통', '높음', '매우 높음'];

export default function JobDetail() {
  const { id } = useParams();
  const { state, toggleComplete, pushRecent } = useApp();
  const job = jobs.find((j) => j.id === id);

  useEffect(() => {
    if (job) pushRecent({ key: `job:${job.id}`, title: job.title, to: `/jobs/${job.id}` });
  }, [job?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!job) {
    return (
      <EmptyState
        title="직무를 찾을 수 없습니다"
        desc="주소가 잘못되었거나 없는 항목입니다."
        action={
          <Link to="/jobs" className="btn btn-primary">
            직무 목록으로
          </Link>
        }
      />
    );
  }

  const key = `job:${job.id}`;
  const done = Boolean(state.completed[key]);

  const toc = [
    { id: 'summary', label: '직무 한 줄 설명' },
    { id: 'duties', label: '주요 업무' },
    { id: 'day', label: '하루 업무 예시' },
    { id: 'env', label: '근무 환경' },
    { id: 'need', label: '필요한 지식과 성향' },
    { id: 'cert', label: '도움이 되는 자격증' },
    { id: 'career', label: '지원 가능성과 경력 확장' },
    { id: 'prosCons', label: '힘든 점과 장점' },
    { id: 'eval', label: '면접에서 평가하는 요소' },
    { id: 'questions', label: '예상 질문 10개' },
    { id: 'metrics', label: '직무 특성 지표' },
    { id: 'recommend', label: '추천 학습 과정' },
  ];

  return (
    <div className="with-toc">
      <div>
        <div className="page-head">
          <p className="crumb">
            <Link to="/jobs">직무 탐색</Link> <Icon.Chevron size={12} /> {job.en}
          </p>
          <h1>{job.title}</h1>
          <div className="btn-row" style={{ marginTop: 10 }}>
            <CompleteButton done={done} onToggle={() => toggleComplete(key)} />
            <Link to="/jobs" className="btn">
              다른 직무와 비교하기
            </Link>
          </div>
        </div>

        <Section id="summary" title="직무 한 줄 설명">
          <p className="lead">{job.oneLine}</p>
        </Section>

        <Section id="duties" title="실제 주요 업무">
          <ul>
            {job.duties.map((d) => (
              <li key={d.slice(0, 20)}>{d}</li>
            ))}
          </ul>
        </Section>

        <Section id="day" title="하루 업무 예시">
          <div className="table-wrap">
            <table>
              <caption className="sr-only">{job.title}의 하루 업무 흐름</caption>
              <thead>
                <tr>
                  <th scope="col">시점</th>
                  <th scope="col">하는 일</th>
                </tr>
              </thead>
              <tbody>
                {job.day.map((d) => (
                  <tr key={d.time}>
                    <th scope="row">{d.time}</th>
                    <td>{d.task}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="tiny muted" style={{ marginTop: 8 }}>
            회사와 사업장, 공정에 따라 실제 흐름은 달라질 수 있습니다.
          </p>
        </Section>

        <Section id="env" title="근무 환경">
          <dl className="kv">
            <dt>근무 장소</dt>
            <dd>{job.place}</dd>
            <dt>교대근무 여부</dt>
            <dd>{job.shift}</dd>
            <dt>방진복 착용</dt>
            <dd>{job.cleanroom}</dd>
          </dl>
        </Section>

        <Section id="need" title="필요한 지식과 성향">
          <div className="grid grid-2">
            <div className="card">
              <h3 className="card-title">필요한 지식</h3>
              <ul className="small" style={{ marginBottom: 0, color: 'var(--text-2)' }}>
                {job.knowledge.map((k) => (
                  <li key={k.slice(0, 18)}>{k}</li>
                ))}
              </ul>
            </div>
            <div className="card">
              <h3 className="card-title">필요한 성향</h3>
              <ul className="small" style={{ marginBottom: 0, color: 'var(--text-2)' }}>
                {job.traits.map((k) => (
                  <li key={k.slice(0, 18)}>{k}</li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        <Section id="cert" title="도움이 되는 자격증">
          <ul>
            {job.certs.map((c) => (
              <li key={c.slice(0, 18)}>{c}</li>
            ))}
          </ul>
          <p className="note">
            <Icon.Info /> 자격증 우대 여부와 인정 범위는 회사마다 다릅니다. 지원 전 채용 공고의 우대 사항을 직접
            확인하세요.
          </p>
        </Section>

        <Section id="career" title="지원 가능성과 경력 확장">
          <div className="card">
            <h3 className="card-title">고졸·초대졸 신입 지원 가능성</h3>
            <p style={{ marginBottom: 0, color: 'var(--text-2)' }}>{job.hsChance}</p>
          </div>
          <div className="grid grid-2" style={{ marginTop: 14 }}>
            <div className="card">
              <h3 className="card-title">경력 확장 방향</h3>
              <ul className="small" style={{ marginBottom: 0, color: 'var(--text-2)' }}>
                {job.career.map((c) => (
                  <li key={c.slice(0, 18)}>{c}</li>
                ))}
              </ul>
            </div>
            <div className="card">
              <h3 className="card-title">이동 가능한 직무</h3>
              <div className="chip-row">
                {job.moves.map((m) => {
                  const target = jobs.find((j) => j.title.includes(m));
                  return target ? (
                    <Link key={m} to={`/jobs/${target.id}`} className="badge badge-accent">
                      {m}
                    </Link>
                  ) : (
                    <span key={m} className="badge">
                      {m}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </Section>

        <Section id="prosCons" title="힘든 점과 장점">
          <div className="grid grid-2">
            <div className="card">
              <h3 className="card-title">
                <span className="badge badge-warn">
                  <Icon.Alert size={12} /> 힘든 점
                </span>
              </h3>
              <ul className="small" style={{ marginBottom: 0, color: 'var(--text-2)' }}>
                {job.hard.map((h) => (
                  <li key={h.slice(0, 18)}>{h}</li>
                ))}
              </ul>
            </div>
            <div className="card">
              <h3 className="card-title">
                <span className="badge badge-good">
                  <Icon.Check size={12} /> 장점
                </span>
              </h3>
              <ul className="small" style={{ marginBottom: 0, color: 'var(--text-2)' }}>
                {job.good.map((h) => (
                  <li key={h.slice(0, 18)}>{h}</li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        <Section id="eval" title="면접에서 평가하는 요소">
          <ul>
            {job.evalPoints.map((e) => (
              <li key={e.slice(0, 18)}>{e}</li>
            ))}
          </ul>
        </Section>

        <Section id="questions" title="예상 질문 10개">
          <ol>
            {job.questions.map((q) => (
              <li key={q.slice(0, 22)}>{q}</li>
            ))}
          </ol>
          <Link to="/interview" className="btn btn-sm">
            면접 질문은행에서 답변 구조 보기
          </Link>
        </Section>

        <Section id="metrics" title="직무 특성 지표">
          <p className="note note-warn">
            <Icon.Alert /> 아래 값은 확정된 사실이 아니라 <b>일반적인 경향</b>입니다. 회사와 사업장, 공정에 따라 다를
            수 있습니다.
          </p>
          <div className="table-wrap" style={{ marginTop: 12 }}>
            <table>
              <caption className="sr-only">{job.title}의 특성 지표</caption>
              <thead>
                <tr>
                  <th scope="col">항목</th>
                  <th scope="col">수준</th>
                </tr>
              </thead>
              <tbody>
                {jobMetricOrder.map((m) => (
                  <tr key={m}>
                    <th scope="row">{jobMetricLabels[m]}</th>
                    <td>
                      {LEVEL_TEXT[job.metrics[m]]} ({job.metrics[m]}/5)
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section id="recommend" title="추천 학습 과정">
          <div className="grid grid-2">
            {job.recommend.map((r) => (
              <Link key={r.to} to={r.to} className="list-card">
                <h3>{r.label}</h3>
              </Link>
            ))}
          </div>
        </Section>
      </div>

      <Toc items={toc} />
    </div>
  );
}
