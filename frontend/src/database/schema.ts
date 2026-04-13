import {appSchema, tableSchema} from '@nozbe/watermelondb'

export const schema = appSchema({
  version: 2,
  tables: [
    tableSchema({
      name: 'ingredients',
      columns: [
        {name: "title", type: "string"},
        {name: "created_at", type: "number"}
      ]
    })
  ]
})