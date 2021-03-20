import {
  IMAGE_MAX_WIDTH,
  IMAGE_MAX_HEIGHT,
  IMAGE_MIN_WIDTH,
  IMAGE_MIN_HEIGHT
} from '../constants/variable.constant';

/**
 * 获取列表数据中最大的id
 * @param list 列表数据
 */
export function getListMaxId(list: any[]) {
  return (
    (list.length &&
      list.map((i) => Number(i.id)).sort((a: any, b: any) => b - a)[0]) ||
    0
  );
}

/**
 * 根据src返回image的实例
 * @param src 图片src
 * @param onLoad 图片加载完成后的回调
 * @param onError 图片加载错误后的回调
 */
export function getImageObj(
  src: string,
  onLoad?: Function,
  onError?: Function
) {
  const image = new Image();
  image.onload = () => {
    const { width, height } = getImageSize(image);
    image.width = width;
    image.height = height;
    onLoad && onLoad(image);
  };
  // 捕获错误，图片加载出错会导致konva报错而出现渲染错误
  image.onerror = (e) => {
    onError && onError(image, e);
  };
  image.src = src;
  return image;
}
/**
 * 异步的根据src返回image的实例
 * @param src 图片src
 */
export async function getImageObjAsync(src: string) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const { width, height } = getImageSize(image);
      image.width = width;
      image.height = height;
      resolve(image);
    };
    // 捕获错误，图片加载出错会导致konva报错而出现渲染错误
    image.onerror = (e) => {
      reject(e);
    };
    image.src = src;
  });
}

/**
 * 图片太大需要缩放尺寸以满足IMAGE_MAX_WIDTH，IMAGE_MAX_HEIGHT
 */
export function getImageSize(image: any) {
  const owidth = image.width;
  const oheight = image.height;
  let width = 0;
  let height = 0;
  const widthMaxScale = owidth / IMAGE_MAX_WIDTH;
  const heightMaxScale = oheight / IMAGE_MAX_HEIGHT;
  const maxScale = Math.max(widthMaxScale, heightMaxScale);
  if (maxScale > 1) {
    width = owidth / maxScale;
    height = oheight / maxScale;
  }
  const widthMinScale = owidth / IMAGE_MIN_WIDTH;
  const heightMinScale = oheight / IMAGE_MIN_HEIGHT;
  const minScale = Math.min(widthMinScale, heightMinScale);
  if (minScale < 1) {
    width = owidth / minScale;
    height = oheight / minScale;
  }
  return { width, height };
}

export function getBase64Image(img: any, useNaturalSize?: boolean) {
  var canvas = document.createElement('canvas');
  canvas.width = useNaturalSize ? img.naturalWidth : img.width;
  canvas.height = useNaturalSize ? img.naturalHeight : img.height;

  var ctx = canvas.getContext('2d');
  ctx && ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  var dataURL = canvas.toDataURL('image/png', 1);
  return dataURL;

  // return dataURL.replace("data:image/png;base64,", "");
}
