import'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import theme from './CustomProperties/Themes';
import {NavigationContainer} from '@react-navigation/native';
import {createDefaultTables, testQuery} from "./FileStorage/Database";

import MainScreen from './Screens/MainScreen';
import TopBar from './Components/TopBar';

export default function App() {
  //createDefaultTables();
  //testQuery();
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
