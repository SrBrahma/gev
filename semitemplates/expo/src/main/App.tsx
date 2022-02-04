import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import AppLoading from 'expo-app-loading';
import { BetterStatusBarProvider } from '../components/common/BetterStatusBar';
import { Modals } from '../components/common/Modal/ModalBase';
import { Root_Navigator } from '../screens/Main/Root';
import { useMyFonts } from './fonts.js';



const Wrappers: React.FC = ({ children }) => (
  {/* https://blog.expo.dev/expo-sdk-44-4c4b8306584a */}
  <GestureHandlerRootView style={{ flex: 1 }}>
    <NavigationContainer>
      {/* Must be after NavigationContainer as we use useFocusEffect to handle back press. */}
      <Modals/>
      <SafeAreaProvider>
        <BetterStatusBarProvider backgroundColor={C.mainLighter1}>
          <SafeAreaView style={{ flex: 1 }}>
            {children}
          </SafeAreaView>
        </BetterStatusBarProvider>
      </SafeAreaProvider>
    </NavigationContainer>
  </GestureHandlerRootView>
);


export const App: React.FC = () => {
  const [fontsLoaded, fontsError] = useMyFonts();
  const userLoaded = true // User.Auth.state !== 'Init';
  const loaded = fontsLoaded && userLoaded;

  useEffect(() => { fontsError && console.error('Font error!:', fontsError); }, [fontsError]);
  useEffect(() => { console.log(`userLoaded=${userLoaded}, fontsLoaded=${fontsLoaded}`); }, [fontsLoaded, userLoaded]);


  if (!loaded)
    return <AppLoading/>;

  return (<Wrappers><Root_Navigator/></Wrappers>);
};