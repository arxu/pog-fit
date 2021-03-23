import { NavigationContainer } from "@react-navigation/native";
import * as React from "react";
import { TouchableHighlight, Text, ShadowPropTypesIOS } from "react-native";
import { useTheme } from "react-native-paper";
import CustomIcon from "./CustomIcon";

const CardAction = (props) => {
  const { colors } = useTheme();
  return (
    <TouchableHighlight
      activeOpacity={0.85}
      underlayColor='#eee'
      onPress={() => props.navigation.push('Recipe', { recipe: props.recipe })}
      style={{
        /* style here */
      }}
    >
      <React.Fragment>
        <CustomIcon
          name={props.name}
          size={20}
          pLeft={35}
          color={colors.iconColor}

          pad={4}
        />
      <Text style={{ marginTop: 5, color: "#808080", backgroundColor: "transparent" }}> {props.text}</Text>
    </React.Fragment>
    </TouchableHighlight>
    
  );
};

export default CardAction;
