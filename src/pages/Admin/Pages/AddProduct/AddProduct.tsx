import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useMatch, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import adminProductApi from 'src/apis/adminProduct.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { ErrorResponse, NoUndefinedField } from 'src/types/utils.type'
import { productSchema } from 'src/utils/rules'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ObjectSchema } from 'yup'

type FormData = NoUndefinedField<{
  name?: string
  description?: string
  category?: string
  image?: string
  images?: string[]
  price?: number
  rating?: number
  price_before_discount?: number
  quantity?: number
  sold?: number
  view?: number
}>

export default function AddProduct() {
  const addMatch = useMatch('/admin/products/addProduct')
  const isAddMode = Boolean(addMatch)
  const { product_id } = useParams()
  const [file, setFile] = useState<File | null>(null)
  const [files, setFiles] = useState<File[] | null>(null)

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
    reset,
    control
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      description: '',
      category: '',
      price: 0,
      rating: 0,
      price_before_discount: 0,
      quantity: 0,
      sold: 0,
      view: 0,
      image: '',
      images: []
    },
    resolver: yupResolver<FormData>(productSchema as ObjectSchema<FormData>)
  })

  // Fetch existing product data when in edit mode
  const { data: productData, isLoading } = useQuery({
    queryKey: ['product', product_id],
    queryFn: () => adminProductApi.getProduct(product_id as string),
    enabled: !!product_id
  })

  const product = productData?.data.data

  // Populate the form with product data when available
  useEffect(() => {
    if (product) {
      console.log('Resetting form with product data:', product)
      reset({
        name: product.name,
        description: product.description,
        category: product.category._id, // Cập nhật category nếu cần
        price: product.price,
        rating: product.rating,
        price_before_discount: product.price_before_discount,
        quantity: product.quantity,
        sold: product.sold,
        view: product.view,
        image: product.image,
        images: product.images
      })
    }
  }, [product, reset])

  // Mutation for adding new product
  const addProductMutation = useMutation({
    mutationFn: adminProductApi.addProductt,
    onSuccess: (data) => {
      toast.success(data.data.message, {
        position: 'top-center',
        autoClose: 1000
      })
    },
    onError: (error) => {
      console.error('Add product mutation error:', error) // Log error during add mutation
    }
  })

  // Mutation for updating an existing product
  const updateProductMutation = useMutation({
    mutationFn: async ({ product_id, productData }: { product_id: string; productData: FormData }) => {
      console.log('Updating product with ID:', product_id) // Log product ID
      console.log('Product data being sent:', productData) // Log the product data being sent for update
      return adminProductApi.updateProduct(product_id, productData)
    },
    onSuccess: (data) => {
      toast.success(data.data.message, {
        position: 'top-center',
        autoClose: 1000
      })
    },
    onError: (error) => {
      console.error('Update product mutation error:', error) // Log error during update mutation
    }
  })

  const onSubmit = handleSubmit(async (data) => {
    console.log('Form data to submit:', data)

    try {
      let imageUrl = data.image
      let imagesArray = data.images || []

      // Upload main image if a new file is selected
      if (file) {
        const formData = new FormData()
        formData.append('image', file)
        const uploadImageResult = await adminProductApi.uploadImage(formData)
        imageUrl = uploadImageResult.data.data // URL ảnh chính sau khi upload
      }

      // Upload additional images if files are selected
      if (files) {
        const formData = new FormData()
        files.forEach((file) => formData.append('images', file))
        const uploadImagesResult = await adminProductApi.uploadImage(formData)
        imagesArray = uploadImagesResult.data.data // Mảng URL ảnh phụ
      }

      // Xử lý thêm hoặc chỉnh sửa
      if (isAddMode) {
        await addProductMutation.mutateAsync({
          ...data,
          category: '60afafe76ef5b902180aacb5', // ID danh mục mẫu
          image: imageUrl,
          images: imagesArray
        })
        reset()
      } else {
        console.log('Sending update for product:', product_id)
        await updateProductMutation.mutateAsync({
          product_id: product_id!,
          productData: {
            ...data,
            category: '60afafe76ef5b902180aacb5', // ID danh mục mẫu
            image: imageUrl,
            images: imagesArray
          }
        })
      }
    } catch (error) {
      console.log('Error updating product:', error)
      if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
        const formError = error.response?.data.data
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormData, {
              type: 'Server'
            })
          })
        }
      }
    }
  })

  return (
    <div className='rounded-sm bg-white px-2 pb-10 shadow md:px-7 md:pb-20'>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>{isAddMode ? 'Thêm' : 'Sửa'} sản phẩm</h1>
      </div>
      <form className='mt-8 mr-auto max-w-2xl' onSubmit={onSubmit}>
        <div className='mt-6 flex-grow md:mt-0 md:pr-12'>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Tên sản phẩm</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                className='relative '
                register={register}
                name='name'
                type='text'
                placeholder='Tên sản phẩm'
                errorMessage={errors.name?.message}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Mô tả sản phẩm</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                className='relative '
                register={register}
                name='description'
                type='text'
                errorMessage={errors.description?.message}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Ảnh sản phẩm</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Controller
                name='image'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <input
                    className='relative w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                    // register={register}
                    type='file'
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setFile(file)
                        field.onChange(file.name)
                      }
                    }}
                    // errorMessage={errors.name?.message}
                  />
                )}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Ảnh mô tả sản phẩm</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Controller
                name='images'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <input
                    className='relative w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                    type='file'
                    multiple // Cho phép chọn nhiều tệp
                    onChange={(e) => {
                      const files = e.target.files
                      if (files) {
                        const fileNames = Array.from(files).map((file) => file.name) // Lấy tên các tệp
                        field.onChange(fileNames) // Lưu mảng tên tệp vào form
                      }
                    }}
                  />
                )}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Giá sản phẩm</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                className='relative '
                register={register}
                name='price'
                type='text'
                placeholder='giá sản phẩm'
                errorMessage={errors.price?.message}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Đánh giá sản phẩm</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                className='relative '
                register={register}
                name='rating'
                type='text'
                placeholder='đánh giá sản phẩm'
                errorMessage={errors.rating?.message}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Giá sản phẩm</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                className='relative '
                register={register}
                name='price_before_discount'
                type='text'
                placeholder='giá sản phẩm trước khi giảm'
                errorMessage={errors.price_before_discount?.message}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Số lượng sản phẩm</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                className='relative '
                register={register}
                name='quantity'
                type='text'
                placeholder='Số lượng sản phẩm '
                errorMessage={errors.quantity?.message}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Đã bán</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                className='relative '
                register={register}
                name='sold'
                type='text'
                errorMessage={errors.sold?.message}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Lượt xem sản phẩm</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                className='relative '
                register={register}
                name='view'
                type='text'
                errorMessage={errors.view?.message}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right' />
            <div className='sm:w-[80%] sm:pl-5'>
              <Button
                className='flex h-9 items-center rounded-sm bg-orange px-5 text-center text-sm text-white hover:bg-orange/80'
                type='submit'
              >
                Lưu
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
