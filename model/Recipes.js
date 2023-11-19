import { appSchema, tableSchema } from '@nozbe/watermelondb'

export const Recipes = appSchema({
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
  ]
})