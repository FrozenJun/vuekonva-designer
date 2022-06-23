import { CustomizeComponentAdapter } from '@/core/dtos/component-customize.dto';

export interface CompDataBusAdapter extends CustomizeComponentAdapter {
  on?: {};
}

export interface EmitBody {
  eventName: string;
  data?: any;
}
export interface CompDataBusOutput {
  send(data: any): void;
  emit(emitBody: string | EmitBody): void;
}
