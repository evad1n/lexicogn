import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Search from './src/components/Search';
// import Button from '_components/Button';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Lexicogn</Text>
      <Search />
      <StatusBar style="auto" />
      {/* <Button></Button> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});