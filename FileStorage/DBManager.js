import AsyncStorage from "@react-native-async-storage/async-storage";

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
        await AsyncStorage.getItem(collection + id.toString(), (error, result) => {
            if (error) {
                console.log(error);
            }
            else if (result) {
                let lastDeleted = await findNearestDeletedId(collection, id);
                if (lastDeleted === null){

                }
                await AsyncStorage.setItem(collection + id.toString(), )
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
  let outResult = null;  
  const fNDI = async (collection, id) => {
      if (id < 0) {
        console.log("ERROR: getNeearestDeletedID received id smaller than 0; ID=" + id);
      }
      try {
          await AsyncStorage.getItem(collection + id.toString(), (error, result) => {
            if (error) {
                console.log(error);
            }
            else if (!result){
                console.log("ERROR: could not finish search for nearest deleted ID");
            }
            else if (result.isDeleted || result.id === "0"){
                outResult = result;
            }
            else {
                await fNDI(collection, id - 1, outResult);
            }  
          });
               
      } catch(e) {
          console.log(e);
      }
  }
  await fNDI(collection, id);
  return outResult;
}
