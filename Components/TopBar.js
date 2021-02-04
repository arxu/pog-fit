import * as React from "react";
import { Appbar } from "react-native-paper";

const TopBar = () => (
  <Appbar.Header>
    <Appbar.BackAction />
    <Appbar.Content title="pog fit" subtitle="" />
  </Appbar.Header>
);

export default TopBar;
