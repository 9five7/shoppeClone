const path = {
  home: '/',
  user:'/user',
  admin: '/admin',
  adminProducts: '/admin/products',
  adminAddProducts: '/admin/products/addProduct',
  adminEditProducts: '/admin/products/:product_id',
  adminCategory: '/admin/categories',
  adminUser: '/admin/users',
  profile: '/user/profile',
  changePassword:'/user/Password',
  historyPurchase:'/user/Purchase',
  login: '/login',
  register: '/register',
  logout: '/logout',
  productDetail:':nameId',
  cart:'/cart',
  order:'/order'
} as const

export default path
