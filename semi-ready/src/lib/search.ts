import { basicTopics } from '@/data/basics';
import { processSteps } from '@/data/processes';
import { backendSteps } from '@/data/backend';
import { equipTopics } from '@/data/equipment';
import { jobs } from '@/data/jobs';
import { companies } from '@/data/companies';
import { interviewQuestions } from '@/data/interview';
import { quizItems } from '@/data/quiz';
import { glossary } from '@/data/glossary';

export interface SearchDoc {
  id: string;
  kind: string;
  title: string;
  desc: string;
  to: string;
  body: string;
}

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, '');

export const searchIndex: SearchDoc[] = [
  ...glossary.map((g) => ({
    id: `term:${g.ko}`,
    kind: '용어',
    title: g.abbr ? `${g.abbr} · ${g.ko}` : g.ko,
    desc: g.desc,
    to: g.to ?? '/glossary',
    body: [g.ko, g.abbr, g.en, g.desc, g.field, ...g.related].filter(Boolean).join(' '),
  })),
  ...basicTopics.map((t) => ({
    id: `basics:${t.id}`,
    kind: '반도체 기초',
    title: t.title,
    desc: t.oneLine,
    to: `/basics/${t.id}`,
    body: [t.title, t.oneLine, ...t.easy, ...t.principles, ...t.terms.map((x) => `${x.ko} ${x.abbr ?? ''} ${x.en ?? ''}`)].join(' '),
  })),
  ...processSteps.map((p) => ({
    id: `process:${p.id}`,
    kind: '공정',
    title: p.title,
    desc: p.purpose,
    to: `/process/${p.id}`,
    body: [p.title, p.en, p.purpose, ...p.principles, ...p.equipment.map((e) => e.name), ...p.variables.map((v) => v.name), ...p.defects.map((d) => d.name)].join(' '),
  })),
  ...backendSteps.map((b) => ({
    id: `backend:${b.id}`,
    kind: '후공정',
    title: b.title,
    desc: b.oneLine,
    to: `/backend/${b.id}`,
    body: [b.title, b.en, b.oneLine, ...b.body, ...b.points, ...b.defects].join(' '),
  })),
  ...equipTopics.map((e) => ({
    id: `equipment:${e.id}`,
    kind: '장비·CS',
    title: e.title,
    desc: e.oneLine,
    to: `/equipment/${e.id}`,
    body: [e.title, e.oneLine, ...e.body, ...(e.bullets ?? []), ...e.terms.map((t) => `${t.ko} ${t.abbr ?? ''}`)].join(' '),
  })),
  ...jobs.map((j) => ({
    id: `job:${j.id}`,
    kind: '직무',
    title: j.title,
    desc: j.oneLine,
    to: `/jobs/${j.id}`,
    body: [j.title, j.en, j.oneLine, ...j.duties, ...j.knowledge, ...j.certs, ...j.questions].join(' '),
  })),
  ...companies.map((c) => ({
    id: `company:${c.id}`,
    kind: '기업',
    title: c.name,
    desc: c.overview,
    to: `/companies/${c.id}`,
    body: [c.name, c.en, c.category, c.overview, c.position, ...c.products, ...c.sites, ...c.focus, ...c.rivals].join(' '),
  })),
  ...interviewQuestions.map((q) => ({
    id: `interview:${q.id}`,
    kind: '면접 질문',
    title: q.q,
    desc: q.intent,
    to: `/interview/${q.id}`,
    body: [q.q, q.area, q.level, q.intent, ...q.criteria, ...q.must, ...q.follow].join(' '),
  })),
  ...quizItems.map((q) => ({
    id: `quiz:${q.id}`,
    kind: '문제',
    title: q.q,
    desc: `${q.category} · ${q.level}`,
    to: `/quiz?focus=${q.id}`,
    body: [q.q, q.category, q.explain, ...(q.choices ?? [])].join(' '),
  })),
];

export function search(query: string, limit = 24): SearchDoc[] {
  const q = norm(query.trim());
  if (q.length < 1) return [];
  const scored: { doc: SearchDoc; score: number }[] = [];
  for (const doc of searchIndex) {
    const title = norm(doc.title);
    const body = norm(doc.body);
    let score = 0;
    if (title === q) score += 100;
    else if (title.startsWith(q)) score += 60;
    else if (title.includes(q)) score += 40;
    if (body.includes(q)) score += 12;
    if (score > 0) scored.push({ doc, score });
  }
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.doc);
}

export const searchKinds = ['용어', '반도체 기초', '공정', '후공정', '장비·CS', '직무', '기업', '면접 질문', '문제'];
