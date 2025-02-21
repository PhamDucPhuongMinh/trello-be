import { ObjectId } from 'mongodb'

// Kiểu dữ liệu truyền vào body của request khi tạo mới một board
export type CreateBoardRequestBodyType = {
  title: string
  description: string
  type: string
}

// Kiểu dữ liệu truyền vào body của request khi di chuyển một card từ một column này sang column khác
export type SupportMovingCardRequestBodyType = {
  cardId: string
  prevColumnId: string
  prevCardOrderedIds: string[]
  nextColumnId: string
  nextCardOrderedIds: string[]
}

export type BoardSchemaType = {
  title: string
  slug: string
  description: string
  type: string
  columnOrderIds: ObjectId[]
  createdAt: number
  updatedAt: number | null
  _destroy: string
}
