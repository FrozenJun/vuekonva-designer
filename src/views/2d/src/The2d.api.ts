import { Send, HTTP_METHODS } from '@/core/http';
import { HTTP_BODY_TYPES } from '@/core/http/http.dto';

class Api {
  // 获取模型
  getById(params?: any) {
    return Send({
      url: '/vis/model/{id}',
      params,
      method: HTTP_METHODS.GET,
      errorText: '获取数据失败'
    });
  }
  // 保存模型
  save(params?: any) {
    return Send({
      url: '/vis/model/two-dimension',
      params,
      method: HTTP_METHODS.PUT,
      bodyType: HTTP_BODY_TYPES.RAW_JSON,
      errorText: '更改失败'
    });
  }
  // 发布模型
  public(params?: any) {
    return Send({
      url: '/vis/model/publish',
      params,
      method: HTTP_METHODS.POST,
      errorText: '操作失败'
    });
  }
  // 上传自定义图标
  iconUpload(params?: any) {
    return Send({
      url: '/vis/icon/adds',
      params,
      method: HTTP_METHODS.POST,
      bodyType: HTTP_BODY_TYPES.RAW_JSON,
      errorText: '上传失败'
    });
  }

  // 获取自定义图标
  iconList(params?: any) {
    return Send({
      url: '/vis/icon',
      params,
      method: HTTP_METHODS.GET,
      errorText: '获取自定义图标失败'
    });
  }

  // 上传图片
  uploadImg(params?: any) {
    return Send({
      url: '/file/upload',
      params,
      method: HTTP_METHODS.POST,
      bodyType: HTTP_BODY_TYPES.FORM_DATA,
      errorText: '上传图标失败'
    });
  }
}

export const The2dApi = new Api();
