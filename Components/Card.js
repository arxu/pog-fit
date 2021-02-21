import * as React from "react";
import { Image, StyleSheet, TouchableHighlight } from "react-native";
import { Card, Text, Paragraph } from "react-native-paper";

import CardAction from "./CardAction";
//import Likes from "./Likes";

const CustomCard = (props) => {
  return (
    <React.Fragment>
      <TouchableHighlight
        activeOpacity={0.85}
        underlayColor='#eee'
        onPress={() => props.navigation.push('Recipe', { recipe: props.recipe })}
      >
        <Card style={styles.container}>
          {/* Image and title */}
          <Card.Content style={{ flexDirection: "row" }}>
            <Image source={{ uri: props.uri }} style={styles.img} />
            <Paragraph style={{ marginTop: 15 }}>
              <Text style={{ fontWeight: "bold", backgroundColor: "transparent" }}>{props.title}</Text>
            </Paragraph>
          </Card.Content>
          
          <Card.Cover source={{ uri: props.uri }} />

          {/*
          <Card.Actions>
            <Card.Content>
              <Paragraph>{props.content.substring(0, 100)}</Paragraph>
            </Card.Content>
          </Card.Actions>
          
          <Card.Content style={styles.horizontalLine} />

          <Card.Content style={styles.action}>
            <CardAction name="thumb-up-outline" text="Plan" />
            <CardAction 
              name="message-outline" text="Edit" 
              navigation={props.navigation}
              recipe={props.recipe}/>
            <CardAction name="share-outline" text="Delete" />
          </Card.Content>
          */}
        </Card>
      </TouchableHighlight>
    </React.Fragment>
  );
};

export default CustomCard;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  img: {
    width: 40,
    height: 40,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#4169E1",
    margin: 10,
  },
  contentStart: { flexDirection: "row", alignItems: "flex-start" },
  contentEnd: { flexDirection: "row", alignItems: "flex-end" },
  horizontalLine: {
    width: 335,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    marginHorizontal: 15,
    paddingVertical: 5,
  },
  action: { flexDirection: "row", paddingTop: 5 },
});
