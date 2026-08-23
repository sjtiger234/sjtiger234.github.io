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
  sections: [],
  summaryNotes: '',
  chosenTitleIndex: 0,
  lastTitleOptions: [],
};

let sectionSeq = 0;
let photoSeq = 0;

function uid(prefix) { return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`; }

/* ---------- 초기 섹션 ---------- */

function addSection(subtitle = '', notes = '') {
  state.sections.push({ id: uid('sec'), subtitle, notes, photos: [] });
  renderSections();
  saveDraft();
}

function removeSection(id) {
  state.sections = state.sections.filter((s) => s.id !== id);
  renderSections();
  saveDraft();
}

function moveSection(id, dir) {
  const idx = state.sections.findIndex((s) => s.id === id);
  const target = idx + dir;
  if (target < 0 || target >= state.sections.length) return;
  const [item] = state.sections.splice(idx, 1);
  state.sections.splice(target, 0, item);
  renderSections();
}

/* ---------- 사진 처리 ---------- */

function addPhotosToSection(sectionId, fileList) {
  const section = state.sections.find((s) => s.id === sectionId);
  if (!section) return;
  const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      section.photos.push({ id: uid('photo'), name: file.name, dataUrl: e.target.result, caption: '' });
      renderSections();
    };
    reader.readAsDataURL(file);
  });
}

function removePhoto(sectionId, photoId) {
  const section = state.sections.find((s) => s.id === sectionId);
  if (!section) return;
  section.photos = section.photos.filter((p) => p.id !== photoId);
  renderSections();
}

function movePhoto(sectionId, photoId, dir) {
  const section = state.sections.find((s) => s.id === sectionId);
  if (!section) return;
  const idx = section.photos.findIndex((p) => p.id === photoId);
  const target = idx + dir;
  if (target < 0 || target >= section.photos.length) return;
  const [item] = section.photos.splice(idx, 1);
  section.photos.splice(target, 0, item);
  renderSections();
}

/* ---------- 렌더: 입력 폼 ---------- */

function renderSections() {
  const wrap = document.getElementById('sectionsList');
  wrap.innerHTML = '';
  state.sections.forEach((sec, i) => {
    const el = document.createElement('div');
    el.className = 'section-card';
    el.innerHTML = `
      <div class="section-card-head">
        <span class="section-num">소제목 ${i + 1}</span>
        <div class="section-card-actions">
          <button type="button" class="icon-btn" data-act="up" title="위로">▲</button>
          <button type="button" class="icon-btn" data-act="down" title="아래로">▼</button>
          <button type="button" class="icon-btn danger" data-act="del" title="삭제">✕</button>
        </div>
      </div>
      <input type="text" class="subtitle-input" placeholder="소제목 (비워두면 자동 생성)" value="${escapeAttr(sec.subtitle)}">
      <textarea class="notes-input" rows="3" placeholder="핵심 내용을 한 줄씩 적어주세요. 예) 웨이팅 15분, 시그니처는 트러플크림파스타, 가격은 1인 2만원대">${escapeHtml(sec.notes)}</textarea>
      <div class="photo-zone">
        <label class="photo-add-btn">
          📷 사진 추가
          <input type="file" accept="image/*" multiple hidden>
        </label>
        <div class="photo-thumbs"></div>
      </div>
    `;
    el.querySelector('[data-act="up"]').onclick = () => moveSection(sec.id, -1);
    el.querySelector('[data-act="down"]').onclick = () => moveSection(sec.id, 1);
    el.querySelector('[data-act="del"]').onclick = () => removeSection(sec.id);
    el.querySelector('.subtitle-input').oninput = (e) => { sec.subtitle = e.target.value; saveDraft(); };
    el.querySelector('.notes-input').oninput = (e) => { sec.notes = e.target.value; saveDraft(); };
    el.querySelector('input[type="file"]').onchange = (e) => { addPhotosToSection(sec.id, e.target.files); e.target.value = ''; };

    const thumbWrap = el.querySelector('.photo-thumbs');
    sec.photos.forEach((p, pi) => {
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
      t.querySelector('[data-act="up"]').onclick = () => movePhoto(sec.id, p.id, -1);
      t.querySelector('[data-act="down"]').onclick = () => movePhoto(sec.id, p.id, 1);
      t.querySelector('[data-act="del"]').onclick = () => removePhoto(sec.id, p.id);
      thumbWrap.appendChild(t);
    });

    wrap.appendChild(el);
  });
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
  return text.split(/\n|,|·/).map((s) => s.trim()).filter(Boolean);
}
function ensureSentence(fragment, category) {
  const endsWithFinal = /[.!?…]$/.test(fragment) || /(다|요|음|함)$/.test(fragment.replace(/[.!?]$/, ''));
  if (endsWithFinal) {
    return /[.!?…]$/.test(fragment) ? fragment : fragment + '.';
  }
  const wrapper = pick(WRAPPERS[category]);
  return wrapper(fragment);
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
    .replace('{keyword}', keyword);
  const introParas = [opener.replace(/\s+/g, ' ').trim(), pick(INTRO_CLOSERS[category])];

  const titleOptions = buildTitleOptions(s);
  state.lastTitleOptions = titleOptions;
  const title = titleOptions[Math.min(s.chosenTitleIndex, titleOptions.length - 1)];

  const builtSections = s.sections.map((sec, i) => {
    const subtitle = sec.subtitle.trim() || DEFAULT_SUBTITLES[category][i % DEFAULT_SUBTITLES[category].length] + (i >= DEFAULT_SUBTITLES[category].length ? ` ${i + 1}` : '');
    const bullets = splitBullets(sec.notes);
    const sentences = bullets.map((b, bi) => {
      const conn = bi === 0 ? '' : pick(CONNECTORS);
      return conn + ensureSentence(b, category);
    });
    if (sentences.length === 0 && sec.photos.length === 0) return null;
    if (sentences.length > 0) sentences.push(pick(SECTION_CLOSERS[category]));

    const photos = sec.photos;
    const blocks = [];
    if (photos.length === 0) {
      blocks.push({ type: 'text', text: sentences.join(' ') });
    } else if (sentences.length === 0) {
      photos.forEach((p) => blocks.push({ type: 'photo', photo: p }));
    } else {
      const gaps = photos.length + 1;
      const perGap = sentences.length / gaps;
      let sIdx = 0;
      let pIdx = 0;
      for (let g = 0; g < gaps; g++) {
        const end = g === gaps - 1 ? sentences.length : Math.round(perGap * (g + 1));
        const chunk = sentences.slice(sIdx, end).join(' ');
        if (chunk) blocks.push({ type: 'text', text: chunk });
        sIdx = end;
        if (pIdx < photos.length) { blocks.push({ type: 'photo', photo: photos[pIdx] }); pIdx++; }
      }
      while (pIdx < photos.length) { blocks.push({ type: 'photo', photo: photos[pIdx] }); pIdx++; }
    }
    return { subtitle, blocks };
  }).filter(Boolean);

  const summaryBullets = splitBullets(s.summaryNotes);
  const summarySentences = summaryBullets.map((b, i) => (i === 0 ? '' : pick(CONNECTORS)) + ensureSentence(b, category));
  if (s.rating > 0) summarySentences.unshift(RATING_TEXT[s.rating]);
  summarySentences.push(pick(SUMMARY_CLOSERS[category]));

  const tags = buildTags(s);

  return { title, titleOptions, introParas, toc: builtSections.map((b) => b.subtitle), sections: builtSections, summarySentences, tags, rating: s.rating };
}

/* ---------- 렌더: 미리보기 ---------- */

let lastPost = null;

function renderPreview() {
  const post = generatePost(state);
  lastPost = post;
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
      ${sec.blocks.map((b) => b.type === 'text'
        ? `<p>${escapeHtml(b.text)}</p>`
        : `<figure><img src="${b.photo.dataUrl}" alt="${escapeAttr(b.photo.caption || sec.subtitle)}">${b.photo.caption ? `<figcaption>${escapeHtml(b.photo.caption)}</figcaption>` : ''}</figure>`
      ).join('')}
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

  el.innerHTML = `
    <div class="title-choices">${titleChoices}</div>
    <h1 class="post-title">${escapeHtml(post.title)}</h1>
    <div class="post-meta">${escapeHtml(CATEGORY_LABEL[state.category])}${state.region ? ' · ' + escapeHtml(state.region) : ''}${state.date ? ' · ' + escapeHtml(state.date) : ''}</div>
    ${tocHtml}
    <div class="post-intro">${post.introParas.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}</div>
    ${sectionsHtml}
    ${summaryHtml}
    ${tagsHtml}
  `;

  el.querySelectorAll('input[name="titleChoice"]').forEach((r) => {
    r.onchange = (e) => { state.chosenTitleIndex = Number(e.target.value); renderPreview(); };
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
      else { photoCounter++; lines.push(`[사진 ${photoCounter}${b.photo.caption ? ' - ' + b.photo.caption : ''}]`); }
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
    ${sec.blocks.map((b) => b.type === 'text'
      ? `<p>${escapeHtml(b.text)}</p>`
      : `<p><img src="${b.photo.dataUrl}" alt="${escapeAttr(b.photo.caption || sec.subtitle)}" style="max-width:100%;">${b.photo.caption ? `<br><i>${escapeHtml(b.photo.caption)}</i>` : ''}</p>`
    ).join('')}
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
function flashStatus(msg) {
  const el = document.getElementById('statusMsg');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => el.classList.remove('show'), 4000);
}

/* ---------- 임시 저장 (텍스트만, 사진 제외) ---------- */

const DRAFT_KEY = 'naver-blog-generator-draft-v1';

function saveDraft() {
  const draft = {
    category: state.category, place: state.place, region: state.region, date: state.date,
    companion: state.companion, rating: state.rating, keywordsRaw: state.keywordsRaw,
    extraTagsRaw: state.extraTagsRaw, summaryNotes: state.summaryNotes,
    sections: state.sections.map((s) => ({ subtitle: s.subtitle, notes: s.notes })),
  };
  try { localStorage.setItem(DRAFT_KEY, JSON.stringify(draft)); } catch (e) { /* 용량 초과 등은 무시 */ }
}

function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return false;
    const draft = JSON.parse(raw);
    Object.assign(state, draft, { sections: [] });
    (draft.sections || []).forEach((s) => state.sections.push({ id: uid('sec'), subtitle: s.subtitle, notes: s.notes, photos: [] }));
    return true;
  } catch (e) { return false; }
}

/* ---------- 예시 불러오기 ---------- */

const EXAMPLE = {
  category: 'food', place: '을지로 화로구이', region: '서울 을지로', date: '', companion: '친구와',
  rating: 5, keywordsRaw: '노포 감성, 숯불구이, 가성비',
  sections: [
    { subtitle: '', notes: '평일 저녁 7시 웨이팅 10분\n허름한 골목 안 노포 느낌 그대로\n테이블은 4개뿐이라 좁지만 정겨움' },
    { subtitle: '', notes: '대패삼겹살과 목살 세트 주문\n연탄 화로에 직접 구워 먹는 방식\n밑반찬으로 나온 파채무침이 은근 중독적' },
    { subtitle: '', notes: '고기 질이 좋아서 잡내 없이 고소함\n불맛이 확실히 살아있음\n마무리로 먹은 계란찜도 맛있었음' },
  ],
  summaryNotes: '2인 기준 4만원대로 가성비 훌륭\n사장님이 친절하고 셀프바가 잘 갖춰져 있음',
};

function loadExample() {
  Object.assign(state, EXAMPLE, { sections: [], chosenTitleIndex: 0 });
  EXAMPLE.sections.forEach((s) => state.sections.push({ id: uid('sec'), subtitle: s.subtitle, notes: s.notes, photos: [] }));
  syncFormFromState();
  renderSections();
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
  document.getElementById('summaryInput').value = state.summaryNotes;
  document.querySelectorAll('.star-btn').forEach((b) => b.classList.toggle('active', Number(b.dataset.star) <= state.rating));
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
  document.getElementById('summaryInput').oninput = (e) => { state.summaryNotes = e.target.value; saveDraft(); };

  document.querySelectorAll('.star-btn').forEach((btn) => {
    btn.onclick = () => {
      const v = Number(btn.dataset.star);
      state.rating = state.rating === v ? 0 : v;
      syncFormFromState();
      saveDraft();
    };
  });

  document.getElementById('addSectionBtn').onclick = () => addSection();
  document.getElementById('generateBtn').onclick = () => { state.chosenTitleIndex = 0; renderPreview(); scrollToPreview(); };
  document.getElementById('exampleBtn').onclick = loadExample;
  document.getElementById('resetBtn').onclick = () => {
    if (!confirm('입력한 내용을 모두 지울까요?')) return;
    localStorage.removeItem(DRAFT_KEY);
    location.reload();
  };
  document.getElementById('copyRichBtn').onclick = copyRich;
  document.getElementById('copyPlainBtn').onclick = copyPlain;
  document.getElementById('downloadBtn').onclick = downloadHtml;

  document.getElementById('mobileTabForm').onclick = () => switchMobileTab('form');
  document.getElementById('mobileTabPreview').onclick = () => switchMobileTab('preview');
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
  const hadDraft = loadDraft();
  if (!hadDraft) {
    addSection();
    addSection();
  } else {
    renderSections();
  }
  syncFormFromState();
  bindForm();
  renderPreview();
}

document.addEventListener('DOMContentLoaded', init);
