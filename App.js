import'react-native-gesture-handler';
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Paragraph, Provider as PaperProvider } from 'react-native-paper';
import theme from './CustomProperties/Themes';
import {createDefaultTables, testQuery} from "./FileStorage/Database";

import MainScreen from './Screens/MainScreen';

export default function App() {
  //createDefaultTables();

  return (
      <PaperProvider theme = { theme }>
          <MainScreen />
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