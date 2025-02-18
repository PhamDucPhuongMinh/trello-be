import { ObjectId } from 'mongodb'

// REQUEST BODY TYPE
export type CreateCardRequestBodyType = {
  boardId: ObjectId
  columnId: ObjectId
  title: string
}

export type CardSchemaType = {
  boardId: ObjectId
  columnId: ObjectId
  title: string
  description: string
  createdAt: string
  updatedAt: string | null
  _destroy: boolean
}
