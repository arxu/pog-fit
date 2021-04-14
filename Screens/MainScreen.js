import React, { useState } from "react";
import RecipeScreen from "./RecipeScreen";
import WorkoutScreen from "./WorkoutScreen";
import ProfileRoute from "./ProfileScreen";
import CalendarRoute from "./CalendarScreen";
import { BottomNavigation } from "react-native-paper";

const Screen = (props) => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "profile", title: "Profile", icon: "account", color: "#e55b13" },
    { key: "calendar", title: "Calendar", icon: "calendar-text", color: "#655010" },
    { key: "recipes", title: "Recipes", icon: "food-apple", color: "#7a871e" },
    { key: "workouts", title: "Workouts", icon: "dumbbell", color: "#f6a21e" }
  ]);

  const renderScene = ({route, jumpTo}) => {
      switch (route.key) {
        case "profile":
          return <ProfileRoute jumpTo={jumpTo}/>
        case "calendar":
          return <CalendarRoute jumpTo={jumpTo}/>
        case "recipes":
          return <RecipeScreen jumpTo={jumpTo}/>
        case "workouts":
          return <WorkoutScreen jumpTo={jumpTo}/>
      }
  }

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

export default Screen;
