/**
 * DataLogin interface for login
 */
export interface DataLogin {
  email: string;
  password: string;
}

/**
 * Login response interface
 */
export interface LoginResponse {
  data: {
    token: string;
    refreshToken: string;
    user: {
      id: string | number;
      email: string;
      name?: string;
      [key: string]: any;
    };
  };
}

/**
 * Password reset request
 */
export interface PasswordResetRequest {
  email: string;
  platform: string;
  appScheme: string;
}

/**
 * Password reset confirmation
 */
export interface PasswordResetConfirmation {
  token: string;
  password: string;
}

/**
 * Refresh token response
 */
export interface RefreshTokenResponse {
  data: {
    access_token: string;
  };
}

/**
 * Email check response
 */
export interface EmailCheckResponse {
  data: boolean;
}
