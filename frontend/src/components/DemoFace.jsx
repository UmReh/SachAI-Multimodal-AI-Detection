/* Illustrated studio portrait used in the hero "example scan".
   Pure SVG (no external image), with a face-landmark overlay that
   fades in once the scan sweep has finished. */

const JAW = [
  [141, 112], [144, 135], [152, 160], [164, 188], [180, 203], [200, 210],
  [220, 203], [236, 188], [248, 160], [256, 135], [259, 112],
];
const BROW_L = [[161, 101], [176, 94], [193, 97]];
const BROW_R = [[207, 97], [224, 94], [239, 101]];
const EYE_L = [[163, 114], [177, 108.5], [191, 114], [177, 118.5]];
const EYE_R = [[209, 114], [223, 108.5], [237, 114], [223, 118.5]];
const NOSE = [[200, 116], [199, 140], [190, 162], [195, 167], [200, 168.5], [205, 167], [210, 162]];
const MOUTH = [[178, 182], [189, 181], [200, 182.5], [211, 181], [222, 182], [211, 193], [200, 195], [189, 193]];

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
        <radialGradient id="df-skin" cx="44%" cy="38%" r="68%">
          <stop offset="0%" stopColor="#F9DCC4" />
          <stop offset="55%" stopColor="#EFC3A0" />
          <stop offset="100%" stopColor="#D69F7A" />
        </radialGradient>
        {/* key light from the left: right side of the face falls into soft shade */}
        <linearGradient id="df-light" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.1" />
          <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="100%" stopColor="#7A4630" stopOpacity="0.26" />
        </linearGradient>
        <linearGradient id="df-neck" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B87D5B" />
          <stop offset="100%" stopColor="#DBA886" />
        </linearGradient>
        <linearGradient id="df-hair" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7A5640" />
          <stop offset="50%" stopColor="#47301F" />
          <stop offset="100%" stopColor="#24170F" />
        </linearGradient>
        <linearGradient id="df-blazer" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2D3E69" />
          <stop offset="100%" stopColor="#141E3C" />
        </linearGradient>
        <linearGradient id="df-teeth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E9E2D8" />
        </linearGradient>
        <radialGradient id="df-iris" cx="50%" cy="42%" r="58%">
          <stop offset="0%" stopColor="#A9794A" />
          <stop offset="60%" stopColor="#6E482A" />
          <stop offset="100%" stopColor="#47301F" />
        </radialGradient>
        <filter id="df-blur-xs" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.1" />
        </filter>
        <filter id="df-blur-sm" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
        <filter id="df-blur-md" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <clipPath id="df-sclera-clip">
          <path d="M163 114 C169 107 185 107 191 114 C185 118.8 169 118.8 163 114 Z" />
        </clipPath>
        <clipPath id="df-face-clip">
          <path d="M141 112 C141 75 168 56 200 56 C232 56 259 75 259 112 C259 140 252 168 236 188 C225 202 213 210 200 210 C187 210 175 202 164 188 C148 168 141 140 141 112 Z" />
        </clipPath>
        <clipPath id="df-neck-clip">
          <path d="M171 188 L168 232 C168 247 232 247 232 232 L229 188 Z" />
        </clipPath>
        <clipPath id="df-mouth-clip">
          <path d="M180 182.5 C189 180 195 180.5 200 182.6 C205 180.5 211 180 220 182.5 C216 190 208 193.6 200 193.6 C192 193.6 184 190 180 182.5 Z" />
        </clipPath>

        {/* one eye (viewer's left); mirrored for the right */}
        <g id="df-eye">
          <ellipse cx="177" cy="105.5" rx="16" ry="6" fill="#B9775A" opacity="0.22" filter="url(#df-blur-sm)" />
          <path d="M163 114 C169 107 185 107 191 114 C185 118.8 169 118.8 163 114 Z" fill="#F7F3ED" />
          <g clipPath="url(#df-sclera-clip)">
            <circle cx="177" cy="113.3" r="5.7" fill="url(#df-iris)" />
            <circle cx="177" cy="113.3" r="2.3" fill="#171009" />
            <circle cx="179.3" cy="111.3" r="1.5" fill="#fff" opacity="0.95" />
            <circle cx="175" cy="115.4" r="0.8" fill="#fff" opacity="0.45" />
            <path d="M163 109.5 C170 105.5 184 105.5 191 109.5 L191 112 L163 112 Z" fill="#5B3626" opacity="0.2" />
          </g>
          {/* lashes + lids */}
          <path d="M162.4 114.4 C169 106.4 185 106.4 191.6 113.8" stroke="#3C261C" strokeOpacity="0.9" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M190.6 113 L194 110.6" stroke="#3C261C" strokeOpacity="0.7" strokeWidth="1" strokeLinecap="round" />
          <path d="M187 110.4 L189.6 107.6" stroke="#3C261C" strokeOpacity="0.5" strokeWidth="0.9" strokeLinecap="round" />
          <path d="M165 116.2 C171 119.6 183 119.6 189 116.2" stroke="#A26650" strokeOpacity="0.32" strokeWidth="0.9" fill="none" />
          <path d="M164 108.6 C170 103 184 103 191 108.4" stroke="#A86A52" strokeOpacity="0.4" strokeWidth="1" fill="none" />
          {/* smile crinkle under the eye */}
          <path d="M165 121 C172 124 184 124 190 120.6" stroke="#B87A60" strokeOpacity="0.18" strokeWidth="1.4" fill="none" filter="url(#df-blur-xs)" />
        </g>
      </defs>

      {/* backdrop */}
      <rect width="400" height="300" fill="url(#df-bg)" />
      <ellipse cx="200" cy="120" rx="150" ry="120" fill="#7596EA" opacity="0.22" filter="url(#df-blur-md)" />

      {/* shoulders & blazer */}
      <path d="M30 300 C40 258 100 232 168 226 L200 256 L232 226 C300 232 360 258 370 300 Z" fill="url(#df-blazer)" />
      <path d="M40 290 C52 262 100 238 166 229" stroke="#8FB0FF" strokeOpacity="0.25" strokeWidth="1.6" fill="none" />
      <path d="M172 228 L200 262 L228 228 L232 300 L168 300 Z" fill="#F0F3FA" />
      <path d="M200 262 L200 300" stroke="#C9D1E0" strokeWidth="1" />
      <path d="M168 226 L142 262 L156 300 L192 300 L200 262 Z" fill="#203159" />
      <path d="M232 226 L258 262 L244 300 L208 300 L200 262 Z" fill="#1C2A4E" />
      <path d="M168 226 L142 262 M232 226 L258 262" stroke="#0D1530" strokeWidth="1.2" opacity="0.5" />

      {/* neck */}
      <path d="M171 188 L168 232 C168 247 232 247 232 232 L229 188 Z" fill="url(#df-neck)" />
      <path d="M172 228 L200 262 L228 228 C216 238 184 238 172 228 Z" fill="#D29D7A" />
      <g clipPath="url(#df-neck-clip)">
        <ellipse cx="204" cy="212" rx="30" ry="11" fill="#8A5238" opacity="0.34" filter="url(#df-blur-sm)" />
      </g>

      {/* back hair */}
      <path d="M134 126 C124 62 162 31 206 31 C254 31 278 66 267 128 C266 140 262 150 256 156 L144 156 C138 150 134 140 134 126 Z" fill="url(#df-hair)" />

      {/* ears */}
      <ellipse cx="140" cy="134" rx="9" ry="16" fill="#E3AF8C" />
      <ellipse cx="260" cy="134" rx="9" ry="16" fill="#D6A07D" />
      <path d="M138 127 C141.5 132 141.5 139 138 145" stroke="#B3735A" strokeOpacity="0.4" strokeWidth="1.2" fill="none" />
      <path d="M262 127 C258.5 132 258.5 139 262 145" stroke="#B3735A" strokeOpacity="0.4" strokeWidth="1.2" fill="none" />

      {/* face */}
      <path
        d="M141 112 C141 75 168 56 200 56 C232 56 259 75 259 112 C259 140 252 168 236 188 C225 202 213 210 200 210 C187 210 175 202 164 188 C148 168 141 140 141 112 Z"
        fill="url(#df-skin)"
      />

      <g clipPath="url(#df-face-clip)">
        {/* directional light / shade */}
        <rect x="140" y="50" width="120" height="165" fill="url(#df-light)" />
        {/* forehead + cheekbone highlights */}
        <ellipse cx="192" cy="78" rx="36" ry="14" fill="#FFF4E8" opacity="0.34" filter="url(#df-blur-sm)" />
        <ellipse cx="166" cy="143" rx="14" ry="9" fill="#FFF1E2" opacity="0.28" filter="url(#df-blur-sm)" />
        <ellipse cx="238" cy="143" rx="12" ry="8" fill="#FFF1E2" opacity="0.16" filter="url(#df-blur-sm)" />
        {/* warm rosy cheeks (lifted by the smile) */}
        <ellipse cx="160" cy="150" rx="16" ry="10" fill="#E8867B" opacity="0.2" filter="url(#df-blur-sm)" />
        <ellipse cx="241" cy="150" rx="16" ry="10" fill="#E8867B" opacity="0.2" filter="url(#df-blur-sm)" />
        {/* jaw falloff */}
        <path d="M143 124 C146 158 160 190 186 206" stroke="#9A5E44" strokeOpacity="0.2" strokeWidth="8" fill="none" filter="url(#df-blur-sm)" />
        <path d="M257 124 C254 158 240 190 214 206" stroke="#9A5E44" strokeOpacity="0.3" strokeWidth="9" fill="none" filter="url(#df-blur-sm)" />
        <ellipse cx="200" cy="209" rx="22" ry="5" fill="#9A5E44" opacity="0.22" filter="url(#df-blur-sm)" />
        {/* chin highlight + soft shadow under lower lip */}
        <ellipse cx="199" cy="203" rx="9" ry="4" fill="#FFF1E2" opacity="0.22" filter="url(#df-blur-xs)" />
        <ellipse cx="200" cy="199" rx="12" ry="3.4" fill="#9A5E44" opacity="0.16" filter="url(#df-blur-xs)" />
      </g>

      {/* front hair — side-swept with natural strands */}
      <path
        d="M134 124 C123 66 156 37 206 37 C256 37 281 68 266 124 C263 103 255 88 242 78 C226 66 198 70 176 84 C158 93 144 106 140 124 Z"
        fill="url(#df-hair)"
      />
      <path d="M150 90 C146 74 160 54 188 46" stroke="#A98467" strokeOpacity="0.4" strokeWidth="2.4" fill="none" strokeLinecap="round" filter="url(#df-blur-xs)" />
      <path d="M168 64 C186 51 218 49 242 64" stroke="#9A7658" strokeOpacity="0.5" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M156 80 C176 63 202 57 228 62" stroke="#876548" strokeOpacity="0.4" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <path d="M206 43 C232 46 252 59 260 84" stroke="#876548" strokeOpacity="0.38" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <path d="M180 56 C196 48 220 47 236 54" stroke="#B28F70" strokeOpacity="0.3" strokeWidth="1" fill="none" strokeLinecap="round" />
      {/* a few loose strands across the hairline */}
      <path d="M160 92 C157 98 158 104 161 108" stroke="#47301F" strokeOpacity="0.4" strokeWidth="1.1" fill="none" strokeLinecap="round" />

      {/* brows — arched and tapered */}
      <path d="M160.5 102 C167 92.5 185 90 194 97.5 C185 94.6 169 96.5 160.5 102 Z" fill="#40291F" opacity="0.92" />
      <path d="M206 97.5 C215 90 233 92.5 239.5 102 C231 96.5 215 94.6 206 97.5 Z" fill="#40291F" opacity="0.92" />

      {/* eyes */}
      <use href="#df-eye" />
      <use href="#df-eye" transform="translate(400,0) scale(-1,1)" />

      {/* nose — narrow bridge, defined tip */}
      <path d="M192.5 120 C190.8 136 189.6 149 189 158" stroke="#A56A4B" strokeOpacity="0.26" strokeWidth="3.2" fill="none" strokeLinecap="round" filter="url(#df-blur-sm)" />
      <path d="M204.5 122 C205.4 136 207 148 209.6 158" stroke="#8A5238" strokeOpacity="0.14" strokeWidth="2.6" fill="none" strokeLinecap="round" filter="url(#df-blur-sm)" />
      <path d="M199 124 C198.6 137 198 149 197.4 157" stroke="#FFF3E4" strokeOpacity="0.4" strokeWidth="1.8" fill="none" strokeLinecap="round" filter="url(#df-blur-xs)" />
      <ellipse cx="199.6" cy="160.6" rx="4.2" ry="3.4" fill="#FFF0DC" opacity="0.5" filter="url(#df-blur-xs)" />
      {/* nostril wings + base */}
      <path d="M190 160.5 C185.5 163 186.5 168 192.5 168" stroke="#8E5640" strokeOpacity="0.5" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M210 160.5 C214.5 163 213.5 168 207.5 168" stroke="#8E5640" strokeOpacity="0.5" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M192.5 168 C195.5 170.6 197.6 170.4 200 169.4 C202.4 170.4 204.5 170.6 207.5 168" stroke="#8E5640" strokeOpacity="0.42" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <ellipse cx="195.3" cy="167" rx="2.3" ry="1.2" fill="#4D281C" opacity="0.5" transform="rotate(-14 195.3 167)" />
      <ellipse cx="204.7" cy="167" rx="2.3" ry="1.2" fill="#4D281C" opacity="0.5" transform="rotate(14 204.7 167)" />
      {/* soft shadow cast under the nose tip */}
      <ellipse cx="201" cy="172.5" rx="8" ry="2.2" fill="#8A5238" opacity="0.2" filter="url(#df-blur-xs)" />

      {/* smile lines (nasolabial folds) */}
      <path d="M187 164 C180 170 177 177 178 183" stroke="#A8654C" strokeOpacity="0.28" strokeWidth="1.3" fill="none" strokeLinecap="round" filter="url(#df-blur-xs)" />
      <path d="M213 164 C220 170 223 177 222 183" stroke="#A8654C" strokeOpacity="0.28" strokeWidth="1.3" fill="none" strokeLinecap="round" filter="url(#df-blur-xs)" />

      {/* mouth — open, friendly smile */}
      <path d="M197 175 L197.4 180 M203 175 L202.6 180" stroke="#B07556" strokeOpacity="0.22" strokeWidth="1.2" />
      <g clipPath="url(#df-mouth-clip)">
        <rect x="176" y="178" width="48" height="18" fill="#5B1F22" />
        {/* teeth */}
        <path d="M183 183 C192 181.4 208 181.4 217 183 C213 189.4 207 191 200 191 C193 191 187 189.4 183 183 Z" fill="url(#df-teeth)" />
        <path d="M200 182 L200 190.5" stroke="#D8D0C4" strokeOpacity="0.7" strokeWidth="0.7" />
        <path d="M191.5 182.2 L192.2 189.6 M208.5 182.2 L207.8 189.6" stroke="#D8D0C4" strokeOpacity="0.45" strokeWidth="0.6" />
        <ellipse cx="200" cy="190.5" rx="9" ry="3" fill="#C26F68" opacity="0.8" />
      </g>
      {/* upper lip */}
      <path d="M178 181.6 C186 179 194 179.4 200 181.8 C206 179.4 214 179 222 181.6 C216 183 207 182.4 200 182.8 C193 182.4 184 183 178 181.6 Z" fill="#B95F57" />
      {/* lower lip */}
      <path d="M181 184 C187 192.6 194 194.8 200 194.8 C206 194.8 213 192.6 219 184 C213 191 206 192.6 200 192.6 C194 192.6 187 191 181 184 Z" fill="#D3827A" />
      <ellipse cx="200" cy="193.6" rx="6.4" ry="1.2" fill="#FFE4DA" opacity="0.5" />
      {/* mouth corners */}
      <path d="M178 181.6 C176.6 180.6 176.2 179.4 176.8 178.4" stroke="#A8654C" strokeOpacity="0.45" strokeWidth="1.1" fill="none" strokeLinecap="round" />
      <path d="M222 181.6 C223.4 180.6 223.8 179.4 223.2 178.4" stroke="#A8654C" strokeOpacity="0.45" strokeWidth="1.1" fill="none" strokeLinecap="round" />

      {/* analysis overlay */}
      <g className={`demo-landmarks ${scanned ? "demo-landmarks--on" : ""}`}>
        <path
          className="demo-box"
          d="M134 74 V50 H158 M242 50 H266 V74 M266 190 V216 H242 M158 216 H134 V190"
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
          <rect x="268" y="52" width="74" height="16" rx="8" fill="#0A1226" fillOpacity="0.8" stroke="#22D3EE" strokeOpacity="0.7" strokeWidth="0.8" />
          <circle cx="278" cy="60" r="2.4" fill="#22D3EE" />
          <text x="285" y="63.3" fontSize="8" fontWeight="600" fill="#E6FBFF" fontFamily="Inter, system-ui, sans-serif" letterSpacing="0.4">
            FACE · 98%
          </text>
        </g>
      </g>
    </svg>
  );
}
