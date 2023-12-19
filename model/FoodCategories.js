import { Model} from '@nozbe/watermelondb'
import {field, date, children, action, readonly} from '@nozbe/watermelondb/decorators';

export default class FoodCategories extends Model{
  static table = 'foodCategories';

  @readonly @date('created_at') createdAt;
  @field('name') name;

  // Actions ---------------
  //@action async getFoodCategory() {
   //   return {
   //       name: this.name,
   //   };
  //}

};