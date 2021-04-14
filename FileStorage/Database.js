import * as SQLite from 'expo-sqlite';
import Elements from "../CustomProperties/Elements";
import WorkoutElements from "../WorkoutScreenViews/WorkoutElements";

let ld = require('lodash');

export function createDefaultTables() {
    const db = SQLite.openDatabase("pogFit");
    /*
    Delete any previously constructed tables 
    NOTE: Drop tables mainly for testing purposes
    */
    
    
    db.transaction((tx) => { tx.executeSql("DROP TABLE IF EXISTS users"); }, (error) => { console.log(error); });
    db.transaction((tx) => { tx.executeSql("DROP TABLE IF EXISTS recipes"); }, (error) => { console.log(error); });
    db.transaction((tx) => { tx.executeSql("DROP TABLE IF EXISTS recipe_ingredients"); }, (error) => { console.log(error); });
    db.transaction((tx) => { tx.executeSql("DROP TABLE IF EXISTS workouts"); }, (error) => { console.log(error); });
    db.transaction((tx) => { tx.executeSql("DROP TABLE IF EXISTS workout_muscle_groups"); }, (error) => { console.log(error); });
    

    /*
    Create tables
    */
    // dates stored as text in form of "YYYY-MM-DD HH:MM:SS.SSS"
    db.transaction((tx) => {
        tx.executeSql(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT,
                date_of_birth TEXT, 
                weight REAL,
                height_cm REAL,
                gender TEXT,
                target_weight REAL
            );
        `,
        [],
        (tx, ResultSet) => {
            // console.log("success");
        },
        (tx, error) => {
            console.log(error);
        });
    },
    (error) => {
        console.log(error);
    });
    db.transaction((tx) => {
        // can change "uri" to "image" and set data type to BLOB
        tx.executeSql(`
            CREATE TABLE IF NOT EXISTS recipes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                method TEXT,
                uri TEXT, 
                category TEXT, 
                fat REAL, 
                protein REAL,
                carbohydrates REAL, 
                sugars REAL,
                user_id INTEGER,
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
        `,
        [],
        (tx, ResultSet) => {
            // console.log("success");
        },
        (tx, error) => {
            console.log(error);
        });
    },
    (error) => {
        console.log(error);
    });
    db.transaction((tx) => {
        tx.executeSql(`
            CREATE TABLE IF NOT EXISTS recipe_ingredients (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                recipe_id INTEGER,
                FOREIGN KEY (recipe_id) REFERENCES recipes(id)
            );
        `,
        [],
        (tx, ResultSet) => {
            // console.log("success");
        },
        (tx, error) => {
            console.log(error);
        });
    },
    (error) => {
        console.log(error);
    });
    db.transaction((tx) => {
        // can change "uri" to "image" and set data type to BLOB
        tx.executeSql(`
            CREATE TABLE IF NOT EXISTS workouts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT, 
                description TEXT, 
                uri TEXT, 
                repetitions INTEGER, 
                sets INTEGER,
                cal_per_set REAL,
                user_id INTEGER,
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
        `,
        [],
        (tx, ResultSet) => {
            // console.log("success");
        },
        (tx, error) => {
            console.log(error);
        });
    },
    (error) => {
        console.log(error);
    });
    db.transaction((tx) => {
        tx.executeSql(`
            CREATE TABLE IF NOT EXISTS workout_muscle_groups (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                muscle_group TEXT, 
                workout_id INTEGER, 
                FOREIGN KEY (workout_id) REFERENCES workouts(id)
            );
        `,
        [],
        (tx, ResultSet) => {
            // console.log("success");
        },
        (tx, error) => {
            console.log(error);
        });
    },
    (error) => {
        console.log(error);
    });

    /*
    Insert default data into tables
    */
    // Add default user
    db.transaction((tx) => {
       tx.executeSql(
           `INSERT INTO users (username, date_of_birth, weight, height_cm, gender, target_weight) 
           VALUES (\"default\", 2000-01-01 12:00:00.000, 0, 0, \"male\", 0);`
        );
    });

    // Insert premade recipes
    Elements.map((elm, idx) => {
        // Insert recipe
        db.transaction((tx) => {         
            tx.executeSql(`
                INSERT INTO recipes (title, method, uri, category, fat, protein, carbohydrates, sugars, user_id)
                VALUES ("${elm.title}", "${elm.method}", "${elm.uri}", "${elm.category}", ${elm.fat}, ${elm.protein}, ${elm.carbohydrates}, ${elm.sugars}, 1);
            `,
            [],
            (tx, ResultSet) => {
                // console.log("success");
            },
            (tx, error) => {
                console.log(error);
            });
        },
        (error) => {
            console.log(error);
        });

        // Insert ingredients of recipe into recipe_ingredients table
        elm.ingredients.forEach(ing => {
            db.transaction((tx) => {
                let str = JSON.stringify(ing);
                console.log(str);
                tx.executeSql(`
                    INSERT INTO recipe_ingredients (title, recipe_id)
                    VALUES ('${str}', ${idx+1});
                `,
                [],
                (tx, resultSet) => {

                },
                (tx, error) => {
                    console.log(error);
                });
            },
            (error) => {
                console.log(error);
            });
        });
    });

    // Insert premade workouts
    WorkoutElements.map((elm, idx) => {
        // Insert recipe
        db.transaction((tx) => {         
            tx.executeSql(`
                INSERT INTO workouts (title, description, uri, repetitions, sets, cal_per_set, user_id)
                VALUES ("${elm.title}", "${elm.description}", "${elm.uri}", "${elm.repetitions}", ${elm.sets}, ${elm.calPerSet}, 1);
            `,
            [],
            (tx, ResultSet) => {
                // console.log("success");
            },
            (tx, error) => {
                console.log(error);
            });
        },
        (error) => {
            console.log(error);
        });

        // Insert muscle groups of each workout into workout_muscle_groups table
        elm.muscleGroups.forEach((group) => {
            db.transaction((tx) => {
                tx.executeSql(`
                    INSERT INTO workout_muscle_groups (muscle_group, workout_id)
                    VALUES ("${group}", ${idx+1});
                `,
                [],
                (tx, resultSet) => {
                    // console.log("success");
                },
                (tx, error) => {
                    console.log(error);
                });
            },
            (error) => {
                console.log(error);
            });
        });
    });

    console.log("Default application tables set up.");
}

// Extracts all recipes from the database as an array of objects. Calls the callback function with values (error, recipeArray)
export function getAllRecipes(callback) {
    const db = SQLite.openDatabase("pogFit");
    db.transaction((tx) => {
        // Get all recipes
        tx.executeSql(`
            SELECT * 
            FROM recipes;
        `, 
        [],
        (tx, recipeResultSet) => { 
            // recipes is an an array of recipe objects, each of which have an ingredients property.
            // ingredients is an array of the ingredients that the recipe consists of.
            let recipes = [];
            recipeResultSet.rows._array.forEach((tuple, idx)=>{
                let ingredients;
                db.transaction((tx) => {
                    // Get the title of each ingredient belonging to the recipe
                    tx.executeSql(`
                        SELECT title 
                        FROM recipe_ingredients
                        WHERE recipe_id=${idx+1}
                    `,
                    [],
                    (tx, ingredientResultSet) => {
                        let ingredients = ld.cloneDeep(ingredientResultSet.rows._array.map((e)=>e.title));
                        tuple.ingredients = ingredients.map((ing) => JSON.parse(ing));
                        recipes.push(tuple);
                        if (recipes.length == recipeResultSet.rows._array.length)
                            callback(null, recipes);
                    },
                    (tx, error) => {
                        callback(error, null);
                    });
                },
                (error) => {
                    callback(error, null);
                });
            });
        },
        (tx, error) => {
            callback(error, null);
        });
    },
    (error) => {
        callback(error, null);
    });
}

// Extracts all users from the database as an array of objects. Calls the callback function with values (error, userArray)
export function getAllUsers(callback) {
    const db = SQLite.openDatabase("PogFit");
    db.transaction((tx) => {
        tx.executeSql(`
            SELECT * 
            FROM users
        `,
        [],
        (tx, userResultSet) => {
            callback(null, userResultSet.rows._array);
        },
        (tx, error) => {
            callback(error, null);
        });
    },
    (error) => {
        callback (error, null);
    });
}

// Extracts all workouts from the database as an array of objects. Calls the callback function with values (error, workoutArray)
export function getAllWorkouts(callback) {
    const db = SQLite.openDatabase("pogFit");
    db.transaction((tx) => {
        // Get all recipes
        tx.executeSql(`
            SELECT * 
            FROM workouts;
        `, 
        [],
        (tx, workoutResultSet) => { 
            // recipes is an an array of recipe objects, each of which have an ingredients property.
            // ingredients is an array of the ingredients that the recipe consists of.
            let workouts = [];
            workoutResultSet.rows._array.forEach((tuple, idx)=>{
                let ingredients;
                db.transaction((tx) => {
                    // Get the title of each ingredient belonging to the recipe
                    tx.executeSql(`
                        SELECT muscle_group 
                        FROM workout_muscle_groups
                        WHERE workout_id=${idx+1}
                    `,
                    [],
                    (tx, muscleGroupResultSet) => {
                        tuple.muscle_groups = muscleGroupResultSet.rows._array;

                        workouts.push(tuple);
                        if (workouts.length == workoutResultSet.rows._array.length)
                            callback(null, workouts);
                    },
                    (tx, error) => {
                        callback(error, null);
                    });
                },
                (error) => {
                    callback(error, null);
                });
            });
        },
        (tx, error) => {
            callback(error, null);
        });
    },
    (error) => {
        callback(error, null);
    });
}


// NOTE: for testing purposes only
export function testQuery(callback){
    const db = SQLite.openDatabase("pogFit");
    db.transaction( (tx) => {
        tx.executeSql(`
            SELECT * 
            FROM recipes;
        `,
        [],
        (tx, resultSet) => {
            callback(resultSet.rows._array);
        },
        (tx, error) => {
            console.log(error);
        });
    },
    (error) => {
        console.log(error);
    });
}