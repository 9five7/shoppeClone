import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import adminProductApi from 'src/apis/adminProduct.api'

export default function ManageUser() {
  const queryClient = useQueryClient()

  // Lấy danh sách người dùng
  const { data: usersData, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => adminProductApi.getUsers()
  })

  // Mutation để xóa người dùng
  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => adminProductApi.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUserMutation.mutate(userId)
    }
  }

  return (
    <div>
      {isLoading ? (
        <p>Loading users...</p>
      ) : (
        <div className='relative mr-2 ml-2 mt-4 overflow-x-auto sm:rounded-lg shadow-sm'>
          <table className='w-full text-left text-sm text-gray-500 dark:text-gray-400 shadow-sm table-fixed'>
            <thead className='bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400'>
              <tr>
                <th scope='col' className='py-3 px-12'>
                  ID
                </th>
                <th scope='col' className='py-3 px-12'>
                  Name
                </th>
                <th scope='col' className='py-3 px-10'>
                  Email
                </th>
              </tr>
            </thead>
            <tbody>
              {usersData?.data.data.map((user) => (
                <tr
                  key={user._id}
                  className='border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'
                >
                  <td className='py-4 px-4'>{user._id}</td>
                  <td className='py-4 px-6'>{user.name}</td>
                  <td className='py-4 px-8'>{user.email}</td>
                  <td className='py-4 px-4 text-right'>
                    <button
                      className='font-medium text-red-600 dark:text-red-500'
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
