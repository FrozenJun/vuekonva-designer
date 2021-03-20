import { eventBus } from '@/core/utils/vue/event-bus';
import { HttpResponeType, HttpErrorResponeType } from '@/config/http.config';
import { Canceler } from 'axios';

export enum HTTP_METHODS {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE'
}
export enum HTTP_BODY_TYPES {
  RAW_JSON = 'RAW_JSON',
  FORM_DATA = 'FORM_DATA',
  X_WWW_FORM_URLENCODED = 'X_WWW_FORM_URLENCODED'
}

export interface CancelToken {
  c: undefined | Canceler;
}

export interface ApiSendConfig {
  url?: string;
  method?: HTTP_METHODS;
  params?: { [key: string]: any };
  paramsSerializer?(params: { [key: string]: any }): string;
  paramKey?: string;
  bodyType?: HTTP_BODY_TYPES;
  headers?: { [key: string]: any };
  errorText?: string;
  isNoErrorHandle?: boolean;
  isHandleBySelf?: boolean;
  cancelToken?: CancelToken;
  disableSend?: boolean;
  mock?: any;
  delay?: number;
}

export interface ApiConfig {
  apiPrefixUrl: string; // 经过代理的接口前缀地址
  defaultBodyType: HTTP_BODY_TYPES;
  successCode: number | string;
  successMessage: string;
  errroDefaultMessage: string;
  successHandle?(): void | Promise<void>;
  errorDefaultHandle?(): void | Promise<void>;
  errorHandles?: ((
    httpStatus: number,
    res: HttpResponeType | HttpErrorResponeType
  ) => void | Promise<void>)[];
  hasNoErrorHandle?: (
    httpStatus: number,
    res: HttpResponeType | HttpErrorResponeType
  ) => boolean;
  beforeApiSend?(
    options: ApiSendConfig
  ): ApiSendConfig | Promise<ApiSendConfig>;
  globalHandle?(): void;
}

export function httpErrorHandle(errMessage: string) {
  errMessage &&
    eventBus.$message({
      type: 'error',
      message: errMessage
    });
}
