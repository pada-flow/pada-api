import { Injectable, HttpException } from '@nestjs/common'
import * as axios from 'axios'
import autobind from 'autobind-decorator'
import { get } from 'lodash'

import { PadaLogger } from '../logger'
import { ContextService } from '../context'

@Injectable()
export class HttpService {
  constructor(
    private readonly ctx: ContextService,
    private readonly logger: PadaLogger
  ) {
    // default request setting
    axios.default.interceptors.request.use(
      this.requestInterceptor
    )

    // default response setting
    axios.default.interceptors.response.use(
      this.successInterceptor,
      this.errorInterceptor,
    )
  }

  public delete(uri: string, config?: axios.AxiosRequestConfig) {
    return axios.default.delete(uri, config)
  }

  public get(uri: string, config?: axios.AxiosRequestConfig) {
    return axios.default.get(uri, config)
  }

  public post(uri: string, body: any, config?: axios.AxiosRequestConfig) {
    return axios.default.post(uri, body, config)
  }

  public put(uri: string, body: any, config?: axios.AxiosRequestConfig) {
    return axios.default.put(uri, body, config)
  }

  private getRequestDuration() {
    return Date.now() - this.ctx.requestStartTime
  }

  private formatLogMessage({ message, method, url, status }) {
    return (
      `Http => ${method} ${url} ${status}` +
      (message ? ` - ${message}` : '') +
      ` +${this.getRequestDuration()}ms`
    )
  }

  private formatRequestLogMessage({ method, url }) {
    return (
      `Http => ${method} ${url} start`
    )
  }

  @autobind
  private requestInterceptor(config) {
    this.ctx.requestStartTime = Date.now()
    this.logger.info(
      this.formatRequestLogMessage({
        method: config.method.toUpperCase(),
        url: config.url,
      })
    )
    return config
  }

  @autobind
  private successInterceptor(response) {
    this.logger.info(
      this.formatLogMessage({
        message: null,
        method: response.config.method.toUpperCase(),
        status: response.status,
        url: response.url,
      }),
    )
    return response
  }

  @autobind
  private errorInterceptor(error) {
    const responseErrorDataCode = get(error, 'response.data.error.code')
    const responseErrorDataMessage = get(error, 'response.data.error.message')
    const msg = responseErrorDataMessage ? `${responseErrorDataCode}: ${responseErrorDataMessage}` : error.message

    return Promise.reject(
      new HttpException(msg, error.response.status)
    )
  }
  
}