import { boardModel } from '~/models/boardModel'
import { columnModel } from '~/models/columnModel'
import { ColumnSchemaType, CreateColumnRequestBodyType } from '~/types/columnType'

const create = async (reqBody: CreateColumnRequestBodyType) => {
  const createdColumnId = await columnModel.create({ ...reqBody })
  const createdColumn = await columnModel.findOneById(createdColumnId)

  if (createdColumn) {
    // Xử lý cấu trúc data trả về
    const resCreatedColumn = { ...createdColumn, cards: [] }

    // Cập nhật columnOrderIds trong collection Board
    await boardModel.pushColumnOrderIds(createdColumn.boardId, createdColumn._id)

    return resCreatedColumn
  }

  return createdColumn
}

const update = async (id: string, reqBody: Partial<ColumnSchemaType>) => {
  const updateData: Partial<ColumnSchemaType> = {
    ...reqBody,
    updatedAt: Date.now()
  }
  const updatedColumn = await columnModel.update(id, updateData)

  return updatedColumn
}

export const columnService = {
  create,
  update
}
