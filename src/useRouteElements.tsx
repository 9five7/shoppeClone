import { useContext } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'

import path from './constants/path'
import { AppContext } from './context/app.context'
import CartLayout from './layouts/CartLayout'
import MainLayout from './layouts/MainLayout'
import RegisterLayout from './layouts/RegisterLayout'
import Cart from './pages/Cart'
import Login from './pages/Login'
import ProductDetail from './pages/ProductDetail'
import ProductList from './pages/ProductList'
import Register from './pages/Register'
import UserLayout from './pages/User/layouts/UserLayout'
import ChangePassword from './pages/User/Pages/ChangePassword'
import HistoryPurchsae from './pages/User/Pages/HistoryPurchase'
import Profile from './pages/User/Pages/Profile'
import { Role } from 'src/types/user.type';
import ManageProduct from './pages/Admin/Pages/ManageProduct'
import Adminlayout from './pages/Admin/layouts/AdminLayout'
import ManageUser from './pages/Admin/Pages/ManageUser'
import AddProduct from './pages/Admin/Pages/AddProduct'
import Oder from './pages/Oder'
// function ProtectedRoute() {
//   const { inAuthenticated } = useContext(AppContext)
//   return inAuthenticated ? <Outlet /> : <Navigate to='/login' />
// }
function ProtectedRoute({ requiredRole }: { requiredRole?: Role }) {
  const { inAuthenticated, profile } = useContext(AppContext);

  if (!inAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && !profile?.roles.includes(requiredRole)) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}

function ReJectedRoute() {
  const { inAuthenticated } = useContext(AppContext)
  return !inAuthenticated ? <Outlet /> : <Navigate to='/' />
}
export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: '/',
      element: (
        <MainLayout>
          <ProductList />
        </MainLayout>
      )
    },
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: path.user,
          element: (
            <MainLayout>
              <UserLayout />
            </MainLayout>
          ),
          children: [
            {
              path: path.profile,
              element: <Profile />
            },
            {
              path: path.changePassword,
              element: <ChangePassword />
            },
            {
              path: path.historyPurchase,
              element: <HistoryPurchsae />
            }
          ]
        },
        {
          path: path.cart,
          element: (
            <CartLayout>
              <Cart />
            </CartLayout>
          )
        },
        {
          path: path.order,
          element: (
            <CartLayout>
              <Oder />
            </CartLayout>
          )
        }
      ]
    },
    {
      path: '',
      element: <ProtectedRoute requiredRole='Admin' />,
      children: [
        {
          path: path.admin,
          element: (
            <MainLayout>
              <Adminlayout />
            </MainLayout>
          ),
          children: [
            {
              path: path.adminProducts,
              element: <ManageProduct />
            },
            {
              path: path.adminUser,
              element: <ManageUser />
            },
            {
              path:path.adminAddProducts,
              element: <AddProduct />
            },
            {
              path:path.adminEditProducts,
              element: <AddProduct />
            }
          ]
        },
        {
          path: path.cart,
          element: (
            <CartLayout>
              <Cart />
            </CartLayout>
          )
        }
      ]
    },
    {
      path: '',
      element: <ReJectedRoute />,
      children: [
        {
          path: path.login,
          element: (
            <RegisterLayout>
              <Login />
            </RegisterLayout>
          )
        },
        {
          path: path.register,
          element: (
            <RegisterLayout>
              <Register />
            </RegisterLayout>
          )
        }
      ]
    },
    {
      path: path.productDetail,
      element: (
        <MainLayout>
          <ProductDetail />
        </MainLayout>
      )
    }
  ])
  return routeElements
}
