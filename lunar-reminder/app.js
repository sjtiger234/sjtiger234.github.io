'use strict';

/* ===== 설정 ===== */
const OWNER = 'sjtiger234';
const REPO = 'sjtiger234.github.io';
const BRANCH = 'main';
const ANNIV_PATH = 'data/anniversaries.json';
const SUB_PATH = 'data/subscriptions.json';

// GitHub Actions 시크릿의 VAPID_PRIVATE_KEY와 짝이 되는 공개키.
// `npx web-push generate-vapid-keys` 로 발급받은 뒤 이 자리에 붙여넣으세요. (공개키는 비밀값이 아닙니다)
const VAPID_PUBLIC_KEY = 'BJSSz6qkzRUkZd2O3acGfjDybpSFl0lLxHCSseaCDPZSKMvoT0mQT2nEsHPMkdkO9Gk6q4Yio2Bn85lv64OGaks';

const API_BASE = `https://api.github.com/repos/${OWNER}/${REPO}/contents`;

/* ===== 유틸 ===== */
const $ = (id) => document.getElementById(id);
let toastTimer = null;
function toast(msg) {
  const el = $('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}

function getPat() { return localStorage.getItem('lr_pat') || ''; }
function setPat(v) { localStorage.setItem('lr_pat', v); }

function todayYMD() {
  const d = new Date();
  return { y: d.getFullYear(), m: d.getMonth() + 1, d: d.getDate() };
}

function ymdToNum(y, m, d) { return y * 10000 + m * 100 + d; }

/* 다가오는 양력 날짜 계산 (윤달이 없는 해는 건너뜀) */
function nextSolarOccurrence(lunarMonth, lunarDay, isLeap) {
  const t = todayYMD();
  const todayNum = ymdToNum(t.y, t.m, t.d);
  for (let offset = 0; offset < 6; offset++) {
    const year = t.y + offset;
    const cal = new KoreanLunarCalendar();
    const ok = cal.setLunarDate(year, lunarMonth, lunarDay, isLeap);
    if (!ok) continue;
    const s = cal.getSolarCalendar();
    const num = ymdToNum(s.year, s.month, s.day);
    if (num >= todayNum) return s;
  }
  return null;
}

function formatSolar(s) {
  if (!s) return '계산 불가';
  return `${s.year}.${String(s.month).padStart(2, '0')}.${String(s.day).padStart(2, '0')}`;
}

function dDay(s) {
  if (!s) return '';
  const target = new Date(s.year, s.month - 1, s.day);
  const t = new Date(); t.setHours(0, 0, 0, 0);
  const diff = Math.round((target - t) / 86400000);
  if (diff === 0) return '오늘';
  if (diff === 1) return '내일';
  return `D-${diff}`;
}

/* ===== GitHub Contents API ===== */
function utf8ToBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  bytes.forEach((b) => { binary += String.fromCharCode(b); });
  return btoa(binary);
}

function base64ToUtf8(b64) {
  const binary = atob(b64.replace(/\n/g, ''));
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder('utf-8').decode(bytes);
}

// raw.githubusercontent.com은 CDN 캐시 지연이 있어 방금 저장한 내용을 못 볼 수 있으므로,
// 항상 api.github.com(캐시 없음)에서 content와 sha를 함께 읽어 일관성을 보장한다.
async function githubGetFile(path) {
  const pat = getPat();
  const headers = { Accept: 'application/vnd.github+json' };
  if (pat) headers.Authorization = `Bearer ${pat}`;
  const res = await fetch(`${API_BASE}/${path}?ref=${BRANCH}`, { headers, cache: 'no-store' });
  if (res.status === 404) return { data: [], sha: null };
  if (!res.ok) throw new Error(`불러오기 실패 (${res.status})`);
  const json = await res.json();
  const data = JSON.parse(base64ToUtf8(json.content));
  return { data, sha: json.sha };
}

async function githubPutFile(path, jsonValue, sha, message) {
  const pat = getPat();
  if (!pat) throw new Error('먼저 설정에서 GitHub 토큰을 저장해주세요.');
  const content = utf8ToBase64(JSON.stringify(jsonValue, null, 2) + '\n');
  const body = { message, content, branch: BRANCH };
  if (sha) body.sha = sha;
  const res = await fetch(`${API_BASE}/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${pat}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `저장 실패 (${res.status})`);
  }
  return res.json();
}

/* ===== 기념일 목록 ===== */
async function loadAnniversaries() {
  const list = $('list');
  list.innerHTML = '<li class="empty">불러오는 중…</li>';
  try {
    const { data } = await githubGetFile(ANNIV_PATH);
    renderAnniversaries(Array.isArray(data) ? data : []);
  } catch (e) {
    list.innerHTML = `<li class="empty">불러오기 실패: ${e.message}</li>`;
  }
}

function renderAnniversaries(items) {
  const list = $('list');
  if (!items.length) {
    list.innerHTML = '<li class="empty">아직 등록된 기념일이 없어요.</li>';
    return;
  }
  const sortKey = (i) => {
    const s = nextSolarOccurrence(i.lunarMonth, i.lunarDay, !!i.isLeap);
    return s ? ymdToNum(s.year, s.month, s.day) : Infinity;
  };
  const sorted = [...items].sort((a, b) => sortKey(a) - sortKey(b));
  list.innerHTML = '';
  for (const item of sorted) {
    const s = nextSolarOccurrence(item.lunarMonth, item.lunarDay, !!item.isLeap);
    const li = document.createElement('li');
    li.className = 'item';
    li.innerHTML = `
      <div class="info">
        <div class="name">${escapeHtml(item.name)}</div>
        <div class="sub">음력 ${item.lunarMonth}월 ${item.lunarDay}일${item.isLeap ? ' (윤달)' : ''}</div>
        <div class="next">다음: ${formatSolar(s)} (${dDay(s)})</div>
      </div>
      <button class="danger" data-id="${item.id}">삭제</button>
    `;
    li.querySelector('button').addEventListener('click', () => deleteAnniversary(item.id));
    list.appendChild(li);
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

async function addAnniversary() {
  const name = $('name').value.trim();
  const month = parseInt($('month').value, 10);
  const day = parseInt($('day').value, 10);
  const isLeap = $('leap').checked;
  const hint = $('addHint');
  hint.textContent = '';

  if (!name) return (hint.textContent = '이름을 입력해주세요.');
  if (!month || month < 1 || month > 12) return (hint.textContent = '음력 월은 1~12 사이여야 해요.');
  if (!day || day < 1 || day > 30) return (hint.textContent = '음력 일은 1~30 사이여야 해요.');

  const test = new KoreanLunarCalendar();
  if (!test.setLunarDate(new Date().getFullYear(), month, day, isLeap)
      && !test.setLunarDate(new Date().getFullYear() + 1, month, day, isLeap)) {
    return (hint.textContent = '유효하지 않은 음력 날짜예요 (윤달 여부를 확인해주세요).');
  }

  const btn = $('addBtn');
  btn.disabled = true;
  try {
    const { data, sha } = await githubGetFile(ANNIV_PATH);
    const items = Array.isArray(data) ? data : [];
    items.push({
      id: (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
      name,
      lunarMonth: month,
      lunarDay: day,
      isLeap,
      createdAt: new Date().toISOString(),
    });
    await githubPutFile(ANNIV_PATH, items, sha, `기념일 추가: ${name}`);
    $('name').value = ''; $('month').value = ''; $('day').value = ''; $('leap').checked = false;
    toast('기념일을 추가했어요.');
    renderAnniversaries(items);
  } catch (e) {
    hint.textContent = e.message;
  } finally {
    btn.disabled = false;
  }
}

async function deleteAnniversary(id) {
  if (!confirm('이 기념일을 삭제할까요?')) return;
  try {
    const { data, sha } = await githubGetFile(ANNIV_PATH);
    const items = (Array.isArray(data) ? data : []).filter((i) => i.id !== id);
    await githubPutFile(ANNIV_PATH, items, sha, '기념일 삭제');
    toast('삭제했어요.');
    renderAnniversaries(items);
  } catch (e) {
    toast(`삭제 실패: ${e.message}`);
  }
}

/* ===== 푸시 알림 ===== */
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

async function refreshPushStatus() {
  const dot = $('pushDot'), text = $('pushStatusText'), badge = $('pushBadge'), btn = $('enablePushBtn');
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    dot.className = 'dot off'; badge.textContent = '미지원';
    text.textContent = '이 브라우저는 웹 푸시 알림을 지원하지 않아요.';
    btn.disabled = true;
    return;
  }
  const reg = await navigator.serviceWorker.getRegistration('./');
  const sub = reg ? await reg.pushManager.getSubscription() : null;
  if (sub && Notification.permission === 'granted') {
    dot.className = 'dot on'; badge.textContent = '켜짐';
    text.textContent = '이 기기에서 알림을 받을 수 있어요.';
    btn.textContent = '알림 다시 켜기';
  } else {
    dot.className = 'dot off'; badge.textContent = '꺼짐';
    text.textContent = Notification.permission === 'denied'
      ? '알림이 차단되어 있어요. 브라우저 설정에서 허용해주세요.'
      : '아직 알림이 꺼져 있어요.';
  }
}

async function enablePush() {
  if (VAPID_PUBLIC_KEY.startsWith('REPLACE_WITH')) {
    toast('앱 설정에 VAPID 공개키가 아직 입력되지 않았어요.');
    return;
  }
  try {
    const reg = await navigator.serviceWorker.register('./sw.js', { scope: './' });
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      toast('알림 권한이 필요해요.');
      return;
    }
    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
    }
    const { data, sha } = await githubGetFile(SUB_PATH);
    const subs = Array.isArray(data) ? data : [];
    const exists = subs.some((s) => s.endpoint === sub.endpoint);
    if (!exists) {
      subs.push(JSON.parse(JSON.stringify(sub)));
      await githubPutFile(SUB_PATH, subs, sha, '푸시 구독 추가');
    }
    toast('알림을 켰어요!');
    await refreshPushStatus();
  } catch (e) {
    toast(`알림 설정 실패: ${e.message}`);
  }
}

/* ===== 초기화 ===== */
document.addEventListener('DOMContentLoaded', () => {
  $('pat').value = getPat();
  $('savePatBtn').addEventListener('click', () => {
    setPat($('pat').value.trim());
    toast('토큰을 저장했어요.');
    $('settingsDetails').removeAttribute('open');
  });
  $('addBtn').addEventListener('click', addAnniversary);
  $('enablePushBtn').addEventListener('click', enablePush);

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js', { scope: './' }).catch(() => {});
  }

  refreshPushStatus();
  loadAnniversaries();
});
