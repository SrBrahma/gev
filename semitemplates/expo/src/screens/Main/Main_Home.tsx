import { RefreshControl, StyleSheet, Text } from 'react-native';
import { PageScrollView } from 'pagescrollview';
import { ScreenBaseStyle } from '../../main/presets';
import { ScreenFC_Main } from './Main_Navigator';





export const Main_Home: ScreenFC_Main<'Home'> = ({ navigation }) => {

  return (
    <PageScrollView
      viewStyle={styles.container}
      refreshControl={<RefreshControl
        refreshing={refreshing}
        onRefresh={refresh}
        // colors={[C.main]}
      />}
    >
      <Text style={styles.h1}>{'Restaurantes'}</Text>
    </PageScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    ...ScreenBaseStyle,
  },
  h1: {
    fontSize: 34,
    letterSpacing: 1,
    marginBottom: 40,
    marginTop: 10,
  },
});