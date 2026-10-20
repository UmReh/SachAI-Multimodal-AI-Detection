/* Friendly illustrated portrait used in the hero "example scan".
   Deliberately stylized (flat shapes, soft shading) rather than photoreal —
   it stays on the appealing side of the uncanny valley. Pure SVG, with a
   face-landmark overlay that fades in once the scan sweep has finished. */

const JAW = [
  [142, 116], [144, 134], [152, 152], [166, 168], [182, 179], [200, 182],
  [218, 179], [234, 168], [248, 152], [256, 134], [258, 116],
];
const BROW_L = [[158, 101], [172, 95], [186, 99]];
const BROW_R = [[214, 99], [228, 95], [242, 101]];
const EYE_L = [[163, 121], [172, 113], [181, 121], [172, 128]];
const EYE_R = [[219, 121], [228, 113], [237, 121], [228, 128]];
const NOSE = [[200, 128], [200, 141], [194, 150], [200, 153], [206, 150]];
const MOUTH = [[182, 152], [191, 150], [200, 151], [209, 150], [218, 152], [210, 163], [200, 166], [190, 163]];

const ALL_POINTS = [...JAW, ...BROW_L, ...BROW_R, ...EYE_L, ...EYE_R, ...NOSE, ...MOUTH];
const toPoints = (pts) => pts.map((p) => p.join(",")).join(" ");

export default function DemoFace({ scanned }) {
  return (
    <svg
      className="demo-face"
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="df-bg" cx="50%" cy="38%" r="75%">
          <stop offset="0%" stopColor="#456AB8" />
          <stop offset="55%" stopColor="#1F3470" />
          <stop offset="100%" stopColor="#0C1633" />
        </radialGradient>
        <linearGradient id="df-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F7CDAA" />
          <stop offset="100%" stopColor="#F0BC95" />
        </linearGradient>
        <linearGradient id="df-hair" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5A4036" />
          <stop offset="100%" stopColor="#332420" />
        </linearGradient>
        <linearGradient id="df-blazer" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2D3E69" />
          <stop offset="100%" stopColor="#16213F" />
        </linearGradient>
        <filter id="df-blur" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <clipPath id="df-neck-clip">
          <path d="M171 164 L169 208 C169 220 231 220 231 208 L229 164 Z" />
        </clipPath>
        <clipPath id="df-mouth-clip">
          <path d="M183 151 C187 168 213 168 217 151 C209 154 191 154 183 151 Z" />
        </clipPath>

        {/* one eye, mirrored for the other side */}
        <g id="df-eye">
          <ellipse cx="172" cy="121" rx="7.2" ry="8" fill="#2A1C18" />
          <circle cx="174.6" cy="118" r="2.7" fill="#fff" />
          <circle cx="169.6" cy="123.6" r="1.3" fill="#fff" opacity="0.8" />
          <path d="M163.5 117 C166 110.6 178 110.6 181 116.6" stroke="#2A1C18" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        </g>
      </defs>

      {/* backdrop */}
      <rect width="400" height="300" fill="url(#df-bg)" />
      <ellipse cx="200" cy="120" rx="150" ry="120" fill="#7596EA" opacity="0.22" filter="url(#df-blur)" />

      {/* neck */}
      <path d="M171 164 L169 208 C169 220 231 220 231 208 L229 164 Z" fill="#E9B590" />
      <g clipPath="url(#df-neck-clip)">
        <ellipse cx="200" cy="184" rx="32" ry="12" fill="#B97C58" opacity="0.38" filter="url(#df-blur)" />
      </g>

      {/* shoulders & blazer */}
      <path d="M28 300 C40 240 102 208 164 200 L200 230 L236 200 C298 208 360 240 372 300 Z" fill="url(#df-blazer)" />
      <path d="M42 290 C58 244 106 218 160 208" stroke="#8FB0FF" strokeOpacity="0.22" strokeWidth="1.6" fill="none" />
      <path d="M170 203 L200 234 L230 203 L234 300 L166 300 Z" fill="#F2F5FB" />
      <path d="M164 200 L138 238 L154 300 L192 300 L200 234 Z" fill="#22335E" />
      <path d="M236 200 L262 238 L246 300 L208 300 L200 234 Z" fill="#22335E" />

      <path d="M170 203 L200 234 L230 203 C216 211 184 211 170 203 Z" fill="#E2A982" />

      {/* ears */}
      <circle cx="142" cy="124" r="10" fill="#F0BC95" />
      <circle cx="258" cy="124" r="10" fill="#F0BC95" />
      <circle cx="142" cy="125" r="4.5" fill="#E3A07A" opacity="0.7" />
      <circle cx="258" cy="125" r="4.5" fill="#E3A07A" opacity="0.7" />

      {/* face — rounded, friendly proportions */}
      <path
        d="M142 116 C142 78 168 58 200 58 C232 58 258 78 258 116 C258 150 234 182 200 182 C166 182 142 150 142 116 Z"
        fill="url(#df-skin)"
      />

      {/* soft cheeks */}
      <ellipse cx="159" cy="146" rx="13" ry="8.5" fill="#F28B82" opacity="0.38" filter="url(#df-blur)" />
      <ellipse cx="241" cy="146" rx="13" ry="8.5" fill="#F28B82" opacity="0.38" filter="url(#df-blur)" />

      {/* hair */}
      <path
        d="M137 118 C128 62 162 36 202 36 C246 36 274 64 263 118 C259 96 248 82 234 77 C214 90 178 90 158 78 C147 87 140 100 137 118 Z"
        fill="url(#df-hair)"
      />
      <path d="M166 58 C184 46 216 44 240 58" stroke="#8A6A5A" strokeOpacity="0.55" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M176 70 C192 62 214 62 230 68" stroke="#7A5C4E" strokeOpacity="0.35" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* brows */}
      <path d="M158 101 C165 94 178 93 187 99" stroke="#3B2A24" strokeWidth="3.6" fill="none" strokeLinecap="round" />
      <path d="M213 99 C222 93 235 94 242 101" stroke="#3B2A24" strokeWidth="3.6" fill="none" strokeLinecap="round" />

      {/* eyes */}
      <use href="#df-eye" />
      <use href="#df-eye" transform="translate(400,0) scale(-1,1)" />

      {/* nose — a simple, soft shape */}
      <path d="M197 142 C195 147 195 151 199 152 C202 153 205 151 205 148" stroke="#D9966F" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <ellipse cx="201" cy="141" rx="3" ry="4.5" fill="#FFE2C8" opacity="0.45" filter="url(#df-blur)" />

      {/* open smile */}
      <path d="M183 151 C187 168 213 168 217 151 C209 154 191 154 183 151 Z" fill="#8E2F3A" />
      <g clipPath="url(#df-mouth-clip)">
        <path d="M180 150 L220 150 L220 158 C212 160 206 160 200 160 C194 160 188 160 180 158 Z" fill="#FFFFFF" />
        <ellipse cx="200" cy="168" rx="11" ry="6" fill="#E26A74" />
      </g>
      <path d="M183 151 C187 168 213 168 217 151 C209 154 191 154 183 151 Z" fill="none" stroke="#B5584F" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M181 148 C178.6 149.6 178.4 153 180 155" stroke="#D9966F" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M219 148 C221.4 149.6 221.6 153 220 155" stroke="#D9966F" strokeWidth="1.6" fill="none" strokeLinecap="round" />

      {/* analysis overlay */}
      <g className={`demo-landmarks ${scanned ? "demo-landmarks--on" : ""}`}>
        <path
          className="demo-box"
          d="M132 78 V52 H156 M244 52 H268 V78 M268 160 V188 H244 M156 188 H132 V160"
          fill="none"
          stroke="#22D3EE"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <g className="demo-mesh" fill="none" stroke="#22D3EE" strokeWidth="0.7" strokeOpacity="0.55">
          <polyline points={toPoints(JAW)} />
          <polyline points={toPoints(BROW_L)} />
          <polyline points={toPoints(BROW_R)} />
          <polygon points={toPoints(EYE_L)} />
          <polygon points={toPoints(EYE_R)} />
          <polyline points={toPoints(NOSE)} />
          <polygon points={toPoints(MOUTH)} />
        </g>
        {ALL_POINTS.map(([x, y], i) => (
          <circle
            key={i}
            className="demo-dot"
            cx={x}
            cy={y}
            r="1.6"
            fill="#22D3EE"
            style={{ animationDelay: `${i * 18}ms` }}
          />
        ))}
        <g className="demo-tag">
          <rect x="272" y="52" width="74" height="16" rx="8" fill="#0A1226" fillOpacity="0.8" stroke="#22D3EE" strokeOpacity="0.7" strokeWidth="0.8" />
          <circle cx="282" cy="60" r="2.4" fill="#22D3EE" />
          <text x="289" y="63.3" fontSize="8" fontWeight="600" fill="#E6FBFF" fontFamily="Inter, system-ui, sans-serif" letterSpacing="0.4">
            FACE · 98%
          </text>
        </g>
      </g>
    </svg>
  );
}
