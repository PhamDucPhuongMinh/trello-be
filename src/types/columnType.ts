import { ObjectId } from 'mongodb'

// REQUEST BODY TYPE
export type CreateColumnRequestBodyType = {
  boardId: ObjectId
  title: string
}

export type ColumnSchemaType = {
  boardId: ObjectId
  title: string
  cardOrderIds: ObjectId[]
  createdAt: number
  updatedAt: number | null
  _destroy: boolean
}
