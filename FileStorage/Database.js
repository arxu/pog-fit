import * as SQLite from 'expo-sqlite';
import Elements from "../CustomProperties/Elements";
import WorkoutElements from "../WorkoutScreenViews/WorkoutElements";

let ld = require('lodash');

export function createDefaultTables(callback) {
    let userTableDeleted, recipeTableDeleted, recipeIngredientTableDeleted, workoutTableDeleted, muscleGroupTableDeleted = false;
    let userTableCreated, recipeTableCreated, recipeIngredientTableCreated, workoutTableCreated, muscleGroupTableCreated = false;
    let addedDefaultUser, allRecipesInserted, allIngredientsInserted, allWorkoutsInserted, 
        allMuscleGroupsInserted = false;
    
    function onAllTablesDeleted() {
        if (!(userTableDeleted && recipeTableDeleted && recipeIngredientTableDeleted && workoutTableDeleted && muscleGroupTableDeleted))
            return;
        // Users table
        db.transaction((tx) => {
            // dates stored as text in form of "YYYY-MM-DD HH:MM:SS.SSS"
            tx.executeSql(`
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT,
                    date_of_birth TEXT, 
                    weight REAL,
                    height_cm REAL,
                    gender TEXT
                );
            `,
            [],
            (tx, ResultSet) => {
                userTableCreated = true;
                console.log("Created table \"users\"");
                onAllTablesCreated();
            },
            (tx, error) => {
                console.log(error);
            });
        },
        (error) => {
            console.log(error);
        });

        // Recipes table
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
                recipeTableCreated = true;
                console.log("Created table \"recipes\"");
                onAllTablesCreated();
            },
            (tx, error) => {
                console.log(error);
            });
        },
        (error) => {
            console.log(error);
        });

        // Recipe ingredients table
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
                recipeIngredientTableCreated = true;
                console.log("Created table \"recipe_ingredients\"");
                onAllTablesCreated();
            },
            (tx, error) => {
                console.log(error);
            });
        },
        (error) => {
            console.log(error);
        });

        // Workouts table
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
                workoutTableCreated = true;
                console.log("Created table \"workouts\"");
                onAllTablesCreated();
            },
            (tx, error) => {
                console.log(error);
            });
        },
        (error) => {
            console.log(error);
        });

        // Muscle groups table
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
                muscleGroupTableCreated = true;
                console.log("Created table \"workout_muscle_groups\"");
                onAllTablesCreated();
            },
            (tx, error) => {
                console.log(error);
            });
        },
        (error) => {
            console.log(error);
        });
    }
    
    function onAllTablesCreated() {
        // Return unless all tables have been created
        if (!(userTableCreated && recipeTableCreated && recipeIngredientTableCreated && workoutTableCreated && muscleGroupTableCreated))
            return;

        // Add default user
        db.transaction((tx) => {
            // dates stored as text in form of "YYYY-MM-DD HH:MM:SS.SSS"
            tx.executeSql(
                `INSERT INTO users (username, date_of_birth, weight, height_cm, gender) 
                VALUES (\"default\", \"2000-01-01 12:00:00.000\", 0, 0, \"male\");`
            ,
            [],
            (tx, resultSet) => {
                addedDefaultUser = true;
                console.log("Added default user");
                onAllQueriesComplete();
            },
            (tx, error) => {
                console.log(error);
            });
        },
        (error) => {
            console.log(error);
        }
        );
    
        // Insert premade recipes
        Elements.map((elm, idx) => {
            
            // Insert recipe
            db.transaction((tx) => {
                let str = JSON.stringify(elm);
                tx.executeSql(`
                    INSERT INTO recipes (title, method, uri, category, fat, protein, carbohydrates, sugars, user_id)
                    VALUES ("${elm.title}", "${elm.method}", "${elm.uri}", "${elm.category}", ${elm.fat}, ${elm.protein}, ${elm.carbohydrates}, ${elm.sugars}, 1);
                `,
                [],
                (tx, ResultSet) => {
                    if (idx + 1 === Elements.length){
                        allRecipesInserted = true;
                        console.log("Inserted all recipes into \"recipes\" table");
                        onAllQueriesComplete();
                    }
                },
                (tx, error) => {
                    console.log(error);
                });
            },
            (error) => {
                console.log(error);
            });
    
            // Insert ingredients of recipe into recipe_ingredients table
            elm.ingredients.forEach((ing, ingIdx) => {
                db.transaction((tx) => {
                    let str = JSON.stringify(ing);
                    tx.executeSql(`
                        INSERT INTO recipe_ingredients (title, recipe_id)
                        VALUES ('${str}', ${idx+1});
                    `,
                    [],
                    (tx, resultSet) => {
                        if (idx + 1 === Elements.length && ingIdx + 1 === elm.ingredients.length) {
                            allIngredientsInserted = true;
                            console.log("Inserted all ingredients into \"recipe_ingredients\" table");
                            onAllQueriesComplete();
                        }
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
                let str = JSON.stringify(elm);  
                tx.executeSql(`
                    INSERT INTO workouts (title, description, uri, repetitions, sets, cal_per_set, user_id)
                    VALUES ("${elm.title}", "${elm.description}", "${elm.uri}", "${elm.repetitions}", ${elm.sets}, ${elm.calPerSet}, 1);
                `,
                [],
                (tx, ResultSet) => {
                    if (idx + 1 === WorkoutElements.length) {
                        allWorkoutsInserted = true;
                        console.log("Inserted all workouts into \"workouts\" table");
                        onAllQueriesComplete();
                    }
                },
                (tx, error) => {
                    console.log(error);
                });
            },
            (error) => {
                console.log(error);
            });
    
            // Insert muscle groups of each workout into workout_muscle_groups table
            elm.muscleGroups.forEach((group, groupIdx) => {
                let str = JSON.stringify(group);
                db.transaction((tx) => {
                    tx.executeSql(`
                        INSERT INTO workout_muscle_groups (muscle_group, workout_id)
                        VALUES ("${group}", ${idx+1});
                    `,
                    [],
                    (tx, resultSet) => {
                        if (idx + 1 === WorkoutElements.length && groupIdx + 1 === elm.muscleGroups.length) {
                            allMuscleGroupsInserted = true;
                            console.log("Inserted all muscle groups into \"muscle_group\" table");
                            onAllQueriesComplete();
                        }
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
    }

    function onAllQueriesComplete() {
        if (userTableCreated && recipeTableCreated && recipeIngredientTableCreated && workoutTableCreated && muscleGroupTableCreated
            && addedDefaultUser && allRecipesInserted && allIngredientsInserted && allWorkoutsInserted && allMuscleGroupsInserted) 
        {
            console.log("All queries complete");
            console.log("SQL database ready!");
            callback();
        }
    }

    const db = SQLite.openDatabase("pogFit");
    
    // Delete users table if exists
    db.transaction(
        (tx) => { 
            tx.executeSql(
                "DROP TABLE IF EXISTS users",
                [],
                (tx, result) => {
                    userTableDeleted = true;
                    console.log("Deleted table \"users\"");
                    onAllTablesDeleted();
                },
                (tx, error) => {
                    console.log(error);
                }
            );
        }, 
        (error) => { 
            console.log(error); 
        }
    );
    
    // Delete recipes table
    db.transaction(
        (tx) => { 
            tx.executeSql(
                "DROP TABLE IF EXISTS recipes",
                [],
                (tx, result) => {
                    recipeTableDeleted = true;
                    console.log("Deleted table \"recipes\"");
                    onAllTablesDeleted();
                },
                (tx, error) => {
                    console.log(error);
                }
            );
        }, 
        (error) => { 
            console.log(error); 
        }
    );

    // Delete recipe ingredients table
    db.transaction(
        (tx) => { 
            tx.executeSql(
                "DROP TABLE IF EXISTS recipe_ingredients",
                [],
                (tx, result) => {
                    recipeIngredientTableDeleted = true;
                    console.log("Deleted table \"recipe_ingredients\"");
                    onAllTablesDeleted();
                },
                (tx, error) => {
                    console.log(error);
                }
            );
        }, 
        (error) => { 
            console.log(error); 
        }
    );

    // Delete workouts table
    db.transaction(
        (tx) => { 
            tx.executeSql(
                "DROP TABLE IF EXISTS workouts",
                [],
                (tx, result) => {
                    workoutTableDeleted = true;
                    console.log("Deleted table \"workouts\"");
                    onAllTablesDeleted();
                },
                (tx, error) => {
                    console.log(error);
                }
            );
        }, 
        (error) => { 
            console.log(error); 
        }
    );

    // Delete muscle group table
    db.transaction(
        (tx) => { 
            tx.executeSql(
                "DROP TABLE IF EXISTS muscle_groups",
                [],
                (tx, result) => {
                    muscleGroupTableDeleted = true;
                    console.log("Deleted table \"muscle_groups\"");
                    onAllTablesDeleted();
                },
                (tx, error) => {
                    console.log(error);
                }
            );
        }, 
        (error) => { 
            console.log(error); 
        }
    );
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