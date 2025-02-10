import { useLocation } from 'react-router-dom';
import Button from 'src/components/Button';
import Input from 'src/components/Input';
import { useMutation, useQuery } from '@tanstack/react-query';
import purchaseApi from 'src/apis/purchase.api';
import { FormatCurrency } from 'src/utils/utils';
import { toast } from 'react-toastify';
import { useContext, useMemo } from 'react';
import { AppContext } from 'src/context/app.context';

export default function Order() {
  const { extendedPurchases, setExtendedPurchases } = useContext(AppContext)
  const location = useLocation();
  const { purchaseIds } = location.state || {};
   const checkedPurchases = useMemo(() => extendedPurchases.filter((purchase) => purchase.checked), [extendedPurchases])

  const { data: purchasesData } = useQuery({
    queryKey: ['orderPurchases', purchaseIds],
    queryFn: () => purchaseApi.getPurchases({ status: 0 }),
    enabled: Boolean(purchaseIds),
  });

  const purchases = (purchasesData?.data.data || []).filter((purchase) =>
    purchaseIds?.includes(purchase._id)
  );

  const totalAmount = purchases.reduce(
    (total, purchase) => total + purchase.product.price * purchase.buy_count,
    0
  );
  const buyProductMutation = useMutation({
    mutationFn: purchaseApi.buyProducts,
    onSuccess: (data) => {
      toast.success(data.data.message, {
        position: 'top-center',
        autoClose: 1000
      });
    }
  });
  const handleBuyPurchase = () => {
    if (checkedPurchases.length > 0) {
      const body = checkedPurchases.map((purchase) => ({
        product_id: purchase.product._id,
        buy_count: purchase.buy_count
      }))
      buyProductMutation.mutate(body)
    }
  }

  return (
    <div className="bg-neutral-100 py-16">
      <div className="container">
        {/* Thông tin đơn hàng */}
        <div className="mb-5">
          <h2 className="text-xl font-semibold">Thông tin đơn hàng</h2>
          <ul>
            {purchases.map((purchase) => (
              <li key={purchase._id} className="flex justify-between py-2 border-b">
                <span>
                  {purchase.product.name} x {purchase.buy_count}
                </span>
                <span>₫{FormatCurrency(purchase.product.price * purchase.buy_count)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-end">
            <strong>Tổng tiền: ₫{FormatCurrency(totalAmount)}</strong>
          </div>
        </div>

        {/* Nhập địa chỉ, số điện thoại, phương thức thanh toán */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700">Tên Người nhận</label>
          <input
            type="text"
            placeholder="Nhập tên"
            className="mt-2 w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700">Địa chỉ giao hàng</label>
          <Input type="text" placeholder="Nhập địa chỉ" className="mt-2 w-full p-2 border border-gray-300 rounded" />
        </div>
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
          <input
            type="tel"
            placeholder="Nhập số điện thoại"
            className="mt-2 w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700">Phương thức thanh toán</label>
          <select className="mt-2 w-full p-2 border border-gray-300 rounded">
            <option value="">Chọn phương thức thanh toán</option>
            <option value="zalo">ZaloPay</option>
            <option value="cod">Thanh toán khi nhận hàng</option>
          </select>
        </div>

        <div className="mt-6">
          <Button onClick={handleBuyPurchase} className="h-12 w-full bg-green-500 text-white text-sm">Đặt hàng</Button>
        </div>
      </div>
    </div>
  );
}
