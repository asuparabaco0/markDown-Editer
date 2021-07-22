const CacheName = 'Cache:v1'

self.addEventListener('install', (event) => {  
  console.log('ServiceWorker install:', event)  
})  
  
self.addEventListener('activate', (event) => {  
  console.log('ServiceWorker activate:', event)  
})

const networkFallingBackToCache = async (request) => {
  const cache = await caches.open(CacheName)
  try {
    //リクエストに対してレスポンスを保持してくれるシンプルな仕組みでキャッシュを提供してくれる
    const response = await fetch(request)
    //response内部に一度しか読み込めないものがあるため黒0\－んする
    await cache.put(request, response.clone())
    return response
  } catch (err) {
    console.error(err)
    // promiseを返すが、この場合undefinedに解決され返却
    return cache.match(request)
  }
}

self.addEventListener('fetch', (event) => {
  //非同期処理を待機して結果を返却してくれるメソッド
   event.respondWith(networkFallingBackToCache(event.request))
  })