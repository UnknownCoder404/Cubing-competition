// Cache middleware
const cache = (duration, options = {}) => {
  // Consider using a dedicated cache library like express-cache-middleware
  const cacheStore = options.cacheStore || new Map(); // Use a Map for in-memory cache

  return (req, res, next) => {
    const { originalUrl, url } = req;
    const key = generateCacheKey(originalUrl || url, options.keyPrefix); // Customize key generation

    const cachedBody = cacheStore.get(key);
    if (cachedBody) {
      res.send(cachedBody);
      return;
    }

    const originalSend = res.send;
    res.send = (body) => {
      cacheStore.set(key, body, duration * 1000);
      res.setHeader("Cache-Control", `public, max-age=${duration}`); // Set cache headers
      originalSend.call(res, body); // Call original send method
    };

    next();
  };
};

// Optional helper function to customize cache key generation
function generateCacheKey(url, prefix = "__express__") {
  // Implement your logic here to potentially exclude parts of the URL
  // You can include relevant parts like path and specific query string parameters
  return `${prefix}${url}`;
}

module.exports = cache;
