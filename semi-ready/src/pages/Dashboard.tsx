import { Link } from 'react-router-dom';
import { useApp, todayKey } from '@/store/store';
import {
  areaProgress,
  companyReadiness,
  dueReviews,
  formatMinutes,
  last7Days,
  mostWrongCategories,
  overallProgress,
  quizByCategory,
  quizStats,
  streak,
  studyDays,
  todayRecommendation,
} from '@/lib/progress';
import { companies } from '@/data/companies';
import { interviewQuestions } from '@/data/interview';
import { CorrectRatio, HBarChart, WeekBars } from '@/components/Charts';
import { EmptyState, Icon, ProgressBar, ProgressRing, Section, Stat } from '@/components/ui';

export default function Dashboard() {
  const { state } = useApp();

  const prog = overallProgress(state);
  const areas = areaProgress(state);
  const qs = quizStats(state);
  const byCat = quizByCategory(state);
  const week = last7Days(state);
  const days = studyDays(state);
  const st = streak(state);
  const due = dueReviews(state);
  const worst = mostWrongCategories(state);
  const rec = todayRecommendation(state, 4);
  const totalSeconds = Object.values(state.studySeconds).reduce((a, b) => a + b, 0);
  const todaySeconds = state.studySeconds[todayKey()] ?? 0;
  const lastMock = state.mocks[0];
  const unpracticed = Object.values(state.answers).filter((a) => !a.practiced && a.text.trim());

  const hasAnyRecord = prog.done > 0 || qs.total > 0 || days.length > 0;

  return (
    <div>
      <div className="page-head">
        <h1>학습 대시보드</h1>
        <p>저장된 학습 기록만으로 계산한 현황입니다. 기록이 없는 항목은 비어 있는 상태로 표시됩니다.</p>
      </div>

      {!hasAnyRecord && (
        <div style={{ marginBottom: 20 }}>
          <EmptyState
            title="아직 표시할 학습 기록이 없습니다"
            desc="학습 항목을 완료로 표시하거나 문제를 풀면 이 화면이 실제 데이터로 채워집니다. 기초 학습부터 시작해 보세요."
            action={
              <Link to="/basics" className="btn btn-primary">
                <Icon.Book /> 반도체 기초 학습 시작
              </Link>
            }
          />
        </div>
      )}

      <Section id="overall" title="전체 학습 진도">
        <div className="card">
          <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <ProgressRing pct={prog.pct} size={124} />
              <div className="tiny muted" style={{ marginTop: 6 }}>
                {prog.done} / {prog.total} 항목 완료
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div className="grid grid-4">
                <Stat label="누적 학습일" value={days.length} unit="일" />
                <Stat label="연속 학습일" value={st} unit="일" />
                <Stat label="오늘 학습" value={Math.floor(todaySeconds / 60)} unit="분" />
                <Stat label="총 학습 시간" value={formatMinutes(totalSeconds)} />
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section id="area" title="분야별 진도">
        <div className="card">
          <HBarChart
            title="영역별 완료율"
            data={areas.map((a) => ({ label: a.area, value: a.pct, sub: `${a.done}/${a.total}` }))}
            unit="%"
            emptyLabel="아직 완료한 학습 항목이 없습니다. 학습 페이지에서 학습 완료로 표시해 보세요."
          />
        </div>
      </Section>

      <Section id="quiz" title="문제 정답률과 약점">
        <div className="grid grid-2">
          <div className="card">
            <h3 className="card-title">전체 정답률</h3>
            <CorrectRatio correct={qs.correct} wrong={qs.wrong} />
            <div className="grid grid-2" style={{ marginTop: 14 }}>
              <Stat label="푼 문제" value={qs.total} unit="문항" />
              <Stat label="풀어 본 문제 수" value={qs.uniqueSolved} unit={`/${qs.bank}`} />
            </div>
          </div>
          <div className="card">
            <HBarChart
              title="분야별 정답률"
              data={byCat
                .filter((c) => c.attempts > 0)
                .map((c) => ({ label: c.category, value: c.rate, sub: `${c.attempts}문항 시도` }))}
              unit="%"
              color="var(--series-2)"
              emptyLabel="아직 푼 문제가 없습니다. 문제은행에서 풀어 보세요."
            />
          </div>
        </div>

        {worst.length > 0 && (
          <div className="card">
            <h3 className="card-title">분야별 약점</h3>
            <p className="small muted">틀린 횟수가 많은 순서입니다. 여기부터 복습하면 효율이 좋습니다.</p>
            <div className="table-wrap">
              <table>
                <caption className="sr-only">분야별 오답 횟수</caption>
                <thead>
                  <tr>
                    <th scope="col">분야</th>
                    <th scope="col">틀린 횟수</th>
                    <th scope="col">정답률</th>
                    <th scope="col">바로 가기</th>
                  </tr>
                </thead>
                <tbody>
                  {worst.slice(0, 5).map((w) => {
                    const cat = byCat.find((c) => c.category === w.category);
                    return (
                      <tr key={w.category}>
                        <th scope="row">{w.category}</th>
                        <td>{w.count}회</td>
                        <td>{cat ? `${cat.rate}%` : '-'}</td>
                        <td>
                          <Link className="btn btn-sm" to={`/quiz?category=${encodeURIComponent(w.category)}`}>
                            문제 풀기
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Section>

      <Section id="time" title="학습 시간">
        <div className="card">
          <WeekBars data={week} />
        </div>
      </Section>

      <Section id="interview" title="면접 준비 상태">
        <div className="grid grid-2">
          <div className="card">
            <h3 className="card-title">최근 모의면접 결과</h3>
            {!lastMock ? (
              <p className="small muted" style={{ margin: 0 }}>
                아직 모의면접 기록이 없습니다.{' '}
                <Link to="/interview/mock">모의면접을 진행해 보세요.</Link>
              </p>
            ) : (
              <div>
                <div className="row" style={{ marginBottom: 10 }}>
                  <span className="badge badge-accent">{lastMock.company}</span>
                  <span className="badge">{lastMock.job}</span>
                  <span className="badge">{new Date(lastMock.ts).toLocaleDateString('ko-KR')}</span>
                </div>
                <ProgressBar pct={lastMock.total} label={`종합 점수 (참고값)`} />
                <p className="tiny muted" style={{ marginTop: 8, marginBottom: 0 }}>
                  {lastMock.answered}/{lastMock.questionCount}문항 답변 · 이 점수는 답변 길이와 핵심어 포함 여부로 계산한
                  참고값입니다.
                </p>
              </div>
            )}
          </div>

          <div className="card">
            <h3 className="card-title">자주 막힌 질문</h3>
            {unpracticed.length === 0 ? (
              <p className="small muted" style={{ margin: 0 }}>
                연습 완료 표시가 없는 답변이 없습니다.
              </p>
            ) : (
              <ul style={{ marginBottom: 0 }}>
                {unpracticed.slice(0, 5).map((a) => {
                  const q = interviewQuestions.find((x) => x.id === a.questionId);
                  return (
                    <li key={a.questionId} className="small">
                      <Link to={`/interview/${a.questionId}`}>{q?.q ?? a.questionId}</Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </Section>

      <Section id="review" title="추천 복습 항목">
        <div className="grid grid-2">
          <div className="card">
            <h3 className="card-title">오늘 복습할 오답</h3>
            {due.length === 0 ? (
              <p className="small muted" style={{ margin: 0 }}>
                오늘 복습할 오답이 없습니다.
              </p>
            ) : (
              <>
                <p className="small" style={{ color: 'var(--text-2)' }}>
                  {due.length}문항이 복습 예정일에 도달했습니다.
                </p>
                <Link to="/wrong-notes" className="btn btn-sm btn-primary">
                  오답노트 열기
                </Link>
              </>
            )}
          </div>
          <div className="card">
            <h3 className="card-title">아직 학습하지 않은 항목</h3>
            {rec.length === 0 ? (
              <p className="small muted" style={{ margin: 0 }}>
                모든 학습 항목을 완료했습니다.
              </p>
            ) : (
              <ul style={{ marginBottom: 0 }}>
                {rec.map((r) => (
                  <li key={r.key} className="small">
                    <Link to={r.to}>{r.title}</Link> <span className="tiny muted">({r.area})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Section>

      <Section id="company" title="지원 기업별 준비도">
        {state.targets.length === 0 ? (
          <EmptyState
            title="등록한 지원 기업이 없습니다"
            desc="기업 상세 페이지에서 지원 기업으로 등록하면, 그 회사에 맞춘 준비도를 여기서 확인할 수 있습니다."
            action={
              <Link to="/companies" className="btn btn-primary">
                <Icon.Building /> 기업 분석 보기
              </Link>
            }
          />
        ) : (
          <div className="grid grid-2">
            {state.targets.map((id) => {
              const r = companyReadiness(state, id);
              if (!r) return null;
              return (
                <div className="card" key={id}>
                  <div className="spread" style={{ marginBottom: 10 }}>
                    <h3 style={{ margin: 0 }}>
                      <Link to={`/companies/${id}`}>{r.company.name}</Link>
                    </h3>
                    <span className="badge badge-accent">{r.company.category}</span>
                  </div>
                  <ProgressBar pct={r.pct} label={`준비도 (${r.done}/${r.total})`} />
                  <ul style={{ marginTop: 12, marginBottom: 0, listStyle: 'none', paddingLeft: 0 }}>
                    {r.parts.map((p) => (
                      <li key={p.label} className="row" style={{ gap: 8, marginBottom: 6 }}>
                        <span
                          style={{ display: 'flex', color: p.done ? 'var(--good)' : 'var(--text-3)' }}
                          aria-hidden="true"
                        >
                          {p.done ? <Icon.Check size={14} /> : <Icon.X size={14} />}
                        </span>
                        <span className="small" style={{ flex: 1, color: p.done ? 'var(--text-2)' : 'var(--text-3)' }}>
                          {p.label}
                        </span>
                        {!p.done && (
                          <Link className="tiny" to={p.to}>
                            하러 가기
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
        {state.targets.length > 0 && state.targets.length < companies.length && (
          <p className="small muted" style={{ marginTop: 12 }}>
            다른 회사도 함께 준비하고 싶다면 <Link to="/companies">기업 분석</Link>에서 지원 기업으로 등록하세요.
          </p>
        )}
      </Section>
    </div>
  );
}
