import'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import theme from './CustomProperties/Themes';
import {createDefaultTables, testQuery} from "./FileStorage/Database";
import AsyncStorage from '@react-native-async-storage/async-storage'

import MainScreen from './Screens/MainScreen';

export default function App() {
  const [appReady, setAppReady] = useState(false);
  const [firstStartup, setFirstStartup] = useState(false);

  useEffect(() => {
      AsyncStorage.getItem("firstStartup", (error, result) => {
        if (error){
          throw error;
        }
        if (!result) {
          // Initiate first time startup sequence
          AsyncStorage.setItem("firstStartup", JSON.stringify({firstStartup: true}), (error, result) => {
            if (error) {
              throw error;
            }
            createDefaultTables(()=> {
              setFirstStartup(true);
              setAppReady(true);
            });
          });
        }
        else {
          setFirstStartup(false);
          setAppReady(true);
        }
      });
    },
    []
  );
  

  return (
      <PaperProvider theme = { theme }>
          { appReady? <MainScreen/> : null}
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