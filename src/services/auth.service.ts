/* eslint-disable @typescript-eslint/no-explicit-any */
// services/auth.service.ts
import authAxios from "../../axios.ts";

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  accessToken?: string;
  message?: string;
}

class AuthService {
  async signIn(credentials: SignInCredentials): Promise<AuthResponse> {
    try {
      const response = await authAxios.post("/user/signin", credentials);
      // Extract user from nested data structure
      const user = response.data.data || response.data.user || response.data;
      return {
        user,
        accessToken: response.data.accessToken || response.data.token,
        message: response.data.message,
      };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async signUp(credentials: SignUpCredentials): Promise<AuthResponse> {
    try {
      const response = await authAxios.post("/user/signup", credentials);
      // Extract user from nested data structure
      const user = response.data.data || response.data.user || response.data;
      return {
        user,
        accessToken: response.data.accessToken || response.data.token,
        message: response.data.message,
      };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async signOut(): Promise<void> {
    try {
      await authAxios.post("/user/logout");
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      localStorage.removeItem("accessToken");
    }
  }

  async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    try {
      const response = await authAxios.post("/user/forgot-password", data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    try {
      const response = await authAxios.post("/user/reset-password", data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getCurrentUser(): Promise<AuthResponse["user"]> {
    try {
      const response = await authAxios.get("/user/me");
      // Extract user from nested data structure
      return response.data.data || response.data.user || response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async refreshToken(): Promise<{ accessToken: string }> {
    try {
      const response = await authAxios.post("/auth/refresh");
      if (response.data.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
      }
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    // The axios interceptor already transforms errors into { message, status, ... }
    // so error.message is always the correct user-facing string.
    // We just re-throw it as an Error so catch blocks get err.message.
    const message =
      error?.message ||
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      "An unexpected error occurred";
    const err = new Error(message);
    // Preserve extra fields (code, status, upgradeUrl) for callers that need them
    Object.assign(err, error);
    return err;
  }
}

export const authService = new AuthService();
