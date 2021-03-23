import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";

var ld = require('lodash');

// loads all records in the collection. Takes collection name and react useState setter
export const loadAll = async (collection, setter) => {
    let finished = false; // set to true if error or no result
    let key = 0;
    while(!finished){
      try {
        await AsyncStorage.getItem(collection + key.toString(), (error, result) => {
          if (error) {
            finished = true;
            console.log(error);
          }
          else{
            console.log("success");
          }

          if (result) {
            setter((previous) => {
              let resultObj = JSON.parse(result);
              
              // not ideal as it makes loading consecutive recipes O(n^2)
              let copy = ld.cloneDeep(previous);

              copy.push(resultObj);
              return copy;
            });  
          }
          else {
            finished = true;
          }

          key++;
        });
      } 
      catch (e) {
        console.log(e);
      }
    }
}

// adds record to collection
export const storeOne = async (collection, record) => {
    
} 

// removes record with specified id from collection. 
export const removeOne = async (collection, id) => {
    try {
      await AsyncStorage.getItem(collection + id.toString(), async (error, result) => {
        if (error) {
          console.log(error);
        }
        else if (result) {
          let lastDeleted = await findNearestDeletedId(collection, id);
          console.log("Last deteled: " + lastDeleted);
          if (lastDeleted === null){
            return;
          }
          else {
            // insert result into the deleted "linked list" by swapping pointers
            result.nextDeletedID = lastDeleted.nextDeletedID;
            lastDeleted.nextDeletedID = result.id;
            result.isDeleted = true;
            
            // write changes to database
            await AsyncStorage.setItem(collection + lastDeleted.id.toString, JSON.stringify(lastDeleted));
            await AsyncStorage.setItem(collection + result.id, JSON.stringify(result));
          }
        }    
      });
    } catch(e) {
        console.log(e);
    }
}

// extracts objects from JSON file into database. Objects must have an id property.
export const storeMultipleFromJSON = async (collection, elementsJSON) => {
    let keyValPairs = elementsJSON.map((e) => [collection + e.id.toString(), JSON.stringify(e)]);
    try {
        await AsyncStorage.multiSet(keyValPairs);
    }
    catch (e) {
        console.log(e);
    }
}

// Returns the id of the nearest deleted item before the id in the database
const findNearestDeletedId = async (collection, id) => {
  if (id < 0) {
    console.log("ERROR: getNeearestDeletedID received id smaller than 0; ID=" + id);
  }
  try {
    // loop backwards through objects until a deleted one is found or obj with id=0 is found
    let foundLastDeleted = false;
    while (!foundLastDeleted) {
      let item = await AsyncStorage.getItem(collection + id.toString());
      if (item) {
        item = JSON.parse(item);
        if (item.id == 0){
          return null;
        }
        else if (item.isDeleted) {
          return item;
        }
        else {
          id--;
        }
      }
      else {
        console.log("no item");
      }
    }   
  } catch(e) {
      console.log(e);
  }
  console.log("uh oh");
  return null;
}
