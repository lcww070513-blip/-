/** 사이트 전체에서 공유하는 데이터 타입 정의 */

export interface Term {
  /** 영문 약어. 약어가 없는 용어는 비워 둔다 */
  abbr?: string;
  /** 영문 전체 명칭 */
  en?: string;
  /** 한국어 명칭 */
  ko: string;
  /** 쉬운 한국어 설명 */
  desc: string;
}

export interface MiniQuiz {
  q: string;
  choices: string[];
  answer: number;
  explain: string;
}

export type BasicGroup =
  | '반도체 개념'
  | '재료와 전자'
  | '소자 원리'
  | '웨이퍼와 칩'
  | '제품과 산업'
  | '제조 현장';

export interface BasicTopic {
  id: string;
  title: string;
  group: BasicGroup;
  /** 한 줄 정의 */
  oneLine: string;
  /** 쉬운 설명 (문단 단위) */
  easy: string[];
  /** Figure 컴포넌트가 해석하는 도해 키 */
  figure?: string;
  figureCaption?: string;
  /** 핵심 원리 */
  principles: string[];
  /** 현장에서 중요한 이유 */
  whyField: string[];
  terms: Term[];
  answer: { sec20: string; sec60: string };
  /** 자주 하는 실수 */
  mistakes: string[];
  check: MiniQuiz[];
  /** 추가 심화 내용 */
  deep: string[];
  related: string[];
  readMinutes: number;
}

export interface ProcessDefect {
  name: string;
  symptom: string;
  causes: string[];
}

export interface ProcessQuestion {
  q: string;
  keywords: string[];
  hint: string;
}

export interface SubSection {
  h: string;
  body: string;
  bullets?: string[];
}

export interface ProcessStep {
  id: string;
  order: number;
  title: string;
  en: string;
  /** 공정 목적 */
  purpose: string;
  before: string;
  after: string;
  principles: string[];
  equipment: { name: string; abbr?: string; en?: string; note: string }[];
  variables: { name: string; note: string }[];
  defects: ProcessDefect[];
  checkBy: {
    operator: string[];
    equipment: string[];
    cs: string[];
  };
  safety: string[];
  questions: ProcessQuestion[];
  /** 공정 간 연결 관계 */
  linkPrev: string;
  linkNext: string;
  figure?: string;
  figureCaption?: string;
  detail: SubSection[];
  readMinutes: number;
}

export interface BackendStep {
  id: string;
  order: number;
  title: string;
  en: string;
  oneLine: string;
  body: string[];
  points: string[];
  /** 직군별 담당 범위 */
  byRole: { production: string; equipment: string; quality: string };
  defects: string[];
  figure?: string;
  terms: Term[];
}

export interface EquipTopic {
  id: string;
  title: string;
  group: string;
  oneLine: string;
  body: string[];
  bullets?: string[];
  terms: Term[];
  interviewTip?: string;
}

export interface TroubleOption {
  id: string;
  label: string;
  /** 올바른 판단인지 */
  verdict: 'good' | 'caution' | 'danger';
  safety: string;
  field: string;
  interview: string;
  /** 정답 순서에서의 위치. -1이면 순서에 포함되지 않는 선택 */
  rank: number;
}

export interface TroubleCase {
  id: string;
  title: string;
  situation: string;
  context: string[];
  options: TroubleOption[];
  wrapUp: string;
}

export type JobMetricKey =
  | 'entry'
  | 'growth'
  | 'physical'
  | 'shift'
  | 'safety'
  | 'customer'
  | 'mechanical'
  | 'electrical'
  | 'transfer';

export interface Job {
  id: string;
  title: string;
  en: string;
  oneLine: string;
  duties: string[];
  day: { time: string; task: string }[];
  place: string;
  shift: string;
  cleanroom: string;
  knowledge: string[];
  traits: string[];
  certs: string[];
  hsChance: string;
  career: string[];
  moves: string[];
  hard: string[];
  good: string[];
  evalPoints: string[];
  questions: string[];
  recommend: { label: string; to: string }[];
  metrics: Record<JobMetricKey, number>;
}

export type CompanyCategory =
  | '메모리·IDM'
  | '파운드리'
  | '팹리스'
  | '장비'
  | '소재·부품'
  | '후공정·테스트';

export interface Company {
  id: string;
  name: string;
  en: string;
  category: CompanyCategory;
  country: string;
  /** 기업 개요 */
  overview: string;
  /** 반도체 산업 내 위치 */
  position: string;
  products: string[];
  customers: string;
  sites: string[];
  /** 생산공정 또는 장비 영역 */
  area: string[];
  /** 최근 집중하는 기술과 사업 방향 */
  focus: string[];
  strengths: string[];
  risks: string[];
  rivals: string[];
  roles: { production: string; equipment: string; cs: string };
  forNewbie: string[];
  motivePoints: string[];
  questions: string[];
  /** 지원동기에서 피해야 할 과장 표현 */
  overclaims: string[];
  links: { site: string; careers: string };
  /** 정보 확인일 */
  asOf: string;
  sources: { label: string; url: string }[];
  compare: {
    type: string;
    mainProduct: string;
    mainProcess: string;
    tech: string;
    productionRole: string;
    csRole: string;
    regions: string;
    shift: string;
    motive: string;
    csPrep: string;
    topics: string;
  };
}

export type InterviewArea =
  | '인성면접'
  | '직무면접'
  | '반도체 CS'
  | '회사별 질문'
  | '상황면접'
  | '안전면접'
  | '교대근무'
  | '압박면접'
  | '자기소개'
  | '지원동기'
  | '마지막 할 말';

export type InterviewLevel = '기초' | '실전' | '심화' | '압박';
export type JobFilter = '생산' | '설비' | '장비 CS' | '공정' | '품질' | '테스트';

export interface InterviewQuestion {
  id: string;
  q: string;
  area: InterviewArea;
  level: InterviewLevel;
  jobs: JobFilter[];
  companies: string[];
  /** 질문 의도 */
  intent: string;
  /** 면접관의 평가요소 */
  criteria: string[];
  /** 답변 구조 */
  structure: string[];
  must: string[];
  avoid: string[];
  good: string;
  bad: string;
  follow: string[];
  essential?: boolean;
}

export type QuizType =
  | 'mcq'
  | 'ox'
  | 'fill'
  | 'order'
  | 'match'
  | 'case'
  | 'short'
  | 'essay';

export type QuizCategory =
  | '반도체 기초'
  | '8대 공정'
  | '후공정'
  | '장비'
  | '안전'
  | '품질'
  | '기업'
  | '직무'
  | '면접';

export interface QuizItem {
  id: string;
  type: QuizType;
  category: QuizCategory;
  level: '기초' | '실전' | '심화';
  q: string;
  /** 객관식·상황판단 선택지 */
  choices?: string[];
  answer?: number;
  /** 선택지별로 틀린 이유 */
  wrongWhy?: string[];
  /** OX 정답 */
  ox?: boolean;
  /** 빈칸·단답 정답 후보 */
  accept?: string[];
  /** 순서 배열 정답 */
  order?: string[];
  /** 용어 연결 */
  pairs?: { l: string; r: string }[];
  /** 서술형 채점 포인트 */
  points?: string[];
  explain: string;
  ref?: { label: string; to: string };
}

export interface GlossaryEntry {
  ko: string;
  abbr?: string;
  en?: string;
  field: string;
  desc: string;
  related: string[];
  usage: string;
  to?: string;
}
