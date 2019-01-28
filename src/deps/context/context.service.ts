import { Injectable } from '@nestjs/common'
import { createNamespace, getNamespace } from 'cls-hooked'

export enum ContextTypes {
  LOCALE = 'LOCALE',
  ROOT = 'CONTEXT',
  TRACE_ID = 'TRACE_ID',
  REQUEST_TIMER = 'REQUEST_TIMER',
}

@Injectable()
export class ContextService {
  constructor() {}
  
  public create(callback) {
    createNamespace(ContextTypes.ROOT).run(callback)
  }

  public get store() {
    return getNamespace(ContextTypes.ROOT)
  }

  // trace id
  public set traceId(traceId: string) {
    this.store.set(ContextTypes.TRACE_ID, traceId)
  }

  public get traceId() {
    return this.store.get(ContextTypes.TRACE_ID)
  }
}
