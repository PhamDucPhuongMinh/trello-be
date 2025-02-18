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
  createdAt: string
  updatedAt: string | null
  _destroy: boolean
}
