export const MESSAGES = {
    COMMON:{
        "INTERNAL_SERVER_ERROR": "Something went wrong",
        "EMAIL_EXISTS": "Email is already registered",
        "UNATHORIZED_ACCESS": 'Unauthorized request!'
    },
    AUTH: {
    LOGIN: {
      INVALID_LOGIN: "Invalid login credentials",
      JWT_GENERATED: "JWT was generated",
      LOGIN_SUCCESSFUL: "Login was successful",
    },
    REGISTRATION: {
      SUCCESSFUL: "Registration was successful",
    },
    PASSWWORD_RESET: {
      EXPIRED: "Password reset token has expired",
      DISABLED_ACCOUNT: "You can only reset the password of an enabled account",
      INACTIVE_ACCOUNT: "You can only reset the password of an active account",
    },
  },
    ACCOUNT: {
    NOT_FOUND: "Account was not found!",
    INVALID_CREDENTIALS: "Invalid email or password",
    INVALID_ACCOUNT:
      "Account not validated. Please check your email for further instructions",
    INACTIVE_ACCOUNT: "Account is inactive. Please contact support",
    DISABLED_ACCOUNT: "Account is disabled. Please contact support",
    user_ACCOUNT_FETCHED: "account info was fetched!",
  },
  EMAIL_VERIFICATION: {
    SUCCESS: "email was successfully verified",
    FAILED: "email verification failed",
    EXPIRED: "Email verification token has expired",
    ALREADY_ACTIVATED: "account is already activated",
    INVALID: "Invalid account activation request",
  },
}

export const dynamic_messages = {
    FETCHED_SUCCESSFULLY: (itemFetched: string) => `${itemFetched} fetched successfully`,
    SUCCESSFULLY_CREATED: (itemCreated: string) => `${itemCreated} successfully created`,
    SUCCESSFULLY_UPDATED: (itemUpdated: string) => `${itemUpdated} successfully updated`,
    NOT_FOUND: (item: string) => `${item} not found`,
    PASSWWORD_RESET_SENT: (email: string) => `Password reset email has been sent ${email}`,
    CONNECTION_FAILED: (item: string) => `${item} connection failed`,
    ALREADY_EXISTS: (item: string) => `${item} already exists`,
    CONNECTION_SUCCESSFUL: (item: string) => `${item} connection was successful`,
}