import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const createdBoard = await boardService.create(req.body)
    res.status(StatusCodes.CREATED).json(createdBoard)
  } catch (error) {
    next(error)
  }
}

const getDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const boardId = req.params.id
    const board = await boardService.getDetails(boardId)
    res.status(StatusCodes.OK).json(board)
  } catch (error) {
    next(error)
  }
}

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const boardId = req.params.id
    const updatedBoard = await boardService.update(boardId, req.body)
    res.status(StatusCodes.OK).json(updatedBoard)
  } catch (error) {
    next(error)
  }
}

const moveCardToDifferentColumn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await boardService.moveCardToDifferentColumn(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const boardController = {
  create,
  getDetails,
  update,
  moveCardToDifferentColumn
}
