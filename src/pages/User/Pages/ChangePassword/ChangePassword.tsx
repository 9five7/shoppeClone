import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import userApi from 'src/apis/user.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { userSchema, UserSchema } from 'src/utils/rules'

type FormData = Pick<UserSchema, 'password' | 'new_password' | 'confirm_password'>
const passwordSchema = userSchema.pick(['password', 'new_password', 'confirm_password'])
export default function ChangePassword() {
  const [, setIsSubmitting] = useState(false)
  const {
    register,
    formState: { errors },
    handleSubmit,
    
  } = useForm<FormData>({
    defaultValues: {
      password: '',
      new_password: '',
      confirm_password: ''
    },
    resolver: yupResolver(passwordSchema)
  })

  const onSubmit = handleSubmit(async (data) => {
    setIsSubmitting(true)

    try {
      const body = {
        password: data.password as string,
        new_password: data.new_password as string
      }
      const res = await userApi.updateProfile(body)
      toast.success(res.data.message)
    } catch (error) {
      console.error(error)
      toast.error('An error occurred while updating the profile.')
    } finally {
      setIsSubmitting(false)
    }
  })

  return (
    <div className=' rounded-sm bg-white px-2 md:px-7 pb-10 md:pb-20 shadow'>
      <div className='items-center border-b border-gray-200 py-4'>
        <h1 className='text-lg text-gray-900 font-medium capitalize'>Thêm kật Khẩu</h1>
        <div className='mt-1 text-sm text-gray-700'>
          Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
        </div>
      </div>
      <form className='mt-8 flex flex-col-reverse md:flex-row md:items-start' onSubmit={onSubmit}>
        <div className='mt-6 flex-grow pr-12 md:mt-0'>
          <div className='mt-4 flex flex-wrap'>
            <div className='w-[20%] pt-3 truncate  text-right caption-bottom'>Mật khẩu cũ </div>
            <div className='w-[80%] pl-5'>
              <Input
                classNameInput='px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                register={register}
                type='password'
                name='password'
                placeholder='Mật khẩu cũ'
                errorMessage={errors.password?.message}
              />
            </div>
          </div>
          <div className='mt-4 flex flex-wrap'>
            <div className='w-[20%] pt-3 truncate  text-right caption-bottom'>Mật khẩu mới </div>
            <div className='w-[80%] pl-5'>
              <Input
                classNameInput='px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                register={register}
                type='password'
                name='new_password'
                placeholder='Mật khẩu mới'
                errorMessage={errors.new_password?.message}
              />
            </div>
          </div>
          <div className='mt-4 flex flex-wrap'>
            <div className='w-[20%] pt-3 truncate  text-right caption-bottom'>Nhập lại mật khẩu mới </div>
            <div className='w-[80%] pl-5'>
              <Input
                classNameInput='px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                register={register}
                type='password'
                name='confirm_password'
                placeholder='Nhập lại mật khẩu mới'
                errorMessage={errors.confirm_password?.message}
              />
            </div>
          </div>

          <div className='mt-4 flex flex-wrap'>
            <div className='w-[20%] truncate  text-right caption-bottom' />
            <div className='w-[80%] pl-5'>
              <Button
                className='flex items-center h-9 bg-orange px-5 text-center text-sm text-white hover:bg-orange/80'
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
