import'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import theme from './CustomProperties/Themes';
import {NavigationContainer} from '@react-navigation/native';

import MainScreen from './Screens/MainScreen';
import TopBar from './Components/TopBar';

export default function App() {
  return (
      <PaperProvider theme = { theme }>
        <NavigationContainer>
          <MainScreen />
        </NavigationContainer>
      </PaperProvider>
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
