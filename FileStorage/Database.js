import * as SQLite from "expo-sqlite";
import Elements from "../CustomProperties/Elements";

export function createDefaultTables() {
    const db = SQLite.openDatabase("pogFit");
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
                gender TEXT
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
                calPerSet REAL,
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
           `INSERT INTO users (username, date_of_birth, weight, height_cm, gender) 
           VALUES (\"default\", 2000-01-01 12:00:00.000, 0, 0, \"male\");`
        );
    });

    // Insert premade recipes
    Elements.map((e) => {
        db.transaction((tx) => {         
            tx.executeSql(`
                INSERT INTO recipes (title, method, uri, category, fat, protein, carbohydrates, sugars, user_id)
                VALUES ("${e.title}", "${e.method}", "${e.uri}", "${e.category}", ${e.fat}, ${e.protein}, ${e.carbohydrates}, ${e.sugars}, 0);
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
    });
}

export function testQuery(){
    const db = SQLite.openDatabase("pogFit");
    let result = [];
    db.transaction( (tx) => {
        tx.executeSql(`
            SELECT * 
            FROM recipes;
        `,
        [],
        (tx, resultSet) => {
            for (let i = 1; i < 10; i++) {
                
                let tuple = resultSet.rows.item(i);
                if (tuple){
                    console.log(tuple);
                }
                else {
                    break;
                }
            }
        },
        (tx, error) => {
            console.log(error);
        });
    },
    (error) => {
        console.log(error);
    });
}