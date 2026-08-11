// 매일 GitHub Actions cron으로 실행되어, 오늘/내일이 등록된 음력 기념일과
// 일치하는 구독자에게 웹 푸시 알림을 보냅니다.
import { readFile, writeFile } from 'node:fs/promises';
import KoreanLunarCalendar from 'korean-lunar-calendar';
import webpush from 'web-push';

const ANNIV_PATH = new URL('../data/anniversaries.json', import.meta.url);
const SUB_PATH = new URL('../data/subscriptions.json', import.meta.url);

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:sjtiger234@gmail.com';
const TEST_MODE = process.env.TEST_MODE === 'true';

if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
  console.error('VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY 환경변수(시크릿)가 설정되어 있지 않습니다.');
  process.exit(1);
}

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

async function readJson(url, fallback) {
  try {
    return JSON.parse(await readFile(url, 'utf8'));
  } catch (e) {
    return fallback;
  }
}

// Asia/Seoul 기준 YYYY-MM-DD 문자열
function seoulDateString(date) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul' }).format(date);
}

function addDays(dateStr, n) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + n);
  return seoulDateString(dt);
}

function solarDateStringsForLunar(lunarMonth, lunarDay, isLeap, centerYear) {
  const results = [];
  for (const year of [centerYear - 1, centerYear, centerYear + 1]) {
    const cal = new KoreanLunarCalendar();
    if (!cal.setLunarDate(year, lunarMonth, lunarDay, isLeap)) continue;
    const s = cal.getSolarCalendar();
    results.push(`${s.year}-${String(s.month).padStart(2, '0')}-${String(s.day).padStart(2, '0')}`);
  }
  return results;
}

async function main() {
  const now = new Date();
  const todayStr = seoulDateString(now);
  const tomorrowStr = addDays(todayStr, 1);
  const centerYear = Number(todayStr.slice(0, 4));

  const anniversaries = await readJson(ANNIV_PATH, []);
  let subscriptions = await readJson(SUB_PATH, []);

  console.log(`오늘(KST): ${todayStr}, 내일(KST): ${tomorrowStr}`);
  console.log(`기념일 ${anniversaries.length}건, 구독 ${subscriptions.length}건`);

  const messages = [];

  if (TEST_MODE) {
    messages.push({
      title: '음력 기념일 알리미 테스트',
      body: '이 메시지가 보이면 알림 설정이 정상 작동하는 거예요.',
      tag: 'test',
    });
  }

  for (const item of anniversaries) {
    const solarDates = solarDateStringsForLunar(item.lunarMonth, item.lunarDay, !!item.isLeap, centerYear);
    if (solarDates.includes(todayStr)) {
      messages.push({ title: '오늘은 기념일이에요 🎉', body: `오늘은 "${item.name}"입니다.`, tag: `anniv-${item.id}-today` });
    }
    if (solarDates.includes(tomorrowStr)) {
      messages.push({ title: '내일은 기념일이에요', body: `내일은 "${item.name}"입니다. 미리 챙겨보세요.`, tag: `anniv-${item.id}-tomorrow` });
    }
  }

  if (!messages.length) {
    console.log('오늘 보낼 알림이 없습니다.');
    return;
  }

  const stillValid = [];
  for (const sub of subscriptions) {
    let keepSub = true;
    for (const msg of messages) {
      try {
        await webpush.sendNotification(sub, JSON.stringify({ ...msg, url: '/lunar-reminder/' }));
        console.log(`전송 성공: ${msg.tag} -> ${sub.endpoint.slice(0, 60)}...`);
      } catch (err) {
        console.error(`전송 실패 (${err.statusCode || 'ERR'}): ${sub.endpoint.slice(0, 60)}...`, err.body || err.message);
        if (err.statusCode === 404 || err.statusCode === 410) {
          keepSub = false; // 만료/삭제된 구독
        }
      }
    }
    if (keepSub) stillValid.push(sub);
  }

  if (stillValid.length !== subscriptions.length) {
    await writeFile(SUB_PATH, JSON.stringify(stillValid, null, 2) + '\n', 'utf8');
    console.log(`만료된 구독 ${subscriptions.length - stillValid.length}건을 정리했습니다.`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
