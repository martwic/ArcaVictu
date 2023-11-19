import { appSchema, tableSchema } from '@nozbe/watermelondb'

export const FoodCategories = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'foodCategories',
      columns: [
        { name: 'created_at', type: 'number' },
        { name: 'name', type: 'string'},
      ]
    }),
  ]
})