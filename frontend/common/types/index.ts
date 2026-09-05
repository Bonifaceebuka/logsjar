export interface FormState {
  submitting: boolean;
  successMsg: string;
  hasBeenFormitted?: boolean;
  errorMsg: string;
}

export interface IApiResponse<T> {
  status_code: number;
  message: string;
  data?: T;
}