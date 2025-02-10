import { Outlet } from 'react-router-dom'
import AdminSideNav from '../../components/AdminSideNav'

export default function Adminlayout() {
  return (
    <div className='bg-neutral-100  text-sm text-gray-600'>
      <div className=''>
        <div className='grid min-h-screen grid-cols-6'>
          <div className='col-span-1'>
            <AdminSideNav />
          </div>
          <div className='col-span-5'>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
