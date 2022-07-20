import React, { useEffect, useState, useCallback } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Root_Navigator } from './Root';
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
// https://docs.expo.dev/versions/latest/sdk/splash-screen/
SplashScreen.preventAutoHideAsync();

function Wrappers({ children }: React.PropsWithChildren): JSX.Element {
  return (
    // https://blog.expo.dev/expo-sdk-44-4c4b8306584a
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <SafeAreaProvider>
          {children}
        </SafeAreaProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  )
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
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) await SplashScreen.hideAsync();
  }, [appIsReady]);

  if (!appIsReady)
    return null;

  return (
    <Wrappers>
      <View onLayout={onLayoutRootView}/>
      <Root_Navigator/>
    </Wrappers>
  );
};