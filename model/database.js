import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";

import schema from "./schema";
import { FoodCategories } from "./FoodCategories";
import { Ingredients } from "./Ingredients";
import { Products } from "./Products";
import { Recipes } from "./Recipes";

const adapter = new SQLiteAdapter({
    dbName:'ArcaVictu',
    schema,
    migrations,
    //jsi: true, /* Platform.OS === 'ios' */
    onSetUpError: error => {
    }
  })

  const database = new Database({
    adapter,
    modelClasses: [
      FoodCategories,
      Ingredients,
      Products,
      Recipes,
    ],
    
    actionsEnabled:true,
  })

  export {database};