import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import Card from '@/components/Card';
import LoadingScreen from '@/components/LoadingScreen';
import PageHeader from '@/components/PageHeader';
import ProductForm from '@/components/ProductForm';
import { useAuth } from '@/hooks/useAuth';
import { getErrorMessage } from '@/lib/firebaseErrors';
import { createProduct, getProduct, updateProductMetadata } from '@/services/productService';

export default function ProductFormPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEdit = Boolean(productId);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit || !productId) {
      return;
    }

    let ignore = false;

    async function loadProduct() {
      try {
        const response = await getProduct(productId);

        if (!ignore) {
          if (!response || response.userId !== user?.uid || response.deleted) {
            navigate('/404', { replace: true });
            return;
          }

          setProduct(response);
        }
      } catch (error) {
        if (!ignore) {
          toast.error(getErrorMessage(error));
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      ignore = true;
    };
  }, [isEdit, navigate, productId, user?.uid]);

  if (loading) {
    return <LoadingScreen label="Loading product details..." />;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={isEdit ? 'Edit product' : 'New product'}
        title={isEdit ? `Update ${product?.name}` : 'Add a new product'}
        description={
          isEdit
            ? 'You can safely edit metadata here. Use the product details page whenever you need to adjust stock and keep the movement history complete.'
            : 'Creating a product with an initial quantity automatically stores the first stock movement.'
        }
      />

      <Card>
        <ProductForm
          initialValues={product}
          isEdit={isEdit}
          isSubmitting={submitting}
          onSubmit={async (values) => {
            setSubmitting(true);

            try {
              if (isEdit) {
                await updateProductMetadata(productId, values);
                toast.success('Product updated successfully.');
                navigate(`/products/${productId}`);
              } else {
                const result = await createProduct(values);
                toast.success('Product created successfully.');
                navigate(`/products/${result.productId}`);
              }
            } catch (error) {
              toast.error(getErrorMessage(error));
            } finally {
              setSubmitting(false);
            }
          }}
        />
      </Card>
    </div>
  );
}
