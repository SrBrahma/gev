import React, { useContext } from 'react';
import { Alert, Platform } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { CompositeScreenProps } from '@react-navigation/core';
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack';
import * as MailComposer from 'expo-mail-composer';
import { PageScrollView } from 'pagescrollview';
import { List } from '../../components/common/List';
import { HeaderRightText, HeaderTitleSkeleton } from '../../components/common/Navigation/Header';
import { UserContext } from '../../components/Contexts/User';
import { appName, appVersion, supportEmail } from '../../main/consts';
import { ScreenOptionsPresets } from '../../main/presets';
import { ScreenFC_Main } from '../Main/Main_Navigator';
import { ScreenProps_Root } from '../Main/Root';
import { Admin_CreateStore } from './Admin/Admin_CreateStore';
import { Admin_Stores } from './Admin/Admin_Stores';
import { Admin } from './Admin/Profile_Admin';
import { Profile_AddCard } from './Profile_Payment/Profile_AddCard';
import { PaymentInfo } from './Profile_Payment/Profile_PaymentInfo';
import { Profile_Payment } from './Profile_Payment/Profile_Payments';
import { Profile_Account } from './Profile_Account';
import { Profile_MyStores } from './Profile_MyStores';



export type ParamList_Profile = {
  ProfileHome: undefined;
  Account: undefined;

  Help: undefined;
  Settings: undefined;
  About: undefined;

  Admin: undefined;
};

export const Profile_Titles: Record<Exclude<keyof ParamList_Profile, 'ProfileHome'>, string> = {
  Account: 'Minha conta',
  Help: 'Ajuda',
  Settings: 'Configurações',
  About: 'Sobre',

  Admin: 'Administrador',
};

type ScreenProps_Profile<S extends keyof ParamList_Profile> = CompositeScreenProps<
  StackScreenProps<ParamList_Profile, S>,
  ScreenProps_Root
>;
export type ScreenFC_Profile<Screen extends keyof ParamList_Profile> = React.FC<ScreenProps_Profile<Screen>>;



const ProfileHome: ScreenFC_Profile<'ProfileHome'> = ({ navigation }) => {
  const User = useContext(UserContext);

  return <PageScrollView>
    <List
      navigation={navigation}
      items={[
        { title: Profile_Titles.Account, leftIcon: 'badge-account-horizontal-outline', onPressNav: (n) => n('Account') },
        { title: Profile_Titles.Settings, leftIcon: <Entypo name='cog'/> },
        {
          title: Profile_Titles.Help, leftIcon: <Entypo name='lifebuoy'/>, onPress: async () => {
          // https://docs.expo.dev/versions/latest/sdk/mail-composer/
            try {
              if (!await MailComposer.isAvailableAsync())
                throw 'Unavailable';

              await MailComposer.composeAsync({
                recipients: [supportEmail], body:
                `

-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
[Não apague ou altere este rodapé]
${appName}
ID do usuário: ${User.id ?? 'Não logado'}
Plataforma: ${Platform.OS}
Versão do App: ${appVersion}
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-`,
              });
            } catch (err) {
              console.warn(err.message);
              Alert.alert('Contato', `Pedimos que por hora o contato conosco seja feito pelo email ${supportEmail}.`);
            }
          },
        },
        { title: Profile_Titles.MyStores, leftIcon: 'store', onPressNav: (n) => n('MyStores'), show: Object.entries(User.data?.stores ?? {}).length > 0 },
        { title: Profile_Titles.Admin, leftIcon: 'shield-account-outline', onPressNav: (n) => n('Admin'), show: User.data?.isAppAdmin ?? false },
        { title: Profile_Titles.About, leftIcon: 'information-variant' },
      ]}
    />
  </PageScrollView>;
};

const Stack = createStackNavigator<ParamList_Profile>();

export const Navigator_Profile: ScreenFC_Main<'Profile'> = () => {
  const User = useContext(UserContext);

  return (
    <Stack.Navigator
      initialRouteName='ProfileHome'
      screenOptions={({ route }) => ({
        ...ScreenOptionsPresets.left,
        title: (Profile_Titles as Record<string, string | undefined>)[route.name as string],
      })}
    >

      <Stack.Screen name='ProfileHome'
        options={{
          headerLeft: () => null,
          headerTitle: User.Auth.state === 'NotAuthed'
            ? 'Não logado'
            : (User.Auth.state === 'AuthingIn' || User.Auth.state === 'AwaitingDB' || User.loading)
              ? (() => <HeaderTitleSkeleton/>) : (User.data?.name ?? 'Sem nome'),
        }}
        component={ProfileHome}
      />


      <Stack.Screen name='Account' component={Profile_Account}/>
      <Stack.Screen name='MyStores' component={Profile_MyStores}/>

      <Stack.Group>
        <Stack.Screen name='Admin' component={Admin}/>
        <Stack.Screen name='Admin_CreateStore' component={Admin_CreateStore}/>
        <Stack.Screen name='Admin_Stores' component={Admin_Stores}/>
      </Stack.Group>


    </Stack.Navigator>
  );
};