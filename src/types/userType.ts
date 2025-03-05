// Kiểu dữ liệu truyền vào body của request khi tạo mới một board
export type RegisterUserRequestBodyType = {
  email: string
  password: string
}

export type UserSchemaType = {
  email: string
  password: string
  username: string
  displayName: string
  avatar: string
  role: string

  isActivated: boolean
  verifyToken: string | null

  createdAt: number
  updatedAt: number | null
  _destroy: boolean
}
