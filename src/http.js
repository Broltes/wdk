class Http {
  /**
   * Serialize an object to a URL-encoded query string
   */
  static param(obj) {
    const params = [];

    Object.keys(obj).forEach((key) => {
      params.push(`${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`);
    });

    return params.join('&');
  }

  /**
   * @param {Object} config
   * @param {String} config.url
   * @param {String} [config.method=get]
   * @param {Object} [config.params] URL parameters
   * @param {Object} [config.data]
   * @param {Object} [config.headers={}]
   * @param {Boolean} [config.withCredentials=false]
   * @param {Number} [config.timeout]
   */
  constructor(config) {
    let { url } = config;
    const {
      method = 'get',
      params,
      headers = {},
      withCredentials = false,
      timeout,
    } = config;

    const req = new XMLHttpRequest();
    if (params) url += `?${Http.param(params)}`;

    req.open(method.toUpperCase(), url, true);
    req.withCredentials = withCredentials;
    if (timeout) req.timeout = timeout;

    Object.keys(headers).forEach((key) => {
      req.setRequestHeader(key, headers[key]);
    });

    this.request = req;
    this.config = config;
  }

  send() {
    const { req, config } = this;
    const { data, onError, onTimeout } = config;
    return new Promise((resolve, reject) => {
      // network error
      if (onError) {
        req.onerror = function () {
          onError(req);
          reject(req);
        };
      }

      // timeout error
      if (onTimeout) {
        req.ontimeout = function () {
          onTimeout(req);
          reject(req);
        };
      }

      // req.readyState = 4
      req.onload = function () {
        resolve(req);
      };

      req.send(data);
    }).then(() => {
      if (/json/.test(req.getResponseHeader('Content-Type'))) {
        req.data = JSON.parse(req.responseText || null);
      }

      return req;
    });
  }

  abort() {
    this.req.abort();
  }
}

export default Http;
