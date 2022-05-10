// import 'expo-dev-client'; // [EAS] https://docs.expo.dev/clients/installation/#add-better-error-handlers
import 'react-native-gesture-handler'; // https://reactnavigation.org/docs/stack-navigator/
import { LogBox } from 'react-native';
import { registerRootComponent } from 'expo';
import _ from 'lodash';
import { App } from './src/main/App';

// Supress some warns/errors windows on dev
// https://github.com/facebook/react-native/issues/12981
LogBox.ignoreLogs([
  'Setting a timer',
  'Require cycle',
  'AsyncStorage', // For some reason getting it after expo 43 upgrade.
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
]);


// Intercepts console calls and remove annoying console messages that some libs causes.
// https://github.com/facebook/react-native/issues/12981#issuecomment-610089520
const _console = _.clone(console);
console.warn = (message) => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};


// https://docs.expo.dev/versions/latest/sdk/register-root-component/
registerRootComponent(App);