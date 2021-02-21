import React, { useState } from "react";
import RecipeRoute from "./RecipeScreen";
import WorkoutRoute from "./WorkoutScreen";
import ProfileRoute from "./ProfileScreen";
import CalendarRoute from "./CalendarScreen";
import { BottomNavigation } from "react-native-paper";
import { baseProps } from "react-native-gesture-handler/dist/src/handlers/gestureHandlers";

const Screen = (props) => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "recipes", title: "Recipes", icon: "message", color: "#3F51B5" },
    { key: "workouts", title: "Workouts", icon: "album", color: "#009688" },
    { key: "profile", title: "Profile", icon: "history", color: "#795548" },
    { key: "calendar", title: "Calendar", icon: "history", color: "#795548" }
  ]);

  const renderScene = BottomNavigation.SceneMap({
    recipes: RecipeRoute,
    workouts: WorkoutRoute,
    profile: ProfileRoute,
    calendar: CalendarRoute
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

export default Screen;
