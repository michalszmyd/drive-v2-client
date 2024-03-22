import SETTINGS from "../../consts/settings";
import { uuid } from "../../helpers/uuid-helper";

interface RequestInstanceParams {
  baseUrl: string;
  headers?: object;
}

interface RequestResponse {
  data: any;
  status: number;
  instance: RequestInstance;
}

enum RequestAction {
  Get = "GET",
  Post = "POST",
  Put = "PUT",
  Delete = "DELETE",
}

type RequestDataPaylaod = null | object | FormData;

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

class RequestsQueue {
  queue: RequestInstance[];

  constructor(queue: RequestInstance[]) {
    this.queue = queue;
  }

  updateQueueHeaders(headers: any) {
    this.queue.forEach((request) => {
      request.headers = { ...request.headers, ...headers };
    });
  }

  findByUrl(url: string) {
    return this.queue.find((element) => element.url === url);
  }

  findRefreshTokenRequest() {
    return this.queue.find((element) => element.isRefreshToken);
  }

  remove(id: string) {
    this.queue = this.queue.filter((element) => element.uniqueRequestId !== id);
    return this.queue;
  }

  push(request: RequestInstance) {
    this.queue.push(request);
  }
}

export default class RequestInstance {
  static _queue = new RequestsQueue([]);

  baseUrl: string;
  method: RequestAction;
  url: string | null;
  data: RequestDataPaylaod;
  headers: { [key: string]: string };
  refreshTokenAction?: () => any;
  uniqueRequestId: string;
  isRefreshToken: boolean;
  _retry: boolean;

  constructor({ baseUrl, headers = {} }: RequestInstanceParams) {
    this.baseUrl = baseUrl;

    this.headers = { ...DEFAULT_HEADERS, ...headers };
    this.url = null;
    this.method = RequestAction.Get;
    this.data = null;
    this.uniqueRequestId = uuid();
    this.isRefreshToken = false;
    this._retry = false;

    RequestInstance._queue.push(this);
  }

  prepareRequestData = () => {
    let payloadParams = null;
    let deleteHeaders: string[] = [];

    if (this.data instanceof FormData) {
      payloadParams = this.data;
      deleteHeaders = ["Content-Type"];
    } else if (this.data) {
      payloadParams = JSON.stringify(this.data);
    }

    return {
      payloadParams,
      deleteHeaders,
    };
  };

  retryRequest = async (): Promise<RequestResponse> => {
    return new Promise((resolve) => setTimeout(resolve, 500)).then(() => {
      this._retry = true;
      return this.request();
    });
  };

  request = async (): Promise<RequestResponse> => {
    if (!this.url) {
      throw new Error("Url must be specified.");
    }

    const { payloadParams, deleteHeaders } = this.prepareRequestData();

    const requestHeaders: {
      [key: string]: string;
    } = this.headers;

    deleteHeaders.forEach((element) => {
      delete requestHeaders[element];
    });

    this.headers = requestHeaders;

    if (SETTINGS.DEVELOPMENT) {
      console.log(`Starting request ${this.url}: `);
      console.log({ instance: this, payloadParams });
    }

    if (
      this.refreshTokenAction &&
      RequestInstance._queue.findRefreshTokenRequest() &&
      !this._retry
    ) {
      if (SETTINGS.DEVELOPMENT) {
        console.log(`delaying request ${this.url}, retry? ${this._retry}`);
      }

      this.retryRequest();
    }

    const response = await fetch(`${this.baseUrl}${this.url}`, {
      headers: requestHeaders,
      method: this.method,
      ...(payloadParams ? { body: payloadParams as BodyInit } : {}),
    });

    if (response.status >= 200 && response.status < 400) {
      RequestInstance._queue.remove(this.uniqueRequestId);

      if ([201, 204].includes(response.status)) {
        return {
          instance: this,
          data: {},
          status: response.status,
        };
      }

      const json = await response.json();

      return {
        data: json,
        status: response.status,
        instance: this,
      };
    } else if (response.status < 500) {
      if (response.status === 401 && this.refreshTokenAction) {
        if (!RequestInstance._queue.findRefreshTokenRequest()) {
          return this.refreshTokenAction().then(() => {
            this._retry = true;
            return this.request();
          });
        } else if (!this._retry) {
          this.retryRequest();
        }
      }

      const json = await response.json();

      const responseData = JSON.stringify({
        data: json,
        status: response.status,
        instance: this,
      });

      RequestInstance._queue.remove(this.uniqueRequestId);

      throw new Error(responseData);
    }

    RequestInstance._queue.remove(this.uniqueRequestId);

    throw new Error("Server error");
  };

  get = async (url: string, data: RequestDataPaylaod = null) => {
    this.method = RequestAction.Get;
    this.data = data;
    this.url = url;

    return await this.request();
  };

  post = async (url: string, data: RequestDataPaylaod = null) => {
    this.method = RequestAction.Post;
    this.data = data;
    this.url = url;

    return await this.request();
  };

  put = async (url: string, data: RequestDataPaylaod = null) => {
    this.method = RequestAction.Put;
    this.data = data;
    this.url = url;

    return await this.request();
  };

  delete = async (url: string, data: RequestDataPaylaod = null) => {
    this.method = RequestAction.Delete;
    this.data = data;
    this.url = url;

    return await this.request();
  };
}
