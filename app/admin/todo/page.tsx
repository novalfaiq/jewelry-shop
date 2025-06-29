
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: todos } = await supabase.from('todos').select()

  return (
    <h1>Hello world</h1>
    // <ul>
    //   {todos?.map((todo) => (
    //     <li>{todo}</li>
    //   ))}
    // </ul>
  )
}
