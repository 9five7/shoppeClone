import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import adminProductApi from 'src/apis/adminProduct.api'
import path from 'src/constants/path'

export default function ManageProduct() {
  const queryClient = useQueryClient()
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => adminProductApi.getProducts({ page: 1, limit: 90 })
  })
  const deleteProductMutation = useMutation({
    mutationFn: (productId: string) => adminProductApi.deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    }
  })
  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProductMutation.mutate(productId)
    }
  }
  return (
    <div>
      {isLoading ? (
        <p>Loading products...</p>
      ) : (
        <div className='relative mr-2 ml-2 mt-4 overflow-x-auto sm:rounded-lg shadow-sm'>
          <table className='w-full text-left text-sm text-gray-500 dark:text-gray-400 shadow-sm table-fixed'>
            <thead className='bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400'>
              <tr>
                <th scope='col' className='py-3 px-12'>
                  ID
                </th>
                <th scope='col' className='py-3 px-12'>
                  Avatar
                </th>
                <th scope='col' className='py-3 px-10'>
                  Name
                </th>
                <th scope='col' className='py-3 px-12 bg-orange text-center text-white'>
                  <Link to={path.adminAddProducts}>ADD</Link>
                </th>
              </tr>
            </thead>
            <tbody>
              {productsData?.data.data.products.map((product) => (
                <tr
                  key={product._id}
                  className='border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'
                >
                  <td className='py-4 px-4'>{product._id}</td>
                  <td className='py-4 px-6'>
                    <img src={product.image} alt='img' className='h-20 w-20' />
                  </td>
                  <th
                    scope='row'
                    className='whitespace-nowrap overflow-hidden py-4 px-8 font-medium text-gray-900 dark:text-white'
                  >
                    <div className='truncate'>{product.name}</div>
                  </th>
                  <td className='py-4 px-4 text-right'>
                    <Link
                      to={`/admin/products/${product._id}`}
                      className='mr-5 font-medium text-blue-600 hover:underline dark:text-blue-500'
                    >
                      Edit
                    </Link>
                    <button
                      className='font-medium text-red-600 dark:text-red-500'
                      onClick={() => handleDeleteProduct(product._id)}
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

      <div className='mt-6 flex justify-center'>
        <nav aria-label='Page navigation example'>
          <ul className='inline-flex -space-x-px'>
            <li>
              <span className='cursor-not-allowed rounded-l-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'>
                Previous
              </span>
            </li>
            <li>
              <a
                className='border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500   hover:bg-gray-100  hover:text-gray-700'
                href='/students?page=8'
              >
                1
              </a>
            </li>
            <li>
              <a
                className='rounded-r-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                href='/students?page=1'
              >
                Next
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}
