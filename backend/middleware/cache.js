// Cache middleware
const cache = (duration) => {
  let cacheObj = {};
  return (req, res, next) => {
    let key = "__express__" + req.originalUrl || req.url;
    let cachedBody = cacheObj[key];
    if (cachedBody) {
      res.send(cachedBody);
      return;
    } else {
      res.sendResponse = res.send;
      res.send = (body) => {
        cacheObj[key] = body;
        res.sendResponse(body);
      };
      setTimeout(() => {
        delete cacheObj[key];
      }, duration * 1000);
      next();
    }
  };
};
module.exports = cache;
