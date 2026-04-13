import { Model } from '@nozbe/watermelondb'
import { field, date, readonly } from '@nozbe/watermelondb/decorators'

export default class Ingredient extends Model {
  static table = 'ingredients'

  @field('title') title!: string
  @readonly @date('created_at') createdAt!: Date
}