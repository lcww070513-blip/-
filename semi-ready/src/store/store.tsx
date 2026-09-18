import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

/* ============================================================
   학습 상태 저장소
   진도, 퀴즈 기록, 오답노트, 면접 답변, 즐겨찾기, 프로필을
   로컬 스토리지에 저장합니다. 계정 연동은 아직 없습니다.
   ============================================================ */

const STORAGE_KEY = 'semi-ready:v1';

export type LearnKind = 'basics' | 'process' | 'backend' | 'equipment';

export interface QuizAttempt {
  id: string;
  category: string;
  correct: boolean;
  ts: number;
}

export interface WrongNote {
  quizId: string;
  category: string;
  reason: string;
  importance: 1 | 2 | 3;
  reviewAt: string; // YYYY-MM-DD
  wrongCount: number;
  solvedAfter: number;
  addedAt: number;
  resolved: boolean;
}

export interface SavedAnswer {
  questionId: string;
  text: string;
  length: string;
  updatedAt: number;
  practiced: boolean;
  checks: string[];
}

export interface Profile {
  education: string;
  major: string;
  targetCompany: string;
  targetJob: string;
  certs: string;
  practice: string;
  project: string;
  award: string;
  patent: string;
  club: string;
  partTime: string;
  strength: string;
  weakness: string;
  conflict: string;
  failure: string;
  safety: string;
  shift: string;
  goal: string;
}

export const emptyProfile: Profile = {
  education: '',
  major: '',
  targetCompany: '',
  targetJob: '',
  certs: '',
  practice: '',
  project: '',
  award: '',
  patent: '',
  club: '',
  partTime: '',
  strength: '',
  weakness: '',
  conflict: '',
  failure: '',
  safety: '',
  shift: '',
  goal: '',
};

export interface MockResult {
  id: string;
  ts: number;
  company: string;
  job: string;
  level: string;
  questionCount: number;
  answered: number;
  scores: Record<string, number>;
  total: number;
}

export interface RecentItem {
  key: string;
  title: string;
  to: string;
  ts: number;
}

export interface AppState {
  version: number;
  theme: 'dark' | 'light';
  onboarded: boolean;
  completed: Record<string, number>;
  attempts: QuizAttempt[];
  wrongNotes: Record<string, WrongNote>;
  answers: Record<string, SavedAnswer>;
  favQuestions: string[];
  favTopics: string[];
  favCompanies: string[];
  profile: Profile;
  targets: string[];
  studySeconds: Record<string, number>;
  recent: RecentItem[];
  mocks: MockResult[];
  firstDay: string;
}

export const todayKey = (d = new Date()) => {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

export const addDays = (days: number, from = new Date()) => {
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return todayKey(d);
};

const initialState = (): AppState => ({
  version: 1,
  theme: 'dark',
  onboarded: false,
  completed: {},
  attempts: [],
  wrongNotes: {},
  answers: {},
  favQuestions: [],
  favTopics: [],
  favCompanies: [],
  profile: { ...emptyProfile },
  targets: [],
  studySeconds: {},
  recent: [],
  mocks: [],
  firstDay: todayKey(),
});

type Status = 'loading' | 'ready' | 'error';

interface Ctx {
  state: AppState;
  status: Status;
  error: string | null;
  set: (updater: (s: AppState) => AppState) => void;
  toggleComplete: (key: string) => void;
  isComplete: (key: string) => boolean;
  recordAttempt: (id: string, category: string, correct: boolean) => void;
  addWrongNote: (quizId: string, category: string) => void;
  updateWrongNote: (quizId: string, patch: Partial<WrongNote>) => void;
  removeWrongNote: (quizId: string) => void;
  saveAnswer: (questionId: string, patch: Partial<SavedAnswer>) => void;
  deleteAnswer: (questionId: string) => void;
  toggleFav: (kind: 'favQuestions' | 'favTopics' | 'favCompanies', id: string) => void;
  setProfile: (patch: Partial<Profile>) => void;
  toggleTarget: (companyId: string) => void;
  pushRecent: (item: Omit<RecentItem, 'ts'>) => void;
  addMock: (m: MockResult) => void;
  setTheme: (t: 'dark' | 'light') => void;
  finishOnboarding: () => void;
  resetAll: () => void;
}

const AppCtx = createContext<Ctx | null>(null);

function migrate(raw: unknown): AppState {
  const base = initialState();
  if (!raw || typeof raw !== 'object') return base;
  const r = raw as Partial<AppState>;
  return {
    ...base,
    ...r,
    profile: { ...base.profile, ...(r.profile ?? {}) },
    completed: r.completed ?? {},
    attempts: Array.isArray(r.attempts) ? r.attempts : [],
    wrongNotes: r.wrongNotes ?? {},
    answers: r.answers ?? {},
    favQuestions: r.favQuestions ?? [],
    favTopics: r.favTopics ?? [],
    favCompanies: r.favCompanies ?? [],
    targets: r.targets ?? [],
    studySeconds: r.studySeconds ?? {},
    recent: r.recent ?? [],
    mocks: r.mocks ?? [],
    version: 1,
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const [status, setStatus] = useState<Status>('loading');
  const [error, setError] = useState<string | null>(null);
  const loaded = useRef(false);

  // 최초 로드
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState(migrate(JSON.parse(raw)));
      setStatus('ready');
    } catch (e) {
      setError('저장된 학습 기록을 불러오지 못했습니다. 브라우저 저장소가 차단되어 있을 수 있습니다.');
      setStatus('error');
    } finally {
      loaded.current = true;
    }
  }, []);

  // 저장
  useEffect(() => {
    if (!loaded.current || status === 'loading') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      setError('학습 기록을 저장하지 못했습니다. 저장 공간이 부족하거나 저장소가 차단되었을 수 있습니다.');
    }
  }, [state, status]);

  // 테마 적용
  useEffect(() => {
    document.documentElement.dataset.theme = state.theme;
  }, [state.theme]);

  // 학습 시간 기록: 문서가 보이는 동안 15초마다 누적
  useEffect(() => {
    if (status !== 'ready') return;
    const tick = () => {
      if (document.visibilityState !== 'visible') return;
      setState((s) => {
        const k = todayKey();
        return { ...s, studySeconds: { ...s.studySeconds, [k]: (s.studySeconds[k] ?? 0) + 15 } };
      });
    };
    const t = window.setInterval(tick, 15000);
    return () => window.clearInterval(t);
  }, [status]);

  const set = useCallback((updater: (s: AppState) => AppState) => setState(updater), []);

  const toggleComplete = useCallback((key: string) => {
    setState((s) => {
      const next = { ...s.completed };
      if (next[key]) delete next[key];
      else next[key] = Date.now();
      return { ...s, completed: next };
    });
  }, []);

  const isComplete = useCallback((key: string) => Boolean(state.completed[key]), [state.completed]);

  const recordAttempt = useCallback((id: string, category: string, correct: boolean) => {
    setState((s) => {
      const attempts = [...s.attempts, { id, category, correct, ts: Date.now() }].slice(-800);
      let wrongNotes = s.wrongNotes;
      if (!correct) {
        const prev = s.wrongNotes[id];
        wrongNotes = {
          ...s.wrongNotes,
          [id]: prev
            ? { ...prev, wrongCount: prev.wrongCount + 1, resolved: false, solvedAfter: 0 }
            : {
                quizId: id,
                category,
                reason: '',
                importance: 2,
                reviewAt: addDays(0),
                wrongCount: 1,
                solvedAfter: 0,
                addedAt: Date.now(),
                resolved: false,
              },
        };
      } else if (s.wrongNotes[id] && !s.wrongNotes[id].resolved) {
        const prev = s.wrongNotes[id];
        const solvedAfter = prev.solvedAfter + 1;
        wrongNotes = { ...s.wrongNotes, [id]: { ...prev, solvedAfter, resolved: solvedAfter >= 2 } };
      }
      return { ...s, attempts, wrongNotes };
    });
  }, []);

  const addWrongNote = useCallback((quizId: string, category: string) => {
    setState((s) =>
      s.wrongNotes[quizId]
        ? s
        : {
            ...s,
            wrongNotes: {
              ...s.wrongNotes,
              [quizId]: {
                quizId,
                category,
                reason: '',
                importance: 2,
                reviewAt: addDays(0),
                wrongCount: 0,
                solvedAfter: 0,
                addedAt: Date.now(),
                resolved: false,
              },
            },
          },
    );
  }, []);

  const updateWrongNote = useCallback((quizId: string, patch: Partial<WrongNote>) => {
    setState((s) => (s.wrongNotes[quizId] ? { ...s, wrongNotes: { ...s.wrongNotes, [quizId]: { ...s.wrongNotes[quizId], ...patch } } } : s));
  }, []);

  const removeWrongNote = useCallback((quizId: string) => {
    setState((s) => {
      const next = { ...s.wrongNotes };
      delete next[quizId];
      return { ...s, wrongNotes: next };
    });
  }, []);

  const saveAnswer = useCallback((questionId: string, patch: Partial<SavedAnswer>) => {
    setState((s) => {
      const prev = s.answers[questionId] ?? {
        questionId,
        text: '',
        length: '60',
        updatedAt: Date.now(),
        practiced: false,
        checks: [],
      };
      return { ...s, answers: { ...s.answers, [questionId]: { ...prev, ...patch, updatedAt: Date.now() } } };
    });
  }, []);

  const deleteAnswer = useCallback((questionId: string) => {
    setState((s) => {
      const next = { ...s.answers };
      delete next[questionId];
      return { ...s, answers: next };
    });
  }, []);

  const toggleFav = useCallback((kind: 'favQuestions' | 'favTopics' | 'favCompanies', id: string) => {
    setState((s) => {
      const list = s[kind];
      return { ...s, [kind]: list.includes(id) ? list.filter((x) => x !== id) : [...list, id] };
    });
  }, []);

  const setProfile = useCallback((patch: Partial<Profile>) => {
    setState((s) => ({ ...s, profile: { ...s.profile, ...patch } }));
  }, []);

  const toggleTarget = useCallback((companyId: string) => {
    setState((s) => ({
      ...s,
      targets: s.targets.includes(companyId) ? s.targets.filter((x) => x !== companyId) : [...s.targets, companyId],
    }));
  }, []);

  const pushRecent = useCallback((item: Omit<RecentItem, 'ts'>) => {
    setState((s) => {
      const rest = s.recent.filter((r) => r.key !== item.key);
      return { ...s, recent: [{ ...item, ts: Date.now() }, ...rest].slice(0, 12) };
    });
  }, []);

  const addMock = useCallback((m: MockResult) => {
    setState((s) => ({ ...s, mocks: [m, ...s.mocks].slice(0, 30) }));
  }, []);

  const setTheme = useCallback((t: 'dark' | 'light') => setState((s) => ({ ...s, theme: t })), []);
  const finishOnboarding = useCallback(() => setState((s) => ({ ...s, onboarded: true })), []);
  const resetAll = useCallback(() => {
    const fresh = initialState();
    fresh.onboarded = true;
    setState(fresh);
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      state,
      status,
      error,
      set,
      toggleComplete,
      isComplete,
      recordAttempt,
      addWrongNote,
      updateWrongNote,
      removeWrongNote,
      saveAnswer,
      deleteAnswer,
      toggleFav,
      setProfile,
      toggleTarget,
      pushRecent,
      addMock,
      setTheme,
      finishOnboarding,
      resetAll,
    }),
    [
      state,
      status,
      error,
      set,
      toggleComplete,
      isComplete,
      recordAttempt,
      addWrongNote,
      updateWrongNote,
      removeWrongNote,
      saveAnswer,
      deleteAnswer,
      toggleFav,
      setProfile,
      toggleTarget,
      pushRecent,
      addMock,
      setTheme,
      finishOnboarding,
      resetAll,
    ],
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
