import * as React from "react";
import { EdgeInsetsPropType, View } from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

const CustomIcon = (props) => {
  return (
    <View>
        <Icon
          name={props.name}
          size={props.size}
          style={{
            /*backgroundColor: `${props.bcolor}`, ---- causes errors*/ 
            color: `${props.color}`,
            paddingLeft: props.pLeft,
            borderRadius: props.rad,
            padding: props.pad,
          }}
        />
    </View>
  );
};


export default CustomIcon;
