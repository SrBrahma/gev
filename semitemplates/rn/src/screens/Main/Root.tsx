import React from 'react';
import { NavigatorScreenParams } from '@react-navigation/core';
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack';
import { ScreenOptionsPresets } from '../../main/presets';
import { Main_Navigator, ParamsList_Main } from './Main_Navigator';



export type ParamList_Root = {
  Main: undefined | NavigatorScreenParams<ParamsList_Main>;
};

export type ScreenProps_Root<S extends keyof ParamList_Root = keyof ParamList_Root> = StackScreenProps<ParamList_Root, S>;
export type ScreenFC_Root<S extends keyof ParamList_Root> = React.FC<ScreenProps_Root<S>>;

const Stack = createStackNavigator<ParamList_Root>();

export function Root_Navigator(): JSX.Element {
  return (
    <Stack.Navigator
      initialRouteName='Main'
      screenOptions={{ ...ScreenOptionsPresets.left, headerShown: false }}
      detachInactiveScreens={false}
    >
      <Stack.Screen name='Main' component={Main_Navigator}/>
    </Stack.Navigator>

  );
}