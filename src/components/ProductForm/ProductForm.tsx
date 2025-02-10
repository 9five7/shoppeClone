import React, { useEffect, useState } from 'react';
import { Product } from 'src/types/product.type';

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (product: Partial<Product>) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit }) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    price_before_discount: 0,
    quantity: 0,
    sold: 0,
    view: 0,
    description: '',
    category: { _id: '', name: '' },
    images: [],
    image: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        price_before_discount: product.price_before_discount,
        quantity: product.quantity,
        sold: product.sold,
        view: product.view,
        description: product.description,
        category: product.category,
        images: product.images,
        image: product.image,
      });
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name || ''}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="price">Price</label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price || 0}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="price_before_discount">Price Before Discount</label>
        <input
          type="number"
          id="price_before_discount"
          name="price_before_discount"
          value={formData.price_before_discount || 0}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="quantity">Quantity</label>
        <input
          type="number"
          id="quantity"
          name="quantity"
          value={formData.quantity || 0}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="sold">Sold</label>
        <input
          type="number"
          id="sold"
          name="sold"
          value={formData.sold || 0}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="view">View</label>
        <input
          type="number"
          id="view"
          name="view"
          value={formData.view || 0}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="category">Category</label>
        <input
          type="text"
          id="category"
          name="category"
          value={formData.category.name || ''}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              category: { ...prev.category, name: e.target.value },
            }))
          }
          required
        />
      </div>
      <div>
        <label htmlFor="image">Main Image</label>
        <input
          type="text"
          id="image"
          name="image"
          value={formData.image || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="images">Images (comma separated)</label>
        <input
          type="text"
          id="images"
          name="images"
          value={formData.images.join(', ')}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              images: e.target.value.split(',').map((image) => image.trim()),
            }))
          }
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default ProductForm;
