import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/store/store';
import { overallProgress, quizStats } from '@/lib/progress';
import { Icon, Section } from '@/components/ui';

export default function Settings() {
  const { state, set, setTheme, resetAll } = useApp();
  const [msg, setMsg] = useState<{ kind: 'good' | 'bad'; text: string } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const prog = overallProgress(state);
  const qs = quizStats(state);

  const exportData = () => {
    try {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `semi-ready-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setMsg({ kind: 'good', text: '학습 기록을 파일로 내려받았습니다.' });
    } catch {
      setMsg({ kind: 'bad', text: '내보내기에 실패했습니다. 브라우저 설정을 확인해 주세요.' });
    }
  };

  const importData = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (typeof parsed !== 'object' || parsed === null) throw new Error('형식 오류');
        set((s) => ({ ...s, ...parsed, version: 1 }));
        setMsg({ kind: 'good', text: '백업 파일을 불러왔습니다.' });
      } catch {
        setMsg({ kind: 'bad', text: '파일을 읽지 못했습니다. 이 사이트에서 내보낸 JSON 파일인지 확인해 주세요.' });
      }
    };
    reader.onerror = () => setMsg({ kind: 'bad', text: '파일을 읽는 중 오류가 생겼습니다.' });
    reader.readAsText(file);
  };

  return (
    <div>
      <div className="page-head">
        <h1>설정과 데이터 관리</h1>
        <p>화면 설정을 바꾸고, 학습 기록을 백업하거나 되돌릴 수 있습니다.</p>
      </div>

      {msg && (
        <div className={`note ${msg.kind === 'bad' ? 'note-warn' : ''}`} style={{ marginBottom: 16 }} role="status">
          {msg.kind === 'good' ? <Icon.Check /> : <Icon.Alert />} {msg.text}
        </div>
      )}

      <Section id="display" title="화면 설정">
        <div className="card">
          <div className="field" style={{ marginBottom: 0 }}>
            <label>테마</label>
            <div className="chip-row">
              <button className="chip" aria-pressed={state.theme === 'dark'} onClick={() => setTheme('dark')}>
                <Icon.Moon size={14} /> 다크 모드
              </button>
              <button className="chip" aria-pressed={state.theme === 'light'} onClick={() => setTheme('light')}>
                <Icon.Sun size={14} /> 라이트 모드
              </button>
            </div>
            <p className="hint">선택한 테마는 이 브라우저에 저장되어 다음 방문에도 유지됩니다.</p>
          </div>
        </div>
      </Section>

      <Section id="data" title="내 학습 데이터">
        <div className="card">
          <div className="grid grid-4" style={{ marginBottom: 14 }}>
            <div className="stat">
              <div className="stat-label">완료 학습 항목</div>
              <div className="stat-value">{prog.done}</div>
            </div>
            <div className="stat">
              <div className="stat-label">푼 문제</div>
              <div className="stat-value">{qs.total}</div>
            </div>
            <div className="stat">
              <div className="stat-label">오답노트</div>
              <div className="stat-value">{Object.keys(state.wrongNotes).length}</div>
            </div>
            <div className="stat">
              <div className="stat-label">저장한 답변</div>
              <div className="stat-value">{Object.keys(state.answers).length}</div>
            </div>
          </div>

          <p className="small" style={{ color: 'var(--text-2)' }}>
            학습 기록은 로그인 없이 이 브라우저의 저장소에만 보관됩니다. 다른 기기나 다른 브라우저에서는 이어지지 않고,
            브라우저 데이터를 지우면 함께 사라집니다. 중요한 내용은 아래에서 파일로 내보내 두세요.
          </p>

          <div className="btn-row">
            <button className="btn btn-primary" onClick={exportData}>
              내보내기 (JSON 파일로 저장)
            </button>
            <button className="btn" onClick={() => fileRef.current?.click()}>
              불러오기
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) importData(f);
                e.target.value = '';
              }}
              aria-label="백업 파일 선택"
            />
          </div>
          <p className="hint">불러오기를 하면 현재 기록이 파일 내용으로 바뀝니다. 먼저 내보내기로 백업해 두세요.</p>
        </div>
      </Section>

      <Section id="reset" title="기록 초기화">
        <div className="card" style={{ borderColor: 'var(--bad)' }}>
          <h3 className="card-title">
            <span className="badge badge-bad">
              <Icon.Alert size={12} /> 되돌릴 수 없음
            </span>
          </h3>
          <p className="small" style={{ color: 'var(--text-2)' }}>
            진도, 퀴즈 기록, 오답노트, 면접 답변, 프로필 입력 내용이 모두 지워집니다. 초기화 전에 반드시 내보내기로
            백업하세요.
          </p>
          {!confirmReset ? (
            <button className="btn" onClick={() => setConfirmReset(true)}>
              <Icon.Trash /> 모든 학습 기록 초기화
            </button>
          ) : (
            <div className="btn-row">
              <button
                className="btn"
                style={{ background: 'var(--bad)', borderColor: 'var(--bad)', color: '#fff' }}
                onClick={() => {
                  resetAll();
                  setConfirmReset(false);
                  setMsg({ kind: 'good', text: '모든 학습 기록을 초기화했습니다.' });
                }}
              >
                정말 초기화합니다
              </button>
              <button className="btn btn-ghost" onClick={() => setConfirmReset(false)}>
                취소
              </button>
            </div>
          )}
        </div>
      </Section>

      <Section id="about" title="이 사이트에 대해">
        <div className="card">
          <dl className="kv" style={{ marginBottom: 0 }}>
            <dt>사이트 이름</dt>
            <dd>SEMI READY (임시 명칭)</dd>
            <dt>목적</dt>
            <dd>반도체 생산·설비·장비 CS 직무 지원자를 위한 학습과 면접 준비</dd>
            <dt>콘텐츠 기준</dt>
            <dd>
              기술 설명은 공개된 표준 자료를 바탕으로 정리했습니다. 기업 정보는 사업 영역처럼 비교적 안정적인 내용만
              담았고, 변동 정보는 포함하지 않았습니다.
            </dd>
            <dt>데이터 저장</dt>
            <dd>로그인과 서버 저장 없이 브라우저 로컬 스토리지만 사용합니다.</dd>
            <dt>AI 연동</dt>
            <dd>생성형 AI와 연결되어 있지 않습니다. 모의면접은 질문은행 기반 데모 모드로 동작합니다.</dd>
          </dl>
        </div>
        <div className="btn-row" style={{ marginTop: 14 }}>
          <Link to="/" className="btn">
            <Icon.Home /> 홈으로
          </Link>
        </div>
      </Section>
    </div>
  );
}
