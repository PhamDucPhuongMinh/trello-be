import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { ObjectId } from 'mongodb'
import { boardModel } from '~/models/boardModel'
import { CreateResBoardBodyType } from '~/types/boardType'
import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatters'

const create = async (reqBody: CreateResBoardBodyType) => {
  const createdBoardId = await boardModel.create({ ...reqBody, slug: slugify(reqBody.title) })
  return await boardModel.findOneById(createdBoardId)
}

const getDetails = async (id: string) => {
  const boardDetails = await boardModel.getDetails(id)
  if (!boardDetails) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
  }
  const resBoard = cloneDeep(boardDetails)
  resBoard.columns = resBoard.columns.map((column: { _id: ObjectId; cards: { _id: ObjectId }[] }) => {
    column.cards = resBoard.filter((card: { columnId: ObjectId }) => card.columnId.equals(column._id))
  })
  delete resBoard.cards
  return boardDetails
}

export const boardService = {
  create,
  getDetails
}
