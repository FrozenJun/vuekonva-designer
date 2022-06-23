import { CancelTokenService } from './../service/cancel-token.service';
import http, { AxiosResponse } from 'axios';
import { API_CONFIG, HttpResponeType } from '@/config/http.config';
import {
  ApiSendConfig,
  httpErrorHandle,
  HTTP_METHODS,
  HTTP_BODY_TYPES
} from './http.dto';
import qs from 'qs';

API_CONFIG.globalHandle && API_CONFIG.globalHandle();

function transformToFormData(body: { [k: string]: any }): FormData {
  const formData = new FormData();
  Object.keys(body).forEach((key) => {
    // 对于file类型和file列表的特殊处理
    if (
      _.isArray(body[key]) &&
      body[key].every((i: any) => Reflect.toString.call(i) === '[object File]')
    ) {
      body[key].forEach((file: File) => formData.append(key, file, file.name));
    } else if (Reflect.toString.call(body[key]) === '[object File]') {
      formData.append(key, body[key], body[key].name);
    } else {
      formData.append(key, body[key]);
    }
  });
  return formData;
}

function transformParamsAndHeaders(
  type: HTTP_BODY_TYPES,
  params: any,
  headers: any
) {
  switch (type) {
    case HTTP_BODY_TYPES.FORM_DATA:
      params = transformToFormData(params);
      break;
    case HTTP_BODY_TYPES.X_WWW_FORM_URLENCODED:
      Object.assign(headers, {
        'Content-Type': 'application/x-www-form-urlencoded'
      });
      params = qs.stringify(params);
  }
  return {
    params,
    headers
  };
}

/**
 * url中有变量时，解析变量并删除params中对应的参数
 * ```javascript
 * _handleUrlVariable({ url: '/test/{id}', params: { id: 1 } }) // { url: '/test/1', params: {} }
 * ```
 * @param options ApiSendConfig
 */
function _handleUrlVariable(options: ApiSendConfig) {
  const URL_VARIABLE_REGEXP = /\{([a-zA-Z0-9_-]{1,})\}/g;
  if (!options.url) return options;
  const matchs = options.url.match(URL_VARIABLE_REGEXP);
  if (!matchs) return options;
  matchs.forEach((match) => {
    const key = match.substring(1, match.length - 1);
    if (options.params && options.params[key]) {
      options.url = options.url!.replace(match, String(options.params[key]));
      Reflect.deleteProperty(options.params, key);
    }
  });
  return options;
}

async function SendApi(options: ApiSendConfig) {
  /**
   * 务必放在函数的最上面，防止await函数导致获取的CancelToken顺序混乱
   * 当前的问题也是如此，从调用函数开始到现在的这段代码中均不能有await
   */
  const CancelToken = {
    cancelToken: new http.CancelToken((c) => {
      options.cancelToken
        ? (options.cancelToken.c = c)
        : CancelTokenService.set(c);
    })
  };
  if (API_CONFIG.beforeApiSend) {
    options = await API_CONFIG.beforeApiSend(options);
  }
  const {
    url = '',
    method = HTTP_METHODS.GET,
    params = {},
    paramsSerializer,
    bodyType = API_CONFIG.defaultBodyType,
    headers = {},
    errorText = '',
    isNoErrorHandle,
    isHandleBySelf
  }: ApiSendConfig = options;
  try {
    let res: AxiosResponse<HttpResponeType>;
    let data: { [k: string]: any } = {};

    switch (method) {
      case HTTP_METHODS.GET:
        res = await http.get(API_CONFIG.apiPrefixUrl + url, {
          ...CancelToken,
          params,
          paramsSerializer,
          headers
        });
        break;
      case HTTP_METHODS.POST:
        data = transformParamsAndHeaders(bodyType, params, headers);
        res = await http.post(API_CONFIG.apiPrefixUrl + url, data.params, {
          ...CancelToken,
          headers: data.headers
        });
        break;
      case HTTP_METHODS.PUT:
        data = transformParamsAndHeaders(bodyType, params, headers);
        res = await http.put(API_CONFIG.apiPrefixUrl + url, data.params, {
          ...CancelToken,
          headers: data.headers
        });
        break;
      case HTTP_METHODS.DELETE:
        res = await http.delete(API_CONFIG.apiPrefixUrl + url, {
          ...CancelToken,
          paramsSerializer,
          params,
          headers
        });
        break;
      default:
        res = await http.get(API_CONFIG.apiPrefixUrl + url, {
          ...CancelToken,
          paramsSerializer,
          params,
          headers
        });
    }
    if (isHandleBySelf) {
      return Promise.resolve(res);
    }
    if (res.data.code === API_CONFIG.successCode) {
      API_CONFIG.successHandle && (await API_CONFIG.successHandle());
      return Promise.resolve(res.data.result || API_CONFIG.successMessage);
    } else {
      API_CONFIG.errorHandles &&
        API_CONFIG.errorHandles.forEach(async (errorHandle) => {
          await errorHandle(200, res.data);
        });
      !isNoErrorHandle &&
        (!API_CONFIG.hasNoErrorHandle ||
          !API_CONFIG.hasNoErrorHandle(200, res.data)) &&
        httpErrorHandle(res.data.message || errorText);
      return Promise.resolve(null);
    }
  } catch (e) {
    console.warn(e);
    if (e.__CANCEL__) {
      // 如果请求被cancel，不做任何处理
      return Promise.resolve(null);
    }
    if (isHandleBySelf) {
      return Promise.resolve(e.response);
    }
    if (e.response) {
      API_CONFIG.errorHandles &&
        API_CONFIG.errorHandles.forEach(async (errorHandle) => {
          await errorHandle(e.response.status, e.response.data);
        });
    }
    !isNoErrorHandle &&
      (!API_CONFIG.hasNoErrorHandle ||
        !API_CONFIG.hasNoErrorHandle(e.response.status, e.response.data)) &&
      httpErrorHandle(
        (e.response && e.response.data.message) ||
          errorText ||
          API_CONFIG.errroDefaultMessage
      );
    return Promise.resolve(null);
  }
}

export async function Send(options: ApiSendConfig = {}) {
  if (options.mock) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        resolve(options.mock);
      }, options.delay || 0);
    });
  } else {
    if (options.params) options.params = _.cloneDeep(options.params);
    const opts = _handleUrlVariable(options);
    if (opts.params && options.paramKey) {
      opts.params = opts.params[options.paramKey];
    }
    return SendApi(opts);
  }
}
