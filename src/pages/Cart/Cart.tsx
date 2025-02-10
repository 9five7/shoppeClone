import { useMutation, useQuery } from '@tanstack/react-query'
import { produce } from 'immer'
import { keyBy } from 'lodash'
import { useContext, useEffect, useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import purchaseApi from 'src/apis/purchase.api'
import Button from 'src/components/Button'
import QuantityController from 'src/components/QuantityController'
import path from 'src/constants/path'
import { purchasesStatus } from 'src/constants/purchase'
import { AppContext } from 'src/context/app.context'
import { Purchase } from 'src/types/purchase.type'
import { FormatCurrency, generateNameId } from 'src/utils/utils'
import noproduct from 'src/assets/image/no-product.png'
export default function Cart() {
  const navigate = useNavigate();
  
  const { extendedPurchases, setExtendedPurchases } = useContext(AppContext)
  const { data: purchasesInCartData, refetch } = useQuery({
    queryKey: ['purchases', { status: purchasesStatus.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchasesStatus.inCart })
  })
  const updatePurchaseMutation = useMutation({
    mutationFn: purchaseApi.updatePurchase,
    onSuccess: () => {
      refetch()
    }
  })

  const buyProductMutation = useMutation({
    mutationFn: purchaseApi.buyProducts,
    onSuccess: (data) => {
      
    }
  });
  const deletePurchaseMutation = useMutation({
    mutationFn: purchaseApi.deletePurchase,
    onSuccess: () => {
      refetch()
    }
  })
  const location = useLocation()
  const choosenPurchaseIdFormLoation = (location.state as { purchaseId: string } | null)?.purchaseId
  const purchasesInCart = purchasesInCartData?.data.data
  const isAllChecked = useMemo(() => extendedPurchases.every((purchase) => purchase.checked), [extendedPurchases])
  const checkedPurchases = useMemo(() => extendedPurchases.filter((purchase) => purchase.checked), [extendedPurchases])
  const checkedPurchasesCount = checkedPurchases.length
  const totalCheckedPurchasePrice = useMemo(
    () =>
      checkedPurchases.reduce((result, current) => {
        return result + current.product.price * current.buy_count
      }, 0),
    [checkedPurchases]
  )
  const totalCheckedPurchaseSavingPrice = useMemo(
    () =>
      checkedPurchases.reduce((result, current) => {
        return result + (current.product.price_before_discount - current.product.price) * current.buy_count
      }, 0),
    [checkedPurchases]
  )

  useEffect(() => {
    setExtendedPurchases((prev) => {
      const extendedPurchasesObject = keyBy(prev, '_id')
      return (
        purchasesInCart?.map((purchase) => {
          const isChoosenPurchaseFormLocation = choosenPurchaseIdFormLoation === purchase._id
          return {
            ...purchase,
            disabled: false,
            checked: isChoosenPurchaseFormLocation || Boolean(extendedPurchasesObject[purchase._id]?.checked)
          }
        }) || []
      )
    })
  }, [purchasesInCart, choosenPurchaseIdFormLoation])
  useEffect(() => {
    return () => {
      history.replaceState(null, '')
    }
  }, [])
  const handleCheck = (purchaseIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].checked = event.target.checked
      })
    )
  }

  const handleCheckAll = () => {
    setExtendedPurchases((prev) => prev.map((purchase) => ({ ...purchase, checked: !isAllChecked })))
  }
  const handleQuantity = (purchaseIndex: number, value: number, enable: boolean) => {
    if (enable) {
      const purchase = extendedPurchases[purchaseIndex]
      setExtendedPurchases(
        produce((draft) => {
          draft[purchaseIndex].disabled = true
        })
      )
      updatePurchaseMutation.mutate({ product_id: purchase.product._id, buy_count: value })
    }
  }
  const handleTypeQuantity = (purchaseIndex: number) => (value: number) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].buy_count = value
      })
    )
  }
  const handleDelete = (purchaseIndex: number) => () => {
    const purchaseId = extendedPurchases[purchaseIndex]._id
    deletePurchaseMutation.mutate([purchaseId])
  }

  const handleDeleteManyPurchase = () => {
    const purchasesIds = checkedPurchases.map((purchase) => purchase._id)
    deletePurchaseMutation.mutate(purchasesIds)
  }
  const handleBuyPurchase = () => {
    if (checkedPurchases.length > 0) {
      const body = checkedPurchases.map((purchase) => ({
        product_id: purchase.product._id,
        buy_count: purchase.buy_count
      }))
      buyProductMutation.mutate(body)
    }
  }
  const buyNow = async () => {
    if (checkedPurchases.length > 0) {
      // Kiểm tra lại các sản phẩm đã chọn
      const isValid = checkedPurchases.every((purchase) => purchase.buy_count > 0 && purchase.buy_count <= purchase.product.quantity);
  
      if (!isValid) {
        toast.warning('Số lượng sản phẩm không hợp lệ hoặc không đủ hàng!', {
          position: 'top-center',
          autoClose: 1000,
        });
        return;
      }
  
      // Hiển thị hộp thoại xác nhận trước khi gửi yêu cầu mua hàng
      const confirmPurchase = window.confirm('Bạn có chắc chắn muốn mua các sản phẩm đã chọn?');
  
      if (confirmPurchase) {
        try {
          const body = checkedPurchases.map((purchase) => ({
            product_id: purchase.product._id,
            buy_count: purchase.buy_count
          }));
  
          // Gửi yêu cầu mua hàng
          const res = await buyProductMutation.mutateAsync(body);
  
          // Lấy dữ liệu đơn hàng và chuyển hướng đến trang order
          const purchases = res.data.data;
  
          // Chuyển hướng đến trang order với các purchaseIds
          navigate(path.order, {
            state: {
              purchaseIds: purchases.map((purchase) => purchase._id), // Truyền các purchaseId
            },
          });
        } catch (error) {
          toast.error('Có lỗi xảy ra khi mua hàng!', {
            position: 'top-center',
            autoClose: 1000,
          });
        }
      }
    } else {
      toast.warning('Bạn chưa chọn sản phẩm nào!', {
        position: 'top-center',
        autoClose: 1000,
      });
    }
  };
  
  
  return (
    <div className='bg-neutral-100 py-16'>
      <div className='container'>
        {
          extendedPurchases.length>0?(
            <>
            <div className='overflow-auto'>
          <div className='min-w-[1000px]'>
            <div className='grid grid-cols-12 rounded-sm bg-white py-5 px-9 text-sm capitalize text-gray-500 shadow'>
              <div className='col-span-6 '>
                <div className='flex items-center'>
                  <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                    <input
                      type='checkbox'
                      className='h-5 w-5 accent-orange'
                      checked={isAllChecked}
                      onChange={handleCheckAll}
                    />
                  </div>
                  <div className='flex-grow text-black'>Sản phẩm</div>
                </div>
              </div>
              <div className='col-span-6'>
                <div className='grid grid-cols-5 text-center'>
                  <div className='col-span-2'>Đơn giá</div>
                  <div className='col-span-1'>Số lượng</div>
                  <div className='col-span-1'>Số tiền</div>
                  <div className='col-span-1'>Thao tác</div>
                </div>
              </div>
            </div>
            <div className='my-3 rounded-sm bg-white p-5 shadow'>
              {extendedPurchases?.map((purchase, index) => (
                <div
                  className='grid items-center mt-3 grid-cols-12 rounded-sm border border-gray-200 bg-white py-5 px-4 text-center text-sm text-gray-500'
                  key={purchase._id}
                >
                  <div className='col-span-6'>
                    <div className='flex '>
                      <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                        <input
                          type='checkbox'
                          className='h-5 w-5 accent-orange'
                          checked={purchase.checked}
                          onChange={handleCheck(index)}
                        />
                      </div>
                      <div className='flex-grow'>
                        <div className='flex'>
                          <Link
                            to={`${path.home}${generateNameId({ name: purchase.product.name, id: purchase.product._id })}`}
                            className='h-20 w-20 flex-shrink-0'
                          >
                            <img alt={purchase.product.name} src={purchase.product.image} />
                          </Link>
                          <div className='flex-grow px-2  pt-1 pb-2'>
                            <Link
                              to={`${path.home}${generateNameId({ name: purchase.product.name, id: purchase.product._id })}`}
                              className='line-clamp-2 text-left'
                            >
                              {purchase.product.name}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='col-span-6'>
                    <div className='grid grid-cols-5 text-center'>
                      <div className='col-span-2'>
                        <div className='flex items-center justify-center'>
                          <span className='text-gray-300 line-through'>
                            ₫{FormatCurrency(purchase.product.price_before_discount)}
                          </span>
                          <span className='ml-3'>₫{FormatCurrency(purchase.product.price)}</span>
                        </div>
                      </div>
                      <div className='col-span-1'>
                        <QuantityController
                          classNameWrapper='flex items-center'
                          max={purchase.product.quantity}
                          value={purchase.buy_count}
                          onIncrease={(value) => handleQuantity(index, value, value <= purchase.product.quantity)}
                          onDecrease={(value) => handleQuantity(index, value, value >= 1)}
                          onType={handleTypeQuantity(index)}
                          onFocusOut={(value) =>
                            handleQuantity(
                              index,
                              value,
                              value >= 1 &&
                                value <= purchase.product.quantity &&
                                value !== (purchasesInCart as Purchase[])[index].buy_count
                            )
                          }
                          disabled={purchase.disabled}
                        />
                      </div>
                      <div className='col-span-1'>
                        <span className='text-orange'>
                          ₫{FormatCurrency(purchase.product.price * purchase.buy_count)}
                        </span>
                      </div>
                      <div className='col-span-1'>
                        <button className='hover:text-orange' onClick={handleDelete(index)}>
                          Xoá
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className='sticky bottom-0 z-10 mt-8 flex items-center rounded-sm bg-white p-5 shadow border-gray-400'>
          <div className='flex flex-shrink-0 items-center justify-center pr-3'>
            <input type='checkbox' className='h-5 w-5 accent-orange' checked={isAllChecked} onChange={handleCheckAll} />
          </div>
          <button className='mx-3  border-none bg-none' onClick={handleCheckAll}>
            {' '}
            Chọn tất cả({extendedPurchases.length})
          </button>
          <button className='mx-3  border-none bg-none' onClick={handleDeleteManyPurchase}>
            {' '}
            Xoá
          </button>
         <div className='ml-auto flex items-center'>
            <div>
              <div className='flex items-center justify-end'>
                <div>Tổng thanh toán :</div>
                <div className='flex text-orange text-2xl'>₫{FormatCurrency(totalCheckedPurchasePrice)}</div>
              </div>
              <div className='flex items-center text-sm justify-end'>
                <div className='text-gray-500'>Tiết kiệm</div>
                <div className='ml-6 text-orange'>{FormatCurrency(totalCheckedPurchaseSavingPrice)}k</div>
              </div>
            </div>
            <Button
              className=' ml-4 h-12 w-52 text-center uppercase bg-red-500 text-white text-sm
                   hover:bg-red-600 flex justify-center items-center'
               onClick={buyNow}
               disabled={buyProductMutation.isPending}
            >
              Mua hàng
            </Button>
          </div>
        </div>
            </>
          ):(
            <div className='text-center'>
              <img src={noproduct} alt='no purchase' className='h-24 w-24 mx-auto' />
              <div className="mt-5 font-bold text-gray-600">Giỏ hàng của bạn còn trống</div>
              <div className="mt-5 text-center">
                <Link to={path.home} className='bg-orange px-8 py-2 uppercase text-white transition-all hover:bg-opacity-80'>
                Mua ngay
                </Link>
              </div>
            </div>
          )
        }
        
      </div>
    </div>
  )
}
