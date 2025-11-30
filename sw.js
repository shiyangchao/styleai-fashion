// StyleAI Service Worker
// 提供离线功能、缓存管理和后台同步

const CACHE_NAME = 'styleai-v2.0.0';
const STATIC_CACHE_NAME = 'styleai-static-v2.0.0';
const DYNAMIC_CACHE_NAME = 'styleai-dynamic-v2.0.0';

// 需要缓存的关键资源
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/manifest.json',
    'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=Inter:wght@400;500;600&display=swap',
    'https://unpkg.com/lucide@latest/dist/umd/lucide.js',
    // 添加图片资源
    '/icon-192x192.png',
    '/icon-512x512.png'
];

// 安装事件
self.addEventListener('install', event => {
    console.log('🔧 Service Worker 安装中...');
    
    event.waitUntil(
        Promise.all([
            // 缓存静态资源
            caches.open(STATIC_CACHE_NAME)
                .then(cache => {
                    console.log('📦 缓存静态资源');
                    return cache.addAll(STATIC_ASSETS);
                }),
            // 跳过等待
            self.skipWaiting()
        ])
    );
});

// 激活事件
self.addEventListener('activate', event => {
    console.log('✅ Service Worker 已激活');
    
    event.waitUntil(
        Promise.all([
            // 清理旧缓存
            cleanupOldCaches(),
            // 立即控制所有客户端
            self.clients.claim()
        ])
    );
});

// 清理旧缓存
async function cleanupOldCaches() {
    const cacheNames = await caches.keys();
    const deletePromises = cacheNames
        .filter(cacheName => 
            cacheName !== STATIC_CACHE_NAME && 
            cacheName !== DYNAMIC_CACHE_NAME &&
            cacheName.startsWith('styleai-')
        )
        .map(cacheName => {
            console.log('🗑️ 删除旧缓存:', cacheName);
            return caches.delete(cacheName);
        });
    
    return Promise.all(deletePromises);
}

// 请求拦截
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // 只处理同域请求
    if (url.origin !== location.origin) {
        return;
    }
    
    // 处理不同类型的请求
    if (request.method === 'GET') {
        // API 请求 - 网络优先
        if (url.pathname.startsWith('/api/')) {
            event.respondWith(networkFirstStrategy(request));
        }
        // 静态资源 - 缓存优先
        else if (isStaticAsset(request.url)) {
            event.respondWith(cacheFirstStrategy(request));
        }
        // 页面请求 - 网络优先，但支持离线
        else {
            event.respondWith(staleWhileRevalidateStrategy(request));
        }
    }
});

// 缓存优先策略 (用于静态资源)
async function cacheFirstStrategy(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        const cache = await caches.open(STATIC_CACHE_NAME);
        cache.put(request, networkResponse.clone());
        
        return networkResponse;
    } catch (error) {
        console.error('缓存优先策略失败:', error);
        return new Response('离线状态，无法加载资源', { status: 503 });
    }
}

// 网络优先策略 (用于API请求)
async function networkFirstStrategy(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('网络请求失败，尝试使用缓存:', error);
        
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // 如果是 API 请求，返回错误响应
        if (request.url.includes('/api/')) {
            return new Response(JSON.stringify({
                error: 'Service Unavailable',
                message: '网络连接不可用，请稍后重试',
                offline: true
            }), {
                status: 503,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // 页面请求返回缓存的主页
        return caches.match('/');
    }
}

// 过期重新验证策略 (用于页面)
async function staleWhileRevalidateStrategy(request) {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    // 启动网络请求（后台）
    const networkResponsePromise = fetch(request).then(async networkResponse => {
        if (networkResponse.ok) {
            await cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    }).catch(() => null);
    
    // 如果有缓存，立即返回；否则等待网络请求
    return cachedResponse || await networkResponsePromise || new Response('离线状态', { status: 503 });
}

// 判断是否为静态资源
function isStaticAsset(url) {
    const staticExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot'];
    return staticExtensions.some(ext => url.includes(ext)) || url.includes('/assets/');
}

// 后台同步
self.addEventListener('sync', event => {
    console.log('🔄 后台同步事件:', event.tag);
    
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

// 执行后台同步
async function doBackgroundSync() {
    try {
        // 同步用户偏好设置
        const settings = await getStoredSettings();
        if (settings && settings.lastSync < Date.now() - 24 * 60 * 60 * 1000) {
            await syncUserPreferences(settings);
        }
    } catch (error) {
        console.error('后台同步失败:', error);
    }
}

// 推送通知
self.addEventListener('push', event => {
    console.log('📨 推送通知接收');
    
    const data = event.data ? event.data.json() : {};
    const options = {
        body: data.body || '您有新的搭配推荐！',
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        tag: data.tag || 'styleai-notification',
        data: data.data || {},
        actions: [
            {
                action: 'view',
                title: '查看',
                icon: '/action-view.png'
            },
            {
                action: 'dismiss',
                title: '忽略',
                icon: '/action-dismiss.png'
            }
        ],
        requireInteraction: true,
        silent: false
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title || 'StyleAI', options)
    );
});

// 通知点击处理
self.addEventListener('notificationclick', event => {
    console.log('👆 通知被点击:', event.action);
    
    event.notification.close();
    
    const action = event.action;
    const data = event.notification.data;
    
    if (action === 'view' || !action) {
        // 打开应用或导航到相应页面
        event.waitUntil(
            clients.matchAll({ type: 'window', includeUncontrolled: true })
                .then(clientList => {
                    // 如果应用已打开，聚焦到它
                    for (const client of clientList) {
                        if (client.url === self.location.origin) {
                            return client.focus();
                        }
                    }
                    
                    // 否则打开新窗口
                    return clients.openWindow(data?.url || '/');
                })
        );
    } else if (action === 'dismiss') {
        // 处理忽略操作
        console.log('通知被忽略');
    }
});

// 消息处理
self.addEventListener('message', event => {
    console.log('📨 消息接收:', event.data);
    
    const { type, payload } = event.data;
    
    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
            
        case 'GET_VERSION':
            event.ports[0].postMessage({ version: CACHE_NAME });
            break;
            
        case 'CLEAR_CACHE':
            event.waitUntil(clearAllCaches());
            event.ports[0].postMessage({ success: true });
            break;
            
        default:
            console.log('未知的消息类型:', type);
    }
});

// 获取存储的设置
async function getStoredSettings() {
    try {
        const cache = await caches.open(DYNAMIC_CACHE_NAME);
        const response = await cache.match('/user-settings');
        return response ? await response.json() : null;
    } catch (error) {
        console.error('获取设置失败:', error);
        return null;
    }
}

// 同步用户偏好
async function syncUserPreferences(settings) {
    try {
        // 这里可以与服务器同步用户偏好
        console.log('同步用户偏好:', settings);
        
        const updatedSettings = {
            ...settings,
            lastSync: Date.now()
        };
        
        // 更新本地存储
        const cache = await caches.open(DYNAMIC_CACHE_NAME);
        await cache.put('/user-settings', new Response(JSON.stringify(updatedSettings)));
        
    } catch (error) {
        console.error('同步用户偏好失败:', error);
    }
}

// 清除所有缓存
async function clearAllCaches() {
    const cacheNames = await caches.keys();
    const deletePromises = cacheNames
        .filter(name => name.startsWith('styleai-'))
        .map(name => caches.delete(name));
    
    return Promise.all(deletePromises);
}

// 定期清理过期缓存
setInterval(async () => {
    try {
        const cache = await caches.open(DYNAMIC_CACHE_NAME);
        const requests = await cache.keys();
        
        // 清理7天前的动态缓存
        const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        
        for (const request of requests) {
            const response = await cache.match(request);
            if (response && response.headers.get('sw-cache-time')) {
                const cacheTime = parseInt(response.headers.get('sw-cache-time'));
                if (cacheTime < weekAgo) {
                    await cache.delete(request);
                    console.log('删除过期缓存:', request.url);
                }
            }
        }
    } catch (error) {
        console.error('清理过期缓存失败:', error);
    }
}, 24 * 60 * 60 * 1000); // 每天执行一次

console.log('🚀 Service Worker 脚本已加载');