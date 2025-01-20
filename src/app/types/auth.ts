interface UserAccount {
  provider: string
  last_login: string
  date_joined: string
  extra_data: {
    sub: string
    name: string
    email: string
    picture: string
    username: string
    identities: string
    email_verified: string
  }
}

export interface User {
  uuid: string
  accounts: UserAccount[]
  groups: string[]
  last_login: string
  is_superuser: boolean
  created_at: string
  updated_at: string
  username: string
  is_active: boolean
  email: string
  is_staff: boolean
  user_permissions: string[]
}
