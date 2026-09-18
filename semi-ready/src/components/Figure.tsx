import React from 'react';

/* ============================================================
   학습 콘텐츠용 도해.
   모든 도형은 CSS 변수를 쓰므로 라이트·다크 모드에서 모두 읽힙니다.
   색만으로 의미를 전달하지 않도록 항상 텍스트 라벨을 함께 둡니다.
   ============================================================ */

const C = {
  line: 'var(--border-strong)',
  text: 'var(--text)',
  text2: 'var(--text-2)',
  text3: 'var(--text-3)',
  fill: 'var(--surface)',
  fill2: 'var(--surface-3)',
  s1: 'var(--series-1)',
  s2: 'var(--series-2)',
  s3: 'var(--series-3)',
  s4: 'var(--series-4)',
};

const T = (props: React.SVGProps<SVGTextElement>) => (
  <text fontSize="11" fill={C.text2} fontFamily="inherit" {...props} />
);
const Tb = (props: React.SVGProps<SVGTextElement>) => (
  <text fontSize="11.5" fontWeight="700" fill={C.text} fontFamily="inherit" {...props} />
);

function Box({
  x,
  y,
  w,
  h,
  label,
  sub,
  color = C.fill2,
  stroke = C.line,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  color?: string;
  stroke?: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="6" fill={color} stroke={stroke} strokeWidth="1.5" />
      <Tb x={x + w / 2} y={sub ? y + h / 2 - 2 : y + h / 2 + 4} textAnchor="middle">
        {label}
      </Tb>
      {sub && (
        <T x={x + w / 2} y={y + h / 2 + 13} textAnchor="middle" fontSize="10">
          {sub}
        </T>
      )}
    </g>
  );
}

type Num = number | string;
function Arrow({ x1, y1, x2, y2 }: { x1: Num; y1: Num; x2: Num; y2: Num }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.line} strokeWidth="2" markerEnd="url(#sr-arrow)" />;
}

const Defs = () => (
  <defs>
    <marker id="sr-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill={C.line} />
    </marker>
  </defs>
);

type Renderer = () => React.ReactElement;

const figures: Record<string, Renderer> = {
  'conductivity-scale': () => (
    <svg viewBox="0 0 520 130" role="img" aria-label="전기 전도도 축 위에 부도체, 반도체, 도체가 배치된 그림">
      <Defs />
      <line x1="30" y1="70" x2="490" y2="70" stroke={C.line} strokeWidth="2" />
      <rect x="30" y="56" width="140" height="28" rx="5" fill={C.fill2} stroke={C.line} strokeWidth="1.5" />
      <rect x="190" y="56" width="140" height="28" rx="5" fill="var(--accent-soft)" stroke={C.s1} strokeWidth="2" />
      <rect x="350" y="56" width="140" height="28" rx="5" fill={C.fill2} stroke={C.line} strokeWidth="1.5" />
      <Tb x="100" y="74" textAnchor="middle">부도체</Tb>
      <Tb x="260" y="74" textAnchor="middle">반도체</Tb>
      <Tb x="420" y="74" textAnchor="middle">도체</Tb>
      <T x="100" y="104" textAnchor="middle">유리, 고무</T>
      <T x="260" y="104" textAnchor="middle">실리콘, 게르마늄</T>
      <T x="420" y="104" textAnchor="middle">구리, 알루미늄</T>
      <T x="30" y="36">전기가 거의 흐르지 않음</T>
      <T x="490" y="36" textAnchor="end">전기가 잘 흐름</T>
      <Arrow x1="30" y1="44" x2="490" y2="44" />
    </svg>
  ),

  'band-gap': () => (
    <svg viewBox="0 0 520 200" role="img" aria-label="도체, 반도체, 부도체의 밴드 구조 비교">
      <Defs />
      {[
        { x: 30, label: '도체', gap: 0 },
        { x: 200, label: '반도체', gap: 34 },
        { x: 370, label: '부도체', gap: 88 },
      ].map((b) => (
        <g key={b.label}>
          <rect x={b.x} y={30} width="120" height="28" rx="4" fill={C.fill2} stroke={C.line} strokeWidth="1.5" />
          <T x={b.x + 60} y={48} textAnchor="middle" fontSize="10">전도대</T>
          <rect x={b.x} y={58 + b.gap} width="120" height="28" rx="4" fill={C.s1} opacity="0.35" stroke={C.s1} strokeWidth="1.5" />
          <T x={b.x + 60} y={76 + b.gap} textAnchor="middle" fontSize="10" fill={C.text}>가전자대</T>
          {b.gap > 0 && (
            <>
              <line x1={b.x + 60} y1={58} x2={b.x + 60} y2={58 + b.gap} stroke={C.s4} strokeWidth="2" strokeDasharray="3 3" />
              <T x={b.x + 68} y={58 + b.gap / 2 + 4} fontSize="10" fill={C.s4}>
                Eg
              </T>
            </>
          )}
          <Tb x={b.x + 60} y={170} textAnchor="middle">{b.label}</Tb>
          <T x={b.x + 60} y={187} textAnchor="middle" fontSize="10">
            {b.gap === 0 ? '밴드갭 없음' : b.gap < 50 ? '약 1.1eV' : '4eV 이상'}
          </T>
        </g>
      ))}
    </svg>
  ),

  'silicon-lattice': () => (
    <svg viewBox="0 0 400 220" role="img" aria-label="실리콘 원자가 이웃 네 개와 공유결합한 구조">
      <Defs />
      {[0, 1, 2].map((r) =>
        [0, 1, 2].map((c) => {
          const cx = 80 + c * 120;
          const cy = 40 + r * 70;
          return (
            <g key={`${r}-${c}`}>
              {c < 2 && <line x1={cx + 16} y1={cy} x2={cx + 104} y2={cy} stroke={C.s1} strokeWidth="2.5" />}
              {r < 2 && <line x1={cx} y1={cy + 16} x2={cx} y2={cy + 54} stroke={C.s1} strokeWidth="2.5" />}
              <circle cx={cx} cy={cy} r="16" fill={C.fill2} stroke={C.line} strokeWidth="1.5" />
              <Tb x={cx} y={cy + 4} textAnchor="middle">Si</Tb>
            </g>
          );
        }),
      )}
      <T x="200" y="205" textAnchor="middle">파란 선은 전자 두 개를 나눠 갖는 공유결합입니다</T>
    </svg>
  ),

  'electron-hole': () => (
    <svg viewBox="0 0 440 180" role="img" aria-label="결합이 끊어져 자유전자와 정공이 생기는 모습">
      <Defs />
      <line x1="80" y1="70" x2="200" y2="70" stroke={C.s1} strokeWidth="2.5" />
      <line x1="200" y1="70" x2="320" y2="70" stroke={C.line} strokeWidth="2.5" strokeDasharray="4 4" />
      {[80, 200, 320].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="70" r="17" fill={C.fill2} stroke={C.line} strokeWidth="1.5" />
          <Tb x={cx} y="74" textAnchor="middle">Si</Tb>
        </g>
      ))}
      <circle cx="270" cy="70" r="7" fill={C.fill} stroke={C.s4} strokeWidth="2" strokeDasharray="3 2" />
      <Tb x="270" y="46" textAnchor="middle" fill={C.s4}>정공</Tb>
      <circle cx="270" cy="128" r="8" fill={C.s1} />
      <T x="270" y="132" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700">e</T>
      <Tb x="270" y="160" textAnchor="middle" fill={C.s1}>자유전자</Tb>
      <Arrow x1="262" y1="88" x2="262" y2="116" />
      <T x="30" y="30">열이나 빛 에너지를 받으면 결합 하나가 끊어집니다</T>
    </svg>
  ),

  'doping-compare': () => (
    <svg viewBox="0 0 480 170" role="img" aria-label="진성 실리콘과 도핑된 실리콘의 운반자 수 비교">
      <Defs />
      <Box x={20} y={30} w={190} h={100} label="진성 반도체" sub="전자 = 정공, 아주 적음" />
      <Box x={270} y={30} w={190} h={100} label="불순물 반도체" sub="한쪽 운반자가 압도적" color="var(--accent-soft)" stroke={C.s1} />
      <circle cx="70" cy="100" r="5" fill={C.s1} />
      <circle cx="160" cy="100" r="5" fill={C.fill} stroke={C.s4} strokeWidth="2" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <circle key={i} cx={300 + i * 26} cy="100" r="5" fill={C.s1} />
      ))}
      <Arrow x1="220" y1="80" x2="262" y2="80" />
      <T x="240" y="70" textAnchor="middle" fontSize="10">도핑</T>
      <T x="240" y="158" textAnchor="middle">● 전자 ○ 정공</T>
    </svg>
  ),

  'np-doping': () => (
    <svg viewBox="0 0 470 190" role="img" aria-label="N형과 P형 반도체의 도핑 구조">
      <Defs />
      <rect x="20" y="30" width="200" height="110" rx="8" fill="var(--accent-soft)" stroke={C.s1} strokeWidth="2" />
      <rect x="250" y="30" width="200" height="110" rx="8" fill="var(--warn-soft)" stroke={C.s4} strokeWidth="2" />
      <Tb x="120" y="52" textAnchor="middle">N형 (인, 비소 주입)</Tb>
      <Tb x="350" y="52" textAnchor="middle">P형 (붕소 주입)</Tb>
      <circle cx="120" cy="88" r="18" fill={C.fill2} stroke={C.line} strokeWidth="1.5" />
      <Tb x="120" y="92" textAnchor="middle">P</Tb>
      <circle cx="152" cy="88" r="7" fill={C.s1} />
      <T x="152" y="92" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="700">e</T>
      <T x="120" y="126" textAnchor="middle">남는 전자 1개</T>
      <circle cx="350" cy="88" r="18" fill={C.fill2} stroke={C.line} strokeWidth="1.5" />
      <Tb x="350" y="92" textAnchor="middle">B</Tb>
      <circle cx="382" cy="88" r="7" fill={C.fill} stroke={C.s4} strokeWidth="2" strokeDasharray="3 2" />
      <T x="350" y="126" textAnchor="middle">빈자리(정공) 1개</T>
      <T x="235" y="172" textAnchor="middle">두 경우 모두 결정 전체는 전기적으로 중성입니다</T>
    </svg>
  ),

  'pn-junction': () => (
    <svg viewBox="0 0 480 220" role="img" aria-label="PN 접합의 공핍층과 순방향, 역방향 바이어스">
      <Defs />
      <rect x="40" y="30" width="160" height="60" rx="5" fill="var(--warn-soft)" stroke={C.s4} strokeWidth="2" />
      <rect x="200" y="30" width="40" height="60" fill={C.fill2} stroke={C.line} strokeWidth="1.5" />
      <rect x="240" y="30" width="160" height="60" rx="5" fill="var(--accent-soft)" stroke={C.s1} strokeWidth="2" />
      <Tb x="120" y="66" textAnchor="middle">P형</Tb>
      <Tb x="320" y="66" textAnchor="middle">N형</Tb>
      <T x="220" y="108" textAnchor="middle" fontSize="10">공핍층</T>
      <line x1="220" y1="90" x2="220" y2="100" stroke={C.line} strokeWidth="1.5" />

      <g>
        <T x="40" y="146">순방향 (P에 +)</T>
        <rect x="40" y="154" width="170" height="26" rx="5" fill="var(--good-soft)" stroke="var(--good)" strokeWidth="1.5" />
        <T x="125" y="171" textAnchor="middle" fill="var(--good)" fontWeight="700">✔ 전류가 흐른다</T>
        <T x="40" y="200" fontSize="10">공핍층이 얇아짐 · 약 0.7V 이상</T>
      </g>
      <g>
        <T x="255" y="146">역방향 (N에 +)</T>
        <rect x="255" y="154" width="170" height="26" rx="5" fill="var(--bad-soft)" stroke="var(--bad)" strokeWidth="1.5" />
        <T x="340" y="171" textAnchor="middle" fill="var(--bad)" fontWeight="700">✕ 거의 흐르지 않음</T>
        <T x="255" y="200" fontSize="10">공핍층이 두꺼워짐 · 누설전류만</T>
      </g>
    </svg>
  ),

  'transistor-switch': () => (
    <svg viewBox="0 0 460 170" role="img" aria-label="밸브에 비유한 트랜지스터의 동작">
      <Defs />
      <rect x="30" y="70" width="380" height="26" rx="4" fill={C.fill2} stroke={C.line} strokeWidth="1.5" />
      <T x="40" y="118">입력</T>
      <T x="400" y="118" textAnchor="end">출력</T>
      <rect x="196" y="40" width="48" height="26" rx="5" fill="var(--accent-soft)" stroke={C.s1} strokeWidth="2" />
      <Tb x="220" y="58" textAnchor="middle">게이트</Tb>
      <line x1="220" y1="66" x2="220" y2="70" stroke={C.s1} strokeWidth="3" />
      <Arrow x1="30" y1="83" x2="180" y2="83" />
      <Arrow x1="260" y1="83" x2="405" y2="83" />
      <T x="230" y="30">작은 신호</T>
      <T x="30" y="150">게이트에 걸리는 작은 전압이 아래로 흐르는 큰 전류를 여닫습니다</T>
    </svg>
  ),

  mosfet: () => (
    <svg viewBox="0 0 470 210" role="img" aria-label="NMOS 트랜지스터의 단면 구조">
      <Defs />
      <rect x="40" y="90" width="390" height="70" rx="5" fill="var(--warn-soft)" stroke={C.s4} strokeWidth="2" />
      <T x="235" y="140" textAnchor="middle">P형 기판</T>
      <rect x="70" y="90" width="90" height="34" rx="4" fill="var(--accent-soft)" stroke={C.s1} strokeWidth="2" />
      <rect x="310" y="90" width="90" height="34" rx="4" fill="var(--accent-soft)" stroke={C.s1} strokeWidth="2" />
      <Tb x="115" y="112" textAnchor="middle">소스 (N+)</Tb>
      <Tb x="355" y="112" textAnchor="middle">드레인 (N+)</Tb>
      <rect x="160" y="82" width="150" height="8" fill={C.fill2} stroke={C.line} strokeWidth="1.2" />
      <T x="235" y="76" textAnchor="middle" fontSize="10">게이트 산화막 (절연)</T>
      <rect x="160" y="52" width="150" height="26" rx="4" fill={C.s3} opacity="0.5" stroke={C.s3} strokeWidth="2" />
      <Tb x="235" y="70" textAnchor="middle">게이트</Tb>
      <rect x="163" y="90" width="144" height="7" fill={C.s1} opacity="0.8" />
      <T x="235" y="182" textAnchor="middle" fontSize="10.5" fill={C.s1}>
        게이트 전압이 문턱전압을 넘으면 얇은 채널이 생겨 전류가 흐릅니다
      </T>
      <Arrow x1="115" y1="140" x2="355" y2="140" />
      <T x="30" y="42">Vg</T>
      <line x1="235" y1="30" x2="235" y2="52" stroke={C.line} strokeWidth="2" />
    </svg>
  ),

  'wafer-die': () => (
    <svg viewBox="0 0 440 210" role="img" aria-label="웨이퍼 위에 다이가 격자로 배열된 모습">
      <Defs />
      <circle cx="120" cy="100" r="85" fill={C.fill2} stroke={C.line} strokeWidth="2" />
      <path d="M118,15 l4,0 l-2,8 z" fill={C.line} stroke={C.line} strokeWidth="3" />
      {Array.from({ length: 7 }).map((_, r) =>
        Array.from({ length: 7 }).map((_, c) => {
          const x = 48 + c * 21;
          const y = 28 + r * 21;
          const dx = x + 9 - 120;
          const dy = y + 9 - 100;
          if (dx * dx + dy * dy > 76 * 76) return null;
          return <rect key={`${r}-${c}`} x={x} y={y} width="18" height="18" rx="2" fill={C.s1} opacity="0.55" stroke={C.s1} strokeWidth="0.8" />;
        }),
      )}
      <T x="120" y="200" textAnchor="middle">웨이퍼 (지름 300mm)</T>
      <Arrow x1="215" y1="100" x2="265" y2="100" />
      <rect x="280" y="66" width="68" height="68" rx="5" fill={C.s1} opacity="0.55" stroke={C.s1} strokeWidth="2" />
      <Tb x="314" y="104" textAnchor="middle">다이</Tb>
      <T x="314" y="152" textAnchor="middle">칩 하나</T>
      <T x="240" y="88" textAnchor="middle" fontSize="10">확대</T>
      <T x="30" y="20" fontSize="10">노치</T>
    </svg>
  ),

  'ingot-wafer': () => (
    <svg viewBox="0 0 500 160" role="img" aria-label="잉곳을 절단하고 연마해 웨이퍼를 만드는 흐름">
      <Defs />
      <ellipse cx="60" cy="40" rx="28" ry="10" fill={C.fill2} stroke={C.line} strokeWidth="1.5" />
      <rect x="32" y="40" width="56" height="70" fill={C.fill2} stroke={C.line} strokeWidth="1.5" />
      <ellipse cx="60" cy="110" rx="28" ry="10" fill={C.fill2} stroke={C.line} strokeWidth="1.5" />
      <Tb x="60" y="140" textAnchor="middle">잉곳</Tb>
      <Arrow x1="100" y1="75" x2="140" y2="75" />
      <T x="120" y="62" textAnchor="middle" fontSize="10">절단</T>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <ellipse cx={185} cy={52 + i * 24} rx="28" ry="9" fill={C.fill2} stroke={C.line} strokeWidth="1.5" />
        </g>
      ))}
      <Tb x="185" y="140" textAnchor="middle">절단</Tb>
      <Arrow x1="225" y1="75" x2="265" y2="75" />
      <T x="245" y="62" textAnchor="middle" fontSize="10">연마</T>
      <ellipse cx="310" cy="75" rx="34" ry="11" fill="var(--accent-soft)" stroke={C.s1} strokeWidth="2" />
      <Tb x="310" y="140" textAnchor="middle">연마·세정</Tb>
      <Arrow x1="352" y1="75" x2="392" y2="75" />
      <circle cx="440" cy="75" r="34" fill="var(--accent-soft)" stroke={C.s1} strokeWidth="2" />
      <Tb x="440" y="140" textAnchor="middle">웨이퍼</Tb>
    </svg>
  ),

  'chip-package': () => (
    <svg viewBox="0 0 470 150" role="img" aria-label="웨이퍼에서 다이, 패키지, 모듈로 이어지는 단계">
      <Defs />
      <circle cx="55" cy="60" r="34" fill={C.fill2} stroke={C.line} strokeWidth="2" />
      <Tb x="55" y="120" textAnchor="middle">웨이퍼</Tb>
      <Arrow x1="97" y1="60" x2="133" y2="60" />
      <rect x="140" y="38" width="44" height="44" rx="4" fill={C.s1} opacity="0.55" stroke={C.s1} strokeWidth="2" />
      <Tb x="162" y="120" textAnchor="middle">다이</Tb>
      <Arrow x1="192" y1="60" x2="228" y2="60" />
      <rect x="235" y="32" width="62" height="56" rx="5" fill={C.fill2} stroke={C.line} strokeWidth="2" />
      <rect x="252" y="46" width="28" height="28" rx="3" fill={C.s1} opacity="0.55" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={240 + i * 15} y="88" width="8" height="7" fill={C.line} />
      ))}
      <Tb x="266" y="120" textAnchor="middle">패키지</Tb>
      <Arrow x1="305" y1="60" x2="341" y2="60" />
      <rect x="348" y="44" width="104" height="32" rx="4" fill={C.fill2} stroke={C.line} strokeWidth="2" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={354 + i * 25} y="50" width="18" height="20" rx="2" fill={C.s1} opacity="0.5" />
      ))}
      <Tb x="400" y="120" textAnchor="middle">모듈</Tb>
    </svg>
  ),

  'memory-system': () => (
    <svg viewBox="0 0 460 170" role="img" aria-label="메모리 반도체와 시스템 반도체의 구분">
      <Defs />
      <Box x={20} y={30} w={190} h={110} label="메모리 반도체" sub="데이터 저장" color="var(--accent-soft)" stroke={C.s1} />
      <Box x={250} y={30} w={190} h={110} label="시스템 반도체" sub="연산 · 제어 · 변환" color="var(--violet-soft)" stroke={C.s3} />
      <T x="115" y="106" textAnchor="middle">DRAM · NAND · SRAM</T>
      <T x="345" y="106" textAnchor="middle">CPU · AP · 센서 · 전력</T>
      <T x="115" y="124" textAnchor="middle" fontSize="10">대량생산과 미세화 경쟁</T>
      <T x="345" y="124" textAnchor="middle" fontSize="10">설계와 다품종 대응</T>
    </svg>
  ),

  'memory-compare': () => (
    <svg viewBox="0 0 480 190" role="img" aria-label="DRAM, SRAM, NAND의 구조와 용도 비교">
      <Defs />
      {[
        { x: 20, t: 'DRAM', s: '트랜지스터 1 + 커패시터 1', u: '주기억장치', v: '휘발성 · 리프레시 필요', c: C.s1 },
        { x: 170, t: 'SRAM', s: '트랜지스터 6개', u: 'CPU 캐시', v: '휘발성 · 빠름', c: C.s3 },
        { x: 320, t: 'NAND', s: '셀 직렬 + 3D 적층', u: 'SSD · USB', v: '비휘발성', c: C.s2 },
      ].map((m) => (
        <g key={m.t}>
          <rect x={m.x} y="26" width="140" height="120" rx="7" fill={C.fill} stroke={m.c} strokeWidth="2" />
          <Tb x={m.x + 70} y="50" textAnchor="middle">{m.t}</Tb>
          <T x={m.x + 70} y="76" textAnchor="middle" fontSize="10">{m.s}</T>
          <T x={m.x + 70} y="100" textAnchor="middle" fontSize="10">{m.u}</T>
          <T x={m.x + 70} y="126" textAnchor="middle" fontSize="10" fill={m.c}>{m.v}</T>
        </g>
      ))}
      <T x="240" y="172" textAnchor="middle">SRAM도 휘발성이라는 점을 자주 혼동합니다</T>
    </svg>
  ),

  'processor-compare': () => (
    <svg viewBox="0 0 440 180" role="img" aria-label="CPU와 GPU의 코어 구성 차이">
      <Defs />
      <rect x="20" y="30" width="180" height="110" rx="7" fill={C.fill} stroke={C.s1} strokeWidth="2" />
      <Tb x="110" y="52" textAnchor="middle">CPU</Tb>
      {[0, 1].map((r) =>
        [0, 1].map((c) => (
          <rect key={`${r}-${c}`} x={48 + c * 62} y={66 + r * 34} width="52" height="26" rx="4" fill={C.s1} opacity="0.55" />
        )),
      )}
      <T x="110" y="158" textAnchor="middle" fontSize="10">적은 수의 강한 코어 · 순차 처리</T>
      <rect x="240" y="30" width="180" height="110" rx="7" fill={C.fill} stroke={C.s3} strokeWidth="2" />
      <Tb x="330" y="52" textAnchor="middle">GPU</Tb>
      {Array.from({ length: 4 }).map((_, r) =>
        Array.from({ length: 8 }).map((_, c) => (
          <rect key={`${r}-${c}`} x={254 + c * 20} y={64 + r * 17} width="15" height="12" rx="2" fill={C.s3} opacity="0.6" />
        )),
      )}
      <T x="330" y="158" textAnchor="middle" fontSize="10">많은 단순 코어 · 병렬 처리</T>
    </svg>
  ),

  'value-chain': () => (
    <svg viewBox="0 0 500 170" role="img" aria-label="팹리스, 파운드리, OSAT로 이어지는 분업 구조와 IDM">
      <Defs />
      <Box x={20} y={30} w={130} h={54} label="팹리스" sub="설계만 담당" color="var(--violet-soft)" stroke={C.s3} />
      <Arrow x1="155" y1="57" x2="185" y2="57" />
      <Box x={190} y={30} w={130} h={54} label="파운드리" sub="위탁 생산(전공정)" color="var(--accent-soft)" stroke={C.s1} />
      <Arrow x1="325" y1="57" x2="355" y2="57" />
      <Box x={360} y={30} w={130} h={54} label="OSAT" sub="패키징·테스트" color="var(--good-soft)" stroke={C.s2} />
      <rect x="20" y="102" width="470" height="44" rx="7" fill={C.fill2} stroke={C.line} strokeWidth="2" strokeDasharray="6 4" />
      <Tb x="255" y="122" textAnchor="middle">IDM (종합 반도체 기업)</Tb>
      <T x="255" y="138" textAnchor="middle" fontSize="10">설계부터 생산, 판매까지 직접 수행</T>
    </svg>
  ),

  'front-back': () => (
    <svg viewBox="0 0 500 160" role="img" aria-label="전공정과 후공정의 경계와 그 사이의 웨이퍼 테스트">
      <Defs />
      <rect x="20" y="34" width="190" height="72" rx="7" fill="var(--accent-soft)" stroke={C.s1} strokeWidth="2" />
      <Tb x="115" y="58" textAnchor="middle">전공정 (FAB)</Tb>
      <T x="115" y="78" textAnchor="middle" fontSize="10">산화 · 포토 · 식각 · 증착</T>
      <T x="115" y="94" textAnchor="middle" fontSize="10">이온주입 · 금속배선</T>
      <rect x="216" y="48" width="68" height="44" rx="6" fill="var(--warn-soft)" stroke={C.s4} strokeWidth="2" />
      <T x="250" y="66" textAnchor="middle" fontSize="10" fontWeight="700" fill={C.text}>웨이퍼</T>
      <T x="250" y="80" textAnchor="middle" fontSize="10" fontWeight="700" fill={C.text}>테스트</T>
      <rect x="290" y="34" width="190" height="72" rx="7" fill="var(--good-soft)" stroke={C.s2} strokeWidth="2" />
      <Tb x="385" y="58" textAnchor="middle">후공정 (조립·테스트)</Tb>
      <T x="385" y="78" textAnchor="middle" fontSize="10">다이싱 · 본딩 · 몰딩</T>
      <T x="385" y="94" textAnchor="middle" fontSize="10">패키지 테스트 · 최종검사</T>
      <T x="250" y="134" textAnchor="middle">불량 다이를 미리 걸러야 후공정 비용을 아낄 수 있습니다</T>
    </svg>
  ),

  'yield-map': () => (
    <svg viewBox="0 0 470 200" role="img" aria-label="웨이퍼 맵의 불량 분포 패턴 세 가지">
      <Defs />
      {[
        { cx: 75, label: '가장자리 집중', hint: '균일도 · 에지 조건', kind: 'edge' },
        { cx: 235, label: '줄무늬', hint: '스캔 · 이송 계통', kind: 'stripe' },
        { cx: 395, label: '군집', hint: '파티클 · 국부 오염', kind: 'cluster' },
      ].map((m) => (
        <g key={m.label}>
          <circle cx={m.cx} cy="70" r="52" fill={C.fill2} stroke={C.line} strokeWidth="2" />
          {Array.from({ length: 9 }).map((_, r) =>
            Array.from({ length: 9 }).map((_, c) => {
              const x = m.cx - 45 + c * 10;
              const y = 25 + r * 10;
              const dx = x + 4 - m.cx;
              const dy = y + 4 - 70;
              const d2 = dx * dx + dy * dy;
              if (d2 > 46 * 46) return null;
              let bad = false;
              if (m.kind === 'edge') bad = d2 > 34 * 34;
              if (m.kind === 'stripe') bad = c === 3 || c === 4;
              if (m.kind === 'cluster') bad = r >= 5 && r <= 7 && c >= 5 && c <= 7;
              return (
                <rect
                  key={`${r}-${c}`}
                  x={x}
                  y={y}
                  width="8"
                  height="8"
                  rx="1"
                  fill={bad ? 'var(--bad)' : C.s2}
                  opacity={bad ? 0.85 : 0.4}
                />
              );
            }),
          )}
          <Tb x={m.cx} y="146" textAnchor="middle">{m.label}</Tb>
          <T x={m.cx} y="164" textAnchor="middle" fontSize="10">{m.hint}</T>
        </g>
      ))}
      <T x="235" y="192" textAnchor="middle" fontSize="10">진한 칸이 불량 다이입니다</T>
    </svg>
  ),

  scaling: () => (
    <svg viewBox="0 0 470 170" role="img" aria-label="평면 구조에서 FinFET, GAA로 이어진 트랜지스터 구조 변화">
      <Defs />
      <g>
        <rect x="25" y="70" width="110" height="34" rx="4" fill={C.fill2} stroke={C.line} strokeWidth="1.5" />
        <rect x="55" y="54" width="50" height="16" rx="3" fill={C.s3} opacity="0.6" stroke={C.s3} strokeWidth="1.5" />
        <Tb x="80" y="128" textAnchor="middle">평면 구조</Tb>
        <T x="80" y="146" textAnchor="middle" fontSize="10">게이트가 위 1면</T>
      </g>
      <Arrow x1="145" y1="86" x2="175" y2="86" />
      <g>
        <rect x="185" y="70" width="110" height="34" rx="4" fill={C.fill2} stroke={C.line} strokeWidth="1.5" />
        {[0, 1, 2].map((i) => (
          <rect key={i} x={205 + i * 26} y="44" width="12" height="34" fill={C.s1} opacity="0.55" stroke={C.s1} strokeWidth="1.2" />
        ))}
        <rect x="196" y="52" width="88" height="14" rx="3" fill={C.s3} opacity="0.5" stroke={C.s3} strokeWidth="1.5" />
        <Tb x="240" y="128" textAnchor="middle">FinFET</Tb>
        <T x="240" y="146" textAnchor="middle" fontSize="10">게이트가 3면</T>
      </g>
      <Arrow x1="305" y1="86" x2="335" y2="86" />
      <g>
        <rect x="345" y="70" width="110" height="34" rx="4" fill={C.fill2} stroke={C.line} strokeWidth="1.5" />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x="370" y={38 + i * 13} width="60" height="8" rx="3" fill={C.s1} opacity="0.6" />
            <rect x="366" y={35 + i * 13} width="68" height="14" rx="4" fill="none" stroke={C.s3} strokeWidth="1.6" />
          </g>
        ))}
        <Tb x="400" y="128" textAnchor="middle">GAA</Tb>
        <T x="400" y="146" textAnchor="middle" fontSize="10">게이트가 전체를 감쌈</T>
      </g>
    </svg>
  ),

  cleanroom: () => (
    <svg viewBox="0 0 460 210" role="img" aria-label="클린룸의 공기 흐름과 출입 절차">
      <Defs />
      <rect x="30" y="30" width="400" height="18" rx="3" fill={C.s1} opacity="0.35" stroke={C.s1} strokeWidth="1.5" />
      <T x="230" y="43" textAnchor="middle" fontSize="10" fill={C.text}>팬 필터 유닛 (천장)</T>
      {[70, 130, 190, 250, 310, 370].map((x) => (
        <line key={x} x1={x} y1="54" x2={x} y2="140" stroke={C.s1} strokeWidth="1.6" strokeDasharray="5 5" markerEnd="url(#sr-arrow)" opacity="0.8" />
      ))}
      <rect x="30" y="146" width="400" height="16" rx="3" fill={C.fill2} stroke={C.line} strokeWidth="1.5" />
      <T x="230" y="158" textAnchor="middle" fontSize="10">바닥 배기</T>
      <rect x="180" y="86" width="34" height="54" rx="6" fill={C.fill} stroke={C.line} strokeWidth="1.5" />
      <T x="197" y="118" textAnchor="middle" fontSize="10">작업자</T>
      <T x="30" y="186" fontSize="10.5">깨끗한 공기를 위에서 아래로 흘려 입자를 바닥으로 밀어내고, 실내는 양압으로 유지합니다</T>
      <T x="30" y="202" fontSize="10.5">출입 순서: 탈의 → 방진복 착용 → 에어샤워 → 지정 동선 이동</T>
    </svg>
  ),

  particle: () => (
    <svg viewBox="0 0 460 180" role="img" aria-label="파티클이 패턴 위와 사이에 놓였을 때 생기는 불량">
      <Defs />
      <g>
        <T x="30" y="28">정상</T>
        <rect x="30" y="38" width="110" height="10" fill={C.s1} opacity="0.6" />
        <rect x="30" y="62" width="110" height="10" fill={C.s1} opacity="0.6" />
        <T x="30" y="96" fontSize="10">두 배선이 분리됨</T>
      </g>
      <g>
        <T x="180" y="28">패턴 위 파티클</T>
        <rect x="180" y="38" width="110" height="10" fill={C.s1} opacity="0.6" />
        <rect x="180" y="48" width="34" height="24" fill="var(--bad)" opacity="0.75" />
        <rect x="180" y="62" width="110" height="10" fill={C.s1} opacity="0.6" />
        <circle cx="197" cy="34" r="7" fill="var(--bad)" />
        <T x="180" y="96" fontSize="10" fill="var(--bad)">✕ 단락 (브리지)</T>
      </g>
      <g>
        <T x="330" y="28">패턴 사이 파티클</T>
        <rect x="330" y="38" width="46" height="10" fill={C.s1} opacity="0.6" />
        <rect x="392" y="38" width="38" height="10" fill={C.s1} opacity="0.6" />
        <circle cx="384" cy="43" r="8" fill="var(--bad)" />
        <rect x="330" y="62" width="100" height="10" fill={C.s1} opacity="0.6" />
        <T x="330" y="96" fontSize="10" fill="var(--bad)">✕ 단선 (오픈)</T>
      </g>
      <T x="30" y="136">파티클은 공기 중 먼지만이 아니라 챔버 내벽 증착물, 부품 마모,</T>
      <T x="30" y="154">웨이퍼 취급 과정에서도 생깁니다. 그래서 발생원별로 나눠 관리합니다.</T>
    </svg>
  ),

  esd: () => (
    <svg viewBox="0 0 460 190" role="img" aria-label="정전기 발생 경로와 ESD 대책">
      <Defs />
      <rect x="25" y="30" width="180" height="60" rx="7" fill="var(--bad-soft)" stroke="var(--bad)" strokeWidth="2" />
      <Tb x="115" y="54" textAnchor="middle">전하 축적</Tb>
      <T x="115" y="74" textAnchor="middle" fontSize="10">마찰 · 박리 · 이동</T>
      <Arrow x1="212" y1="60" x2="248" y2="60" />
      <rect x="255" y="30" width="180" height="60" rx="7" fill="var(--bad-soft)" stroke="var(--bad)" strokeWidth="2" />
      <Tb x="345" y="54" textAnchor="middle">순간 방전</Tb>
      <T x="345" y="74" textAnchor="middle" fontSize="10">절연막 파괴 · 잠재 불량</T>
      <rect x="25" y="112" width="205" height="54" rx="7" fill="var(--good-soft)" stroke="var(--good)" strokeWidth="2" />
      <Tb x="127" y="134" textAnchor="middle">도체 대책</Tb>
      <T x="127" y="152" textAnchor="middle" fontSize="10">손목 접지밴드 · 전도성 작업화</T>
      <rect x="248" y="112" width="187" height="54" rx="7" fill="var(--good-soft)" stroke="var(--good)" strokeWidth="2" />
      <Tb x="341" y="134" textAnchor="middle">절연물 대책</Tb>
      <T x="341" y="152" textAnchor="middle" fontSize="10">이온 블로어로 중화</T>
    </svg>
  ),

  'safety-flow': () => (
    <svg viewBox="0 0 500 130" role="img" aria-label="작업 전 안전 확인 흐름">
      <Defs />
      {['작업 내용 확인', 'MSDS·위험성 확인', '보호구 착용', 'LOTO 시행', '잔류 에너지 확인'].map((s, i) => (
        <g key={s}>
          <rect x={12 + i * 98} y="42" width="88" height="44" rx="6" fill={C.fill2} stroke={C.line} strokeWidth="1.5" />
          <text x={56 + i * 98} y="62" textAnchor="middle" fontSize="10" fontWeight="700" fill={C.text}>
            {s.split('·')[0]}
          </text>
          <text x={56 + i * 98} y="76" textAnchor="middle" fontSize="9.5" fill={C.text2}>
            {s.includes('·') ? s.split('·')[1] : ''}
          </text>
          {i < 4 && <Arrow x1={102 + i * 98} y1="64" x2={106 + i * 98} y2="64" />}
        </g>
      ))}
      <T x="250" y="112" textAnchor="middle">이 순서를 건너뛰는 지점에서 사고가 납니다</T>
    </svg>
  ),

  oxidation: () => (
    <svg viewBox="0 0 440 180" role="img" aria-label="실리콘 표면이 소모되며 산화막이 자라는 모습">
      <Defs />
      <T x="30" y="28">산화 전</T>
      <rect x="30" y="38" width="150" height="60" rx="4" fill="var(--warn-soft)" stroke={C.s4} strokeWidth="2" />
      <T x="105" y="74" textAnchor="middle">실리콘</T>
      <Arrow x1="196" y1="68" x2="234" y2="68" />
      <T x="215" y="56" textAnchor="middle" fontSize="10">O2 / H2O</T>
      <T x="250" y="28">산화 후</T>
      <rect x="250" y="38" width="150" height="22" rx="3" fill={C.s1} opacity="0.45" stroke={C.s1} strokeWidth="2" />
      <T x="325" y="53" textAnchor="middle" fontSize="10" fill={C.text}>SiO2 절연막</T>
      <rect x="250" y="60" width="150" height="38" rx="3" fill="var(--warn-soft)" stroke={C.s4} strokeWidth="2" />
      <T x="325" y="84" textAnchor="middle">실리콘</T>
      <line x1="250" y1="38" x2="414" y2="38" stroke={C.line} strokeWidth="1" strokeDasharray="3 3" />
      <T x="418" y="42" fontSize="9.5" textAnchor="end">원래 표면</T>
      <T x="30" y="132">산화막이 자랄 때 실리콘 표면이 소모되므로, 막의 일부는 원래 표면보다 아래에 생깁니다.</T>
      <T x="30" y="152">건식은 느리지만 치밀하고(게이트용), 습식은 빠르게 두껍게 자랍니다(소자 분리용).</T>
    </svg>
  ),

  'photo-flow': () => (
    <svg viewBox="0 0 500 190" role="img" aria-label="포토 공정의 도포부터 현상까지 단면 변화">
      <Defs />
      {[
        { x: 12, label: '1. 도포', pr: true, hole: false },
        { x: 137, label: '2. 노광', pr: true, hole: false, light: true },
        { x: 262, label: '3. 현상', pr: true, hole: true },
        { x: 387, label: '4. 식각 결과', pr: false, hole: true },
      ].map((s) => (
        <g key={s.label}>
          <rect x={s.x} y="80" width="100" height="34" rx="3" fill="var(--warn-soft)" stroke={C.s4} strokeWidth="1.5" />
          {s.pr ? (
            s.hole ? (
              <>
                <rect x={s.x} y="66" width="36" height="14" fill={C.s3} opacity="0.6" />
                <rect x={s.x + 64} y="66" width="36" height="14" fill={C.s3} opacity="0.6" />
              </>
            ) : (
              <rect x={s.x} y="66" width="100" height="14" fill={C.s3} opacity="0.6" />
            )
          ) : (
            <rect x={s.x + 36} y="80" width="28" height="16" fill="var(--bg)" stroke={C.line} strokeWidth="1" />
          )}
          {s.light && (
            <>
              <rect x={s.x + 30} y="34" width="40" height="8" fill={C.line} />
              <line x1={s.x + 15} y1="46" x2={s.x + 15} y2="64" stroke={C.s4} strokeWidth="2" markerEnd="url(#sr-arrow)" />
              <line x1={s.x + 85} y1="46" x2={s.x + 85} y2="64" stroke={C.s4} strokeWidth="2" markerEnd="url(#sr-arrow)" />
              <text x={s.x + 50} y="30" textAnchor="middle" fontSize="9.5" fill={C.text2}>마스크</text>
            </>
          )}
          <Tb x={s.x + 50} y="136" textAnchor="middle">{s.label}</Tb>
        </g>
      ))}
      <T x="250" y="164" textAnchor="middle">보라색이 감광액(PR), 노란색이 아래 막입니다</T>
      <T x="250" y="180" textAnchor="middle" fontSize="10">전체 순서: 도포 → 소프트베이크 → 노광 → 현상 → 하드베이크</T>
    </svg>
  ),

  'etch-profile': () => (
    <svg viewBox="0 0 440 180" role="img" aria-label="등방성 습식식각과 이방성 건식식각의 단면 차이">
      <Defs />
      <g>
        <Tb x="105" y="28" textAnchor="middle">습식식각 (등방성)</Tb>
        <rect x="30" y="40" width="150" height="16" fill={C.s3} opacity="0.6" />
        <rect x="90" y="40" width="30" height="16" fill="var(--bg)" />
        <path d="M30,56 L150,56 L150,110 L30,110 Z" fill="var(--warn-soft)" stroke={C.s4} strokeWidth="1.5" />
        <path d="M72,56 A33,28 0 0 0 138,56 Z" fill="var(--bg)" stroke="var(--bad)" strokeWidth="2" />
        <T x="105" y="132" textAnchor="middle" fontSize="10" fill="var(--bad)">마스크 아래까지 파고듦</T>
      </g>
      <g>
        <Tb x="320" y="28" textAnchor="middle">건식식각 (이방성)</Tb>
        <rect x="245" y="40" width="150" height="16" fill={C.s3} opacity="0.6" />
        <rect x="305" y="40" width="30" height="16" fill="var(--bg)" />
        <path d="M245,56 L365,56 L365,110 L245,110 Z" fill="var(--warn-soft)" stroke={C.s4} strokeWidth="1.5" />
        <rect x="305" y="56" width="30" height="46" fill="var(--bg)" stroke="var(--good)" strokeWidth="2" />
        <T x="320" y="132" textAnchor="middle" fontSize="10" fill="var(--good)">수직에 가깝게 깎임</T>
      </g>
      <T x="220" y="162" textAnchor="middle">미세 패턴에는 방향성이 좋은 건식식각을 씁니다</T>
    </svg>
  ),

  'deposition-compare': () => (
    <svg viewBox="0 0 470 190" role="img" aria-label="PVD, CVD, ALD의 홈 채움 특성 비교">
      <Defs />
      {[
        { x: 20, t: 'PVD', d: '물리적으로 튕겨 쌓음', shape: 'pvd', c: C.s1 },
        { x: 170, t: 'CVD', d: '표면 화학 반응', shape: 'cvd', c: C.s2 },
        { x: 320, t: 'ALD', d: '원자층 단위', shape: 'ald', c: C.s3 },
      ].map((m) => (
        <g key={m.t}>
          <Tb x={m.x + 65} y="26" textAnchor="middle">{m.t}</Tb>
          <path d={`M${m.x},40 L${m.x + 45},40 L${m.x + 45},96 L${m.x + 85},96 L${m.x + 85},40 L${m.x + 130},40 L${m.x + 130},120 L${m.x},120 Z`} fill="var(--warn-soft)" stroke={C.s4} strokeWidth="1.5" />
          {m.shape === 'pvd' && (
            <>
              <rect x={m.x} y="34" width="45" height="9" fill={m.c} opacity="0.75" />
              <rect x={m.x + 85} y="34" width="45" height="9" fill={m.c} opacity="0.75" />
              <rect x={m.x + 47} y="91" width="36" height="5" fill={m.c} opacity="0.75" />
            </>
          )}
          {m.shape === 'cvd' && (
            <path d={`M${m.x},34 L${m.x + 45},34 L${m.x + 45},91 L${m.x + 85},91 L${m.x + 85},34 L${m.x + 130},34 L${m.x + 130},41 L${m.x + 91},41 L${m.x + 91},97 L${m.x + 39},97 L${m.x + 39},41 L${m.x},41 Z`} fill={m.c} opacity="0.75" />
          )}
          {m.shape === 'ald' && (
            <path d={`M${m.x},36 L${m.x + 45},36 L${m.x + 45},93 L${m.x + 85},93 L${m.x + 85},36 L${m.x + 130},36 L${m.x + 130},41 L${m.x + 90},41 L${m.x + 90},98 L${m.x + 40},98 L${m.x + 40},41 L${m.x},41 Z`} fill={m.c} opacity="0.85" />
          )}
          <T x={m.x + 65} y="142" textAnchor="middle" fontSize="10">{m.d}</T>
          <T x={m.x + 65} y="160" textAnchor="middle" fontSize="10" fill={m.c}>
            {m.shape === 'pvd' ? '홈 바닥이 얇음' : m.shape === 'cvd' ? '비교적 고르게' : '가장 고르게'}
          </T>
        </g>
      ))}
      <T x="235" y="182" textAnchor="middle" fontSize="10">깊고 좁은 구조일수록 ALD가 유리하지만 속도는 느립니다</T>
    </svg>
  ),

  implant: () => (
    <svg viewBox="0 0 440 200" role="img" aria-label="이온주입의 깊이와 농도 분포">
      <Defs />
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={i} x1={100 + i * 50} y1="26" x2={92 + i * 50} y2="66" stroke={C.s1} strokeWidth="2" markerEnd="url(#sr-arrow)" />
      ))}
      <T x="220" y="18" textAnchor="middle">가속된 도펀트 이온</T>
      <rect x="40" y="56" width="70" height="14" fill={C.s3} opacity="0.6" />
      <rect x="330" y="56" width="70" height="14" fill={C.s3} opacity="0.6" />
      <T x="75" y="50" textAnchor="middle" fontSize="9.5">PR 마스크</T>
      <rect x="40" y="70" width="360" height="80" rx="4" fill="var(--warn-soft)" stroke={C.s4} strokeWidth="2" />
      <ellipse cx="220" cy="94" rx="105" ry="20" fill={C.s1} opacity="0.5" />
      <T x="220" y="98" textAnchor="middle" fontSize="10" fill={C.text}>주입 영역</T>
      <T x="220" y="134" textAnchor="middle">실리콘 기판</T>
      <T x="40" y="176" fontSize="10.5">주입 에너지가 높을수록 깊게, 도즈량이 많을수록 농도가 높아집니다.</T>
      <T x="40" y="192" fontSize="10.5">주입 직후에는 격자가 손상되어 있으므로 열처리로 회복시키고 활성화합니다.</T>
    </svg>
  ),

  'metal-layers': () => (
    <svg viewBox="0 0 440 200" role="img" aria-label="다층 금속배선과 비아 구조">
      <Defs />
      <rect x="40" y="150" width="360" height="30" rx="4" fill="var(--warn-soft)" stroke={C.s4} strokeWidth="2" />
      <T x="220" y="170" textAnchor="middle">실리콘 기판 (소자)</T>
      {[0, 1, 2].map((i) => {
        const y = 110 - i * 34;
        return (
          <g key={i}>
            <rect x="40" y={y} width="360" height="28" rx="3" fill={C.fill2} stroke={C.line} strokeWidth="1.2" />
            <rect x={70 + i * 20} y={y + 7} width="120" height="14" rx="2" fill={C.s1} opacity="0.7" />
            <rect x={240} y={y + 7} width="110" height="14" rx="2" fill={C.s1} opacity="0.7" />
            <rect x={150} y={y + 21} width="14" height="13" fill={C.s2} opacity="0.85" />
            <T x="30" y={y + 20} textAnchor="end" fontSize="9.5">M{3 - i}</T>
          </g>
        );
      })}
      <T x="40" y="24">파란색이 금속 배선, 초록색이 층을 잇는 비아입니다</T>
      <T x="40" y="196" fontSize="10">각 층 사이는 절연막으로 분리되고, CMP로 평탄화한 뒤 다음 층을 올립니다</T>
    </svg>
  ),

  'package-flow': () => (
    <svg viewBox="0 0 500 140" role="img" aria-label="후공정 전체 흐름 요약">
      <Defs />
      {['백그라인딩', '다이싱', '다이 어태치', '본딩', '몰딩', '검사'].map((s, i) => (
        <g key={s}>
          <rect x={10 + i * 82} y="46" width="72" height="40" rx="6" fill={C.fill2} stroke={C.line} strokeWidth="1.5" />
          <text x={46 + i * 82} y="70" textAnchor="middle" fontSize="10" fontWeight="700" fill={C.text}>
            {s}
          </text>
          {i < 5 && <Arrow x1={84 + i * 82} y1="66" x2={88 + i * 82} y2="66" />}
        </g>
      ))}
      <T x="250" y="116" textAnchor="middle">웨이퍼 테스트에서 양품으로 판정된 다이만 이 흐름으로 넘어옵니다</T>
    </svg>
  ),

  backgrinding: () => (
    <svg viewBox="0 0 440 150" role="img" aria-label="웨이퍼 뒷면을 갈아 두께를 줄이는 과정">
      <Defs />
      <rect x="40" y="46" width="150" height="10" fill={C.s3} opacity="0.6" />
      <T x="115" y="40" textAnchor="middle" fontSize="9.5">보호 테이프</T>
      <rect x="40" y="56" width="150" height="40" rx="3" fill="var(--warn-soft)" stroke={C.s4} strokeWidth="2" />
      <T x="115" y="118" textAnchor="middle" fontSize="10">약 775μm</T>
      <Arrow x1="206" y1="76" x2="244" y2="76" />
      <T x="225" y="64" textAnchor="middle" fontSize="10">연삭</T>
      <rect x="260" y="46" width="150" height="10" fill={C.s3} opacity="0.6" />
      <rect x="260" y="56" width="150" height="15" rx="3" fill="var(--warn-soft)" stroke={C.s4} strokeWidth="2" />
      <T x="335" y="118" textAnchor="middle" fontSize="10">수십~수백 μm</T>
      <T x="220" y="142" textAnchor="middle">얇아질수록 휘거나 깨지기 쉬워 취급이 까다로워집니다</T>
    </svg>
  ),

  dicing: () => (
    <svg viewBox="0 0 420 160" role="img" aria-label="스크라이브 레인을 따라 웨이퍼를 절단하는 모습">
      <Defs />
      {[0, 1, 2].map((r) =>
        [0, 1, 2].map((c) => (
          <rect key={`${r}-${c}`} x={60 + c * 74} y={40 + r * 32} width="64" height="24" rx="2" fill={C.s1} opacity="0.5" stroke={C.s1} strokeWidth="1.2" />
        )),
      )}
      {[0, 1].map((i) => (
        <line key={i} x1={128 + i * 74} y1="34" x2={128 + i * 74} y2="142" stroke="var(--bad)" strokeWidth="2.5" strokeDasharray="6 4" />
      ))}
      {[0, 1].map((i) => (
        <line key={i} x1="54" y1={68 + i * 32} x2="288" y2={68 + i * 32} stroke="var(--bad)" strokeWidth="2.5" strokeDasharray="6 4" />
      ))}
      <T x="310" y="72">절단선</T>
      <T x="310" y="88" fontSize="10">(스크라이브 레인)</T>
      <T x="30" y="26">다이 사이에 절단용 여유 공간을 미리 비워 둡니다</T>
      <T x="30" y="156" fontSize="10">절단 시 가장자리가 깨지는 칩핑이 대표 불량입니다</T>
    </svg>
  ),

  'die-attach': () => (
    <svg viewBox="0 0 430 150" role="img" aria-label="다이를 기판에 붙이는 과정">
      <Defs />
      <rect x="40" y="96" width="160" height="22" rx="3" fill={C.fill2} stroke={C.line} strokeWidth="1.5" />
      <T x="120" y="138" textAnchor="middle" fontSize="10">기판 / 리드프레임</T>
      <rect x="92" y="40" width="56" height="26" rx="3" fill={C.s1} opacity="0.55" stroke={C.s1} strokeWidth="1.5" />
      <Arrow x1="120" y1="70" x2="120" y2="90" />
      <T x="120" y="30" textAnchor="middle" fontSize="10">다이</T>
      <Arrow x1="216" y1="96" x2="252" y2="96" />
      <rect x="268" y="96" width="140" height="22" rx="3" fill={C.fill2} stroke={C.line} strokeWidth="1.5" />
      <rect x="306" y="90" width="64" height="6" fill={C.s2} opacity="0.8" />
      <rect x="310" y="66" width="56" height="24" rx="3" fill={C.s1} opacity="0.55" stroke={C.s1} strokeWidth="1.5" />
      <T x="338" y="138" textAnchor="middle" fontSize="10">접착층으로 고정</T>
      <T x="30" y="24">배치 위치와 기울기, 접착층 두께가 핵심 관리값입니다</T>
    </svg>
  ),

  'wire-bonding': () => (
    <svg viewBox="0 0 420 150" role="img" aria-label="와이어로 다이 패드와 기판 단자를 연결하는 모습">
      <Defs />
      <rect x="40" y="92" width="330" height="24" rx="3" fill={C.fill2} stroke={C.line} strokeWidth="1.5" />
      <rect x="150" y="58" width="110" height="34" rx="3" fill={C.s1} opacity="0.55" stroke={C.s1} strokeWidth="1.5" />
      <T x="205" y="80" textAnchor="middle" fontSize="10" fill={C.text}>다이</T>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <path d={`M${162 + i * 16},58 Q${130 + i * 6},${18 + i * 6} ${82 + i * 16},92`} fill="none" stroke={C.s4} strokeWidth="2" />
          <path d={`M${248 - i * 16},58 Q${280 - i * 6},${18 + i * 6} ${328 - i * 16},92`} fill="none" stroke={C.s4} strokeWidth="2" />
        </g>
      ))}
      <T x="205" y="136" textAnchor="middle">지름 수십 μm 금속 와이어로 하나씩 연결합니다</T>
      <T x="30" y="28" fontSize="10">접합 강도가 부족하면 끊어지고, 과하면 패드가 손상됩니다</T>
    </svg>
  ),

  'flip-chip': () => (
    <svg viewBox="0 0 430 160" role="img" aria-label="플립칩 방식에서 범프로 직접 연결하는 구조">
      <Defs />
      <T x="30" y="26">와이어 본딩</T>
      <rect x="30" y="86" width="160" height="20" rx="3" fill={C.fill2} stroke={C.line} strokeWidth="1.5" />
      <rect x="76" y="58" width="68" height="28" rx="3" fill={C.s1} opacity="0.55" stroke={C.s1} strokeWidth="1.5" />
      <path d="M88,58 Q64,28 44,86" fill="none" stroke={C.s4} strokeWidth="2" />
      <path d="M132,58 Q156,28 176,86" fill="none" stroke={C.s4} strokeWidth="2" />
      <T x="110" y="128" textAnchor="middle" fontSize="10">신호 경로가 길다</T>
      <T x="240" y="26">플립칩</T>
      <rect x="240" y="86" width="160" height="20" rx="3" fill={C.fill2} stroke={C.line} strokeWidth="1.5" />
      <rect x="276" y="52" width="88" height="26" rx="3" fill={C.s1} opacity="0.55" stroke={C.s1} strokeWidth="1.5" />
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} cx={288 + i * 16} cy="82" r="5" fill={C.s2} />
      ))}
      <T x="320" y="128" textAnchor="middle" fontSize="10">범프로 바로 연결 · 경로가 짧다</T>
      <T x="215" y="152" textAnchor="middle" fontSize="10">접합 후 언더필 수지로 응력을 분산시킵니다</T>
    </svg>
  ),

  molding: () => (
    <svg viewBox="0 0 420 150" role="img" aria-label="몰딩으로 다이와 와이어를 수지로 감싸는 모습">
      <Defs />
      <rect x="40" y="86" width="150" height="20" rx="3" fill={C.fill2} stroke={C.line} strokeWidth="1.5" />
      <rect x="82" y="60" width="66" height="26" rx="3" fill={C.s1} opacity="0.55" stroke={C.s1} strokeWidth="1.5" />
      <path d="M92,60 Q70,34 52,86" fill="none" stroke={C.s4} strokeWidth="1.8" />
      <path d="M138,60 Q160,34 178,86" fill="none" stroke={C.s4} strokeWidth="1.8" />
      <T x="115" y="128" textAnchor="middle" fontSize="10">몰딩 전</T>
      <Arrow x1="206" y1="86" x2="242" y2="86" />
      <rect x="258" y="46" width="130" height="60" rx="5" fill={C.text3} opacity="0.55" stroke={C.line} strokeWidth="1.5" />
      <rect x="258" y="86" width="130" height="20" rx="3" fill={C.fill2} stroke={C.line} strokeWidth="1.5" />
      <T x="323" y="80" textAnchor="middle" fontSize="10" fill={C.text}>에폭시 수지</T>
      <T x="323" y="128" textAnchor="middle" fontSize="10">몰딩 후</T>
      <T x="30" y="26">수지가 고르게 채워져야 하고, 기포(보이드)가 남으면 신뢰성 불량이 됩니다</T>
    </svg>
  ),

  'package-types': () => (
    <svg viewBox="0 0 440 160" role="img" aria-label="리드형 패키지와 BGA, CSP의 형태 비교">
      <Defs />
      <g>
        <rect x="30" y="50" width="100" height="40" rx="4" fill={C.text3} opacity="0.5" stroke={C.line} strokeWidth="1.5" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={22} y={58 + i * 9} width="10" height="4" fill={C.line} />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={128} y={58 + i * 9} width="10" height="4" fill={C.line} />
        ))}
        <Tb x="80" y="116" textAnchor="middle">리드형 (QFP 등)</Tb>
        <T x="80" y="134" textAnchor="middle" fontSize="10">옆면에 리드</T>
      </g>
      <g>
        <rect x="175" y="50" width="100" height="36" rx="4" fill={C.text3} opacity="0.5" stroke={C.line} strokeWidth="1.5" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <circle key={i} cx={186 + i * 16} cy="92" r="5" fill={C.s2} />
        ))}
        <Tb x="225" y="116" textAnchor="middle">BGA</Tb>
        <T x="225" y="134" textAnchor="middle" fontSize="10">바닥에 솔더볼 격자</T>
      </g>
      <g>
        <rect x="330" y="56" width="66" height="30" rx="3" fill={C.text3} opacity="0.5" stroke={C.line} strokeWidth="1.5" />
        <rect x="336" y="60" width="54" height="22" rx="2" fill={C.s1} opacity="0.5" />
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx={343 + i * 17} cy="90" r="4" fill={C.s2} />
        ))}
        <Tb x="363" y="116" textAnchor="middle">CSP / WLP</Tb>
        <T x="363" y="134" textAnchor="middle" fontSize="10">칩 크기에 가깝게</T>
      </g>
      <T x="30" y="28" fontSize="10">단자 수가 늘어날수록 옆면 리드로는 부족해 바닥 면 전체를 씁니다</T>
    </svg>
  ),

  hbm: () => (
    <svg viewBox="0 0 430 190" role="img" aria-label="HBM에서 DRAM 다이를 적층하고 TSV로 연결한 구조">
      <Defs />
      <rect x="60" y="150" width="310" height="22" rx="3" fill={C.fill2} stroke={C.line} strokeWidth="1.5" />
      <T x="215" y="184" textAnchor="middle" fontSize="10">패키지 기판</T>
      <rect x="70" y="126" width="290" height="24" rx="3" fill={C.s3} opacity="0.4" stroke={C.s3} strokeWidth="1.5" />
      <T x="215" y="142" textAnchor="middle" fontSize="10" fill={C.text}>인터포저</T>
      <rect x="248" y="42" width="104" height="84" rx="3" fill={C.s1} opacity="0.3" stroke={C.s1} strokeWidth="1.5" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={252} y={48 + i * 19} width="96" height="15" rx="2" fill={C.s1} opacity="0.6" stroke={C.s1} strokeWidth="1" />
          <text x={300} y={59 + i * 19} textAnchor="middle" fontSize="9" fill={C.text}>DRAM 다이</text>
        </g>
      ))}
      {[0, 1, 2].map((i) => (
        <line key={i} x1={268 + i * 32} y1="48" x2={268 + i * 32} y2="126" stroke={C.s2} strokeWidth="3" />
      ))}
      <rect x="86" y="86" width="140" height="40" rx="3" fill={C.s3} opacity="0.35" stroke={C.s3} strokeWidth="1.5" />
      <T x="156" y="110" textAnchor="middle" fontSize="10" fill={C.text}>GPU / AI 가속기</T>
      <T x="228" y="34" fontSize="10">초록 선이 TSV</T>
      <T x="30" y="34" fontSize="10">다이를 쌓아 연결 단자 수를 크게 늘려 대역폭을 확보합니다</T>
    </svg>
  ),

  tsv: () => (
    <svg viewBox="0 0 400 170" role="img" aria-label="다이를 수직으로 관통하는 TSV 구조">
      <Defs />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x="80" y={40 + i * 34} width="240" height="28" rx="3" fill="var(--warn-soft)" stroke={C.s4} strokeWidth="1.5" />
          <text x="70" y={58 + i * 34} textAnchor="end" fontSize="9.5" fill={C.text2}>
            다이 {i + 1}
          </text>
        </g>
      ))}
      {[0, 1, 2].map((c) => (
        <rect key={c} x={130 + c * 64} y="40" width="12" height="102" fill={C.s2} />
      ))}
      <T x="200" y="160" textAnchor="middle">깊은 구멍을 뚫고 절연막을 입힌 뒤 구리로 채워 위아래를 직접 잇습니다</T>
      <T x="80" y="28" fontSize="10">초록색이 TSV (구리 충전)</T>
    </svg>
  ),

  chiplet: () => (
    <svg viewBox="0 0 440 180" role="img" aria-label="2.5D와 3D 패키징의 배치 차이">
      <Defs />
      <g>
        <Tb x="110" y="28" textAnchor="middle">2.5D</Tb>
        <rect x="30" y="96" width="160" height="20" rx="3" fill={C.s3} opacity="0.4" stroke={C.s3} strokeWidth="1.5" />
        <T x="110" y="110" textAnchor="middle" fontSize="9.5" fill={C.text}>인터포저</T>
        <rect x="40" y="62" width="62" height="34" rx="3" fill={C.s1} opacity="0.55" stroke={C.s1} strokeWidth="1.5" />
        <rect x="118" y="62" width="62" height="34" rx="3" fill={C.s2} opacity="0.55" stroke={C.s2} strokeWidth="1.5" />
        <T x="110" y="140" textAnchor="middle" fontSize="10">나란히 배치 · 방열에 유리</T>
      </g>
      <g>
        <Tb x="330" y="28" textAnchor="middle">3D</Tb>
        <rect x="250" y="96" width="160" height="20" rx="3" fill={C.fill2} stroke={C.line} strokeWidth="1.5" />
        <rect x="288" y="62" width="84" height="34" rx="3" fill={C.s2} opacity="0.55" stroke={C.s2} strokeWidth="1.5" />
        <rect x="288" y="40" width="84" height="22" rx="3" fill={C.s1} opacity="0.55" stroke={C.s1} strokeWidth="1.5" />
        {[0, 1].map((i) => (
          <line key={i} x1={312 + i * 36} y1="40" x2={312 + i * 36} y2="96" stroke={C.s2} strokeWidth="3" />
        ))}
        <T x="330" y="140" textAnchor="middle" fontSize="10">수직 적층 · 면적과 경로에 유리</T>
      </g>
      <T x="220" y="168" textAnchor="middle" fontSize="10">큰 칩 하나 대신 기능별 칩렛을 조합해 수율과 유연성을 확보합니다</T>
    </svg>
  ),
};

export default function Figure({ name, caption }: { name?: string; caption?: string }) {
  if (!name) return null;
  const render = figures[name];
  if (!render) return null;
  return (
    <figure className="figure">
      {render()}
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

export const hasFigure = (name?: string) => Boolean(name && figures[name]);
