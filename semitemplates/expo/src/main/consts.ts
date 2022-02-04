import { Platform } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import Constants from 'expo-constants';



export const appName = 'Cardáppio';
export const supportEmail = 'henrique.bruno.fa@gmail.com';
export const useServerEmulator: boolean = true;

export const isWeb = Platform.OS === 'web';
export const isDevEnv = __DEV__;
export const environment: 'dev' | 'prod' = isDevEnv ? 'dev' : 'prod';
/** isDevEnv must also be checked to show dev stuff. */
export const showDevOptions: boolean = true;
export const appVersion = Constants.manifest!.version;