import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp, type Profile } from '@/store/store';
import { answerLengths, feedbackCriteria } from '@/data/interview';
import { companies } from '@/data/companies';
import { jobs } from '@/data/jobs';
import { Icon, Section } from '@/components/ui';

/* ============================================================
   개인 경험 기반 답변 초안 작성기.
   입력하지 않은 경험, 성과, 수치, 자격증은 절대 만들어 넣지 않습니다.
   비어 있는 자리는 빈칸으로 표시하고, 무엇을 더 써야 하는지 질문으로 알려 줍니다.
   ============================================================ */

const FIELDS: { key: keyof Profile; label: string; placeholder: string; multiline?: boolean }[] = [
  { key: 'education', label: '학력', placeholder: '예: OO공업고등학교 졸업 (2026년 2월)' },
  { key: 'major', label: '전공 또는 계열', placeholder: '예: 전기과, 기계과, 비전공' },
  { key: 'targetCompany', label: '지원 기업', placeholder: '목록에서 고르거나 직접 입력' },
  { key: 'targetJob', label: '지원 직무', placeholder: '목록에서 고르거나 직접 입력' },
  { key: 'certs', label: '보유 자격증', placeholder: '예: 전기기능사 (2025년 취득). 없으면 비워 두세요.', multiline: true },
  { key: 'practice', label: '실습 경험', placeholder: '학교 실습, 현장실습에서 실제로 한 작업을 적으세요.', multiline: true },
  { key: 'project', label: '프로젝트', placeholder: '무엇을 맡아 어떻게 했는지 적으세요.', multiline: true },
  { key: 'award', label: '수상', placeholder: '대회명과 수상 내용. 없으면 비워 두세요.', multiline: true },
  { key: 'patent', label: '특허', placeholder: '있는 경우에만 적으세요.', multiline: true },
  { key: 'club', label: '동아리 활동', placeholder: '역할과 실제로 한 일을 적으세요.', multiline: true },
  { key: 'partTime', label: '아르바이트', placeholder: '기간과 맡은 역할, 배운 점을 적으세요.', multiline: true },
  { key: 'strength', label: '강점', placeholder: '강점과 그것을 보여 준 구체적 상황을 함께 적으세요.', multiline: true },
  { key: 'weakness', label: '단점', placeholder: '실제 단점과 개선을 위해 하고 있는 행동을 적으세요.', multiline: true },
  { key: 'conflict', label: '갈등 경험', placeholder: '누구와 무엇 때문에, 본인이 어떻게 했는지 적으세요.', multiline: true },
  { key: 'failure', label: '실패 경험', placeholder: '무엇이 잘 안 됐고 거기서 무엇을 배웠는지 적으세요.', multiline: true },
  { key: 'safety', label: '안전 관련 경험', placeholder: '안전 교육, 규정을 지킨 경험, 위험을 발견한 경험 등', multiline: true },
  { key: 'shift', label: '교대근무 가능 여부와 근거', placeholder: '예: 가능. 야간 아르바이트 6개월 경험이 있음', multiline: true },
  { key: 'goal', label: '입사 후 목표', placeholder: '1년, 3년 뒤 어떤 모습이고 싶은지 적으세요.', multiline: true },
];

type DraftKind = 'intro' | 'motive' | 'strength' | 'conflict' | 'failure' | 'safety' | 'shift' | 'goal';

const DRAFT_KINDS: { id: DraftKind; label: string; question: string; uses: (keyof Profile)[] }[] = [
  { id: 'intro', label: '1분 자기소개', question: '1분 자기소개를 해보세요.', uses: ['strength', 'practice', 'targetJob', 'goal'] },
  { id: 'motive', label: '지원동기', question: '우리 회사에 지원한 이유는 무엇입니까?', uses: ['targetCompany', 'targetJob', 'practice', 'goal'] },
  { id: 'strength', label: '강점과 단점', question: '본인의 강점과 단점은 무엇입니까?', uses: ['strength', 'weakness'] },
  { id: 'conflict', label: '갈등 해결 경험', question: '갈등을 해결한 경험을 말해보세요.', uses: ['conflict'] },
  { id: 'failure', label: '실패 경험', question: '실패한 경험과 배운 점을 말해보세요.', uses: ['failure'] },
  { id: 'safety', label: '안전 의식', question: '안전과 관련한 경험이 있습니까?', uses: ['safety'] },
  { id: 'shift', label: '교대근무 가능 여부', question: '교대근무가 가능한가요?', uses: ['shift'] },
  { id: 'goal', label: '입사 후 목표', question: '입사 후 목표는 무엇입니까?', uses: ['goal', 'targetJob'] },
];

const BLANK = (what: string) => `[${what}을(를) 여기에 직접 채워 주세요]`;

interface Draft {
  star: { s: string; t: string; a: string; r: string };
  text: string;
  missing: string[];
  questions: string[];
}

function buildDraft(kind: DraftKind, p: Profile, lengthId: string): Draft {
  const missing: string[] = [];
  const questions: string[] = [];
  const has = (v: string) => v.trim().length > 0;
  const use = (v: string, name: string, q: string) => {
    if (has(v)) return v.trim();
    missing.push(name);
    questions.push(q);
    return '';
  };

  const job = has(p.targetJob) ? p.targetJob.trim() : '';
  const company = has(p.targetCompany) ? p.targetCompany.trim() : '';
  if (!job) {
    missing.push('지원 직무');
    questions.push('어떤 직무에 지원하시나요? 직무를 정해야 답변의 방향이 잡힙니다.');
  }
  if ((kind === 'motive' || kind === 'intro') && !company) {
    missing.push('지원 기업');
    questions.push('어느 회사에 지원하시나요? 회사가 정해져야 지원동기를 구체화할 수 있습니다.');
  }

  let s = '';
  let t = '';
  let a = '';
  let r = '';

  switch (kind) {
    case 'intro': {
      const strength = use(p.strength, '강점', '본인의 강점은 무엇이고, 그것이 드러난 구체적인 상황은 언제였나요?');
      const exp = has(p.practice) ? p.practice.trim() : has(p.project) ? p.project.trim() : has(p.partTime) ? p.partTime.trim() : '';
      if (!exp) {
        missing.push('강점을 뒷받침할 경험');
        questions.push('실습, 프로젝트, 아르바이트 중 강점을 보여 줄 수 있는 경험 하나를 적어 주세요.');
      }
      const goal = use(p.goal, '입사 후 목표', '입사 후 어떤 모습으로 일하고 싶으신가요?');
      s = exp || BLANK('강점을 보여 준 상황');
      t = `${job || BLANK('지원 직무')}에 필요한 태도를 실제로 보여 줄 수 있는지가 관건이었습니다.`;
      a = strength ? `저는 ${strength}` : BLANK('그 상황에서 본인이 한 행동');
      r = goal ? `그 경험을 바탕으로 ${goal}` : BLANK('입사 후 목표');
      break;
    }
    case 'motive': {
      const exp = has(p.practice) ? p.practice.trim() : has(p.project) ? p.project.trim() : '';
      if (!exp) {
        missing.push('직무와 연결할 경험');
        questions.push('지원 직무와 연결할 수 있는 실습이나 프로젝트 경험이 있나요?');
      }
      const goal = use(p.goal, '입사 후 목표', '이 회사에서 무엇을 이루고 싶으신가요?');
      s = `${company || BLANK('지원 기업')}의 사업 영역을 알아보면서 ${BLANK('회사에서 관심을 갖게 된 구체적인 부분')}에 관심을 갖게 되었습니다.`;
      t = `${job || BLANK('지원 직무')}에서 제가 기여할 수 있는 부분을 찾는 것이 과제였습니다.`;
      a = exp ? `저는 ${exp}` : BLANK('본인이 준비하거나 경험한 내용');
      r = goal ? `입사 후에는 ${goal}` : BLANK('입사 후 목표');
      break;
    }
    case 'strength': {
      const strength = use(p.strength, '강점', '본인의 강점과 그것이 드러난 상황을 적어 주세요.');
      const weakness = use(p.weakness, '단점', '실제 단점과 그것을 개선하기 위해 지금 하고 있는 행동을 적어 주세요.');
      s = strength ? `제 강점은 ${strength}` : BLANK('강점과 그 근거가 되는 상황');
      t = `${job || BLANK('지원 직무')}에서 이 강점이 어떻게 쓰일 수 있는지 ${BLANK('직무와의 연결점')}으로 설명합니다.`;
      a = weakness ? `단점은 ${weakness}` : BLANK('단점과 개선을 위해 하고 있는 행동');
      r = `개선을 위해 ${BLANK('구체적인 기준이나 습관')}을 정해 지키고 있습니다.`;
      break;
    }
    case 'conflict': {
      const conflict = use(p.conflict, '갈등 경험', '누구와 어떤 일로 의견이 달랐고, 본인은 어떻게 행동했나요?');
      s = conflict || BLANK('갈등이 생긴 상황');
      t = `서로 다른 의견을 좁혀 일이 진행되게 만드는 것이 과제였습니다.`;
      a = conflict ? BLANK('그 상황에서 본인이 실제로 한 행동') : BLANK('본인이 한 행동');
      r = BLANK('결과와 거기서 배운 점');
      if (has(p.conflict)) questions.push('갈등 상황에서 본인이 구체적으로 어떤 말과 행동을 했는지 한 문장으로 적어 주세요.');
      break;
    }
    case 'failure': {
      const failure = use(p.failure, '실패 경험', '무엇을 시도했고 왜 잘 되지 않았나요?');
      s = failure || BLANK('실패한 상황');
      t = `원인을 찾아 같은 실수를 반복하지 않는 것이 과제였습니다.`;
      a = BLANK('원인을 확인하고 바꾼 행동');
      r = BLANK('그 뒤 달라진 점과 배운 것');
      break;
    }
    case 'safety': {
      const safety = use(p.safety, '안전 관련 경험', '안전 교육을 받거나 규정을 지킨 경험, 위험을 발견한 경험이 있나요?');
      s = safety || BLANK('안전과 관련된 상황');
      t = `규정을 지키면서도 작업을 진행해야 하는 상황이었습니다.`;
      a = BLANK('본인이 지킨 절차나 조치');
      r = `이 경험으로 절차를 지키는 것이 결국 가장 빠른 길이라고 생각하게 되었습니다.`;
      break;
    }
    case 'shift': {
      const shift = use(p.shift, '교대근무 가능 여부와 근거', '교대근무가 가능한가요? 가능하다면 그 근거가 되는 경험이나 생활 습관을 적어 주세요.');
      s = shift || BLANK('교대근무에 대한 본인의 상황과 경험');
      t = `생활 리듬을 유지하면서 근무를 지속하는 것이 과제입니다.`;
      a = BLANK('수면과 식사를 어떻게 관리할 계획인지');
      r = `쉽지 않다는 것을 알고 지원했고, 준비한 방법으로 관리하며 오래 일하고 싶습니다.`;
      break;
    }
    case 'goal': {
      const goal = use(p.goal, '입사 후 목표', '1년 뒤, 3년 뒤 각각 어떤 모습이고 싶으신가요?');
      s = `${job || BLANK('지원 직무')}에서 시작해 단계적으로 성장하고 싶습니다.`;
      t = `우선 맡은 일을 실수 없이 해내는 것이 먼저라고 생각합니다.`;
      a = goal || BLANK('구체적인 단기·중기 목표');
      r = `길게는 ${BLANK('되고 싶은 모습')}이 되고 싶습니다.`;
      break;
    }
  }

  const lengthNote = answerLengths.find((l) => l.id === lengthId) ?? answerLengths[2];
  const parts =
    lengthId === '20'
      ? [a, r]
      : lengthId === '40'
        ? [s, a, r]
        : lengthId === '60'
          ? [s, t, a, r]
          : [s, t, a, r, `이 경험이 ${job || BLANK('지원 직무')}에서 어떻게 쓰일지는 ${BLANK('입사 후 적용 방안')}으로 이어서 말하겠습니다.`];

  const text = parts.filter(Boolean).join(' ');

  return {
    star: { s, t, a, r },
    text: `${text}\n\n(목표 분량: ${lengthNote.label}, ${lengthNote.chars})`,
    missing: Array.from(new Set(missing)),
    questions: Array.from(new Set(questions)),
  };
}

export default function AnswerBuilder() {
  const { state, setProfile, saveAnswer } = useApp();
  const [kind, setKind] = useState<DraftKind>('intro');
  const [length, setLength] = useState('60');
  const [generated, setGenerated] = useState<Draft | null>(null);
  const [edited, setEdited] = useState('');

  const filled = FIELDS.filter((f) => state.profile[f.key].trim()).length;
  const kindMeta = DRAFT_KINDS.find((k) => k.id === kind)!;

  const canGenerate = useMemo(() => kindMeta.uses.some((u) => state.profile[u].trim()), [kindMeta, state.profile]);

  const generate = () => {
    const d = buildDraft(kind, state.profile, length);
    setGenerated(d);
    setEdited(d.text);
  };

  return (
    <div>
      <div className="page-head">
        <p className="crumb">
          <Link to="/interview">면접 준비</Link> <Icon.Chevron size={12} /> 답변 작성 도우미
        </p>
        <h1>개인 경험 기반 답변 작성</h1>
        <p>
          입력한 정보만으로 STAR 구조의 초안을 만듭니다. 쓰지 않은 경력, 성과, 수치, 자격증은 절대 만들어 넣지 않고,
          채워야 할 자리는 빈칸으로 남긴 뒤 무엇을 더 써야 하는지 질문으로 알려 드립니다.
        </p>
      </div>

      <div className="note note-warn" style={{ marginBottom: 18 }}>
        <Icon.Alert /> 이 기능은 문장 뼈대를 만들어 줄 뿐입니다. 빈칸을 본인의 실제 경험으로 채우지 않으면 꼬리질문에서
        바로 드러납니다. 없는 경험을 지어내면 다른 답변의 신뢰까지 무너집니다.
      </div>

      <Section id="profile" title={`1. 내 정보 입력 (${filled}/${FIELDS.length}개 작성됨)`}>
        <p className="small muted">
          입력한 내용은 이 브라우저에만 저장됩니다. 해당하지 않는 항목은 비워 두세요. 비워 두면 초안에서 빈칸으로
          표시됩니다.
        </p>
        <div className="card">
          <div className="grid grid-2">
            {FIELDS.map((f) => (
              <div className="field" key={f.key}>
                <label htmlFor={`pf-${f.key}`}>{f.label}</label>
                {f.key === 'targetCompany' ? (
                  <>
                    <select
                      id={`pf-${f.key}`}
                      className="select"
                      value={companies.some((c) => c.name === state.profile.targetCompany) ? state.profile.targetCompany : ''}
                      onChange={(e) => setProfile({ targetCompany: e.target.value })}
                    >
                      <option value="">목록에서 선택 (또는 아래에 직접 입력)</option>
                      {companies.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <input
                      className="input"
                      style={{ marginTop: 6 }}
                      placeholder="직접 입력"
                      value={state.profile.targetCompany}
                      onChange={(e) => setProfile({ targetCompany: e.target.value })}
                      aria-label="지원 기업 직접 입력"
                    />
                  </>
                ) : f.key === 'targetJob' ? (
                  <>
                    <select
                      id={`pf-${f.key}`}
                      className="select"
                      value={jobs.some((j) => j.title === state.profile.targetJob) ? state.profile.targetJob : ''}
                      onChange={(e) => setProfile({ targetJob: e.target.value })}
                    >
                      <option value="">목록에서 선택 (또는 아래에 직접 입력)</option>
                      {jobs.map((j) => (
                        <option key={j.id} value={j.title}>
                          {j.title}
                        </option>
                      ))}
                    </select>
                    <input
                      className="input"
                      style={{ marginTop: 6 }}
                      placeholder="직접 입력"
                      value={state.profile.targetJob}
                      onChange={(e) => setProfile({ targetJob: e.target.value })}
                      aria-label="지원 직무 직접 입력"
                    />
                  </>
                ) : f.multiline ? (
                  <textarea
                    id={`pf-${f.key}`}
                    className="textarea"
                    style={{ minHeight: 86 }}
                    placeholder={f.placeholder}
                    value={state.profile[f.key]}
                    onChange={(e) => setProfile({ [f.key]: e.target.value } as Partial<Profile>)}
                  />
                ) : (
                  <input
                    id={`pf-${f.key}`}
                    className="input"
                    placeholder={f.placeholder}
                    value={state.profile[f.key]}
                    onChange={(e) => setProfile({ [f.key]: e.target.value } as Partial<Profile>)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section id="generate" title="2. 답변 초안 만들기">
        <div className="card">
          <div className="field">
            <label>어떤 질문에 대한 답변을 만들까요?</label>
            <div className="chip-row">
              {DRAFT_KINDS.map((k) => (
                <button key={k.id} className="chip" aria-pressed={kind === k.id} onClick={() => setKind(k.id)}>
                  {k.label}
                </button>
              ))}
            </div>
            <p className="hint">질문: {kindMeta.question}</p>
          </div>

          <div className="field">
            <label>답변 길이</label>
            <div className="chip-row">
              {answerLengths.map((l) => (
                <button key={l.id} className="chip" aria-pressed={length === l.id} onClick={() => setLength(l.id)}>
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          <button className="btn btn-primary" onClick={generate}>
            <Icon.Note /> 초안 만들기
          </button>
          {!canGenerate && (
            <p className="hint">
              이 질문에 필요한 정보가 아직 비어 있습니다. 초안은 만들 수 있지만 대부분 빈칸으로 나옵니다. 위에서{' '}
              {kindMeta.uses.map((u) => FIELDS.find((f) => f.key === u)?.label).filter(Boolean).join(', ')} 항목을 먼저
              채우면 훨씬 쓸 만한 초안이 나옵니다.
            </p>
          )}
        </div>
      </Section>

      {generated && (
        <Section id="result" title="3. 초안과 보완할 부분">
          {generated.questions.length > 0 && (
            <div className="card" style={{ borderColor: 'var(--warn)' }}>
              <h3 className="card-title">
                <span className="badge badge-warn">
                  <Icon.Alert size={12} /> 더 알려 주셔야 할 내용
                </span>
              </h3>
              <p className="small" style={{ color: 'var(--text-2)' }}>
                아래 내용은 지어낼 수 없어 빈칸으로 두었습니다. 직접 답을 채워 주세요.
              </p>
              <ul className="small" style={{ marginBottom: 0, color: 'var(--text-2)' }}>
                {generated.questions.map((q) => (
                  <li key={q.slice(0, 20)}>{q}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="card">
            <h3 className="card-title">STAR 구조로 본 초안</h3>
            <dl className="kv">
              <dt>Situation (상황)</dt>
              <dd>{generated.star.s}</dd>
              <dt>Task (과제)</dt>
              <dd>{generated.star.t}</dd>
              <dt>Action (행동)</dt>
              <dd>{generated.star.a}</dd>
              <dt>Result (결과와 배운 점)</dt>
              <dd>{generated.star.r}</dd>
            </dl>
          </div>

          <div className="card">
            <h3 className="card-title">이어 붙인 답변 초안 (직접 고쳐 쓰세요)</h3>
            <textarea
              className="textarea"
              style={{ minHeight: 180 }}
              value={edited}
              onChange={(e) => setEdited(e.target.value)}
              aria-label="답변 초안 편집"
            />
            <p className="hint">현재 {edited.length}자</p>
            <div className="btn-row">
              <button
                className="btn btn-primary"
                onClick={() => {
                  const q = ({
                    intro: 'q-intro',
                    motive: 'q-why-company',
                    strength: 'q-strength-weakness',
                    conflict: 'q-failure',
                    failure: 'q-failure',
                    safety: 'q-colleague-safety',
                    shift: 'q-shift',
                    goal: 'q-goal',
                  } as Record<DraftKind, string>)[kind];
                  saveAnswer(q, { text: edited, length });
                }}
                disabled={!edited.trim()}
              >
                <Icon.Check /> 해당 면접 질문에 저장
              </button>
              <button
                className="btn"
                onClick={() => {
                  navigator.clipboard?.writeText(edited);
                }}
              >
                복사하기
              </button>
            </div>
          </div>

          <div className="card">
            <h3 className="card-title">답변 점검 항목</h3>
            <ul className="small" style={{ marginBottom: 0, color: 'var(--text-2)' }}>
              {feedbackCriteria.map((c) => (
                <li key={c.id}>
                  <b>{c.label}</b> · {c.hint}
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}
    </div>
  );
}
