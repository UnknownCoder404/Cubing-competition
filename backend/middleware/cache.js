const NodeCache = require("node-cache");

// Initialize NodeCache without a global TTL
const nodeCache = new NodeCache({ checkperiod: 120 });

// Middleware factory function to create cache middleware with custom TTL
const cache = (ttl) => {
  return (req, res, next) => {
    const key = req.originalUrl;
    const cachedResponse = nodeCache.get(key);
    if (cachedResponse) {
      res.send(cachedResponse);
    } else {
      res.originalSend = res.send;
      res.send = (body) => {
        nodeCache.set(key, body, ttl);
        res.originalSend(body);
      };
      next();
    }
  };
};
module.exports = cache;
