import { appSchema, tableSchema } from '@nozbe/watermelondb'

export const Products = appSchema({
  version: 1,
  tables: [
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
  ]
})