import { appSchema, tableSchema } from '@nozbe/watermelondb'

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'recipes',
      columns: [
        { name: 'created_at', type: 'number' },
        { name: 'name', type: 'string'},
        { name: 'preparationTime', type: 'number' },
        { name: 'waitingTime', type: 'number' },
        { name: 'durability', type: 'string' },
        { name: 'directions', type: 'number' },
        { name: 'photoPath', type: 'string' },
      ]
    }),
    tableSchema({
      name: 'products',
      columns: [
        { name: 'created_at', type: 'number' },
        { name: 'name', type: 'string'},
        { name: 'calories', type: 'number' },
        { name: 'carbohydrates', type: 'number' },
        { name: 'fats', type: 'number' },
        { name: 'proteins', type: 'number' },
        { name: 'category_id', type: 'string' },
      ]
    }),
    tableSchema({
      name: 'ingredients',
      columns: [
        { name: 'created_at', type: 'number' },
        { name: 'recipe_id', type: 'string'},
        { name: 'product_id', type: 'string'},
        { name: 'weight', type: 'number' },
        { name: 'amount', type: 'number' },
        { name: 'measure', type: 'string' },
      ]
    }),
    tableSchema({
      name: 'foodCategories',
      columns: [
        { name: 'created_at', type: 'number' },
        { name: 'name', type: 'string'},
      ]
    }),
  ]
})