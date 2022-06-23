import store from '@/store';
import { ApiConfig, HTTP_BODY_TYPES } from '@/core/http/http.dto';

export const API_CONFIG: ApiConfig = {
  apiPrefixUrl: process.env.NODE_ENV === 'production' ? '/api' : '/api',
  defaultBodyType: HTTP_BODY_TYPES.X_WWW_FORM_URLENCODED,
  successCode: 'SuccessOperation',
  successMessage: '请求成功',
  errroDefaultMessage: '服务器连接出现问题',
  errorHandles: [
    (httpStatus) => {
      if (httpStatus === 401) {
        store.commit('tokenExpired');
      }
    }
  ],
  beforeApiSend(options) {
    const token = store.state.user.access_token;
    const tokenType = store.state.user.token_type;
    if (token) {
      if (options.headers) {
        options.headers.Authorization = `${tokenType} ${token}`;
      } else {
        options.headers = {
          Authorization: `${tokenType} ${token}`
        };
      }
    }
    return options;
  },
  hasNoErrorHandle(httpStatus) {
    if (httpStatus === 401) return true;
    return false;
  }
};

export interface HttpResponeType {
  code: number | string;
  message: string;
  result: any;
  timestamp: number;
}

export interface HttpErrorResponeType {
  code: number | string;
  message: string;
  result: any;
  timestamp: number;
}
