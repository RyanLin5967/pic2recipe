import {Database} from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
import { schema } from './schema'
import Ingredient from '@/src/database/models/Ingredient'

const adapter = new SQLiteAdapter({
    schema,
    jsi: true,
})

export const database = new Database({
    adapter, 
    modelClasses: [Ingredient]
})