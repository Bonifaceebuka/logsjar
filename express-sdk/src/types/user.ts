export interface User {
  id?: string;
  email?: string;
  username?: string;
  ipAddress?: string;
  [key: string]: unknown;
}
