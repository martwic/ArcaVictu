/*import { Database } from "@nozbe/watermelondb";
//import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";
import migrations from "./migrations";
import  FoodCategories  from "./FoodCategories";
import  Ingredients  from "./Ingredients";
import Products from "./Products";
import schema from './schema';
import  Recipes  from "./Recipes";
const adapter = new SQLiteAdapter({
    dbName:'ArcaVictu',
    schema,
    migrations,
    jsi: true,  //Platform.OS === 'ios' 
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

  export {databaseWatermelon};*/