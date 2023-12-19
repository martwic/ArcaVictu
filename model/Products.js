import { Model} from '@nozbe/watermelondb'
import {field, date, children, action, readonly} from '@nozbe/watermelondb/decorators';

export default class Products extends Model{
  static table = 'products';
  static associations = {
    ingredients: { type: 'has_many', foreignKey: 'product_id' },
};

  @readonly @date('created_at') createdAt;
  @field('name') name;
  @field('calories') calories;
  @field('carbohydrates') carbohydrates;
  @field('fats') fats;
  @field('proteins') proteins;
  @field('photoPath') photoPath;
  @children('ingredients') ingredients

/*
  // Actions ---------------
  @action async getRecipe() {
      return {
          name: this.name,
          preparationTime: this.preparationTime,
          waitingTime: this.waitingTime,
          durability: this.durability,
          directions: this.directions,
          photoPath: this.photoPath,
          ingredients: this.ingredients,
      };
  } 
*/
};