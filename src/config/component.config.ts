import { eventBus } from './../core/utils/vue/event-bus';
import { API_CONFIG } from '@/config/http.config';
import { ComponentConfig } from './../core/dtos/factories.dto';

export const COMPONENT_CONFIG: ComponentConfig = {
  upload: {
    width: '120px',
    height: '120px',
    action: API_CONFIG.apiPrefixUrl + '/file/upload',
    getModelByRes(res, config, oldModel) {
      if (res.code !== API_CONFIG.successCode) {
        eventBus.$message.error(res.message || '上传失败');
        return '';
      }
      if (!config.limit || config.limit > 1) {
        let arrayModel: string[];
        if (_.isArray(oldModel)) {
          arrayModel = oldModel;
        } else if (oldModel) {
          arrayModel = [oldModel];
        } else {
          arrayModel = [];
        }
        return [...arrayModel, res.result.id];
      } else {
        return res.result.id;
      }
    },
    async getUploadsByModel(model, config) {
      const getInfoById = async (id: string, isNeedName = false) => {
        const base = {
          id,
          url: `${API_CONFIG.apiPrefixUrl}/file/download?id=${id}`,
          name: ''
        };
        if (isNeedName) {
          base.name =  '';
        }
        return base;
      };
      if (_.isArray(model)) {
        const res = await Promise.all(
          model.map(async (i: string) => {
            const res = await getInfoById(i, config.type === 'file');
            return res;
          })
        );
        return res;
      } else {
        const res = model
          ? [await getInfoById(model, config.type === 'file')]
          : [];
        return res;
      }
    }
  }
};
