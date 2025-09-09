export interface DecodeResponse {
  dtcs: string[];
  message?: string;
}

export interface DecodeRequestBody {
  rawResponse: string;
}

export interface IDecodeUseCases {
  decode(rawResponse: string): DecodeResponse;
}
