export interface StageDataContent {
  canvas: {
    width: number;
    height: number;
    background: string;
  };
  shapeList: any[];
}

// 后台返回数据的格式 - 只列了用到的数据字段
export interface StageData {
  content: string;
  id: string;
  previewUrl: string;
  name: string;
  status: number;
}
