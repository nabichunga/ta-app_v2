const CACHE_NAME = 'ta-app-v2'; // 버전을 관리하여 업데이트가 반영되게 합니다.
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/chart.js' // 외부 라이브러리도 캐싱하면 좋습니다.
];

// 설치 단계: 필요한 리소스를 캐시에 저장
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('캐시 저장 중...');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); // 새로운 서비스 워커가 즉시 적용되도록 함
});

// 활성화 단계: 오래된 캐시 삭제
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// 페치 단계: 네트워크가 안 될 때 캐시된 파일 제공
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request);
    })
  );
});
