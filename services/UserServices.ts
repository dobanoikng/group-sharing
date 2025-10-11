import { supabase } from '@/libs/supabase'

const TABLE_NAME = 'profiles'

export type IProfile = {
  id: string,
  full_name: string,
  email: string
  avatar_url?: string
}

export const userServices = {
  async getAll() {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: true })
    if (error) throw error
    return data
  },
  async create(newUser: Omit<IProfile, 'id'> & { password: string }) {
    const { data: user, error } = await supabase.auth.signUp(newUser)

    if (error || !user.user) throw error

    const { data, error: err } = await supabase
      .from(TABLE_NAME)
      .insert([{
        'avatar_url': null,
        'full_name': newUser.full_name,
        'email': newUser.email,
        'id': user.user.id
      }])
      .select()

    if (err) {
      await supabase.auth.admin.deleteUser(user.user.id)
      throw err
    }

    return data[0]
  },
}
