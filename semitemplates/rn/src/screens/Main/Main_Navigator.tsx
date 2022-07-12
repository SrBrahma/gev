import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabScreenProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NavTab } from '../../components/common/NavBottomTab';
import { ScreenOptionsPresets } from '../../main/presets';
import { Main_Home } from './Main_Home';
import { ScreenFC_Root, ScreenProps_Root } from './Root';




export type ParamsList_Main = {
  Home: undefined;
};

export type ScreenProps_Main<S extends keyof ParamsList_Main = keyof ParamsList_Main> = CompositeScreenProps<
  BottomTabScreenProps<ParamsList_Main, S>,
  ScreenProps_Root<'Main'>
>;

export type ScreenFC_Main<Screen extends keyof ParamsList_Main> = React.FC<ScreenProps_Main<Screen>>;

const Tab = createBottomTabNavigator<ParamsList_Main>();



export const Main_Navigator: ScreenFC_Root<'Main'> = () => {
  return (
    <Tab.Navigator
      initialRouteName='Home'
      screenOptions={{
        ...ScreenOptionsPresets.center,
        headerShown: false,
      }}
      // sceneContainerStyle={{ backgroundColor: C.background }}
      tabBar={(p) => <NavTab {...p}/>}
    >
      <Tab.Screen name='Home' component={Main_Home} options={{
        title: 'Início',
        tabBarIcon: ({ focused }) => (<MaterialCommunityIcons name={focused ? 'home' : 'home-outline'}/>),
      }}/>
    </Tab.Navigator>
  );
};
