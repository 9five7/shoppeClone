import { Product, ProductList, ProductListConfig } from 'src/types/product.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'
// interface BodyProduct {
//   name: string
//   description: string
//   category: string
//   image: string
//   images: string[]
//   price: number
//   rating: number
//   price_before_discount: number
//   quantity: number
//   sold: number
//   view: number
// }
const URL = 'products'
const productApi = {
  getProducts(params: ProductListConfig) {
    return http.get<SuccessResponse<ProductList>>(URL, {
      params
    })
  },
  getProductDetail(id: string) {
    return http.get<SuccessResponse<Product>>(`${URL}/${id}`)
  }
  // addProduct(product: BodyProduct) {
  //   return http.post(`/admin/products`, product)
  // },
  // uploadImage(body: FormData) {
  //   return http.post(`/admin/products/upload-image`, body, {
  //     headers: {
  //       'Content-Type': 'multipart/form-data'
  //     }
  //   })
  // }
}

export default productApi
