import { schemaMigrations, createTable } from '@nozbe/watermelondb/Schema/migrations'

export const migrations = schemaMigrations({
    migrations: [
        {
            toVersion: 3,
            steps: [
                createTable({
                    name: 'favorites',
                    columns: [
                        {name: "recipe_id", type: "number"},
                        {name: "title", type: "string"},
                        {name: "ingredients_json", type: "string"},
                        {name: "directions_json", type: "string"},
                        {name: "similarity", type: "number"},
                        {name: "cook_time_minutes", type: "number"},
                        {name: "difficulty", type: "string", isOptional: true},
                        {name: "equipment_json", type: "string", isOptional: true},
                        {name: "created_at", type: "number"}
                    ]
                })
            ]
        }
    ]
})