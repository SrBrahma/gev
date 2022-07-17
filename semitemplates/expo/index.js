import 'expo-dev-client'; // EAS - https://docs.expo.dev/clients/installation/#add-better-error-handlers
import 'react-native-gesture-handler'; // https://reactnavigation.org/docs/stack-navigator/
import { registerRootComponent } from 'expo';
import { App } from './src/main/App';

// https://docs.expo.dev/versions/latest/sdk/register-root-component/
registerRootComponent(App);