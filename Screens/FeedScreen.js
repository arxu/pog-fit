import * as React from "react";
import CustomCard from "../Components/Card";
import SearchBar from "../Components/SearchBar";
import Elements from "../CustomProperties/Elements";
import { ScrollView } from "react-native";

const FeedScreen = () => {
  return (
    <React.Fragment>
      <SearchBar />
      <ScrollView>
        {Elements.map((e) => (
          <CustomCard
            key={e.id}
            title={e.title}
            content={e.content}
            uri={e.uri}
            comment={e.comment}
            shares={e.shares}
            views={e.views}
            likes={e.likes}
          />
        ))}
      </ScrollView>
    </React.Fragment>
  );
};

export default FeedScreen;