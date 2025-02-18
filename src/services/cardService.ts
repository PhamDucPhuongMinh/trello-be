import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import { CreateCardRequestBodyType } from '~/types/cardType'

const create = async (reqBody: CreateCardRequestBodyType) => {
  const createdCardId = await cardModel.create({ ...reqBody })
  const createdCard = await cardModel.findOneById(createdCardId)

  if (createdCard) {
    // Cập nhật cardOrderIds trong document Column
    await columnModel.pushCardOrderIds(createdCard.columnId, createdCard._id)
  }

  return createdCard
}

export const cardService = {
  create
}
