import { Platform } from 'react-native';
import Constants from 'expo-constants';



export const appName = '';
export const supportEmail = '';

export const isWeb = Platform.OS === 'web';
export const isDev = __DEV__;
const isTest = process.env.NODE_ENV === 'test';

export type Environment = 'prod' | 'dev' | 'test';
export const environment: Environment = isTest ? 'test' : (isDev ? 'dev' : 'prod');

/** isDevEnv must also be checked to show dev stuff. */
export const showDevOptions: boolean = true;
export const appVersion = Constants.manifest!.version;