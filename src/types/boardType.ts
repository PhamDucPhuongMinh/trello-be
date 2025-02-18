import { ObjectId } from 'mongodb'

// Kiểu dữ liệu truyền vào body của request khi tạo mới một board
export type CreateBoardRequestBodyType = {
  title: string
  description: string
  type: string
}

export type BoardSchemaType = {
  title: string
  slug: string
  description: string
  type: string
  columnOrderIds: ObjectId[]
  createdAt: string
  updatedAt: string | null
  _destroy: string
}
