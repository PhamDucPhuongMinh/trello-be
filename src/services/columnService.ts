import { StatusCodes } from 'http-status-codes'
import { boardModel } from '~/models/boardModel'
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import { ColumnSchemaType, CreateColumnRequestBodyType } from '~/types/columnType'
import ApiError from '~/utils/ApiError'

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

const deleteItem = async (id: string) => {
  const targetColumn = await columnModel.findOneById(id)
  if (!targetColumn) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Column doesn't exist!")
  }
  // Xoá Column
  await columnModel.deleteOneById(id)
  // Xoá Card trong Column
  await cardModel.deleteManyByColumnId(id)
  // Xoá columnId trong collection Board columnOrderIds
  await boardModel.pullColumnOrderIds(targetColumn.boardId, targetColumn._id)
  return {
    deleteResult: 'Column and its Cards deleted successfully!'
  }
}

export const columnService = {
  create,
  update,
  deleteItem
}
