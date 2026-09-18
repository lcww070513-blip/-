import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp, todayKey } from '@/store/store';
import {
  overallProgress,
  quizStats,
  streak,
  todayRecommendation,
  dueReviews,
} from '@/lib/progress';
import { interviewQuestions } from '@/data/interview';
import { Icon, ProgressRing, Stat } from '@/components/ui';

const QUICK = [
  { to: '/basics/what-is-semiconductor', label: '반도체란 무엇인가', icon: <Icon.Book /> },
  { to: '/process', label: '반도체 8대 공정', icon: <Icon.Flow /> },
  { to: '/equipment', label: '장비 엔지니어 기초', icon: <Icon.Wrench /> },
  { to: '/interview?job=생산', label: '생산직 면접 질문', icon: <Icon.Mic /> },
  { to: '/interview?area=회사별 질문', label: '회사별 예상 질문', icon: <Icon.Building /> },
  { to: '/interview/builder', label: '면접 답변 작성하기', icon: <Icon.Note /> },
];

export default function Home() {
  const { state } = useApp();
  const nav = useNavigate();

  const prog = overallProgress(state);
  const qs = quizStats(state);
  const todaySec = state.studySeconds[todayKey()] ?? 0;
  const savedAnswers = Object.values(state.answers).filter((a) => a.text.trim().length > 0).length;
  const rec = useMemo(() => todayRecommendation(state, 3), [state]);
  const due = dueReviews(state);
  const st = streak(state);

  // 오늘의 면접 질문: 날짜를 기준으로 고정 선택
  const todayQuestion = useMemo(() => {
    const essentials = interviewQuestions.filter((q) => q.essential);
    const seed = Number(todayKey().replace(/-/g, '')) % essentials.length;
    return essentials[seed];
  }, []);

  return (
    <div>
      {/* 첫 화면 */}
      <section className="hero">
        <svg className="hero-deco" width="260" height="220" viewBox="0 0 260 220" aria-hidden="true">
          <circle cx="150" cy="100" r="86" fill="none" stroke="var(--accent)" strokeWidth="1.2" opacity="0.5" />
          {Array.from({ length: 7 }).map((_, r) =>
            Array.from({ length: 7 }).map((_, c) => {
              const x = 82 + c * 20;
              const y = 32 + r * 20;
              const dx = x + 8 - 150;
              const dy = y + 8 - 100;
              if (dx * dx + dy * dy > 78 * 78) return null;
              return <rect key={`${r}-${c}`} x={x} y={y} width="16" height="16" rx="2" fill="var(--accent)" opacity="0.18" />;
            }),
          )}
        </svg>
        <h1>반도체 기초부터 기업별 면접까지, 한 번에 준비하세요.</h1>
        <p>생산·설비·장비 CS 직무 지원자를 위한 단계별 반도체 취업 학습 플랫폼</p>
        <div className="btn-row">
          <Link to="/basics" className="btn btn-primary">
            <Icon.Book /> 학습 시작하기
          </Link>
          <Link to={`/interview/${todayQuestion.id}`} className="btn">
            <Icon.Mic /> 오늘의 면접 질문
          </Link>
          <Link to="/companies?compare=1" className="btn">
            <Icon.Building /> 기업 비교하기
          </Link>
        </div>
      </section>

      {/* 학습 현황 */}
      <section style={{ marginTop: 22 }} aria-labelledby="status-h">
        <h2 id="status-h">학습 현황</h2>
        <div className="card">
          <div style={{ display: 'flex', gap: 22, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <ProgressRing pct={prog.pct} />
              <div className="tiny muted" style={{ marginTop: 6 }}>
                전체 학습 진도율
              </div>
              <div className="tiny muted">
                {prog.done} / {prog.total} 항목
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div className="grid grid-4">
                <Stat label="오늘 학습 시간" value={Math.floor(todaySec / 60)} unit="분" />
                <Stat label="완료한 강의" value={prog.done} unit="개" sub={`전체 ${prog.total}개`} />
                <Stat label="푼 문제" value={qs.total} unit="문항" sub={`문제은행 ${qs.bank}문항`} />
                <Stat label="정답률" value={qs.total ? `${qs.rate}` : '-'} unit={qs.total ? '%' : ''} sub={qs.total ? `정답 ${qs.correct}문항` : '아직 기록 없음'} />
              </div>
              <div className="grid grid-2" style={{ marginTop: 12 }}>
                <Stat label="저장한 면접 답변" value={savedAnswers} unit="개" />
                <Stat label="연속 학습일" value={st} unit="일" sub={st === 0 ? '오늘 학습하면 1일부터 시작합니다' : undefined} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-2" style={{ marginTop: 14 }}>
          <div className="card">
            <h3 className="card-title">
              <Icon.Clock /> 최근 학습한 항목
            </h3>
            {state.recent.length === 0 ? (
              <p className="small muted" style={{ margin: 0 }}>
                아직 학습 기록이 없습니다. 반도체 기초부터 시작해 보세요.
              </p>
            ) : (
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {state.recent.slice(0, 5).map((r) => (
                  <li key={r.key}>
                    <Link to={r.to}>{r.title}</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card">
            <h3 className="card-title">
              <Icon.Star /> 오늘 추천 학습
            </h3>
            {rec.length === 0 ? (
              <p className="small muted" style={{ margin: 0 }}>
                모든 학습 항목을 완료했습니다. 문제은행과 오답노트로 복습해 보세요.
              </p>
            ) : (
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {rec.map((r) => (
                  <li key={r.key}>
                    <Link to={r.to}>{r.title}</Link> <span className="tiny muted">({r.area})</span>
                  </li>
                ))}
              </ul>
            )}
            {due.length > 0 && (
              <p className="note note-warn" style={{ marginTop: 12, marginBottom: 0 }}>
                <Icon.Alert /> 오늘 복습할 오답이 {due.length}문항 있습니다.{' '}
                <Link to="/wrong-notes">오답노트 열기</Link>
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 빠른 메뉴 */}
      <section style={{ marginTop: 26 }} aria-labelledby="quick-h">
        <h2 id="quick-h">빠른 메뉴</h2>
        <div className="grid grid-3">
          {QUICK.map((q) => (
            <button
              key={q.to}
              className="list-card"
              style={{ textAlign: 'left', cursor: 'pointer' }}
              onClick={() => nav(q.to)}
            >
              <div className="row" style={{ gap: 9 }}>
                <span style={{ color: 'var(--accent)', display: 'flex' }}>{q.icon}</span>
                <h3 style={{ margin: 0 }}>{q.label}</h3>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 오늘의 면접 질문 */}
      <section style={{ marginTop: 26 }} aria-labelledby="todayq-h">
        <h2 id="todayq-h">오늘의 면접 질문</h2>
        <div className="card">
          <div className="row" style={{ marginBottom: 8 }}>
            <span className="badge badge-accent">{todayQuestion.area}</span>
            <span className="badge">{todayQuestion.level}</span>
          </div>
          <h3 style={{ marginBottom: 6 }}>{todayQuestion.q}</h3>
          <p className="small" style={{ color: 'var(--text-2)' }}>
            {todayQuestion.intent}
          </p>
          <Link to={`/interview/${todayQuestion.id}`} className="btn btn-primary btn-sm">
            답변 구조 보고 작성하기
          </Link>
        </div>
      </section>

      {/* 안내 */}
      <section style={{ marginTop: 26 }} aria-labelledby="notice-h">
        <h2 id="notice-h">이 사이트를 쓰기 전에</h2>
        <div className="grid grid-3">
          <div className="card">
            <h3 className="card-title">학습 기록은 이 브라우저에 저장됩니다</h3>
            <p className="small" style={{ color: 'var(--text-2)', margin: 0 }}>
              로그인 없이 진도와 답변이 브라우저 저장소에 보관됩니다. 다른 기기에서는 이어지지 않고, 브라우저 데이터를
              지우면 함께 사라집니다. <Link to="/settings">설정에서 내보내기</Link>를 해 두면 백업할 수 있습니다.
            </p>
          </div>
          <div className="card">
            <h3 className="card-title">기업 정보는 직접 확인해야 합니다</h3>
            <p className="small" style={{ color: 'var(--text-2)', margin: 0 }}>
              매출, 투자, 채용 규모처럼 자주 바뀌는 정보는 담지 않았습니다. 사업 영역 같은 안정적인 내용만 정리했으니
              나머지는 공식 홈페이지와 채용 공고로 확인하세요.
            </p>
          </div>
          <div className="card">
            <h3 className="card-title">예시 답변은 정답이 아닙니다</h3>
            <p className="small" style={{ color: 'var(--text-2)', margin: 0 }}>
              모든 모범 답변은 구조를 보여 주는 참고용입니다. 본인의 실제 경험으로 바꾸지 않으면 꼬리질문에서 바로
              드러납니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
