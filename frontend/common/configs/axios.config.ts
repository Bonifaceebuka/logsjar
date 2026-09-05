import Axios, { AxiosError, AxiosHeaders, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { APP_CONFIGS } from ".";

const API_BASE_URL = APP_CONFIGS.API_BASE_URL;

  /**
   * Extend axios request config so we know
   * whether we've already retried this request.
   */
  interface RetryAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
  }

  /**
   * Every request waiting for a refresh
   * is stored inside this queue.
   */
  interface PendingRequest {
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
  }

   /**
   * Prevents multiple refresh calls.
   */
   let isRefreshing = false;
  
   /**
    * Waiting requests.
    */
   let failedQueue: PendingRequest[] = [];

     /**
   * Once refresh finishes,
   * either wake everyone up
   * or reject everyone.
   */
  const processQueue = (
    error?: unknown
  ) => {
    failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve("");
      }
    });
  
    failedQueue = [];
  };


export const axios = Axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  // validateStatus: (status: number) => {
  //   const allowedStatuses = [200, 400, 201];
  //   return allowedStatuses.includes(status);
  // },
});

/**
 * Check whether a request is the refresh request itself.
 *
 * This prevents:
 *
 * /auth/refresh-token -> 401 -> interceptor -> /auth/refresh-token -> ...
 */

const isRefreshRequest = (config?: AxiosRequestConfig) => {
  if (!config?.url) {
    return false;
  }

  return config.url === "/auth/refresh-token";
};

/**
 * Response interceptor.
 *
 * Normal flow:
 *
 * 1. API request is made.
 * 2. Access token cookie is automatically sent by the browser.
 * 3. Backend returns 200 -> request continues normally.
 *
 * If access token has expired:
 *
 * 1. Backend returns 401.
 * 2. First request calls `/auth/refresh-token`.
 * 3. Browser automatically sends the refresh-token cookie.
 * 4. Backend validates the refresh token.
 * 5. Backend sets new HttpOnly cookies.
 * 6. Original request is retried.
 *
 * Concurrent requests:
 *
 * Request A -> 401 -> refresh
 * Request B -> 401 -> waits
 * Request C -> 401 -> waits
 *
 * Once refresh succeeds:
 *
 * A -> retry
 * B -> retry
 * C -> retry
 */

axios.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error: AxiosError) => {
    const originalRequest =
      error.config as RetryAxiosRequestConfig | undefined;

    /**
     * If there is no request configuration,
     * we cannot retry anything.
     */
    if (!originalRequest) {
      return Promise.reject(error);
    }

    /**
     * Only attempt refresh for 401 Unauthorized.
     */
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    /**
     * Never try to refresh the refresh request itself.
     */
    if (isRefreshRequest(originalRequest)) {
      processQueue(error);

      return Promise.reject(error);
    }

    /**
     * Prevent infinite retry loops.
     */
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    /**
     * If another request is already refreshing the session,
     * wait for it to finish.
     */
    if (isRefreshing) {
      return new Promise<void>((resolve: any, reject) => {
        failedQueue.push({
          resolve,
          reject,
        });
      }).then(() => {
        /**
         * The refresh request has already updated the
         * HttpOnly cookies, so we simply retry the request.
         */
        return axios(originalRequest);
      });
    }

    /**
     * This request becomes responsible for refreshing
     * the session.
     */
    isRefreshing = true;

    try {
      /**
       * IMPORTANT:
       *
       * We don't send a refresh token manually.
       *
       * The browser automatically sends the HttpOnly
       * refresh_token cookie because `withCredentials`
       * is enabled.
       */
      await axios.post("/auth/refresh-token");

      /**
       * Backend should have replaced the access_token
       * and refresh_token cookies here.
       *
       * Retry every request waiting for the refresh.
       */
      processQueue();

      /**
       * Retry the original request.
       *
       * The browser will automatically attach the
       * newly issued access_token cookie.
       */
      return axios(originalRequest);
    } catch (refreshError) {
      /**
       * Refresh failed.
       *
       * This normally means:
       * - refresh token expired
       * - refresh token revoked
       * - session deleted
       * - user logged out elsewhere
       */
      processQueue(refreshError);

      /**
       * Don't redirect during SSR.
       */
      if (typeof window !== "undefined") {
        window.location.href = "/sign-in";
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);