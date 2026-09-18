import { basicTopics } from '@/data/basics';
import { processSteps } from '@/data/processes';
import { backendSteps } from '@/data/backend';
import { equipTopics } from '@/data/equipment';
import { jobs } from '@/data/jobs';
import { companies } from '@/data/companies';
import { quizItems } from '@/data/quiz';
import type { AppState } from '@/store/store';
import { todayKey } from '@/store/store';

/** 학습 단위 하나 */
export interface LearnUnit {
  key: string;
  title: string;
  to: string;
  area: string;
}

/** 진도 계산에 쓰이는 전체 학습 단위 목록 */
export const learnUnits: LearnUnit[] = [
  ...basicTopics.map((t) => ({ key: `basics:${t.id}`, title: t.title, to: `/basics/${t.id}`, area: '반도체 기초' })),
  ...processSteps.map((p) => ({ key: `process:${p.id}`, title: p.title, to: `/process/${p.id}`, area: '8대 공정' })),
  ...backendSteps.map((b) => ({ key: `backend:${b.id}`, title: b.title, to: `/backend/${b.id}`, area: '후공정' })),
  ...equipTopics.map((e) => ({ key: `equipment:${e.id}`, title: e.title, to: `/equipment/${e.id}`, area: '장비·CS' })),
  ...jobs.map((j) => ({ key: `job:${j.id}`, title: j.title, to: `/jobs/${j.id}`, area: '직무' })),
  ...companies.map((c) => ({ key: `company:${c.id}`, title: c.name, to: `/companies/${c.id}`, area: '기업' })),
];

export const learnAreas = ['반도체 기초', '8대 공정', '후공정', '장비·CS', '직무', '기업'] as const;

export function areaProgress(state: AppState) {
  return learnAreas.map((area) => {
    const units = learnUnits.filter((u) => u.area === area);
    const done = units.filter((u) => state.completed[u.key]).length;
    return { area, done, total: units.length, pct: units.length ? Math.round((done / units.length) * 100) : 0 };
  });
}

export function overallProgress(state: AppState) {
  const total = learnUnits.length;
  const done = learnUnits.filter((u) => state.completed[u.key]).length;
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}

export function quizStats(state: AppState) {
  const solvedIds = new Set(state.attempts.map((a) => a.id));
  const correct = state.attempts.filter((a) => a.correct).length;
  const total = state.attempts.length;
  return {
    total,
    correct,
    wrong: total - correct,
    rate: total ? Math.round((correct / total) * 100) : 0,
    uniqueSolved: solvedIds.size,
    bank: quizItems.length,
  };
}

export function quizByCategory(state: AppState) {
  const cats = Array.from(new Set(quizItems.map((q) => q.category)));
  return cats.map((c) => {
    const at = state.attempts.filter((a) => a.category === c);
    const correct = at.filter((a) => a.correct).length;
    return {
      category: c,
      attempts: at.length,
      correct,
      rate: at.length ? Math.round((correct / at.length) * 100) : 0,
      bank: quizItems.filter((q) => q.category === c).length,
    };
  });
}

/** 정답률이 낮은 분야 (시도 3회 이상) */
export function weakAreas(state: AppState) {
  return quizByCategory(state)
    .filter((c) => c.attempts >= 3)
    .sort((a, b) => a.rate - b.rate)
    .slice(0, 3);
}

export function studyDays(state: AppState) {
  const days = Object.entries(state.studySeconds)
    .filter(([, v]) => v >= 60)
    .map(([k]) => k)
    .sort();
  return days;
}

export function streak(state: AppState) {
  const days = new Set(studyDays(state));
  let count = 0;
  const d = new Date();
  // 오늘 기록이 없으면 어제부터 센다
  if (!days.has(todayKey(d))) d.setDate(d.getDate() - 1);
  for (;;) {
    if (!days.has(todayKey(d))) break;
    count += 1;
    d.setDate(d.getDate() - 1);
  }
  return count;
}

export function last7Days(state: AppState) {
  const out: { day: string; label: string; minutes: number }[] = [];
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = todayKey(d);
    out.push({
      day: key,
      label: ['일', '월', '화', '수', '목', '금', '토'][d.getDay()],
      minutes: Math.round((state.studySeconds[key] ?? 0) / 60),
    });
  }
  return out;
}

export function formatMinutes(seconds: number) {
  const m = Math.floor(seconds / 60);
  if (m < 60) return `${m}분`;
  return `${Math.floor(m / 60)}시간 ${m % 60}분`;
}

/** 기업별 준비도: 6개 요소를 각각 채웠는지 확인 */
export interface ReadinessPart {
  label: string;
  done: boolean;
  to: string;
}

export function companyReadiness(state: AppState, companyId: string) {
  const company = companies.find((c) => c.id === companyId);
  if (!company) return null;

  const processDone = processSteps.filter((p) => state.completed[`process:${p.id}`]).length;
  const jobDone = jobs.filter((j) => state.completed[`job:${j.id}`]).length;
  const companyAnswers = Object.values(state.answers).filter((a) => a.text.trim().length > 30);
  const motiveAnswer = state.answers['q-why-company']?.text.trim().length ?? 0;

  const parts: ReadinessPart[] = [
    { label: '기업 정보 학습', done: Boolean(state.completed[`company:${companyId}`]), to: `/companies/${companyId}` },
    { label: '관련 공정 학습 (3개 이상)', done: processDone >= 3, to: '/process' },
    { label: '직무 학습 (1개 이상)', done: jobDone >= 1, to: '/jobs' },
    { label: '회사별 질문 연습', done: companyAnswers.length >= 3, to: '/interview' },
    { label: '지원동기 작성', done: motiveAnswer > 80, to: '/interview/q-why-company' },
    { label: '모의면접 완료', done: state.mocks.length > 0, to: '/interview/mock' },
  ];
  const done = parts.filter((p) => p.done).length;
  return { company, parts, done, total: parts.length, pct: Math.round((done / parts.length) * 100) };
}

/** 오늘 추천 학습: 아직 완료하지 않은 항목을 영역 순서대로 제시 */
export function todayRecommendation(state: AppState, count = 3): LearnUnit[] {
  const pending = learnUnits.filter((u) => !state.completed[u.key]);
  if (pending.length === 0) return [];
  // 영역별로 골고루 나오도록 순서를 섞지 않고 영역을 번갈아 고른다
  const byArea = new Map<string, LearnUnit[]>();
  pending.forEach((u) => {
    const list = byArea.get(u.area) ?? [];
    list.push(u);
    byArea.set(u.area, list);
  });
  const picked: LearnUnit[] = [];
  let guard = 0;
  while (picked.length < count && guard < 40) {
    guard += 1;
    for (const area of learnAreas) {
      const list = byArea.get(area);
      if (list && list.length) {
        picked.push(list.shift()!);
        if (picked.length >= count) break;
      }
    }
    if (Array.from(byArea.values()).every((v) => v.length === 0)) break;
  }
  return picked;
}

/** 오늘 복습해야 할 오답 */
export function dueReviews(state: AppState) {
  const today = todayKey();
  return Object.values(state.wrongNotes)
    .filter((n) => !n.resolved && n.reviewAt <= today)
    .sort((a, b) => b.importance - a.importance);
}

/** 최근 7일 안에 틀린 문제 */
export function recentWrongs(state: AppState) {
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const ids = new Set(state.attempts.filter((a) => !a.correct && a.ts >= cutoff).map((a) => a.id));
  return Object.values(state.wrongNotes).filter((n) => ids.has(n.quizId));
}

/** 가장 많이 틀린 분야 */
export function mostWrongCategories(state: AppState) {
  const map = new Map<string, number>();
  state.attempts.filter((a) => !a.correct).forEach((a) => map.set(a.category, (map.get(a.category) ?? 0) + 1));
  return Array.from(map.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

/** 연습 완료 표시가 없는, 답변을 저장한 면접 질문 */
export function stuckQuestions(state: AppState) {
  return Object.values(state.answers)
    .filter((a) => !a.practiced)
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 5);
}
