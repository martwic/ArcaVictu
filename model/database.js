import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";

//import { FoodCategories } from "./model/FoodCategories";
//import { Ingredients } from "./model/Ingredients";
import Products from './Products';
import schema from './schema';
import migrations from './migrations';
//import { Recipes } from "./model/Recipes";
const adapter = new SQLiteAdapter({
    dbName:'ArcaVictu',
    schema,
    migrations,
    //jsi: true,  Platform.OS === 'ios' 
    //onSetUpError: error => {
    //}
  })

  const databaseWatermelon = new Database({
    adapter,
    modelClasses: [
      //FoodCategories,
      //Ingredients,
      Products,
      //Recipes,
    ],

    actionsEnabled:true,
  })

  export {databaseWatermelon};