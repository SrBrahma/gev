import React from 'react';
import { StyleSheet, Text, View } from 'react-native';


export const Component: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Open up src/App.tsx to start working on your app!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});