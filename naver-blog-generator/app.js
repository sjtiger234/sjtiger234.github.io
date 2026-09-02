/* ==========================================================
   네이버 블로그 포스팅 생성기 — 클라이언트 전용 (서버/외부 전송 없음)
   ========================================================== */

/* ---------- 카테고리별 데이터 ---------- */

const CATEGORY_LABEL = { food: '맛집 후기', travel: '여행 후기', show: '공연 후기', product: '제품 사용 후기' };

// gemini-2.5-flash는 신규 사용자에게 더 이상 제공되지 않음(구글 API 404 안내 기준) — 최신 모델로 교체
const DEFAULT_AI_MODEL = 'gemini-3.6-flash';

const DEFAULT_SUBTITLES = {
  food:    ['첫인상과 웨이팅', '메뉴 소개', '맛 평가', '가격과 서비스'],
  travel:  ['첫인상', '코스와 동선', '포토스팟', '꿀팁과 정보'],
  show:    ['관람 전 준비', '공연 하이라이트', '연출과 배우', '관람 후 여운'],
  product: ['개봉과 첫인상', '주요 기능과 사용법', '장단점', '가격과 구매 정보'],
};

const INTRO_OPENERS = {
  food: [
    '{date}{companion} {place}에 다녀왔어요.',
    '요즘 {region}에서 화제라는 {place}, 드디어 방문했습니다.',
    '{companion} {place}을(를) 찾은 건 순전히 {keyword} 때문이었어요.',
    '{date} 저녁, {place}에서의 한 끼를 기록해봅니다.',
  ],
  travel: [
    '{date}{companion} {region} {place}로 떠났어요.',
    '오랜만에 {companion} 훌쩍 다녀온 {place}, 그 후기를 남겨봅니다.',
    '{keyword}을(를) 보러 {region} {place}까지 다녀왔습니다.',
    '{date}, {place}에서의 하루를 정리해봅니다.',
  ],
  show: [
    '{date}{companion} {place}에서 열린 공연을 보고 왔어요.',
    '오랫동안 기다려온 {keyword}, 드디어 {place}에서 만났습니다.',
    '{date} 저녁, {place} 공연장 후기를 남겨봅니다.',
    '{companion} {place}에서 잊지 못할 시간을 보냈어요.',
  ],
  product: [
    '{date} {place}을(를) 구매해서 써봤어요.',
    '요즘 관심 있게 보던 {place}, 드디어 구매했습니다.',
    '{keyword} 때문에 {place}을(를) 들이게 됐어요.',
    '{date}, {place} 사용 후기를 남겨봅니다.',
  ],
};

const INTRO_CLOSERS = {
  food: [
    '오늘은 그날의 메뉴와 분위기를 하나씩 정리해보려고 해요.',
    '방문 전 궁금했던 점들, 방문 후 느낀 점까지 순서대로 담아봅니다.',
    '아래 목차 순서대로 솔직한 후기를 남겨볼게요.',
    '과연 소문대로였을지, 아래 후기에서 하나씩 확인해보실까요?',
  ],
  travel: [
    '이번 코스와 꿀팁을 아래 순서대로 정리해봅니다.',
    '동선부터 포토스팟까지, 다녀온 순서대로 기록을 남겨봅니다.',
    '준비하시는 분들께 도움이 되길 바라며 상세히 적어봅니다.',
    '어떤 코스로 다녀왔는지 궁금하지 않으신가요? 아래에서 하나씩 풀어볼게요.',
  ],
  show: [
    '관람 전 준비부터 공연 후 여운까지 순서대로 남겨봅니다.',
    '스포일러는 최소화하되, 느낀 감정은 최대한 담아보려고 해요.',
    '아래 목차 순서대로 솔직한 관람 후기를 적어볼게요.',
    '실제로 본 소감이 어땠을지 궁금하시죠? 아래에서 자세히 남겨볼게요.',
  ],
  product: [
    '개봉기부터 실사용 느낌까지 순서대로 정리해봅니다.',
    '장단점을 최대한 솔직하게 담아보려고 해요.',
    '아래 목차 순서대로 사용 후기를 남겨볼게요.',
    '실제로 써보니 어땠을지 궁금하지 않으신가요? 아래에서 솔직하게 남겨볼게요.',
  ],
};

const CONNECTORS = ['', '', '그리고 ', '무엇보다 ', '특히 ', '게다가 ', '무엇보다도 ', '더불어 '];

const WRAPPERS = {
  food: [
    (x) => `${x}가 특히 인상적이었어요.`,
    (x) => `${x} 덕분에 만족도가 높았습니다.`,
    (x) => `${x}는 이 집의 시그니처처럼 느껴졌어요.`,
    (x) => `${x} 부분도 놓치지 말아야 할 포인트예요.`,
    (x) => `무엇보다 ${x}가 좋았습니다.`,
    (x) => `${x}라는 점에서 재방문 의사가 생겼어요.`,
  ],
  travel: [
    (x) => `${x}는 꼭 들러봐야 할 포인트였어요.`,
    (x) => `${x} 덕분에 여행이 한층 더 특별해졌습니다.`,
    (x) => `${x}를 보는 순간 카메라부터 꺼내게 됐어요.`,
    (x) => `${x}는 이번 여행의 하이라이트였습니다.`,
    (x) => `${x} 코스는 특히 기억에 남아요.`,
    (x) => `${x} 덕분에 발걸음이 가벼웠습니다.`,
  ],
  show: [
    (x) => `${x}는 특히 여운이 오래 남았어요.`,
    (x) => `${x} 덕분에 몰입도가 남달랐습니다.`,
    (x) => `${x} 장면에서는 소름이 돋았어요.`,
    (x) => `${x}는 이 공연의 백미였습니다.`,
    (x) => `${x}를 보며 박수가 절로 나왔어요.`,
    (x) => `${x} 연출은 다시 봐도 감탄스러울 것 같아요.`,
  ],
  product: [
    (x) => `${x} 부분이 특히 마음에 들었어요.`,
    (x) => `${x} 덕분에 만족도가 높았습니다.`,
    (x) => `${x}는 이 제품의 강점처럼 느껴졌어요.`,
    (x) => `${x} 부분은 아쉬운 점으로 남았습니다.`,
    (x) => `무엇보다 ${x}가 좋았어요.`,
    (x) => `${x}라는 점에서 구매를 잘했다는 생각이 들었습니다.`,
  ],
};

const SECTION_CLOSERS = {
  food: [
    '다음 방문 때는 다른 메뉴도 꼭 시켜보고 싶어요.',
    '전반적으로 기대 이상이었습니다.',
    '이 부분만으로도 방문할 이유는 충분했어요.',
  ],
  travel: [
    '다음 여행 코스에도 꼭 넣고 싶은 곳이에요.',
    '전체 일정 중에서도 손에 꼽히는 순간이었습니다.',
    '이 코스만으로도 방문할 가치는 충분했어요.',
  ],
  show: [
    '커튼콜까지 여운이 가시지 않았어요.',
    '다음 시즌에도 꼭 다시 보고 싶다는 생각이 들었습니다.',
    '이 장면 하나만으로도 관람할 가치는 충분했어요.',
  ],
  product: [
    '이 부분만으로도 구매할 이유는 충분했어요.',
    '전반적으로 기대 이상이었습니다.',
    '다음에 필요하면 같은 브랜드 제품을 또 고려하게 될 것 같아요.',
  ],
};

const RATING_TEXT = {
  food:    { 1: '아쉬운 점이 많이 남는 방문이었어요.', 2: '기대보다는 조금 아쉬웠습니다.', 3: '무난하게 즐길 만했어요.', 4: '만족스러운 방문이었어요, 다시 찾을 의향이 있습니다.', 5: '별 다섯 개를 아낌없이 주고 싶을 만큼 만족스러웠어요.' },
  travel:  { 1: '아쉬운 점이 많이 남는 여행이었어요.', 2: '기대보다는 조금 아쉬웠습니다.', 3: '무난하게 즐길 만했어요.', 4: '만족스러운 여행이었어요, 다시 찾을 의향이 있습니다.', 5: '별 다섯 개를 아낌없이 주고 싶을 만큼 만족스러웠어요.' },
  show:    { 1: '아쉬운 점이 많이 남는 관람이었어요.', 2: '기대보다는 조금 아쉬웠습니다.', 3: '무난하게 즐길 만했어요.', 4: '만족스러운 공연이었어요, 다음에도 찾을 의향이 있습니다.', 5: '별 다섯 개를 아낌없이 주고 싶을 만큼 만족스러웠어요.' },
  product: { 1: '아쉬운 점이 많이 남는 제품이었어요.', 2: '기대보다는 조금 아쉬웠습니다.', 3: '무난하게 쓸 만했어요.', 4: '만족스러운 제품이었어요, 재구매 의향이 있습니다.', 5: '별 다섯 개를 아낌없이 주고 싶을 만큼 만족스러웠어요.' },
};

const SUMMARY_CLOSERS = {
  food: ['다음에 또 방문하고 싶은 곳이에요.', '주변에도 자신 있게 추천할 만합니다.', '재방문 의사 100%예요.'],
  travel: ['다시 이곳을 찾게 될 것 같아요.', '여행 코스로 자신 있게 추천합니다.', '사진으로 다 담지 못한 여운이 남아요.'],
  show: ['여운이 가시지 않아 다음 공연도 예매를 고민 중이에요.', '주변에 꼭 추천하고 싶은 공연입니다.', '다시 봐도 좋을 것 같은 무대였어요.'],
  product: ['다음에 또 필요하면 재구매할 의향이 있어요.', '주변에도 자신 있게 추천할 만합니다.', '가격 대비 만족도가 높은 제품이었어요.'],
};

const SIGNOFF_POOL = {
  food: ['다음에도 맛있는 맛집 이야기로 찾아올게요 :)', '다음에도 재미있는 맛집 이야기로 찾아올게요 :)'],
  travel: ['다음에도 즐거운 여행 이야기로 찾아올게요 :)', '다음에도 재미있는 여행 이야기로 찾아올게요 :)'],
  show: ['다음에도 감동적인 공연 이야기로 찾아올게요 :)', '다음에도 재미있는 공연 이야기로 찾아올게요 :)'],
  product: ['다음에도 솔직한 제품 후기로 찾아올게요 :)', '다음에도 유용한 사용 후기로 찾아올게요 :)'],
};

const TAG_POOL = {
  food: ['맛집', '맛집추천', '맛집투어', '먹스타그램', '맛스타그램', '로컬맛집', '데이트코스', '맛집리뷰'],
  travel: ['여행', '국내여행', '여행스타그램', '여행에미치다', '여행코스', '당일치기', '주말여행', '여행추천'],
  show: ['공연', '공연후기', '문화생활', '공연추천', '주말나들이', '데이트코스', '콘서트후기', '전시후기'],
  product: ['제품리뷰', '내돈내산', '사용후기', '언박싱', '추천템', '가성비템', '내돈내산리뷰', '솔직후기'],
};

/* ---------- 상태 ---------- */

let state = {
  category: 'food',
  place: '', region: '', date: '', companion: '', rating: 0,
  keywordsRaw: '',
  extraTagsRaw: '',
  summaryText: '',
  photos: [],
  summaryNotes: '',
  nickname: '멋진 나그네',
  signoffText: '다음에도 재미있는 여행. 맛집. 공연 후기로 다시 찾아올께요.^^',
  chosenTitleIndex: 0,
  lastTitleOptions: [],
  aiEnabled: false,
  apiKey: '',
  aiModel: DEFAULT_AI_MODEL,
  analyzePhotos: true,
};

let lastAIJson = null;

function uid(prefix) { return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`; }

/* ---------- 사진 처리 (전체 공용 사진 풀) ---------- */

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

// 요즘 휴대폰 사진은 장당 5~15MB가 흔해서, 원본 그대로 여러 장(20~30장)을 메모리에
// 들고 있으면 브라우저가 느려지거나 탭이 죽을 수 있다. 그래서 등록 시점에 블로그
// 게시에 충분한 해상도(장변 1920px)로 한 번 줄여서 저장하고, 원본 바이트는 들고
// 있지 않는다. 화면 표시는 이보다 더 작은 별도 썸네일(THUMB_*)을 써서 가볍게 한다.
const MAIN_PHOTO_MAX_DIM = 1920;
const MAIN_PHOTO_QUALITY = 0.85;
const THUMB_MAX_DIM = 480;
const THUMB_QUALITY = 0.75;

// 사진을 한 장씩 읽을 때마다 renderPhotos()로 전체 목록을 다시 그리면, 이미 추가된
// 사진들까지 매번 다시 디코딩해야 해서 장수가 많을수록(예: 20장 이상) 기하급수적으로
// 느려지고 마치 멈춘 것처럼 보인다. 그래서 모든 파일을 다 읽은 뒤 딱 한 번만
// 렌더링한다. 진행 상황은 photoCount 텍스트로 안내한다.
async function addPhotos(fileList) {
  const allFiles = Array.from(fileList);
  const files = allFiles.filter((f) => f.type.startsWith('image/'));
  console.log(`[사진 추가 시작] 전달된 파일 ${allFiles.length}개 중 이미지로 인식된 파일 ${files.length}개`,
    allFiles.map((f) => ({ name: f.name, type: f.type, size: f.size })));
  if (files.length === 0) {
    if (allFiles.length > 0) flashStatus('선택하신 파일이 이미지 형식으로 인식되지 않았어요. (콘솔에 상세 로그를 남겼어요)');
    return;
  }
  const countEl = document.getElementById('photoCount');
  const newPhotos = [];
  let failed = 0;
  for (let i = 0; i < files.length; i++) {
    if (countEl) countEl.textContent = `사진 불러오는 중... (${i + 1}/${files.length})`;
    const file = files[i];
    try {
      const original = await readFileAsDataUrl(file);
      const dataUrl = await resizeImageForApi(original, MAIN_PHOTO_MAX_DIM, MAIN_PHOTO_QUALITY);
      const thumbDataUrl = await resizeImageForApi(original, THUMB_MAX_DIM, THUMB_QUALITY);
      newPhotos.push({ id: uid('photo'), name: file.name, dataUrl, thumbDataUrl, caption: '' });
    } catch (e) {
      failed++;
      console.error(`[사진 추가 실패] ${file.name}:`, e);
    }
  }
  state.photos.push(...newPhotos);
  renderPhotos();
  console.log(`[사진 추가 완료] 이번에 ${newPhotos.length}장 추가, 실패 ${failed}장, 전체 ${state.photos.length}장`);
  if (failed > 0) flashStatus(`사진 ${failed}장을 불러오지 못했어요. 파일 형식을 확인해주세요.`);
}

function removePhoto(photoId) {
  state.photos = state.photos.filter((p) => p.id !== photoId);
  renderPhotos();
}

function movePhoto(photoId, dir) {
  const idx = state.photos.findIndex((p) => p.id === photoId);
  const target = idx + dir;
  if (target < 0 || target >= state.photos.length) return;
  const [item] = state.photos.splice(idx, 1);
  state.photos.splice(target, 0, item);
  renderPhotos();
}

/* ---------- 렌더: 사진 목록 ---------- */

function renderPhotos() {
  const wrap = document.getElementById('photoThumbs');
  wrap.innerHTML = '';
  state.photos.forEach((p, pi) => {
    const t = document.createElement('div');
    t.className = 'photo-thumb';
    t.innerHTML = `
      <img src="${p.thumbDataUrl || p.dataUrl}" alt="${escapeAttr(p.name)}">
      <input type="text" class="caption-input" placeholder="캡션(선택)" value="${escapeAttr(p.caption)}">
      <div class="photo-thumb-actions">
        <button type="button" data-act="up">◀</button>
        <span>${pi + 1}</span>
        <button type="button" data-act="down">▶</button>
        <button type="button" data-act="del" class="danger">✕</button>
      </div>
    `;
    t.querySelector('.caption-input').oninput = (e) => { p.caption = e.target.value; };
    t.querySelector('[data-act="up"]').onclick = () => movePhoto(p.id, -1);
    t.querySelector('[data-act="down"]').onclick = () => movePhoto(p.id, 1);
    t.querySelector('[data-act="del"]').onclick = () => removePhoto(p.id);
    wrap.appendChild(t);
  });
  const countEl = document.getElementById('photoCount');
  if (countEl) countEl.textContent = state.photos.length ? `${state.photos.length}장 첨부됨` : '';
}

/* ---------- 유틸 ---------- */

function escapeHtml(str = '') {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function escapeAttr(str = '') {
  return escapeHtml(str).replace(/"/g, '&quot;');
}
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function splitBullets(text) {
  // 줄바꿈 기준으로만 나눈다. 문장 안의 쉼표(예: "위치, 운영시간, 입장료")까지
  // 잘라버리면 문장이 토막나므로 쉼표는 구분자로 쓰지 않는다.
  return text.split(/\n+/).map((s) => s.trim()).filter(Boolean);
}
function ensureTrailingPeriod(str) {
  const trimmed = (str || '').trim();
  if (!trimmed) return trimmed;
  return /[.!?…~]$/.test(trimmed) ? trimmed : trimmed + '.';
}
function ensureSentence(fragment, category) {
  const trimmed = fragment.trim();
  // 이미 문장처럼 길거나 한국어 종결어미로 끝나면 그대로 두고 마침표만 보정한다.
  // 짧은 키워드성 조각일 때만 정형 문구로 감싼다 (그래야 "~했는데" 같은 접속형 문장이
  // 엉뚱한 문구와 뒤섞여 깨지는 걸 막을 수 있다).
  const endsWithPunct = /[.!?…]$/.test(trimmed);
  const looksLikeSentence = trimmed.length >= 10
    || endsWithPunct
    || /(다|요|음|함|까|죠|네요|어요|아요|였다|했다|입니다|습니다)$/.test(trimmed.replace(/[.!?…]$/, ''));
  if (looksLikeSentence) {
    return endsWithPunct ? trimmed : trimmed + '.';
  }
  const wrapper = pick(WRAPPERS[category]);
  return wrapper(trimmed);
}
function splitIntoChunks(items, n) {
  if (n <= 0) return [];
  if (items.length === 0) return Array.from({ length: n }, () => []);
  const chunks = [];
  const base = Math.floor(items.length / n);
  let extra = items.length % n;
  let idx = 0;
  for (let i = 0; i < n; i++) {
    const size = base + (extra > 0 ? 1 : 0);
    if (extra > 0) extra--;
    chunks.push(items.slice(idx, idx + size));
    idx += size;
  }
  return chunks;
}
function nonEmptyArr(a) { return Array.isArray(a) && a.length > 0; }

function sectionSearchText(sec) {
  const parts = [sec.subtitle || ''];
  if (nonEmptyArr(sec.facts)) parts.push(sec.facts.map((f) => `${f.label} ${f.value}`).join(' '));
  if (nonEmptyArr(sec.list)) parts.push(sec.list.join(' '));
  if (nonEmptyArr(sec.paragraphs)) parts.push(sec.paragraphs.join(' '));
  return parts.join(' ');
}

// 사진 캡션에 적힌 단어가 소제목·본문에 등장하면 그 섹션에 우선 배치하고,
// 캡션이 없거나 일치하는 곳이 없는 사진은 남은 섹션에 균등하게 나눈다.
function groupPhotosByCaption(photos, sectionTexts) {
  const n = sectionTexts.length;
  if (n === 0) return [];
  const groups = Array.from({ length: n }, () => []);
  const leftover = [];
  photos.forEach((p) => {
    const caption = (p.caption || '').trim();
    if (!caption) { leftover.push(p); return; }
    const tokens = caption.split(/[\s,·.\/()~-]+/).filter((t) => t.length >= 2);
    let bestIdx = -1;
    let bestScore = 0;
    sectionTexts.forEach((text, i) => {
      const score = tokens.reduce((sum, t) => sum + (text.includes(t) ? 1 : 0), 0);
      if (score > bestScore) { bestScore = score; bestIdx = i; }
    });
    if (bestIdx >= 0) groups[bestIdx].push(p); else leftover.push(p);
  });
  const leftoverChunks = splitIntoChunks(leftover, n);
  leftoverChunks.forEach((chunk, i) => { groups[i] = groups[i].concat(chunk); });
  return groups;
}

function assignPhotosToSections(photos, sections) {
  const eligible = sections.map((sec, i) => (nonEmptyArr(sec.paragraphs) ? i : -1)).filter((i) => i >= 0);
  const targetIdxs = eligible.length ? eligible : sections.map((_, i) => i);
  const sectionTexts = targetIdxs.map((idx) => sectionSearchText(sections[idx]));
  const groups = groupPhotosByCaption(photos, sectionTexts);
  const result = sections.map(() => []);
  targetIdxs.forEach((idx, k) => { result[idx] = groups[k]; });
  return result;
}

/* ---------- 사진 실제 분석용 (Gemini 비전) ---------- */

const MAX_ANALYZE_PHOTOS = 30;

function pickPhotosForAnalysis(photos, max = MAX_ANALYZE_PHOTOS) {
  if (photos.length <= max) return photos;
  const step = photos.length / max;
  const picked = [];
  for (let i = 0; i < max; i++) picked.push(photos[Math.floor(i * step)]);
  return picked;
}

function resizeImageForApi(dataUrl, maxDim = 1024, quality = 0.82) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        const scale = maxDim / Math.max(width, height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

function dataUrlToInlinePart(dataUrl) {
  const match = dataUrl.match(/^data:([^;]+);base64,(.*)$/);
  return match ? { mimeType: match[1], data: match[2] } : null;
}

async function buildImagePartsForAnalysis(photos) {
  const selected = pickPhotosForAnalysis(photos);
  const resized = await Promise.all(selected.map((p) => resizeImageForApi(p.dataUrl)));
  return resized.map(dataUrlToInlinePart).filter(Boolean);
}

function buildSignatureLine(s) {
  return s.nickname.trim() ? `- ${s.nickname.trim()} -` : '';
}

// AI가 지침을 무시하고 자체 인사말("안녕하세요, ~입니다")을 문단 앞에 넣는 경우가 있어
// 도입부 첫 문장이 방문자가 바로 내용을 파악할 수 있는 정리된 문장으로 시작하도록 제거한다.
function stripDuplicateGreeting(paragraph) {
  return paragraph
    .replace(/^안녕하세요[!?,.~\s]*/, '')
    .replace(/^[^.!?\n]{0,20}(입니다|이에요|예요)\.?\s*/, '')
    .trim();
}

function finalizeIntro(s, introParas) {
  if (introParas.length === 0) return introParas;
  const firstCleaned = stripDuplicateGreeting(introParas[0]);
  return firstCleaned ? [firstCleaned, ...introParas.slice(1)] : introParas.slice(1);
}
function finalizeSummary(s, summarySentences) {
  const signoff = s.signoffText.trim() || pick(SIGNOFF_POOL[s.category]);
  const signature = buildSignatureLine(s);
  return signature ? [...summarySentences, signoff, signature] : [...summarySentences, signoff];
}

/* ---------- 제목 / 태그 생성 ---------- */

const MAX_TITLE_CHARS = 35;

function truncateTitle(title) {
  const t = (title || '').replace(/\s+/g, ' ').trim();
  if (t.length <= MAX_TITLE_CHARS) return t;
  const cut = t.slice(0, MAX_TITLE_CHARS);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 10 ? cut.slice(0, lastSpace) : cut).trim();
}

function buildTitleOptions(s) {
  const place = s.place || '이곳';
  const region = s.region ? `[${s.region}] ` : '';
  const kws = parseKeywords(s.keywordsRaw);
  const kw = kws[0] || CATEGORY_LABEL[s.category].replace(' 후기', '');
  const kw2 = kws[1] || '';
  const bank = {
    food: [
      `${region}${place}, 이래서 소문났나 봐요 (${kw})`,
      `${place} 찐후기 | ${kw}${kw2 ? ' & ' + kw2 : ''}`,
      `${(s.region || '').trim()} ${place}, 다시 가고 싶은 이유 (${kw})`.trim(),
    ],
    travel: [
      `${region}${place}, 여기 안 가면 후회해요`,
      `${(s.region || '').trim()} ${place} 찐후기 | ${kw} 완벽 코스`.trim(),
      `${place} 여행, ${kw} 놓치면 아까워요`,
    ],
    show: [
      `${region}${place}, 이 무대 실화인가요?`,
      `${place} 관람 후기 | ${kw}가 남긴 여운`,
      `${(s.region || '').trim()} ${place}, ${kw} 직접 보니`.trim(),
    ],
    product: [
      `${place}, 써보니 어땠을까요? (${kw})`,
      `${place} 찐사용기 | ${kw}${kw2 ? ' & ' + kw2 : ''}`,
      `${place} 리얼 장단점, 사기 전에 확인`,
    ],
  };
  return bank[s.category].map(truncateTitle);
}

function parseKeywords(raw) {
  return (raw || '').split(/[,，、]/).map((s) => s.trim()).filter(Boolean);
}

function buildTags(s) {
  const tags = new Set();
  const place = (s.place || '').replace(/\s+/g, '');
  if (place) tags.add(place);
  (s.region || '').split(/\s+/).filter(Boolean).forEach((t) => tags.add(t));
  parseKeywords(s.keywordsRaw).forEach((k) => tags.add(k.replace(/\s+/g, '')));
  parseKeywords(s.extraTagsRaw).forEach((k) => tags.add(k.replace(/\s+/g, '')));
  const basePool = TAG_POOL[s.category];
  let bi = 0;
  while (tags.size < 12 && bi < basePool.length) { tags.add(basePool[bi]); bi++; }
  return Array.from(tags).slice(0, 20);
}

/* ---------- 본문 생성 ---------- */

function buildCompanionPhrase(companion) {
  if (!companion) return '';
  return /와|과|랑|끼리|혼자/.test(companion) ? `${companion} ` : `${companion}와(과) `;
}

function buildDatePhrase(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return '';
  return `${d.getMonth() + 1}월 ${d.getDate()}일, `;
}

function defaultSubtitle(category, i) {
  return DEFAULT_SUBTITLES[category][i % DEFAULT_SUBTITLES[category].length] + (i >= DEFAULT_SUBTITLES[category].length ? ` ${i + 1}` : '');
}

function distributeIntoBlocks(items, photos) {
  const blocks = [];
  if (items.length === 0) {
    photos.forEach((p) => blocks.push({ type: 'photo', photo: p }));
    return blocks;
  }
  if (photos.length === 0) {
    items.forEach((t) => blocks.push({ type: 'text', text: t }));
    return blocks;
  }
  const gaps = photos.length + 1;
  const perGap = items.length / gaps;
  let idx = 0;
  let pIdx = 0;
  for (let g = 0; g < gaps; g++) {
    const end = g === gaps - 1 ? items.length : Math.round(perGap * (g + 1));
    for (; idx < end; idx++) blocks.push({ type: 'text', text: items[idx] });
    if (pIdx < photos.length) { blocks.push({ type: 'photo', photo: photos[pIdx] }); pIdx++; }
  }
  while (pIdx < photos.length) { blocks.push({ type: 'photo', photo: photos[pIdx] }); pIdx++; }
  return blocks;
}

function buildTemplateSections(s) {
  const category = s.category;
  const bullets = splitBullets(s.summaryText);
  const sectionCount = bullets.length === 0
    ? (s.photos.length > 0 ? 1 : 0)
    : Math.min(DEFAULT_SUBTITLES[category].length, Math.max(1, Math.ceil(bullets.length / 3)));
  if (sectionCount === 0) return [];
  const bulletChunks = splitIntoChunks(bullets, sectionCount);
  const sectionTexts = bulletChunks.map((chunk, i) => `${defaultSubtitle(category, i)} ${chunk.join(' ')}`);
  const photoChunks = groupPhotosByCaption(s.photos, sectionTexts);
  return bulletChunks.map((chunk, i) => {
    const subtitle = defaultSubtitle(category, i);
    const sentences = chunk.map((b, bi) => (bi === 0 ? '' : pick(CONNECTORS)) + ensureSentence(b, category));
    if (sentences.length > 0) sentences.push(pick(SECTION_CLOSERS[category]));
    return { subtitle, blocks: distributeIntoBlocks(sentences, photoChunks[i] || []) };
  }).filter((sec) => sec.blocks.length > 0);
}

function generatePost(s) {
  const category = s.category;
  const place = s.place || '이곳';
  const region = s.region || '';
  const kws = parseKeywords(s.keywordsRaw);
  const keyword = kws[0] || CATEGORY_LABEL[category].replace(' 후기', '');
  const companionPhrase = buildCompanionPhrase(s.companion);
  const datePhrase = buildDatePhrase(s.date);

  const opener = pick(INTRO_OPENERS[category])
    .replace('{date}', datePhrase)
    .replace('{companion}', companionPhrase || (category === 'food' ? '홀로 ' : ''))
    .replace('{place}', place)
    .replace('{region}', region || '요즘 핫한 동네')
    .replace('{keyword}', keyword)
    .replace(/^[,.\s]+/, '');
  const introParas = finalizeIntro(s, [opener.replace(/\s+/g, ' ').trim(), pick(INTRO_CLOSERS[category])]);

  const titleOptions = buildTitleOptions(s);
  state.lastTitleOptions = titleOptions;
  const title = titleOptions[Math.min(s.chosenTitleIndex, titleOptions.length - 1)];

  const builtSections = buildTemplateSections(s);

  const summaryBullets = splitBullets(s.summaryNotes);
  let summarySentences = summaryBullets.map((b, i) => (i === 0 ? '' : pick(CONNECTORS)) + ensureSentence(b, category));
  if (s.rating > 0) summarySentences.unshift(RATING_TEXT[s.category][s.rating]);
  summarySentences.push(pick(SUMMARY_CLOSERS[category]));
  summarySentences = finalizeSummary(s, summarySentences);

  const tags = buildTags(s);

  return { title, titleOptions, introParas, toc: builtSections.map((b) => b.subtitle), sections: builtSections, summarySentences, tags, rating: s.rating, source: 'template' };
}

/* ---------- AI(Gemini) 결과를 같은 구조로 합성 ---------- */

function composeFromAI(s, ai, sourceLabel = 'ai') {
  const category = s.category;

  const templateTitles = buildTitleOptions(s);
  const aiTitles = [ai.title, ...(Array.isArray(ai.titleAlternatives) ? ai.titleAlternatives : [])].filter(Boolean).map(truncateTitle);
  const titleOptions = Array.from(new Set([...aiTitles, ...templateTitles])).slice(0, 5);
  state.lastTitleOptions = titleOptions;
  const title = titleOptions[Math.min(s.chosenTitleIndex, titleOptions.length - 1)];

  const introParas = finalizeIntro(s, Array.isArray(ai.intro) && ai.intro.length
    ? ai.intro.filter(Boolean).map(ensureTrailingPeriod)
    : [pick(INTRO_OPENERS[category]).replace(/\{[a-z]+\}/g, '').replace(/\s+/g, ' ').trim(), pick(INTRO_CLOSERS[category])]);

  const aiSectionsRaw = Array.isArray(ai.sections)
    ? ai.sections.filter((sec) => sec && (nonEmptyArr(sec.facts) || nonEmptyArr(sec.list) || nonEmptyArr(sec.paragraphs)))
    : [];

  let builtSections;
  if (aiSectionsRaw.length > 0) {
    const photoChunks = assignPhotosToSections(s.photos, aiSectionsRaw);
    builtSections = aiSectionsRaw.map((aiSec, i) => {
      const subtitle = (aiSec.subtitle && aiSec.subtitle.trim()) || defaultSubtitle(category, i);
      const blocks = [];
      if (nonEmptyArr(aiSec.facts)) {
        const facts = aiSec.facts.filter((f) => f && f.label && f.value);
        if (facts.length) blocks.push({ type: 'infobox', facts });
      }
      if (nonEmptyArr(aiSec.list)) {
        const items = aiSec.list.filter(Boolean).map(ensureTrailingPeriod);
        if (items.length) blocks.push({ type: 'list', items });
      }
      const paragraphs = nonEmptyArr(aiSec.paragraphs) ? aiSec.paragraphs.filter(Boolean).map(ensureTrailingPeriod) : [];
      blocks.push(...distributeIntoBlocks(paragraphs, photoChunks[i] || []));
      return { subtitle, blocks };
    }).filter((sec) => sec.blocks.length > 0);
  } else {
    builtSections = buildTemplateSections(s);
  }

  let summarySentences;
  if (Array.isArray(ai.summary) && ai.summary.length) {
    summarySentences = ai.summary.filter(Boolean).map(ensureTrailingPeriod);
  } else {
    const bullets = splitBullets(s.summaryNotes);
    summarySentences = bullets.map((b, i) => (i === 0 ? '' : pick(CONNECTORS)) + ensureSentence(b, category));
    if (s.rating > 0) summarySentences.unshift(RATING_TEXT[s.category][s.rating]);
    summarySentences.push(pick(SUMMARY_CLOSERS[category]));
  }
  summarySentences = finalizeSummary(s, summarySentences);

  const templateTags = buildTags(s);
  const aiTags = Array.isArray(ai.tags) ? ai.tags.map((t) => String(t).replace(/^#/, '').replace(/\s+/g, '')).filter(Boolean) : [];
  const tags = Array.from(new Set([...aiTags, ...templateTags])).slice(0, 20);

  return { title, titleOptions, introParas, toc: builtSections.map((b) => b.subtitle), sections: builtSections, summarySentences, tags, rating: s.rating, source: sourceLabel };
}

/* ---------- 렌더: 미리보기 ---------- */

let lastPost = null;
let lastAISource = 'ai';

function renderPreview() {
  lastAIJson = null;
  const post = generatePost(state);
  renderPostToDom(post);
}

function renderAIPost(ai, sourceLabel = 'ai') {
  lastAISource = sourceLabel;
  const post = composeFromAI(state, ai, sourceLabel);
  renderPostToDom(post);
}

function renderBlockHtml(b, sectionSubtitle) {
  if (b.type === 'text') return `<p>${escapeHtml(b.text)}</p>`;
  if (b.type === 'infobox') {
    return `<dl class="info-box">${b.facts.map((f) => `<div class="info-row"><dt>${escapeHtml(f.label)}</dt><dd>${escapeHtml(f.value)}</dd></div>`).join('')}</dl>`;
  }
  if (b.type === 'list') {
    return `<ul class="content-list">${b.items.map((t) => `<li>${escapeHtml(t)}</li>`).join('')}</ul>`;
  }
  return `<figure><img src="${b.photo.dataUrl}" alt="${escapeAttr(sectionSubtitle)}"></figure>`;
}

function blockTextLength(b) {
  if (b.type === 'text') return b.text.length;
  if (b.type === 'infobox') return b.facts.reduce((sum, f) => sum + f.label.length + f.value.length, 0);
  if (b.type === 'list') return b.items.reduce((sum, t) => sum + t.length, 0);
  return 0;
}

function computeCharCount(post) {
  return post.introParas.join('').length
    + post.sections.reduce((sum, sec) => sum + sec.blocks.reduce((s2, b) => s2 + blockTextLength(b), 0), 0)
    + post.summarySentences.join('').length;
}

/* ---------- 네이버 SEO 체크리스트 ---------- */
/* 2026년 기준: 체류시간이 핵심 랭킹 요소가 되면서 본문 밀도(글자수)·직접 촬영
   사진 수·구조화(목차/기본정보)·궁금증 유발 문장 여부가 상위노출에 영향을 준다. */
const SEO_MIN_CHARS = 1500;
const SEO_IDEAL_MIN_CHARS = 2000;
const SEO_IDEAL_MAX_CHARS = 3000;
const SEO_MIN_PHOTOS = 6;

function buildSeoChecklist(post, s) {
  const charCount = computeCharCount(post);
  const items = [];

  if (charCount >= SEO_IDEAL_MIN_CHARS && charCount <= SEO_IDEAL_MAX_CHARS + 500) {
    items.push({ level: 'good', text: `본문 분량 ${charCount}자 — 상위 노출 글 평균(2,000~3,000자) 수준이에요.` });
  } else if (charCount >= SEO_MIN_CHARS) {
    items.push({ level: 'warn', text: `본문 분량 ${charCount}자 — 최소 기준(1,500자)은 넘었지만, 2,000~3,000자면 더 유리해요.` });
  } else {
    items.push({ level: 'bad', text: `본문 분량 ${charCount}자 — 최소 권장 기준(1,500자)에 못 미쳐요. 내용을 더 추가해보세요.` });
  }

  const photoCount = s.photos.length;
  if (photoCount >= SEO_MIN_PHOTOS) {
    items.push({ level: 'good', text: `직접 촬영 사진 ${photoCount}장 — 권장 기준(6장 이상)을 충족했어요.` });
  } else {
    items.push({ level: 'warn', text: `직접 촬영 사진 ${photoCount}장 — 6장 이상이면 D.I.A.+ 평가에 더 유리해요.` });
  }

  if (post.toc.length >= 2) {
    items.push({ level: 'good', text: `소제목 ${post.toc.length}개로 목차가 구성돼 있어요.` });
  } else {
    items.push({ level: 'warn', text: '소제목이 1개 이하예요. 내용을 2개 이상 섹션으로 나누면 구조화 평가에 유리해요.' });
  }

  const hasFactsBox = post.sections.some((sec) => sec.blocks.some((b) => b.type === 'infobox'));
  items.push(hasFactsBox
    ? { level: 'good', text: '기본 정보(주소·가격 등) 박스가 포함돼 있어요.' }
    : { level: 'warn', text: '기본 정보 박스가 없어요. 첫 소제목에 주소·가격 등 사실 정보를 추가하면 좋아요.' });

  const allText = [...post.introParas, ...post.sections.flatMap((sec) => sec.blocks.filter((b) => b.type === 'text').map((b) => b.text))].join(' ');
  items.push(/[?？]/.test(allText)
    ? { level: 'good', text: '궁금증을 유발하는 질문형 문장이 있어요 — 체류시간에 도움이 돼요.' }
    : { level: 'warn', text: '질문형 문장이 없어요. "~는 어땠을까요?" 같은 문장을 하나 넣으면 체류시간에 도움이 돼요.' });

  return items;
}

function renderSeoChecklist(post, s) {
  const el = document.getElementById('seoChecklist');
  if (!el) return;
  const items = buildSeoChecklist(post, s);
  const iconMap = { good: '✅', warn: '⚠️', bad: '❌' };
  el.hidden = false;
  el.innerHTML = `<div class="seo-title">📊 네이버 SEO 체크리스트 (이 글 기준)</div>`
    + items.map((it) => `<div class="seo-item seo-${it.level}"><span class="seo-icon">${iconMap[it.level]}</span><span>${escapeHtml(it.text)}</span></div>`).join('');
}

const MODE_INDICATOR_MAP = {
  'ai-researched': { text: '🔎 현재 결과: AI 검색·리서치 기반으로 작성됨', cls: 'mode-ai' },
  'ai': { text: '✨ 현재 결과: AI 다듬기 적용됨 (검색 없이 메모만 사용)', cls: 'mode-ai' },
  'claude-manual': { text: '🤖 현재 결과: Claude 붙여넣기 기반으로 작성됨', cls: 'mode-ai' },
  'template': { text: '📝 현재 결과: 규칙 기반 초안 (AI 미사용 — 정형 문구가 섞여 있어요)', cls: '' },
};

function updateModeIndicator(post) {
  const el = document.getElementById('modeIndicator');
  if (!el) return;
  const info = MODE_INDICATOR_MAP[post.source] || MODE_INDICATOR_MAP.template;
  el.textContent = info.text;
  el.className = 'mode-indicator' + (info.cls ? ' ' + info.cls : '');
}

function renderPostToDom(post) {
  lastPost = post;
  updateModeIndicator(post);
  const el = document.getElementById('previewArticle');

  const titleChoices = post.titleOptions.map((t, i) => `
    <label class="title-choice">
      <input type="radio" name="titleChoice" value="${i}" ${i === state.chosenTitleIndex ? 'checked' : ''}>
      <span>${escapeHtml(t)}</span>
    </label>`).join('');

  const tocHtml = post.toc.length
    ? `<div class="toc-box"><div class="toc-heading">- 목차 -</div><ol>${post.toc.map((t) => `<li>${escapeHtml(t)}</li>`).join('')}</ol></div>`
    : '';

  const sectionsHtml = post.sections.map((sec, i) => `
    <section class="post-section">
      <h2>${i + 1}. ${escapeHtml(sec.subtitle)}</h2>
      ${sec.blocks.map((b) => renderBlockHtml(b, sec.subtitle)).join('')}
    </section>
  `).join('');

  const stars = post.rating ? `<div class="stars">${'★'.repeat(post.rating)}${'☆'.repeat(5 - post.rating)}</div>` : '';

  const summaryHtml = `
    <section class="post-section">
      <h2>${post.sections.length + 1}. 총평</h2>
      ${stars}
      ${post.summarySentences.map((t) => `<p>${escapeHtml(t)}</p>`).join('')}
    </section>`;

  const tagsHtml = `<div class="tags-line">${post.tags.map((t) => `<span class="tag-chip">#${escapeHtml(t)}</span>`).join(' ')}</div>`;

  const sourceBadgeMap = {
    'ai-researched': '<span class="source-badge ai">🔎 AI 검색·리서치 기반 작성</span>',
    'ai': '<span class="source-badge ai">✨ AI 다듬기 적용 (검색 없음)</span>',
    'claude-manual': '<span class="source-badge ai">🤖 Claude 붙여넣기 기반</span>',
    'template': '<span class="source-badge">규칙 기반 초안</span>',
  };
  const sourceBadge = sourceBadgeMap[post.source] || sourceBadgeMap.template;

  const charCount = computeCharCount(post);
  renderSeoChecklist(post, state);

  el.innerHTML = `
    <div class="title-choices">${titleChoices}</div>
    <h1 class="post-title">${escapeHtml(post.title)}</h1>
    <div class="post-meta">${sourceBadge} ${escapeHtml(CATEGORY_LABEL[state.category])}${state.region ? ' · ' + escapeHtml(state.region) : ''}${state.date ? ' · ' + escapeHtml(state.date) : ''} · 본문 약 ${charCount}자</div>
    <div class="post-intro">${post.introParas.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}</div>
    ${tocHtml}
    ${sectionsHtml}
    ${summaryHtml}
    ${tagsHtml}
  `;

  el.querySelectorAll('input[name="titleChoice"]').forEach((r) => {
    r.onchange = (e) => {
      state.chosenTitleIndex = Number(e.target.value);
      if (lastAIJson) renderAIPost(lastAIJson, lastAISource); else renderPreview();
    };
  });
}

/* ---------- 내보내기 ---------- */

function buildPlainText(post) {
  const lines = [];
  lines.push(post.title, '');
  post.introParas.forEach((p) => lines.push(p));
  lines.push('');
  if (post.toc.length) {
    lines.push('- 목차 -');
    post.toc.forEach((t, i) => lines.push(`${i + 1}. ${t}`));
    lines.push('');
  }
  let photoCounter = 0;
  post.sections.forEach((sec, i) => {
    lines.push(`${i + 1}. ${sec.subtitle}`, '');
    sec.blocks.forEach((b) => {
      if (b.type === 'text') lines.push(b.text);
      else if (b.type === 'infobox') b.facts.forEach((f) => lines.push(`${f.label}: ${f.value}`));
      else if (b.type === 'list') b.items.forEach((t) => lines.push(`- ${t}`));
      else { photoCounter++; lines.push(`[사진 ${photoCounter}]`); }
    });
    lines.push('');
  });
  lines.push(`${post.sections.length + 1}. 총평`, '');
  if (post.rating) lines.push('★'.repeat(post.rating) + '☆'.repeat(5 - post.rating));
  post.summarySentences.forEach((p) => lines.push(p));
  lines.push('', post.tags.map((t) => `#${t}`).join(' '));
  return lines.join('\n');
}

function buildHtmlFragment(post) {
  const tocHtml = post.toc.length ? `<p style="text-align:center;"><b>- 목차 -</b></p><p>${post.toc.map((t, i) => `${i + 1}. ${escapeHtml(t)}`).join('<br>')}</p>` : '';
  const introHtml = post.introParas.map((p) => `<p>${escapeHtml(p)}</p>`).join('');
  const sectionsHtml = post.sections.map((sec, i) => `
    <h2>${i + 1}. ${escapeHtml(sec.subtitle)}</h2>
    ${sec.blocks.map((b) => {
      if (b.type === 'text') return `<p>${escapeHtml(b.text)}</p>`;
      if (b.type === 'infobox') return `<p>${b.facts.map((f) => `<b>${escapeHtml(f.label)}</b>: ${escapeHtml(f.value)}`).join('<br>')}</p>`;
      if (b.type === 'list') return `<p>${b.items.map((t) => `- ${escapeHtml(t)}`).join('<br>')}</p>`;
      return `<p><img src="${b.photo.dataUrl}" alt="${escapeAttr(sec.subtitle)}" style="max-width:100%;"></p>`;
    }).join('')}
  `).join('');
  const stars = post.rating ? `<p>${'★'.repeat(post.rating)}${'☆'.repeat(5 - post.rating)}</p>` : '';
  const summaryHtml = `<h2>${post.sections.length + 1}. 총평</h2>${stars}${post.summarySentences.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}`;
  const tagsHtml = `<p>${post.tags.map((t) => `#${escapeHtml(t)}`).join(' ')}</p>`;
  return `<h1>${escapeHtml(post.title)}</h1>${introHtml}${tocHtml}${sectionsHtml}${summaryHtml}${tagsHtml}`;
}

async function copyRich() {
  if (!lastPost) return;
  const html = buildHtmlFragment(lastPost);
  const text = buildPlainText(lastPost);
  try {
    if (window.ClipboardItem) {
      const item = new ClipboardItem({
        'text/html': new Blob([html], { type: 'text/html' }),
        'text/plain': new Blob([text], { type: 'text/plain' }),
      });
      await navigator.clipboard.write([item]);
    } else {
      await navigator.clipboard.writeText(text);
    }
    flashStatus('사진 포함 서식으로 복사했어요. 네이버 블로그 글쓰기 창에 붙여넣기(Ctrl+V) 해보세요.');
  } catch (err) {
    try {
      await navigator.clipboard.writeText(text);
      flashStatus('이 브라우저는 사진 포함 복사가 지원되지 않아 텍스트만 복사했어요.');
    } catch (e2) {
      flashStatus('복사에 실패했어요. 아래 텍스트를 직접 선택해 복사해주세요.');
    }
  }
}

async function copyPlain() {
  if (!lastPost) return;
  const text = buildPlainText(lastPost);
  try {
    await navigator.clipboard.writeText(text);
    flashStatus('텍스트만 복사했어요. 사진은 각 소제목 아래 썸네일에서 개별 저장해주세요.');
  } catch (e) {
    flashStatus('복사에 실패했어요. 아래 텍스트를 직접 선택해 복사해주세요.');
  }
}

function downloadHtml() {
  if (!lastPost) return;
  const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>${escapeHtml(lastPost.title)}</title></head><body>${buildHtmlFragment(lastPost)}</body></html>`;
  const blob = new Blob([html], { type: 'text/html' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${(state.place || 'naver-post').replace(/\s+/g, '_')}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

let statusTimer = null;
function flashStatus(msg, { persist = false } = {}) {
  const el = document.getElementById('statusMsg');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(statusTimer);
  if (!persist) statusTimer = setTimeout(() => el.classList.remove('show'), 4000);
}

/* ---------- 임시 저장 (텍스트만, 사진 제외) ---------- */

const DRAFT_KEY = 'naver-blog-generator-draft-v2';

function saveDraft() {
  const draft = {
    category: state.category, place: state.place, region: state.region, date: state.date,
    companion: state.companion, rating: state.rating, keywordsRaw: state.keywordsRaw,
    extraTagsRaw: state.extraTagsRaw, summaryText: state.summaryText, summaryNotes: state.summaryNotes,
    nickname: state.nickname, signoffText: state.signoffText,
  };
  try { localStorage.setItem(DRAFT_KEY, JSON.stringify(draft)); } catch (e) { /* 용량 초과 등은 무시 */ }
}

function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return false;
    const draft = JSON.parse(raw);
    Object.assign(state, draft);
    return true;
  } catch (e) { return false; }
}

/* ---------- AI(Gemini) 연동 ---------- */

const AI_SETTINGS_KEY = 'naver-blog-generator-ai-settings-v1';

function saveAISettings() {
  try {
    localStorage.setItem(AI_SETTINGS_KEY, JSON.stringify({
      aiEnabled: state.aiEnabled, apiKey: state.apiKey, aiModel: state.aiModel, analyzePhotos: state.analyzePhotos,
    }));
  } catch (e) { /* 용량 초과 등은 무시 */ }
}

function loadAISettings() {
  try {
    const raw = localStorage.getItem(AI_SETTINGS_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (typeof saved.aiEnabled === 'boolean') state.aiEnabled = saved.aiEnabled;
    if (typeof saved.apiKey === 'string') state.apiKey = saved.apiKey;
    if (typeof saved.aiModel === 'string' && saved.aiModel) {
      // 예전 기본값(gemini-2.5-flash)이 저장돼 있으면 최신 기본 모델로 자동 승격
      state.aiModel = saved.aiModel === 'gemini-2.5-flash' ? DEFAULT_AI_MODEL : saved.aiModel;
    }
    if (typeof saved.analyzePhotos === 'boolean') state.analyzePhotos = saved.analyzePhotos;
  } catch (e) { /* 무시 */ }
}

function summarizeInput(s) {
  return {
    category: CATEGORY_LABEL[s.category],
    place: s.place || null,
    region: s.region || null,
    date: s.date || null,
    companion: s.companion || null,
    rating: s.rating || null,
    keywords: parseKeywords(s.keywordsRaw),
    overallNotes: splitBullets(s.summaryText),
    photoCount: s.photos.length,
    photoCaptions: s.photos.map((p) => p.caption.trim()).filter(Boolean),
    finalThoughts: splitBullets(s.summaryNotes),
  };
}

const WRITING_PRINCIPLES = `- 광고성 과장 표현("무조건 강추", "인생 맛집" 남발 등)과 이모지 남발을 피하고, 담백하고 자연스러운 문체로 쓸 것
- 지역·장소명·키워드를 억지스럽지 않게 자연스럽게 본문에 녹여 검색 노출에 도움이 되도록 할 것
- title(제목)은 핵심 키워드(장소명·제품명 등)를 앞쪽에 배치해 검색에 잘 걸리면서, 동시에 궁금증을 유발하거나 시선을 확 끄는 문구로 쓸 것. "무조건 강추", "인생템", "역대급" 같은 과장 광고 문구는 피하고, 반드시 공백 포함 35자를 넘지 않을 것. titleAlternatives도 같은 기준으로 2개 더 제안할 것
- 2026년 네이버 검색은 체류시간을 핵심 랭킹 요소로 본다. 본문(도입부+섹션+총평 합산) 분량은 최소 1,500자 이상, 가능하면 2,000~3,000자를 목표로 쓸 것. 취재 노트와 overallNotes가 풍부하면 소제목을 6~9개까지 늘려 실제 파워블로거의 후기처럼 충실하고 상세하게 쓰고, 정보가 적으면 2~4개 정도로 간결하게 쓸 것
- 글 전체에 "~는 어땠을까요?", "~가 궁금하지 않으신가요?" 같은 궁금증을 유발하는 질문형 문장을 최소 1개는 자연스럽게 포함시켜서, 읽는 사람이 답을 확인하려고 끝까지 스크롤하게 만들 것 (억지스럽게 여러 번 넣지 말고 자연스러운 곳에 한두 번만)
- 첫 소제목은 가능하면 "기본 정보"에 해당하는 섹션으로 구성해서, 그 섹션의 facts 필드에 확인된 사실을 key-value로 정리할 것 — 맛집/여행/공연은 주소·전화번호·영업시간/공연일시·가격·정기휴무 등, 제품은 제품명·모델명·가격·주요 스펙(사양)·구성품·제조사/판매처 등. 확인된 사실이 없으면 이 섹션은 생략할 것
- 가능하면 장소·인물·단체의 배경(이력, 유명해진 계기, 역사 등)을 다루는 소제목을 하나 포함할 것 (취재 노트에 근거가 있을 때만. 근거 없이 지어내지 말 것)
- 코스 옵션, 프로그램/세트리스트, 방문 팁처럼 목록으로 정리하는 게 자연스러운 내용은 해당 섹션의 list 필드에 배열로 담을 것. 항목이 "용량/구간/단계"처럼 이름과 설명으로 나뉘는 내용이면 "이름 : 설명 문장." 형식(콜론 앞뒤 띄어쓰기, 끝에 마침표)으로 한 항목씩 작성할 것
- intro, paragraphs, summary, list의 모든 항목은 예외 없이 마침표(.)로 끝나야 한다. 마침표나 물음표·느낌표 없이 문장이 끝나는 경우가 없도록 마지막에 반드시 마침표를 찍을 것
- 섹션당 문단(paragraphs)은 2~4개, 문단당 2~4문장 정도로, 취재된 실제 정보(주소·영업시간·가격대·메뉴명·특징 등)를 구체적으로 담아 밀도 있게 쓸 것
- photoCount는 실제 사진 배치를 위한 참고용 숫자일 뿐이니, 본문에서 "사진 1", "위 사진처럼" 같은 표현은 쓰지 말 것
- photoCaptions는 사용자가 실제로 찍은 사진에 붙인 설명이다. 이 목록에 나온 소재(예: "은각사 입구", "정원 풍경")는 관련 있는 소제목의 본문에서 최소 한 번씩 구체적으로 언급해서, 나중에 그 사진이 해당 문단 옆에 자동 배치됐을 때 내용과 사진이 자연스럽게 맞아떨어지도록 할 것. 캡션은 "어디를 찍은 사진인지"에 대한 힌트일 뿐이니, 그 자체를 문장에 그대로 베끼지 말고 실제 관찰한 내용과 엮어서 풀어 쓸 것
- intro(도입부)의 첫 문장은 "안녕하세요", "~입니다/~이에요" 같은 인사말·자기소개로 시작하지 말 것. 방문자가 글을 열자마자 무엇에 대한 글인지 바로 파악할 수 있도록, 언제·어디서·무엇을 했는지가 드러나는 정리된 문장으로 곧바로 시작할 것 (예: "{장소}에 다녀왔어요", "{제품}을 구매해서 써봤어요" 같은 형태). 자기소개·서명은 시스템이 글 맨 끝에 별도로 붙이므로 intro에는 넣지 말 것
- [사진 분석, 중요] 이 메시지에 실제 사진이 첨부되어 있다면, 사진 한 장 한 장을 캡션과 함께 꼼꼼히 관찰해서 그 사진이 걸리는 소제목의 본문에 구체적으로 반영할 것. "예뻤어요", "분위기가 좋았어요" 같은 뭉뚱그린 표현 대신, 실제로 눈에 보이는 구체적인 요소(정확한 색상·재질, 담긴 음식/사물의 종류와 개수, 구도, 글자·간판 내용, 인테리어 디테일, 날씨·조명, 사람들의 표정·동작 등)를 최소 한두 가지는 짚어서 묘사할 것. 캡션과 사진 내용이 서로 다른 것을 가리키면(예: 캡션은 "정원"인데 사진은 실내) 사진에서 실제로 보이는 대로 우선해서 쓸 것. 사진이 첨부되지 않았거나 특정 소제목과 관련 없는 사진의 내용은 그 소제목에서 지어내지 말 것
- [가장 중요, 반드시 지킬 것] 모든 문장은 예외 없이 "~요/~어요/~았어요/~였어요"(해요체) 또는 "~습니다/~입니다/~였습니다"(합쇼체)로 끝나야 한다. "~다."로 끝나는 문장(반말 서술체, 평서체)은 단 한 문장도 있으면 안 된다.
  절대 쓰면 안 되는 종결: "~였다.", "~했다.", "~있다.", "~없다.", "~한다.", "~된다.", "~같다.", "~이다.", "~보인다.", "~들었다.", "~났다.", "~간직하고 있다.", "~평가받는다.", "~이어진다.", "~붙었다고 한다."
  반드시 이렇게 바꿀 것(예시): "다녀온 적이 있다." → "다녀온 적이 있어요.” / "남아 있다." → "남아 있어요." / "지쇼지다." → "지쇼지예요." / "이동했다." → "이동했어요." / "올라가야 한다." → "올라가야 해요." / "지루하지 않았다." → "지루하지 않았어요." / "목조 건물이다." → "목조 건물이에요." / "들었다." → "들었어요." / "조용했다." → "조용했어요." / "좋았다." → "좋았어요." / "나온다." → "나와요." / "이어진다." → "이어져요." / "곳이다." → "곳이에요." / "들었다." → "들었어요."
  문장을 다 쓴 뒤, 마지막 글자가 "다."로 끝나는 문장이 하나라도 있는지 스스로 다시 확인하고, 있다면 전부 "~요/~습니다"체로 고쳐서 최종 답변에는 절대 남기지 말 것. 실제 파워블로거 글(예: "어제 ~보고 왔어요. ~빛이 났습니다.")은 처음부터 끝까지 이 존댓말체로만 쓰여 있다.
  단, 한쪽으로 치우치면 안 된다. "~요/~어요"체와 "~습니다/~입니다"체를 전체 글에서 대략 반반 정도 비율로, 두세 문장마다 자연스럽게 번갈아 섞어서 리듬감 있게 쓸 것 — "~요"만 계속 이어지거나 "~습니다"만 계속 이어지지 않도록 할 것.`;

function buildResearchPrompt(s) {
  const input = summarizeInput(s);
  return `당신은 네이버 블로그에 올릴 ${CATEGORY_LABEL[s.category]}를 위해 취재하는 리서처입니다. 구글 검색으로 아래 장소/공연에 대한 실제 정보를 최대한 찾아서 정리해주세요.

찾아야 할 정보 (해당되는 것만, "기본 정보" 박스에 쓸 수 있도록 최대한 정확한 값으로):
- 정확한 위치/주소, 전화번호, 가는 법, 영업시간·정기휴무(또는 공연 일시), 가격대·티켓 가격
- 대표 메뉴/시그니처, 웨이팅 여부 (맛집) / 코스, 입장료, 추천 동선, 주변 명소 (여행) / 러닝타임, 캐스팅, 공연장 정보, 관람 포인트 (공연) / 정확한 제품명·모델명, 가격, 주요 스펙(사양), 구성품, 제조사·공식 판매처 (제품)
- 관련 인물·단체·브랜드의 배경 (셰프/연주자/극단/제조사 등의 이력, 유명해진 계기, 수상 경력, 방송 출연 등)
- 최근 방문객·관람객·구매자들의 공통적인 평가나 특징
- 사용자가 직접 남긴 아래 메모(실제 경험, overallNotes)

사용자 입력 정보:
${JSON.stringify(input, null, 2)}

검색으로 확인되지 않는 내용은 추측해서 지어내지 말고, 확인된 사실과 사용자 메모만으로 정리하세요. 결과는 JSON이 아닌 자유로운 한국어 텍스트로, 섹션 구분 없이 취재 노트 형태로 최대한 상세하게 작성해주세요 (이 노트 자체는 나중에 요약될 재료이니 길어도 괜찮습니다).`;
}

function buildRestructurePrompt(s, researchNotes) {
  const input = summarizeInput(s);
  return `당신은 네이버 블로그에 ${CATEGORY_LABEL[s.category]}를 올리는 블로거입니다. 아래 "취재 노트"와 "사용자 입력 정보"를 바탕으로 실제 경험을 진솔하고 밀도 있게 전달하는 한국어 블로그 글을 작성해주세요.

작성 원칙:
${WRITING_PRINCIPLES}
- 취재 노트에 없는 내용은 지어내지 말 것

취재 노트:
"""
${researchNotes}
"""

사용자 입력 정보:
${JSON.stringify(input, null, 2)}

아래 JSON 형식으로만, 다른 설명 없이 응답하세요:
{
  "title": "네이버 검색 노출과 클릭을 동시에 노리는, 시선을 끄는 제목 (공백 포함 반드시 35자 이내)",
  "titleAlternatives": ["대체 제목1", "대체 제목2"],
  "intro": ["도입부 문단1"],
  "sections": [
    { "subtitle": "기본 정보", "facts": [{"label": "주소", "value": "..."}, {"label": "영업시간", "value": "..."}] },
    { "subtitle": "소제목", "paragraphs": ["문단1", "문단2", "문단3"] },
    { "subtitle": "소제목", "list": ["항목1", "항목2"], "paragraphs": ["문단1"] }
  ],
  "summary": ["총평 문단1", "총평 문단2"],
  "tags": ["태그1", "태그2"]
}
(facts/list는 해당 내용이 있을 때만 넣고, 없으면 필드 자체를 생략하세요)

다시 한번 강조합니다: 답변에 있는 모든 문장은 "~요/~습니다"체로 끝나야 하고 "~다."로 끝나는 문장은 절대 없어야 합니다. 이 대화에 이전 답변이 남아있다면 그 답변의 말투는 무시하고, 지금 이 지침을 우선해서 새로 작성해주세요.`;
}

function buildFallbackJsonPrompt(s) {
  const input = summarizeInput(s);
  return `당신은 네이버 블로그에 ${CATEGORY_LABEL[s.category]}를 올리는 블로거입니다. 아래 JSON 정보를 바탕으로 실제 경험을 진솔하게 전달하는 한국어 블로그 글을 작성해주세요.

작성 원칙:
${WRITING_PRINCIPLES}
- 입력에 없는 구체적 사실(가격, 시간, 메뉴명 등)을 지어내지 말 것

입력 정보:
${JSON.stringify(input, null, 2)}

아래 JSON 형식으로만, 다른 설명 없이 응답하세요:
{
  "title": "네이버 검색 노출과 클릭을 동시에 노리는, 시선을 끄는 제목 (공백 포함 반드시 35자 이내)",
  "titleAlternatives": ["대체 제목1", "대체 제목2"],
  "intro": ["도입부 문단1"],
  "sections": [
    { "subtitle": "기본 정보", "facts": [{"label": "주소", "value": "..."}, {"label": "영업시간", "value": "..."}] },
    { "subtitle": "소제목", "paragraphs": ["문단1", "문단2", "문단3"] },
    { "subtitle": "소제목", "list": ["항목1", "항목2"], "paragraphs": ["문단1"] }
  ],
  "summary": ["총평 문단1", "총평 문단2"],
  "tags": ["태그1", "태그2"]
}
(facts/list는 해당 내용이 있을 때만 넣고, 없으면 필드 자체를 생략하세요)

다시 한번 강조합니다: 답변에 있는 모든 문장은 "~요/~습니다"체로 끝나야 하고 "~다."로 끝나는 문장은 절대 없어야 합니다. 이 대화에 이전 답변이 남아있다면 그 답변의 말투는 무시하고, 지금 이 지침을 우선해서 새로 작성해주세요.`;
}

function buildClaudePrompt(s) {
  const input = summarizeInput(s);
  return `당신은 네이버 블로그에 ${CATEGORY_LABEL[s.category]}를 올리는 블로거입니다. 아래 정보를 바탕으로 실제 경험을 진솔하고 상세하게 전달하는 한국어 블로그 글을 작성해주세요.

웹 검색이 가능하다면, 아래 장소·공연·인물에 대한 실제 정보(정확한 주소, 전화번호, 영업시간·공연일시, 가격, 관련 인물·단체의 이력 등)를 찾아서 반영해주세요. 검색이 불가능한 상황이라면 확인되지 않은 구체적 사실은 지어내지 말고 아래 입력 정보만으로 작성하세요.

이 대화에 사진 파일이 함께 첨부되어 있다면 반드시 한 장씩 직접 살펴보고, 아래 입력 정보의 photoCaptions와 대조해서 각 사진이 어느 소제목에 해당하는지 파악한 뒤, 사진에 실제로 보이는 내용을 그 소제목에 구체적이고 사실적으로 녹여서 써주세요.

작성 원칙:
${WRITING_PRINCIPLES}

입력 정보:
${JSON.stringify(input, null, 2)}

아래 JSON 형식으로 응답해주세요 (코드블록으로 감싸도 되고, 앞뒤에 설명을 조금 덧붙여도 괜찮습니다. JSON 부분만 정확한 형식이면 됩니다):
{
  "title": "네이버 검색 노출과 클릭을 동시에 노리는, 시선을 끄는 제목 (공백 포함 반드시 35자 이내)",
  "titleAlternatives": ["대체 제목1", "대체 제목2"],
  "intro": ["도입부 문단1"],
  "sections": [
    { "subtitle": "기본 정보", "facts": [{"label": "주소", "value": "..."}, {"label": "영업시간", "value": "..."}] },
    { "subtitle": "소제목", "paragraphs": ["문단1", "문단2", "문단3"] },
    { "subtitle": "소제목", "list": ["항목1", "항목2"], "paragraphs": ["문단1"] }
  ],
  "summary": ["총평 문단1", "총평 문단2"],
  "tags": ["태그1", "태그2"]
}
(facts/list는 해당 내용이 있을 때만 넣고, 없으면 필드 자체를 생략하세요)

다시 한번 강조합니다: 답변에 있는 모든 문장은 "~요/~습니다"체로 끝나야 하고 "~다."로 끝나는 문장은 절대 없어야 합니다. 이 대화에 이전 답변이 남아있다면 그 답변의 말투는 무시하고, 지금 이 지침을 우선해서 새로 작성해주세요.`;
}

async function copyClaudePrompt() {
  const prompt = buildClaudePrompt(state);
  try {
    await navigator.clipboard.writeText(prompt);
    flashStatus('클로드용 프롬프트를 복사했어요. claude.ai(또는 이 대화창)에 붙여넣고 답변을 받아온 뒤, 아래 칸에 붙여넣고 "가져오기"를 눌러주세요.', { persist: true });
  } catch (e) {
    flashStatus('복사에 실패했어요. 브라우저 권한을 확인해주세요.');
  }
}

function importClaudeResult() {
  const raw = document.getElementById('claudeResultInput').value.trim();
  if (!raw) {
    flashStatus('붙여넣은 내용이 없어요. 클로드의 답변 전체를 붙여넣어 주세요.', { persist: true });
    return;
  }
  try {
    const json = parseAIJson(raw);
    lastAIJson = json;
    renderAIPost(json, 'claude-manual');
    flashStatus('클로드 답변을 가져와서 반영했어요. 사진 배치와 내용을 확인해주세요.');
    scrollToPreview();
  } catch (err) {
    flashStatus(`가져오기에 실패했어요: ${err.message}. 클로드 답변에 있는 JSON 부분이 잘리지 않았는지 확인해주세요.`, { persist: true });
  }
}

async function callGeminiApi(apiKey, model, prompt, { useSearch = false, jsonMode = false, images = [] } = {}) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  const parts = [{ text: prompt }, ...images.map((img) => ({ inline_data: { mime_type: img.mimeType, data: img.data } }))];
  const body = {
    contents: [{ role: 'user', parts }],
    generationConfig: { temperature: 0.9, maxOutputTokens: 8192 },
  };
  if (jsonMode) body.generationConfig.responseMimeType = 'application/json';
  if (useSearch) body.tools = [{ google_search: {} }];

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let detail = '';
    try { detail = (await res.json()).error?.message || ''; } catch (e) { /* 무시 */ }
    if (res.status === 401 && apiKey.trim().startsWith('AQ.')) {
      throw new Error('구글이 최근 발급하는 "AQ."로 시작하는 새 형식 API 키가 현재 구글 쪽 버그로 REST 요청을 거부하고 있어요(다수 보고된 알려진 이슈). 이 도구의 문제가 아니라 구글 쪽에서 해결해야 하는 문제입니다. AI Studio에서 Standard 키가 있는지 확인하거나, 다른 프로젝트로 새로 발급해보세요.');
    }
    throw new Error(`Gemini API 오류 (${res.status})${detail ? ': ' + detail : ''}`);
  }
  const data = await res.json();
  const text = (data.candidates?.[0]?.content?.parts || []).map((p) => p.text || '').join('');
  if (!text) throw new Error('Gemini 응답이 비어있어요.');
  const queries = data.candidates?.[0]?.groundingMetadata?.webSearchQueries || [];
  return { text, queries };
}

function parseAIJson(raw) {
  let text = raw.trim();
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) text = fence[1].trim();
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('AI 응답 형식을 이해할 수 없어요.');
  return JSON.parse(text.slice(start, end + 1));
}

async function generateWithAI() {
  const btn = document.getElementById('generateBtn');
  const original = btn.textContent;
  btn.disabled = true;
  const model = state.aiModel || DEFAULT_AI_MODEL;

  try {
    let images = [];
    if (state.analyzePhotos && state.photos.length) {
      btn.textContent = '📷 사진 분석 준비 중...';
      flashStatus('사진을 분석용으로 준비하고 있어요...');
      images = await buildImagePartsForAnalysis(state.photos);
    }

    btn.textContent = '🔎 관련 정보 검색 중...';
    flashStatus('구글 검색으로 관련 정보를 찾고 있어요. 잠시만 기다려주세요...');
    const research = await callGeminiApi(state.apiKey, model, buildResearchPrompt(state), { useSearch: true });

    btn.textContent = '✨ 글로 정리하는 중...';
    flashStatus('찾은 정보를 바탕으로 글을 정리하고 있어요...');
    const restructured = await callGeminiApi(state.apiKey, model, buildRestructurePrompt(state, research.text), { jsonMode: true, images });
    const json = parseAIJson(restructured.text);
    lastAIJson = json;
    renderAIPost(json, 'ai-researched');
    const q = research.queries;
    flashStatus(`AI가 검색 정보를 반영해 글을 작성했어요${q.length ? ` (검색어: ${q.slice(0, 3).join(', ')})` : ''}. 사실관계는 꼭 한 번 더 확인해주세요.`);
    return;
  } catch (searchErr) {
    // 검색 연동 실패 시, 검색 없이 메모만으로 다듬기를 시도
    try {
      btn.textContent = '✨ AI가 다듬는 중...';
      flashStatus('검색 연동에 실패해 메모 기반으로 다듬고 있어요...');
      const images = (state.analyzePhotos && state.photos.length) ? await buildImagePartsForAnalysis(state.photos) : [];
      const fallback = await callGeminiApi(state.apiKey, model, buildFallbackJsonPrompt(state), { jsonMode: true, images });
      const json = parseAIJson(fallback.text);
      lastAIJson = json;
      renderAIPost(json, 'ai');
      flashStatus(`검색 없이 메모만으로 문장을 다듬었어요. (검색 실패 사유: ${searchErr.message})`, { persist: true });
    } catch (fallbackErr) {
      lastAIJson = null;
      renderPreview();
      flashStatus(`⚠️ AI 다듬기에 실패해 규칙 기반 초안을 표시했어요. (${fallbackErr.message})`, { persist: true });
    }
  } finally {
    btn.disabled = false;
    btn.textContent = original;
  }
}

/* ---------- 예시 불러오기 ---------- */

const EXAMPLE = {
  category: 'food', place: '을지로 화로구이', region: '서울 을지로', date: '', companion: '친구와',
  rating: 5, keywordsRaw: '노포 감성, 숯불구이, 가성비',
  summaryText: '평일 저녁 7시 웨이팅 10분\n허름한 골목 안 노포 느낌 그대로, 테이블은 4개뿐\n대패삼겹살과 목살 세트 주문, 연탄 화로에 직접 구워 먹는 방식\n밑반찬으로 나온 파채무침이 은근 중독적\n고기 질이 좋아서 잡내 없이 고소함, 불맛이 확실히 살아있음\n마무리로 먹은 계란찜도 맛있었음',
  summaryNotes: '2인 기준 4만원대로 가성비 훌륭\n사장님이 친절하고 셀프바가 잘 갖춰져 있음',
};

function loadExample() {
  Object.assign(state, EXAMPLE, { chosenTitleIndex: 0, photos: state.photos });
  syncFormFromState();
  renderPreview();
  saveDraft();
}

// 닉네임·서명 문구·AI 설정(API 키 등)은 유지한 채, 이번 포스팅 입력 내용만 비운다.
// 매번 API 키를 다시 입력하지 않고도 새 글을 빠르게 시작할 수 있도록 하기 위함.
const BLANK_POST_CONTENT = {
  category: 'food',
  place: '', region: '', date: '', companion: '', rating: 0,
  keywordsRaw: '',
  extraTagsRaw: '',
  summaryText: '',
  summaryNotes: '',
  chosenTitleIndex: 0,
  lastTitleOptions: [],
};

function resetPostContent() {
  Object.assign(state, BLANK_POST_CONTENT, { photos: [] });
  lastAIJson = null;
  lastPost = null;
  syncFormFromState();
  document.getElementById('previewArticle').innerHTML = '';
  document.getElementById('seoChecklist').hidden = true;
  document.getElementById('modeIndicator').textContent = '';
  document.getElementById('modeIndicator').className = 'mode-indicator';
  document.getElementById('claudeResultInput').value = '';
  saveDraft();
  if (window.innerWidth <= 900) switchMobileTab('form');
}

/* ---------- 폼 <-> 상태 동기화 ---------- */

const FIELD_LABELS = {
  food:    { place: '상호명 / 장소명', region: '지역', placePlaceholder: '예) 을지로 화로구이', regionPlaceholder: '예) 서울 을지로' },
  travel:  { place: '상호명 / 장소명', region: '지역', placePlaceholder: '예) 은각사', regionPlaceholder: '예) 일본 교토' },
  show:    { place: '상호명 / 장소명', region: '지역', placePlaceholder: '예) 구리아트홀', regionPlaceholder: '예) 경기 구리' },
  product: { place: '제품명', region: '브랜드 / 구매처', placePlaceholder: '예) 무선청소기 XY-100', regionPlaceholder: '예) OO전자, 쿠팡' },
};

function updateFieldLabels() {
  const labels = FIELD_LABELS[state.category] || FIELD_LABELS.food;
  document.getElementById('placeLabel').textContent = labels.place;
  document.getElementById('regionLabel').textContent = labels.region;
  document.getElementById('placeInput').placeholder = labels.placePlaceholder;
  document.getElementById('regionInput').placeholder = labels.regionPlaceholder;
}

function syncFormFromState() {
  document.querySelectorAll('input[name="category"]').forEach((r) => { r.checked = r.value === state.category; });
  updateFieldLabels();
  document.getElementById('placeInput').value = state.place;
  document.getElementById('regionInput').value = state.region;
  document.getElementById('dateInput').value = state.date;
  document.getElementById('companionInput').value = state.companion;
  document.getElementById('keywordsInput').value = state.keywordsRaw;
  document.getElementById('extraTagsInput').value = state.extraTagsRaw;
  document.getElementById('summaryTextInput').value = state.summaryText;
  document.getElementById('summaryInput').value = state.summaryNotes;
  document.getElementById('nicknameInput').value = state.nickname;
  document.getElementById('signoffInput').value = state.signoffText;
  document.querySelectorAll('.star-btn').forEach((b) => b.classList.toggle('active', Number(b.dataset.star) <= state.rating));

  document.getElementById('aiToggle').checked = state.aiEnabled;
  document.getElementById('apiKeyInput').value = state.apiKey;
  document.getElementById('aiModelInput').value = state.aiModel;
  document.getElementById('analyzePhotosToggle').checked = state.analyzePhotos;
  document.getElementById('aiSettingsBody').classList.toggle('open', state.aiEnabled);

  renderPhotos();
}

function bindForm() {
  document.querySelectorAll('input[name="category"]').forEach((r) => {
    r.onchange = () => { state.category = r.value; updateFieldLabels(); saveDraft(); };
  });
  document.getElementById('placeInput').oninput = (e) => { state.place = e.target.value; saveDraft(); };
  document.getElementById('regionInput').oninput = (e) => { state.region = e.target.value; saveDraft(); };
  document.getElementById('dateInput').oninput = (e) => { state.date = e.target.value; saveDraft(); };
  document.getElementById('companionInput').oninput = (e) => { state.companion = e.target.value; saveDraft(); };
  document.getElementById('keywordsInput').oninput = (e) => { state.keywordsRaw = e.target.value; saveDraft(); };
  document.getElementById('extraTagsInput').oninput = (e) => { state.extraTagsRaw = e.target.value; saveDraft(); };
  document.getElementById('summaryTextInput').oninput = (e) => { state.summaryText = e.target.value; saveDraft(); };
  document.getElementById('summaryInput').oninput = (e) => { state.summaryNotes = e.target.value; saveDraft(); };
  document.getElementById('nicknameInput').oninput = (e) => { state.nickname = e.target.value; saveDraft(); };
  document.getElementById('signoffInput').oninput = (e) => { state.signoffText = e.target.value; saveDraft(); };

  document.getElementById('photoAddInput').onchange = (e) => {
    console.log(`[사진 추가 버튼] input.files 개수: ${e.target.files.length}`);
    addPhotos(e.target.files);
    e.target.value = '';
  };

  const photoDropZone = document.getElementById('photoDropZone');
  ['dragenter', 'dragover'].forEach((evt) => {
    photoDropZone.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      photoDropZone.classList.add('drag-over');
    });
  });
  ['dragleave', 'drop'].forEach((evt) => {
    photoDropZone.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      photoDropZone.classList.remove('drag-over');
    });
  });
  photoDropZone.addEventListener('drop', (e) => {
    const files = e.dataTransfer && e.dataTransfer.files;
    console.log(`[사진 드롭] dataTransfer.files 개수: ${files ? files.length : 0}`);
    if (files && files.length) addPhotos(files);
  });

  // 탐색기에서 파일을 복사(Ctrl+C)한 뒤 화면에 붙여넣기(Ctrl+V)하는 방식도 지원한다.
  // 텍스트 입력칸에 글자를 붙여넣는 일반적인 붙여넣기는 건드리지 않고,
  // 클립보드에 이미지 파일이 실제로 담겨 있을 때만 사진 추가로 처리한다.
  document.addEventListener('paste', (e) => {
    const items = e.clipboardData && e.clipboardData.items;
    if (!items) return;
    const files = [];
    for (const item of items) {
      if (item.kind === 'file' && item.type.startsWith('image/')) {
        const f = item.getAsFile();
        if (f) files.push(f);
      }
    }
    if (files.length > 0) {
      e.preventDefault();
      console.log(`[사진 붙여넣기] 클립보드 이미지 개수: ${files.length}`);
      addPhotos(files);
    }
  });

  document.querySelectorAll('.star-btn').forEach((btn) => {
    btn.onclick = () => {
      const v = Number(btn.dataset.star);
      state.rating = state.rating === v ? 0 : v;
      syncFormFromState();
      saveDraft();
    };
  });

  document.getElementById('generateBtn').onclick = () => {
    state.chosenTitleIndex = 0;
    if (state.aiEnabled && state.apiKey.trim()) {
      generateWithAI();
    } else {
      const proceed = confirm(
        state.aiEnabled
          ? 'AI 토글은 켜져 있지만 API 키가 비어 있어요.\n\n이 상태로 계속하면 정형 문구가 섞인 "규칙 기반 초안"이 생성됩니다.\n\n계속할까요? (취소를 누르고 "Gemini API 키" 칸을 채운 뒤 다시 시도하시면 AI로 생성됩니다)'
          : '지금 "AI로 문장 다듬기"가 꺼져 있어요.\n\n이 상태로 계속하면 정형 문구가 섞인 "규칙 기반 초안"이 생성됩니다. (실제 방문 정보 검색·자연스러운 문장은 반영되지 않아요)\n\n계속할까요? (취소를 누르고 위쪽 "✨ AI로 문장 다듬기" 체크박스를 켠 뒤 Gemini 키를 입력하시면 AI로 생성됩니다)'
      );
      if (!proceed) return;
      renderPreview();
    }
    scrollToPreview();
  };
  document.getElementById('templateOnlyBtn').onclick = () => { state.chosenTitleIndex = 0; renderPreview(); scrollToPreview(); };
  document.getElementById('exampleBtn').onclick = loadExample;
  document.getElementById('newPostBtn').onclick = () => {
    if (!confirm('작성 중인 내용을 지우고 새 글을 시작할까요? (닉네임·서명 문구·AI 설정은 그대로 유지돼요)')) return;
    resetPostContent();
  };
  document.getElementById('resetBtn').onclick = () => {
    if (!confirm('입력한 내용과 저장된 API 키를 모두 지울까요?')) return;
    localStorage.removeItem(DRAFT_KEY);
    localStorage.removeItem(AI_SETTINGS_KEY);
    location.reload();
  };
  document.getElementById('copyRichBtn').onclick = copyRich;
  document.getElementById('copyPlainBtn').onclick = copyPlain;
  document.getElementById('downloadBtn').onclick = downloadHtml;

  document.getElementById('mobileTabForm').onclick = () => switchMobileTab('form');
  document.getElementById('mobileTabPreview').onclick = () => switchMobileTab('preview');

  document.getElementById('aiToggle').onchange = (e) => {
    state.aiEnabled = e.target.checked;
    document.getElementById('aiSettingsBody').classList.toggle('open', state.aiEnabled);
    saveAISettings();
  };
  const apiKeyInput = document.getElementById('apiKeyInput');
  apiKeyInput.oninput = (e) => { state.apiKey = e.target.value.trim(); saveAISettings(); };
  document.getElementById('aiModelInput').oninput = (e) => { state.aiModel = e.target.value.trim() || DEFAULT_AI_MODEL; saveAISettings(); };
  document.getElementById('analyzePhotosToggle').onchange = (e) => { state.analyzePhotos = e.target.checked; saveAISettings(); };
  document.getElementById('toggleKeyVisible').onclick = () => {
    apiKeyInput.type = apiKeyInput.type === 'password' ? 'text' : 'password';
  };
  document.getElementById('clearKeyBtn').onclick = () => {
    state.apiKey = '';
    apiKeyInput.value = '';
    saveAISettings();
    flashStatus('저장된 API 키를 삭제했어요.');
  };

  document.getElementById('copyClaudePromptBtn').onclick = copyClaudePrompt;
  document.getElementById('importClaudeResultBtn').onclick = importClaudeResult;
}

function switchMobileTab(tab) {
  document.body.classList.toggle('show-preview', tab === 'preview');
  document.getElementById('mobileTabForm').classList.toggle('active', tab === 'form');
  document.getElementById('mobileTabPreview').classList.toggle('active', tab === 'preview');
}

function scrollToPreview() {
  if (window.innerWidth <= 900) { switchMobileTab('preview'); }
  document.getElementById('previewPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ---------- 초기화 ---------- */

function init() {
  loadDraft();
  loadAISettings();
  syncFormFromState();
  bindForm();
  renderPreview();
}

document.addEventListener('DOMContentLoaded', init);
