const { scheduleJob } = require("node-schedule");

const cache = (duration, options = {}) => {
  const cacheStore = options.cacheStore || new Map();

  // Cleanup function to remove expired cache entries
  const cleanupCache = () => {
    const now = Date.now();
    for (const [key, { timestamp }] of cacheStore.entries()) {
      if (now - timestamp >= duration * 1000) {
        cacheStore.delete(key);
      }
    }
  };

  // Schedule cleanup job to run every second
  scheduleJob("/1 * * * * *", cleanupCache);

  return (req, res, next) => {
    const { originalUrl, url } = req;
    const key = generateCacheKey(originalUrl || url, options.keyPrefix);

    const cachedEntry = cacheStore.get(key);
    if (cachedEntry && Date.now() - cachedEntry.timestamp < duration * 1000) {
      res.send(cachedEntry.body);
      return;
    }

    const originalSend = res.send;
    res.send = (body) => {
      cacheStore.set(key, { body, timestamp: Date.now() });
      res.setHeader("Cache-Control", `public, max-age=${duration}`);
      originalSend.call(res, body);
    };

    next();
  };
};

// Helper function to generate cache key
function generateCacheKey(url, prefix = "__express__") {
  return `${prefix}${url}`;
}

module.exports = cache;
