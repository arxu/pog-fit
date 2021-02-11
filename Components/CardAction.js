import * as React from "react";
import { TouchableHighlight, Text } from "react-native";
import { useTheme } from "react-native-paper";
import CustomIcon from "./CustomIcon";

const CardAction = (props) => {
  const { colors } = useTheme();
  return (
    <TouchableHighlight
      activeOpacity={0.5}
      underlayColor='#f0f'
      onPress={() => alert('pressed')}
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
      <Text style={{ marginTop: 5, color: "#808080" }}> {props.text}</Text>
    </React.Fragment>

    </TouchableHighlight>
    
  );
};

export default CardAction;
