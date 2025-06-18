import { API_CONFIG, ENDPOINTS, createApiUrl, createAuthHeaders } from "./apiConfig";

// Constants for error messages
const ERROR_MESSAGES = {
  NETWORK: "Network error. Please check your connection.",
  DEFAULT: "An unexpected error occurred.",
};

class AuthService {
  /**
   * Generic API request handler
   * @private
   */
  async _makeRequest(endpoint, method, body = null, headers = {}, requiresAuth = false, token = null) {
    try {
      const config = {
        method,
        headers: {
          ...API_CONFIG.HEADERS,
          ...headers,
        },
      };

      if (body) {
        config.body = JSON.stringify(body);
      }

      if (requiresAuth) {
        if (!token) throw new Error("Authentication token is required");
        config.headers.Authorization = `Bearer ${token}`;
      }

      const url = createApiUrl(endpoint);
      console.debug(`API Request: ${method} ${url}`, { body, headers: config.headers });

      const response = await fetch(url, config);
      const data = await this._parseResponse(response);

      console.debug(`API Response: ${method} ${url}`, { 
        status: response.status, 
        data 
      });

      if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API Error (${method} ${endpoint}):`, error);
      throw new Error(error.message || ERROR_MESSAGES.DEFAULT);
    }
  }

  /**
   * Parse API response
   * @private
   */
  async _parseResponse(response) {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }
    return await response.text();
  }

  /**
   * User Authentication Methods
   */

  async login(email, password) {
    try {
      console.log("Attempting login with:", { email: email.trim().toLowerCase() });
      
      return await this._makeRequest(
        ENDPOINTS.AUTH.LOGIN,
        "POST",
        { email: email.trim().toLowerCase(), password }
      );
    } catch (error) {
      console.error("Login error:", error);
      throw new Error(error.message || "Login failed. Please check your credentials.");
    }
  }

  async register(userData) {
    try {
      // Clean and validate data
      const cleanUserData = {
        email: userData.email?.trim().toLowerCase(),
        username: userData.username?.trim().toLowerCase(),
        password: userData.password,
        firstName: userData.firstName?.trim(),
        lastName: userData.lastName?.trim(),
      };

      // Remove empty fields
      Object.keys(cleanUserData).forEach(key => {
        if (cleanUserData[key] == null || cleanUserData[key] === "") {
          delete cleanUserData[key];
        }
      });

      console.log("Attempting registration with cleaned data:", cleanUserData);
      
      return await this._makeRequest(
        ENDPOINTS.AUTH.REGISTER,
        "POST",
        cleanUserData
      );
    } catch (error) {
      console.error("Registration error:", error);
      
      // Handle validation errors specifically
      if (error.message.includes("validation") || error.message.includes("Validation")) {
        throw error; // Pass through validation errors
      }
      
      throw new Error(error.message || "Registration failed. Please try again.");
    }
  }

  async logout(token) {
    try {
      console.log("Attempting logout");
      await this._makeRequest(
        ENDPOINTS.AUTH.LOGOUT,
        "POST",
        null,
        {},
        true,
        token
      );
      return { success: true, message: "Logged out successfully" };
    } catch (error) {
      console.error("Logout error:", error);
      // Even if API logout fails, consider it successful (client-side cleanup will handle it)
      return { success: true, message: "Logged out locally" };
    }
  }

  /**
   * Email Verification Methods
   */

  async verifyEmail(token) {
    try {
      console.log("Attempting email verification");
      return await this._makeRequest(
        ENDPOINTS.AUTH.VERIFY_EMAIL,
        "POST",
        { token }
      );
    } catch (error) {
      console.error("Email verification error:", error);
      throw new Error(error.message || "Failed to verify email");
    }
  }

  async resendVerificationEmail(email) {
    try {
      console.log("Resending verification email to:", email);
      return await this._makeRequest(
        ENDPOINTS.AUTH.VERIFY_EMAIL, // Adjust if you have separate resend endpoint
        "POST",
        { email }
      );
    } catch (error) {
      console.error("Resend verification error:", error);
      throw new Error(error.message || "Failed to resend verification email");
    }
  }

  /**
   * Password Recovery Methods
   */

  async forgotPassword(email) {
    try {
      console.log("Processing forgot password for:", email);
      return await this._makeRequest(
        ENDPOINTS.AUTH.FORGOT_PASSWORD,
        "POST",
        { email }
      );
    } catch (error) {
      console.error("Forgot password error:", error);
      throw new Error(error.message || "Failed to process password reset request");
    }
  }

  async resetPassword(token, newPassword) {
    try {
      console.log("Attempting password reset");
      return await this._makeRequest(
        ENDPOINTS.AUTH.RESET_PASSWORD,
        "POST",
        { token, password: newPassword }
      );
    } catch (error) {
      console.error("Password reset error:", error);
      throw new Error(error.message || "Failed to reset password");
    }
  }

  /**
   * User Profile Methods
   */

  async getProfile(token) {
    try {
      console.log("Fetching user profile");
      return await this._makeRequest(
        ENDPOINTS.AUTH.ME,
        "GET",
        null,
        {},
        true,
        token
      );
    } catch (error) {
      console.error("Get profile error:", error);
      throw new Error(error.message || "Failed to fetch profile");
    }
  }

  async updateProfile(profileData, token) {
    try {
      console.log("Updating profile with:", profileData);
      return await this._makeRequest(
        ENDPOINTS.USER.PROFILE,
        "PUT",
        profileData,
        {},
        true,
        token
      );
    } catch (error) {
      console.error("Update profile error:", error);
      throw new Error(error.message || "Failed to update profile");
    }
  }

  async changePassword({ currentPassword, newPassword }, token) {
    try {
      console.log("Changing password");
      return await this._makeRequest(
        ENDPOINTS.USER.CHANGE_PASSWORD,
        "PUT",
        { currentPassword, newPassword },
        {},
        true,
        token
      );
    } catch (error) {
      console.error("Change password error:", error);
      throw new Error(error.message || "Failed to change password");
    }
  }

  /**
   * Token Management
   */

  async refreshToken(refreshToken) {
    try {
      console.log("Refreshing access token");
      return await this._makeRequest(
        ENDPOINTS.AUTH.REFRESH,
        "POST",
        { refreshToken }
      );
    } catch (error) {
      console.error("Refresh token error:", error);
      throw new Error(error.message || "Failed to refresh token");
    }
  }
}

// Singleton instance
export const authService = new AuthService();