import { appSchema, tableSchema } from '@nozbe/watermelondb'

export const Ingredients = appSchema({
  version: 1,
  tables: [
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
  ]
})