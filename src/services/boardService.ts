import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { ObjectId } from 'mongodb'
import { boardModel } from '~/models/boardModel'
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import { BoardSchemaType, CreateBoardRequestBodyType, SupportMovingCardRequestBodyType } from '~/types/boardType'
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

const update = async (id: string, reqBody: Partial<BoardSchemaType>) => {
  const updateData: Partial<BoardSchemaType> = {
    ...reqBody,
    updatedAt: Date.now()
  }
  const updatedBoard = await boardModel.update(id, updateData)

  return updatedBoard
}

const moveCardToDifferentColumn = async (reqBody: SupportMovingCardRequestBodyType) => {
  // Bước 1: Cập nhật orderedIds của column cũ
  await columnModel.update(reqBody.prevColumnId, {
    cardOrderIds: reqBody.prevCardOrderedIds.map((id) => new ObjectId(id)),
    updatedAt: Date.now()
  })
  // Bước 2: Cập nhật orderedIds của column mới
  await columnModel.update(reqBody.nextColumnId, {
    cardOrderIds: reqBody.nextCardOrderedIds.map((id) => new ObjectId(id)),
    updatedAt: Date.now()
  })
  // Bước 3: Cập nhật columnId của card
  await cardModel.update(reqBody.cardId, {
    columnId: new ObjectId(reqBody.nextColumnId),
    updatedAt: Date.now()
  })

  return { updateResult: 'success' }
}

export const boardService = {
  create,
  getDetails,
  update,
  moveCardToDifferentColumn
}
