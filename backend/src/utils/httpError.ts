class HttpError {
  constructor(
    public readonly status: number,
    public readonly message: string
  ) {}
}

export default HttpError;
