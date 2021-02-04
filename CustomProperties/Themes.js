import React from "react";
import { configureFonts, DefaultTheme } from "react-native-paper";
import customFonts from "./Fonts";

const theme = {
  ...DefaultTheme,
  fonts: configureFonts(customFonts),
  roundness: 30,
  colors: {
    ...DefaultTheme.colors,
    primary: "#444444",
    accent: "#f1c40f",
    cancelButton: "#c64239",
    iconColor: "#808080",
  },
};

export default theme;
