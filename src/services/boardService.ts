import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { ObjectId } from 'mongodb'
import { boardModel } from '~/models/boardModel'
import { BoardSchemaType, CreateBoardRequestBodyType } from '~/types/boardType'
import { CardSchemaType } from '~/types/cardType'
import { ColumnSchemaType } from '~/types/columnType'
import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatters'

const create = async (reqBody: CreateBoardRequestBodyType) => {
  const createdBoardId = await boardModel.create({ ...reqBody, slug: slugify(reqBody.title) })
  return await boardModel.findOneById(createdBoardId)
}

const getDetails = async (id: string) => {
  const boardDetails = await boardModel.getDetails(id)
  if (!boardDetails) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
  }
  const cloneBoardDetails = cloneDeep(boardDetails)
  const resBoard: BoardSchemaType & {
    columns: (ColumnSchemaType & { _id: ObjectId; cards: (CardSchemaType & { _id: ObjectId })[] })[]
    cards?: (CardSchemaType & { _id: ObjectId })[]
  } = {
    ...cloneBoardDetails,
    columns: cloneBoardDetails.columns.map((column) => {
      return {
        ...column,
        cards: cloneBoardDetails.cards.filter((card) => card.columnId.equals(column._id))
      }
    })
  }
  delete resBoard.cards
  return resBoard
}

export const boardService = {
  create,
  getDetails
}
