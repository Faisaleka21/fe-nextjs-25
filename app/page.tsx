'use client';

import Layout from '@/components/ui/Layout';
import { service } from '@/services/services';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

type Summary = {
  products: number;
  categories: number;
  variants: number;
};

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<Summary>({
    products: 0,
    categories: 0,
    variants: 0,
  });

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const [productRes, categoryRes, variantRes] = await Promise.all([
        service('product'),
        service('product-categories'),
        service('product-variant'),
      ]);

      setSummary({
        products: productRes.data.length,
        categories: categoryRes.data.length,
        variants: variantRes.data.length,
      });
    } catch (error) {
      toast.error('Gagal mengambil data dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6 text-black">
      Home/Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Total Products"
          value={summary.products}
          loading={loading}
        />
        <DashboardCard
          title="Product Categories"
          value={summary.categories}
          loading={loading}
        />
        <DashboardCard
          title="Product Variants"
          value={summary.variants}
          loading={loading}
        />
      </div>
    </Layout>
  );
}

type CardProps = {
  title: string;
  value: number;
  loading: boolean;
};

const DashboardCard = ({ title, value, loading }: CardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-start">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-3xl font-bold text-black mt-2">
        {loading ? 'Loading...' : value}
      </h2>
    </div>
  );
};
