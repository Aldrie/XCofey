class HttpError extends Error {
  status: number;

  data: string | object;

  constructor(status: number, data: string | object) {
    super();
    this.status = status;
    this.data = data;
  }
}

export default HttpError;
