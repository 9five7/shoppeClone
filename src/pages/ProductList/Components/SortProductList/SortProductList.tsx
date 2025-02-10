import { omit } from 'lodash'
import { Link, createSearchParams, useNavigate } from 'react-router-dom'

import { order as orderConstant, sortBy } from 'src/constants/products'

import path from 'src/constants/path'
import { ProductListConfig } from 'src/types/product.type'
import { QueryConfig } from 'src/hooks/useQueryConfig'


interface Props {
  queryConfig: QueryConfig
  pageSize: number
}
export default function SortProductList({ queryConfig, pageSize }: Props) {
  const page = Number(queryConfig.page)
  const { sort_by = sortBy.createdAt, order } = queryConfig
  const navigate = useNavigate()
  const isActiveSortBy = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    return sort_by === sortByValue
  }

  const handleSort = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams(
        omit(
          {
            ...queryConfig,
            sort_by: sortByValue
          },
          ['order']
        )
      ).toString()
    })
  }

  const handlePriceOrder = (orderValue: Exclude<ProductListConfig['order'], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        sort_by: sortBy.price,
        order: orderValue
      }).toString()
    })
  }
  return (
    <div className='bg-gray-300/40 py-6 px-3 '>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex items-center flex-wrap gap-2'>
          <div>Sắp xếp theo</div>
          <button
            className={`h-8 px-4 capitalize text-center rounded-sm ${isActiveSortBy(sortBy.view) ? ' bg-orange  text-white text-sm hover:bg-orange/80' : 'bg-white text-black hover:bg-slate-100'}`}
            onClick={() => handleSort(sortBy.view)}
          >
            Phổ biến
          </button>
          <button
            className={`h-8 px-4 capitalize text-center rounded-sm ${isActiveSortBy(sortBy.createdAt) ? ' bg-orange  text-white text-sm hover:bg-orange/80' : 'bg-white text-black hover:bg-slate-100'}`}
            onClick={() => handleSort(sortBy.createdAt)}
          >
            Mới nhất
          </button>
          <button
            className={`h-8 px-4 capitalize text-center rounded-sm ${isActiveSortBy(sortBy.sold) ? ' bg-orange  text-white text-sm hover:bg-orange/80' : 'bg-white text-black hover:bg-slate-100'}`}
            onClick={() => handleSort(sortBy.sold)}
          >
            Bán chạy
          </button>
          <select
            className={`h-8 px-4 capitalize outline-none text-sm text-left rounded-sm ${isActiveSortBy(sortBy.price) ? ' bg-orange  text-white text-sm hover:bg-orange/80' : 'bg-white text-black hover:bg-slate-100'}`}
            value={order || ''}
            onChange={(event) => handlePriceOrder(event.target.value as Exclude<ProductListConfig['order'], undefined>)}
          >
            <option value='' disabled className='bg-white text-black'>
              Giá
            </option>
            <option value={orderConstant.asc} className='bg-white text-black'>
              Giá: Thấp đến cao
            </option>
            <option value={orderConstant.desc} className='bg-white text-black'>
              Giá: Cao đến thấp
            </option>
          </select>
        </div>
        <div className='flex items-center'>
          <span className='text-orange'>{page}</span>
          <span>/{pageSize}</span>
          <div className='ml-2 flex'>
            {page === 1 ? (
              <span className=' flex w-9 h-8 justify-center items-center shadow rounded-tl-sm rounded-bl-sm bg-white/60 hover:bg-slate-100 cursor-not-allowed'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-3 h-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5 8.25 12l7.5-7.5' />
                </svg>
              </span>
            ) : (
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    page: (page - 1).toString()
                  }).toString()
                }}
                className=' flex w-9 h-8 justify-center items-center shadow rounded-tl-sm rounded-bl-sm bg-white hover:bg-slate-100 cursor-not-allowed'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-3 h-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5 8.25 12l7.5-7.5' />
                </svg>
              </Link>
            )}

            {page === pageSize ? (
              <span className=' flex w-9 h-8 justify-center items-center shadow rounded-tl-sm rounded-bl-sm bg-white/60 hover:bg-slate-100 cursor-not-allowed'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-3 h-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                </svg>
              </span>
            ) : (
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    page: (page + 1).toString()
                  }).toString()
                }}
                className=' flex w-9 h-8 justify-center items-center shadow rounded-tl-sm rounded-bl-sm bg-white hover:bg-slate-100 cursor-not-allowed'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-3 h-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
