/* ==========================================================
   네이버 블로그 포스팅 생성기 — 클라이언트 전용 (서버/외부 전송 없음)
   ========================================================== */

/* ---------- 카테고리별 데이터 ---------- */

const CATEGORY_LABEL = { food: '맛집 후기', travel: '여행 후기', show: '공연 후기' };

const DEFAULT_SUBTITLES = {
  food:   ['첫인상과 웨이팅', '메뉴 소개', '맛 평가', '가격과 서비스'],
  travel: ['첫인상', '코스와 동선', '포토스팟', '꿀팁과 정보'],
  show:   ['관람 전 준비', '공연 하이라이트', '연출과 배우', '관람 후 여운'],
};

const INTRO_OPENERS = {
  food: [
    '{date}{companion} {place}에 다녀왔다.',
    '요즘 {region}에서 화제라는 {place}, 드디어 방문했다.',
    '{companion} {place}을(를) 찾은 건 순전히 {keyword} 때문이었다.',
    '{date} 저녁, {place}에서의 한 끼를 기록해본다.',
  ],
  travel: [
    '{date}{companion} {region} {place}로 떠났다.',
    '오랜만에 {companion} 훌쩍 다녀온 {place}, 그 후기를 남긴다.',
    '{keyword}을(를) 보러 {region} {place}까지 다녀왔다.',
    '{date}, {place}에서의 하루를 정리해본다.',
  ],
  show: [
    '{date}{companion} {place}에서 열린 공연을 보고 왔다.',
    '오랫동안 기다려온 {keyword}, 드디어 {place}에서 만났다.',
    '{date} 저녁, {place} 공연장 후기를 남겨본다.',
    '{companion} {place}에서 잊지 못할 시간을 보냈다.',
  ],
};

const INTRO_CLOSERS = {
  food: [
    '오늘은 그날의 메뉴와 분위기를 하나씩 정리해보려 한다.',
    '방문 전 궁금했던 점들, 방문 후 느낀 점까지 순서대로 담아본다.',
    '아래 목차 순서대로 솔직한 후기를 남긴다.',
  ],
  travel: [
    '이번 코스와 꿀팁을 아래 순서대로 정리해본다.',
    '동선부터 포토스팟까지, 다녀온 순서대로 기록을 남긴다.',
    '준비하시는 분들께 도움이 되길 바라며 상세히 적어본다.',
  ],
  show: [
    '관람 전 준비부터 공연 후 여운까지 순서대로 남겨본다.',
    '스포일러는 최소화하되, 느낀 감정은 최대한 담아보려 한다.',
    '아래 목차 순서대로 솔직한 관람 후기를 적어본다.',
  ],
};

const CONNECTORS = ['', '', '그리고 ', '무엇보다 ', '특히 ', '게다가 ', '무엇보다도 ', '더불어 '];

const WRAPPERS = {
  food: [
    (x) => `${x}가 특히 인상적이었다.`,
    (x) => `${x} 덕분에 만족도가 높았다.`,
    (x) => `${x}는 이 집의 시그니처처럼 느껴졌다.`,
    (x) => `${x} 부분도 놓치지 말아야 할 포인트다.`,
    (x) => `무엇보다 ${x}가 좋았다.`,
    (x) => `${x}라는 점에서 재방문 의사가 생겼다.`,
  ],
  travel: [
    (x) => `${x}는 꼭 들러봐야 할 포인트였다.`,
    (x) => `${x} 덕분에 여행이 한층 더 특별해졌다.`,
    (x) => `${x}를 보는 순간 카메라부터 꺼내게 됐다.`,
    (x) => `${x}는 이번 여행의 하이라이트였다.`,
    (x) => `${x} 코스는 특히 기억에 남는다.`,
    (x) => `${x} 덕분에 발걸음이 가벼웠다.`,
  ],
  show: [
    (x) => `${x}는 특히 여운이 오래 남았다.`,
    (x) => `${x} 덕분에 몰입도가 남달랐다.`,
    (x) => `${x} 장면에서는 소름이 돋았다.`,
    (x) => `${x}는 이 공연의 백미였다.`,
    (x) => `${x}를 보며 박수가 절로 나왔다.`,
    (x) => `${x} 연출은 다시 봐도 감탄스러울 것 같다.`,
  ],
};

const SECTION_CLOSERS = {
  food: [
    '다음 방문 때는 다른 메뉴도 꼭 시켜보고 싶다.',
    '전반적으로 기대 이상이었다.',
    '이 부분만으로도 방문할 이유는 충분했다.',
  ],
  travel: [
    '다음 여행 코스에도 꼭 넣고 싶은 곳이다.',
    '전체 일정 중에서도 손에 꼽히는 순간이었다.',
    '이 코스만으로도 방문할 가치는 충분했다.',
  ],
  show: [
    '커튼콜까지 여운이 가시지 않았다.',
    '다음 시즌에도 꼭 다시 보고 싶다는 생각이 들었다.',
    '이 장면 하나만으로도 관람할 가치는 충분했다.',
  ],
};

const RATING_TEXT = {
  1: '아쉬운 점이 많이 남는 방문이었다.',
  2: '기대보다는 조금 아쉬웠다.',
  3: '무난하게 즐길 만했다.',
  4: '만족스러운 방문이었다, 다시 찾을 의향이 있다.',
  5: '별 다섯 개를 아낌없이 주고 싶을 만큼 만족스러웠다.',
};

const SUMMARY_CLOSERS = {
  food: ['다음에 또 방문하고 싶은 곳이다.', '주변에도 자신 있게 추천할 만하다.', '재방문 의사 100%다.'],
  travel: ['다시 이곳을 찾게 될 것 같다.', '여행 코스로 자신 있게 추천한다.', '사진으로 다 담지 못한 여운이 남는다.'],
  show: ['여운이 가시지 않아 다음 공연도 예매를 고민 중이다.', '주변에 꼭 추천하고 싶은 공연이다.', '다시 봐도 좋을 것 같은 무대였다.'],
};

const SIGNOFF_POOL = {
  food: ['다음에도 맛있는 맛집 이야기로 찾아올게요 :)', '다음에도 재미있는 맛집 이야기로 찾아올게요 :)'],
  travel: ['다음에도 즐거운 여행 이야기로 찾아올게요 :)', '다음에도 재미있는 여행 이야기로 찾아올게요 :)'],
  show: ['다음에도 감동적인 공연 이야기로 찾아올게요 :)', '다음에도 재미있는 공연 이야기로 찾아올게요 :)'],
};

const TAG_POOL = {
  food: ['맛집', '맛집추천', '맛집투어', '먹스타그램', '맛스타그램', '로컬맛집', '데이트코스', '맛집리뷰'],
  travel: ['여행', '국내여행', '여행스타그램', '여행에미치다', '여행코스', '당일치기', '주말여행', '여행추천'],
  show: ['공연', '공연후기', '문화생활', '공연추천', '주말나들이', '데이트코스', '콘서트후기', '전시후기'],
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
  aiModel: 'gemini-2.5-flash',
};

let lastAIJson = null;

function uid(prefix) { return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`; }

/* ---------- 사진 처리 (전체 공용 사진 풀) ---------- */

function addPhotos(fileList) {
  const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      state.photos.push({ id: uid('photo'), name: file.name, dataUrl: e.target.result, caption: '' });
      renderPhotos();
    };
    reader.readAsDataURL(file);
  });
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
      <img src="${p.dataUrl}" alt="${escapeAttr(p.name)}">
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

function buildGreetingLine(s) {
  return s.nickname.trim() ? `안녕하세요? ${s.nickname.trim()}입니다.` : '';
}
function finalizeIntro(s, introParas) {
  const greeting = buildGreetingLine(s);
  return greeting ? [greeting, ...introParas] : introParas;
}
function finalizeSummary(s, summarySentences) {
  const signoff = s.signoffText.trim() || pick(SIGNOFF_POOL[s.category]);
  return [...summarySentences, signoff];
}

/* ---------- 제목 / 태그 생성 ---------- */

function buildTitleOptions(s) {
  const place = s.place || '이곳';
  const region = s.region ? `[${s.region}] ` : '';
  const kws = parseKeywords(s.keywordsRaw);
  const kw = kws[0] || CATEGORY_LABEL[s.category].replace(' 후기', '');
  const kw2 = kws[1] || '';
  const bank = {
    food: [
      `${region}${place} · ${kw} 제대로 하는 맛집 후기`,
      `${place} 리얼 후기 | ${kw}${kw2 ? ' & ' + kw2 : ''}`,
      `${(s.region || '').trim()} ${place}, 인생 맛집 등극 (${kw})`.trim(),
    ],
    travel: [
      `${region}${place} 여행 코스 총정리 (feat. ${kw})`,
      `${(s.region || '').trim()} ${place} 다녀온 후기 | ${kw} 스팟`.trim(),
      `${place} 여행 브이로그 · ${kw} 완전정복`,
    ],
    show: [
      `${region}${place} 공연 후기 · ${kw}`,
      `${place} 관람 후기, ${kw}가 남긴 여운`,
      `${(s.region || '').trim()} ${place} | ${kw} 솔직 리뷰`.trim(),
    ],
  };
  return bank[s.category].map((t) => t.replace(/\s+/g, ' ').trim());
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
  if (s.rating > 0) summarySentences.unshift(RATING_TEXT[s.rating]);
  summarySentences.push(pick(SUMMARY_CLOSERS[category]));
  summarySentences = finalizeSummary(s, summarySentences);

  const tags = buildTags(s);

  return { title, titleOptions, introParas, toc: builtSections.map((b) => b.subtitle), sections: builtSections, summarySentences, tags, rating: s.rating, source: 'template' };
}

/* ---------- AI(Gemini) 결과를 같은 구조로 합성 ---------- */

function composeFromAI(s, ai, sourceLabel = 'ai') {
  const category = s.category;

  const templateTitles = buildTitleOptions(s);
  const aiTitles = [ai.title, ...(Array.isArray(ai.titleAlternatives) ? ai.titleAlternatives : [])].filter(Boolean);
  const titleOptions = Array.from(new Set([...aiTitles, ...templateTitles])).slice(0, 5);
  state.lastTitleOptions = titleOptions;
  const title = titleOptions[Math.min(s.chosenTitleIndex, titleOptions.length - 1)];

  const introParas = finalizeIntro(s, Array.isArray(ai.intro) && ai.intro.length
    ? ai.intro.filter(Boolean)
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
        const items = aiSec.list.filter(Boolean);
        if (items.length) blocks.push({ type: 'list', items });
      }
      const paragraphs = nonEmptyArr(aiSec.paragraphs) ? aiSec.paragraphs.filter(Boolean) : [];
      blocks.push(...distributeIntoBlocks(paragraphs, photoChunks[i] || []));
      return { subtitle, blocks };
    }).filter((sec) => sec.blocks.length > 0);
  } else {
    builtSections = buildTemplateSections(s);
  }

  let summarySentences;
  if (Array.isArray(ai.summary) && ai.summary.length) {
    summarySentences = ai.summary.filter(Boolean);
  } else {
    const bullets = splitBullets(s.summaryNotes);
    summarySentences = bullets.map((b, i) => (i === 0 ? '' : pick(CONNECTORS)) + ensureSentence(b, category));
    if (s.rating > 0) summarySentences.unshift(RATING_TEXT[s.rating]);
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
    ? `<div class="toc-box"><div class="toc-heading">목차</div><ol>${post.toc.map((t) => `<li>${escapeHtml(t)}</li>`).join('')}</ol></div>`
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

  const charCount = post.introParas.join('').length
    + post.sections.reduce((sum, sec) => sum + sec.blocks.reduce((s2, b) => s2 + blockTextLength(b), 0), 0)
    + post.summarySentences.join('').length;

  el.innerHTML = `
    <div class="title-choices">${titleChoices}</div>
    <h1 class="post-title">${escapeHtml(post.title)}</h1>
    <div class="post-meta">${sourceBadge} ${escapeHtml(CATEGORY_LABEL[state.category])}${state.region ? ' · ' + escapeHtml(state.region) : ''}${state.date ? ' · ' + escapeHtml(state.date) : ''} · 본문 약 ${charCount}자</div>
    ${tocHtml}
    <div class="post-intro">${post.introParas.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}</div>
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
  if (post.toc.length) {
    lines.push('[목차]');
    post.toc.forEach((t, i) => lines.push(`${i + 1}. ${t}`));
    lines.push('');
  }
  post.introParas.forEach((p) => lines.push(p));
  lines.push('');
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
  const tocHtml = post.toc.length ? `<p><b>[목차]</b><br>${post.toc.map((t, i) => `${i + 1}. ${escapeHtml(t)}`).join('<br>')}</p>` : '';
  const introHtml = post.introParas.map((p) => `<p>${escapeHtml(p)}</p>`).join('');
  const sectionsHtml = post.sections.map((sec, i) => `
    <h2>${i + 1}. ${escapeHtml(sec.subtitle)}</h2>
    ${sec.blocks.map((b) => {
      if (b.type === 'text') return `<p>${escapeHtml(b.text)}</p>`;
      if (b.type === 'infobox') return `<p>${b.facts.map((f) => `<b>${escapeHtml(f.label)}</b>: ${escapeHtml(f.value)}`).join('<br>')}</p>`;
      if (b.type === 'list') return `<p>${b.items.map((t) => `• ${escapeHtml(t)}`).join('<br>')}</p>`;
      return `<p><img src="${b.photo.dataUrl}" alt="${escapeAttr(sec.subtitle)}" style="max-width:100%;"></p>`;
    }).join('')}
  `).join('');
  const stars = post.rating ? `<p>${'★'.repeat(post.rating)}${'☆'.repeat(5 - post.rating)}</p>` : '';
  const summaryHtml = `<h2>${post.sections.length + 1}. 총평</h2>${stars}${post.summarySentences.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}`;
  const tagsHtml = `<p>${post.tags.map((t) => `#${escapeHtml(t)}`).join(' ')}</p>`;
  return `<h1>${escapeHtml(post.title)}</h1>${tocHtml}${introHtml}${sectionsHtml}${summaryHtml}${tagsHtml}`;
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
      aiEnabled: state.aiEnabled, apiKey: state.apiKey, aiModel: state.aiModel,
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
    if (typeof saved.aiModel === 'string' && saved.aiModel) state.aiModel = saved.aiModel;
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
- 전체 분량에는 엄격한 글자수 제한을 두지 않는다. 취재 노트와 overallNotes가 풍부하면 소제목을 6~9개까지 늘려 실제 파워블로거의 후기처럼 충실하고 상세하게 쓰고, 정보가 적으면 2~4개 정도로 간결하게 쓸 것
- 첫 소제목은 가능하면 "기본 정보"에 해당하는 섹션으로 구성해서, 그 섹션의 facts 필드에 확인된 사실(주소, 전화번호, 영업시간/공연일시, 가격, 정기휴무 등)을 key-value로 정리할 것. 확인된 사실이 없으면 이 섹션은 생략할 것
- 가능하면 장소·인물·단체의 배경(이력, 유명해진 계기, 역사 등)을 다루는 소제목을 하나 포함할 것 (취재 노트에 근거가 있을 때만. 근거 없이 지어내지 말 것)
- 코스 옵션, 프로그램/세트리스트, 방문 팁처럼 목록으로 정리하는 게 자연스러운 내용은 해당 섹션의 list 필드에 배열로 담을 것
- 섹션당 문단(paragraphs)은 2~4개, 문단당 2~4문장 정도로, 취재된 실제 정보(주소·영업시간·가격대·메뉴명·특징 등)를 구체적으로 담아 밀도 있게 쓸 것
- photoCount는 실제 사진 배치를 위한 참고용 숫자일 뿐이니, 본문에서 "사진 1", "위 사진처럼" 같은 표현은 쓰지 말 것
- photoCaptions는 사용자가 실제로 찍은 사진에 붙인 설명이다. 이 목록에 나온 소재(예: "은각사 입구", "정원 풍경")는 관련 있는 소제목의 본문에서 최소 한 번씩 구체적으로 언급해서, 나중에 그 사진이 해당 문단 옆에 자동 배치됐을 때 내용과 사진이 자연스럽게 맞아떨어지도록 할 것
- 문장은 "~했다/~였다/~한다" 같은 담담한 서술체를 기본 축으로 쓰되, 가끔 "~했어요/~좋았다" 식으로 부드러운 문장을 자연스럽게 섞어서 실제 파워블로거 글 같은 편안한 리듬을 만들 것. 한 문장 안에서 서로 다른 종결어미가 어색하게 이어 붙거나("~했는데는 ~였다" 같은 비문), 문장이 중간에 끊기는 일이 없도록 매끄럽게 다듬을 것`;

function buildResearchPrompt(s) {
  const input = summarizeInput(s);
  return `당신은 네이버 블로그에 올릴 ${CATEGORY_LABEL[s.category]}를 위해 취재하는 리서처입니다. 구글 검색으로 아래 장소/공연에 대한 실제 정보를 최대한 찾아서 정리해주세요.

찾아야 할 정보 (해당되는 것만, "기본 정보" 박스에 쓸 수 있도록 최대한 정확한 값으로):
- 정확한 위치/주소, 전화번호, 가는 법, 영업시간·정기휴무(또는 공연 일시), 가격대·티켓 가격
- 대표 메뉴/시그니처, 웨이팅 여부 (맛집) / 코스, 입장료, 추천 동선, 주변 명소 (여행) / 러닝타임, 캐스팅, 공연장 정보, 관람 포인트 (공연)
- 관련 인물·단체의 배경 (셰프/연주자/극단 등의 이력, 유명해진 계기, 수상 경력, 방송 출연 등)
- 최근 방문객·관람객들의 공통적인 평가나 특징
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
  "title": "네이버 검색 노출에 최적화된 제목 (25~40자 내외)",
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
(facts/list는 해당 내용이 있을 때만 넣고, 없으면 필드 자체를 생략하세요)`;
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
  "title": "네이버 검색 노출에 최적화된 제목 (25~40자 내외)",
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
(facts/list는 해당 내용이 있을 때만 넣고, 없으면 필드 자체를 생략하세요)`;
}

function buildClaudePrompt(s) {
  const input = summarizeInput(s);
  return `당신은 네이버 블로그에 ${CATEGORY_LABEL[s.category]}를 올리는 블로거입니다. 아래 정보를 바탕으로 실제 경험을 진솔하고 상세하게 전달하는 한국어 블로그 글을 작성해주세요.

웹 검색이 가능하다면, 아래 장소·공연·인물에 대한 실제 정보(정확한 주소, 전화번호, 영업시간·공연일시, 가격, 관련 인물·단체의 이력 등)를 찾아서 반영해주세요. 검색이 불가능한 상황이라면 확인되지 않은 구체적 사실은 지어내지 말고 아래 입력 정보만으로 작성하세요.

작성 원칙:
${WRITING_PRINCIPLES}

입력 정보:
${JSON.stringify(input, null, 2)}

아래 JSON 형식으로 응답해주세요 (코드블록으로 감싸도 되고, 앞뒤에 설명을 조금 덧붙여도 괜찮습니다. JSON 부분만 정확한 형식이면 됩니다):
{
  "title": "네이버 검색 노출에 최적화된 제목 (25~40자 내외)",
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
(facts/list는 해당 내용이 있을 때만 넣고, 없으면 필드 자체를 생략하세요)`;
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

async function callGeminiApi(apiKey, model, prompt, { useSearch = false, jsonMode = false } = {}) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
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
  const model = state.aiModel || 'gemini-2.5-flash';

  try {
    btn.textContent = '🔎 관련 정보 검색 중...';
    flashStatus('구글 검색으로 관련 정보를 찾고 있어요. 잠시만 기다려주세요...');
    const research = await callGeminiApi(state.apiKey, model, buildResearchPrompt(state), { useSearch: true });

    btn.textContent = '✨ 글로 정리하는 중...';
    flashStatus('찾은 정보를 바탕으로 글을 정리하고 있어요...');
    const restructured = await callGeminiApi(state.apiKey, model, buildRestructurePrompt(state, research.text), { jsonMode: true });
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
      const fallback = await callGeminiApi(state.apiKey, model, buildFallbackJsonPrompt(state), { jsonMode: true });
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

/* ---------- 폼 <-> 상태 동기화 ---------- */

function syncFormFromState() {
  document.querySelectorAll('input[name="category"]').forEach((r) => { r.checked = r.value === state.category; });
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
  document.getElementById('aiSettingsBody').classList.toggle('open', state.aiEnabled);

  renderPhotos();
}

function bindForm() {
  document.querySelectorAll('input[name="category"]').forEach((r) => {
    r.onchange = () => { state.category = r.value; saveDraft(); };
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

  document.getElementById('photoAddInput').onchange = (e) => { addPhotos(e.target.files); e.target.value = ''; };

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
  document.getElementById('aiModelInput').oninput = (e) => { state.aiModel = e.target.value.trim() || 'gemini-2.5-flash'; saveAISettings(); };
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
