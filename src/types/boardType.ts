// REQUEST BODY TYPE
export type CreateResBoardBodyType = {
  title: string
  description: string
  type: string
}

// OBJECT TYPE
export type BoardSchemaType = {
  title: string
  slug: string
  description: string
  type: string
  columnOrderIds: string
  createdAt: string
  updatedAt: string
  _destroy: string
}
