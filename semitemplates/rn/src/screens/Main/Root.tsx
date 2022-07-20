import type { StackScreenProps } from '@react-navigation/stack';
import { createStackNavigator } from '@react-navigation/stack';
import { Home } from './Home';



export type ParamList_Root = {
  Home: undefined;
};

export type ScreenProps_Root<S extends keyof ParamList_Root = keyof ParamList_Root> = StackScreenProps<ParamList_Root, S>;

const Stack = createStackNavigator<ParamList_Root>();

export function Root_Navigator(): JSX.Element {
  return (
    <Stack.Navigator
      initialRouteName='Home'
    >
      <Stack.Screen name='Home' component={Home}/>
    </Stack.Navigator>

  );
}