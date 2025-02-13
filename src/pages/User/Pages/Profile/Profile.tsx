import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import userApi from 'src/apis/user.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import InputNumber from 'src/components/InputNumber'
import config from 'src/constants/config'
import { AppContext } from 'src/context/app.context'
import { setProfileToLS } from 'src/utils/auth'
import { userSchema, UserSchema } from 'src/utils/rules'
import { getAvatarUrl } from 'src/utils/utils'
import DateSelect from '../../components/DateSelect'

type FormData = Pick<UserSchema, 'name' | 'address' | 'phone' | 'date_of_birth' | 'avatar'>

const profileSchema = userSchema.pick(['name', 'address', 'phone', 'date_of_birth', 'avatar'])

export default function Profile() {
  const { setProfile } = useContext(AppContext)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { data: profileData, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: userApi.getProfile
  })
  const profile = profileData?.data.data
  const updateProfileMutation = useMutation({
    mutationFn: userApi.updateProfile
  })
  const uploadAvatarMutaion = useMutation({
    mutationFn: userApi.uploadAvatar
  })
  const [, setIsSubmitting] = useState(false)
  const [file, setFile] = useState<File>()
  const previewImage = useMemo(() => {
    return file ? URL.createObjectURL(file) : ''
  }, [file])
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      avatar: '',
      date_of_birth: new Date(1990, 0, 1)
    },
    resolver: yupResolver(profileSchema)
  })
  const avatar = watch('avatar')
  useEffect(() => {
    if (profile) {
      setValue('name', profile.name)
      setValue('address', profile.address)
      setValue('avatar', profile.avatar)
      setValue('phone', profile.phone)
      setValue('date_of_birth', profile.date_of_birth ? new Date(profile.date_of_birth) : new Date(1990, 0, 1))
    }
  }, [profile, setValue])
  const onSubmit = handleSubmit(async (data) => {
    setIsSubmitting(true)
    try {
      let avatarName = avatar
      if (file) {
        const form = new FormData()
        form.append('image', file)
        const uploadRes = await uploadAvatarMutaion.mutateAsync(form)
        avatarName = uploadRes.data.data
        console.log(uploadRes.data.data)
        setValue('avatar', avatarName)
      }
      const res = await updateProfileMutation.mutateAsync({
        ...data,
        date_of_birth: data.date_of_birth?.toISOString(),
        avatar: avatarName
      })
      setProfile(res.data.data)
      setProfileToLS(res.data.data)
      refetch()
      toast.success(res.data.message)
    } catch (error) {
      console.error(error)
      toast.error('An error occurred while updating the profile.')
    } finally {
      setIsSubmitting(false)
    }
  })
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileFormLocal = event.target.files?.[0]
    if (fileFormLocal && (fileFormLocal.size >= config.maxSizeUploadAvatar || !fileFormLocal.type.includes('image'))) {
      toast.error('Dụng lượng file tối đa 1 MB Định dạng:.JPEG, .PNG')
    } else {
      setFile(fileFormLocal)
    }
  }
  const handleUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className=' rounded-sm bg-white px-2 md:px-7 pb-10 md:pb-20 shadow'>
      <div className='items-center border-b border-gray-200 py-4'>
        <h1 className='text-lg text-gray-900 font-medium capitalize'>Hồ Sơ Của Tôi</h1>
        <div className='mt-1 text-sm text-gray-700'>Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
      </div>
      <form className='mt-8 flex flex-col-reverse md:flex-row md:items-start' onSubmit={onSubmit}>
        <div className='mt-6 flex-grow pr-12 md:mt-0'>
          <div className='mt-4 flex flex-wrap'>
            <div className='w-[20%] pt-3 truncate  text-right caption-bottom'>Tên </div>
            <div className='w-[80%] pl-5'>
              <Input
                classNameInput='px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                register={register}
                name='name'
                placeholder='ten'
                errorMessage={errors.name?.message}
              />
            </div>
          </div>
          <div className='mt-2 flex bg-flex-wrap'>
            <div className='w-[20%] truncate  text-right caption-bottom'>Email </div>
            <div className='w-[80%] pl-5'>{profile?.email}</div>
          </div>
          <div className='mt-6 flex flex-wrap'>
            <div className='w-[20%] truncate  text-right caption-bottom'>Số điện thoại </div>
            <div className='w-[80%] pl-5'>
              <Controller
                control={control}
                name='phone'
                render={({ field }) => (
                  <InputNumber
                    classNameInput='px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                    placeholder='So dien thoai'
                    errorMessage={errors.phone?.message}
                    {...field}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>
          <div className='mt-4 flex flex-wrap'>
            <div className='w-[20%] truncate  text-right caption-bottom'>Địa chỉ </div>
            <div className='w-[80%] pl-5'>
              <Input
                classNameInput='px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                register={register}
                name='address'
                placeholder='dia chi'
                errorMessage={errors.address?.message}
              />
            </div>
          </div>
          <Controller
            control={control}
            name='date_of_birth'
            render={({ field }) => (
              <DateSelect errorMessage={errors.date_of_birth?.message} value={field.value} onChange={field.onChange} />
            )}
          />

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
        <div className='flex justify-center md:w-72 md:border-l md:border-l-gray-200'>
          <div className='flex flex-col items-center'>
            <div className='my-5 h-24 w-24'>
              <img
                src={previewImage || getAvatarUrl(avatar)}
                alt=''
                className='h-full w-full rounded-full object-cover'
              />
            </div>
            <input
              type='file'
              accept='.jpg,.jpeg,.png'
              className='hidden'
              ref={fileInputRef}
              onChange={onFileChange}
              onClick={(event) => {
                ;(event.target as any).value = null
              }}
            />
            <button
              className='flex h-10 items-center justify-end rounded-sm border bg-white px-6 text-gray-600 shadow-sm'
              type='button'
              onClick={handleUpload}
            >
              Chọn ảnh
            </button>
            <div className='mt-3 text-gray-400'>
              <div>Dụng lượng file tối đa 1 MB</div>
              <div>Định dạng:.JPEG, .PNG</div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
