interface RequestInstanceParams {
  baseUrl: string;
  headers?: object;
}

interface RequestResponse {
  data: any;
  status: number;
  instance: RequestInstance,
}

enum RequestAction {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Delete = 'DELETE',
}

type RequestDataPaylaod = null | object | FormData;

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
}

export default class RequestInstance {
  baseUrl: string;
  method: RequestAction;
  url: string | null;
  data: RequestDataPaylaod;
  headers: object;

  constructor({
    baseUrl,
    headers = {},
  }: RequestInstanceParams) {
    this.baseUrl = baseUrl;

    this.headers = ({...DEFAULT_HEADERS, ...headers});
    this.url = null;
    this.method = RequestAction.Get;
    this.data = null;
  }

  prepareRequestData = () => {
    let payloadParams = null;
    let additionalHeaders = {};

    if (this.data instanceof FormData) {
      payloadParams = this.data;
      additionalHeaders = {'Content-Type': 'application/x-www-form-urlencoded'}
    } else if (this.data) {
      payloadParams = JSON.stringify(this.data);
    }

    return {
      payloadParams,
      additionalHeaders,
    }
  }

  request = async (): Promise<RequestResponse> => {
    if (!this.url) {
      throw new Error('Url must be specified.');
    }

    const { payloadParams, additionalHeaders } = this.prepareRequestData();

    const requestHeaders: {
      [key: string]: string;
    } = {...this.headers, ...additionalHeaders};

    const httpHeaders = new Headers();
    Object.keys(requestHeaders).forEach((key) => {
      httpHeaders.append(key, requestHeaders[key]);
    });

    console.log('Starting request: ');
    console.log({instance: this, payloadParams, requestHeaders});

    const response = await fetch(`${this.baseUrl}${this.url}`, {
      headers: requestHeaders,
      method: this.method,
      ...(payloadParams ? {body: payloadParams as BodyInit} : {}),
    });

    console.log(`Response code: ${response.status}`);

    if (response.status >= 200 && response.status < 400) {
      if (response.status === 204) {
        return {
          instance: this,
          data: {},
          status: response.status,
        }
      }

      const json = await response.json();

      return {
        data: json,
        status: response.status,
        instance: this,
      }
    } else if (response.status < 500) {
      const json = await response.json();

      const responseData = JSON.stringify({
        data: json,
        status: response.status,
        instance: this,
      });

      throw new Error(responseData);
    }

    throw new Error('Server error');
  }

  get = async (url: string, data: RequestDataPaylaod = null) => {
    this.method = RequestAction.Get;
    this.data = data;
    this.url = url;

    return await this.request();
  }

  post = async (url: string, data: RequestDataPaylaod = null) => {
    this.method = RequestAction.Post;
    this.data = data;
    this.url = url;

    return await this.request();
  }

  put = async (url: string, data: RequestDataPaylaod = null) => {
    this.method = RequestAction.Put;
    this.data = data;
    this.url = url;

    return await this.request();
  }
}
