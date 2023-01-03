import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { Root_Navigator } from './Root';

// Keep the splash screen visible while we fetch resources
// https://docs.expo.dev/versions/latest/sdk/splash-screen/
void SplashScreen.preventAutoHideAsync();

function Wrappers({ children }: React.PropsWithChildren<unknown>): JSX.Element {
  return (
    // https://blog.expo.dev/expo-sdk-44-4c4b8306584a
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <SafeAreaProvider>{children}</SafeAreaProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export const App: React.FC = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Load stuff
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    void prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) await SplashScreen.hideAsync();
  }, [appIsReady]);

  if (!appIsReady) return null;

  return (
    <Wrappers>
      <View onLayout={onLayoutRootView} />
      <Root_Navigator />
    </Wrappers>
  );
};
