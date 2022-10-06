export interface VerifyAuthenticationInDto {
  token: string;
}

export interface VerifyAuthenticationOutDto {
  userId?: string;
  errorMessage?: string;
}
