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
  headers: {[key: string]: string;};

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
    let deleteHeaders: string[] = [];

    if (this.data instanceof FormData) {
      payloadParams = this.data;
      deleteHeaders = ['Content-Type'];
    } else if (this.data) {
      payloadParams = JSON.stringify(this.data);
    }

    return {
      payloadParams,
      deleteHeaders,
    }
  }

  request = async (): Promise<RequestResponse> => {
    if (!this.url) {
      throw new Error('Url must be specified.');
    }

    const { payloadParams, deleteHeaders } = this.prepareRequestData();

    const requestHeaders: {
      [key: string]: string;
    } = this.headers;

    deleteHeaders.forEach((element) => {
      delete requestHeaders[element];
    })

    this.headers = requestHeaders;

    console.log(`Starting request ${this.url}: `);
    console.log({instance: this, payloadParams});

    const response = await fetch(`${this.baseUrl}${this.url}`, {
      headers: requestHeaders,
      method: this.method,
      ...(payloadParams ? {body: payloadParams as BodyInit} : {}),
    });

    console.log(`Response code: ${response.status}`);

    if (response.status >= 200 && response.status < 400) {
      if ([201, 204].includes(response.status)) {
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

  delete = async (url: string, data: RequestDataPaylaod = null) => {
    this.method = RequestAction.Delete;
    this.data = data;
    this.url = url;

    return await this.request();
  }
}
