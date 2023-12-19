import { Model} from '@nozbe/watermelondb'
import {field, date, children, action, readonly} from '@nozbe/watermelondb/decorators';

export default class Recipes extends Model{
  static table = 'recipes';
  static associations = {
    ingredients: { type: 'has_many', foreignKey: 'recipes_id' },
};

  @readonly @date('created_at') createdAt;
  @field('name') name;
  @field('preparationTime') preparationTime;
  @field('waitingTime') waitingTime;
  @field('durability') durability;
  @field('directions') directions;
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
  }*/

};