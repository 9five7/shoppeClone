import { SuccessResponse } from 'src/types/utils.type';
import { Product, ProductList, ProductListConfig } from 'src/types/product.type';
import http from 'src/utils/http';
import { User, UserList, UserListt } from 'src/types/user.type';
import { Purchase, PurchaseListStatus } from 'src/types/purchase.type';
interface BodyProduct {
  name: string
  description: string
  category: string
  image: string
  images: string[]
  price: number
  rating: number
  price_before_discount: number
  quantity: number
  sold: number
  view: number
}

const BASE_URL = 'admin/products';
const URL = 'admin/users';
const URL_ODER = 'admin/purchases';

const adminProductApi = {
  getProducts(params: ProductListConfig) {
    return http.get<SuccessResponse<ProductList>>(`${BASE_URL}`, { params });
  },
  getUsers() {
    return http.get<SuccessResponse<User[]>>(URL)
  },
  deleteUser(userId: string) {
    return http.delete<SuccessResponse<string>>(`${URL}/delete/${userId}`);
  },
  getProduct(product_id: string) {
    return http.get(`${BASE_URL}/${product_id}`);
  },
  addProductt(productData: BodyProduct) {
    return http.post(`${BASE_URL}`, productData)
  },
  uploadImage(body: FormData) {
    return http.post(`${BASE_URL}/upload-image`, body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  updateProduct(product_id: string, productData:BodyProduct) {
    return http.put<SuccessResponse<Product>>(`${BASE_URL}/${product_id}`, productData);
  },

  deleteProduct(productId: string) {
    return http.delete<SuccessResponse<{ deleted_count: number }>>(`${BASE_URL}/delete/${productId}`);
  },
  getPurchases(params: { status: PurchaseListStatus }) {
    return http.get<SuccessResponse<Purchase[]>>(`${URL_ODER}`, {
      params
    })
  },
  updatePurchase(body: { product_id: string; buy_count: number }) {
    return http.put<SuccessResponse<Purchase>>(`${URL}/update-status`, body)
  },

  
};

export default adminProductApi;
