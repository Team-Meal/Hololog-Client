export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  role: string;
}

export interface LoginResponse {
  tokens: AuthTokens;
  user: AuthUser;
}
