import { appSchema, tableSchema } from '@nozbe/watermelondb'

import { Model} from '@nozbe/watermelondb'
import {field, date, children, action, readonly} from '@nozbe/watermelondb/decorators';

export default class Products extends Model{
  static table = 'products';

  @readonly @date('created_at') createdAt;
  @field('weight') name;
  @field('amount') calories;
  @field('measure') measure;

  // Actions ---------------
  @action async getRecipe() {
      return {
          weight: this.weight,
          amount: this.amount,
          measure: this.measure,
          products: this.products,
      };
  }
};