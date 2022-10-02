export interface IAuthenticateInDTO {
  email: string;
  password: string;
}

export interface IAuthenticateOutDTO {
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
  };
  token: string;
}
