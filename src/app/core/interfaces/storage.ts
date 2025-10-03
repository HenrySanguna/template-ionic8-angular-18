/**
 * Storage Key enum
 */
export enum StorageKey {
  accessToken = 'accessToken',
  refreshToken = 'refreshToken',
  language = 'language',
  userData = 'userData',
}

/**
 * User data stored in local storage
 */
export interface UserData {
  id: string | number;
  email: string;
  name?: string;
  [key: string]: any;
}

/**
 * App Skel Storage interface
 */
export interface AppSkelStorage {
  /**
   * Defines a string variable to manage the authentication token
   */
  [StorageKey.accessToken]: string;

  /**
   * Defines a string variable to manage the refresh token
   */
  [StorageKey.refreshToken]: string;

  /**
   * Defines a string variable to manage the app language
   */
  [StorageKey.language]: string;

  /**
   * Defines user data object
   */
  [StorageKey.userData]: UserData;
}
