export class HttpError {
  constructor(
    public readonly status: number,
    public readonly message: string
  ) {}
}

export class PostNotFoundError {}
export class PostExpireTimeError {}
export class PostSizeError {}
export class PostInvalidSecretError {}
