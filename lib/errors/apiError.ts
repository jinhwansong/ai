export type ApiErrorKind =
  | 'Network' // fetch 실패, CORS, 연결 끊김
  | 'Timeout' // AbortController timeout
  | 'Http' // res.ok === false
  | 'Parse' // JSON 파싱 실패
  | 'Abort' // 사용자 취소
  | 'Unknown';

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;
  readonly url?: string;
  readonly method?: string;
  readonly code?: string;
  readonly payload?: unknown;

  constructor(
    message: string,
    init: {
      kind: ApiErrorKind;
      status?: number;
      url?: string;
      method?: string;
      code?: string;
      payload?: unknown;
    }
  ) {
    super(message);
    this.name = 'ApiError';
    this.kind = init.kind;
    this.status = init.status;
    this.url = init.url;
    this.method = init.method;
    this.code = init.code;
    this.payload = init.payload;
  }

  /** 재시도 가치가 있는지 (네트워크/429/5xx) */
  get isRetryable(): boolean {
    if (this.kind === 'Network' || this.kind === 'Timeout') return true;
    if (this.kind === 'Http' && this.status) {
      return this.status === 429 || (this.status >= 500 && this.status < 600);
    }
    return false;
  }

  /** 사용자에게 "네트워크 확인" 메시지를 보여줄지 */
  get isNetworkRelated(): boolean {
    return this.kind === 'Network' || this.kind === 'Timeout';
  }
}
