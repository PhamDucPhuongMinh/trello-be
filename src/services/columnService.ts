import { boardModel } from '~/models/boardModel'
import { columnModel } from '~/models/columnModel'
import { CreateColumnRequestBodyType } from '~/types/columnType'

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

export const columnService = {
  create
}
