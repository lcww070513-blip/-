import { useState } from 'react';
import type { MiniQuiz as MiniQuizType } from '@/data/types';
import { Icon } from './ui';

/** 학습 페이지 하단의 확인 문제. 결과는 아이콘과 텍스트로 함께 표시합니다. */
export default function MiniQuiz({ items }: { items: MiniQuizType[] }) {
  const [picked, setPicked] = useState<Record<number, number>>({});

  if (!items.length) return null;

  return (
    <div className="stack">
      {items.map((item, qi) => {
        const choice = picked[qi];
        const answered = choice !== undefined;
        const correct = answered && choice === item.answer;
        return (
          <div className="card" key={item.q}>
            <p style={{ fontWeight: 700, marginBottom: 12 }}>
              Q{qi + 1}. {item.q}
            </p>
            <div role="group" aria-label={`확인 문제 ${qi + 1}`}>
              {item.choices.map((c, ci) => {
                let stateAttr: string | undefined;
                if (answered) {
                  if (ci === item.answer) stateAttr = 'correct';
                  else if (ci === choice) stateAttr = 'wrong';
                } else if (ci === choice) stateAttr = 'selected';
                return (
                  <button
                    key={c}
                    className="choice"
                    data-state={stateAttr}
                    disabled={answered}
                    onClick={() => setPicked((p) => ({ ...p, [qi]: ci }))}
                  >
                    <span className="choice-mark" aria-hidden="true">
                      {answered && ci === item.answer ? '✓' : answered && ci === choice ? '✕' : ci + 1}
                    </span>
                    <span>{c}</span>
                  </button>
                );
              })}
            </div>
            {answered && (
              <div style={{ marginTop: 10 }} role="status">
                <p className={`verdict ${correct ? 'verdict-good' : 'verdict-bad'}`} style={{ marginBottom: 6 }}>
                  {correct ? <Icon.Check /> : <Icon.X />}
                  {correct ? '정답입니다' : '오답입니다'}
                </p>
                <p className="small" style={{ color: 'var(--text-2)', marginBottom: 8 }}>
                  {item.explain}
                </p>
                <button className="btn btn-sm" onClick={() => setPicked((p) => {
                  const n = { ...p };
                  delete n[qi];
                  return n;
                })}>
                  <Icon.Refresh /> 다시 풀기
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
