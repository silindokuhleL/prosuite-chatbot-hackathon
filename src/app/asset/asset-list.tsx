'use client';

import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/ui/data-table';
import { Badge, StatusBadge } from '@/components/ui/badge';
import { getAssets } from '@/lib/data';
import type { Asset } from '@/types';

export function AssetList() {
  const router = useRouter();
  const assets = getAssets();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(value);
  };

  const columns = [
    {
      key: 'assetTag',
      header: 'Asset Tag',
      className: 'w-28',
      render: (asset: Asset) => (
        <span className="font-mono text-xs">{asset.assetTag}</span>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (asset: Asset) => (
        <div>
          <p className="font-medium">{asset.description}</p>
          <p className="text-xs text-muted-foreground">
            {asset.brand} • {asset.category_name}
          </p>
        </div>
      ),
    },
    {
      key: 'department_name',
      header: 'Department',
      className: 'hidden md:table-cell',
    },
    {
      key: 'location_name',
      header: 'Location',
      className: 'hidden lg:table-cell',
      render: (asset: Asset) => (
        <div className="text-sm">
          <p>{asset.site_name}</p>
          <p className="text-xs text-muted-foreground">{asset.location_name}</p>
        </div>
      ),
    },
    {
      key: 'cost',
      header: 'Cost',
      className: 'hidden md:table-cell text-right',
      render: (asset: Asset) => (
        <span className="font-medium">{formatCurrency(asset.cost)}</span>
      ),
    },
    {
      key: 'assetStatus_name',
      header: 'Status',
      className: 'w-28',
      render: (asset: Asset) => {
        const statusColors: Record<number, string> = {
          1: '#22c55e',
          2: '#f97316',
          3: '#6b7280',
          4: '#dc2626',
        };
        return (
          <StatusBadge
            status={asset.assetStatus_name}
            color={statusColors[asset.assetStatus_id] || '#6b7280'}
          />
        );
      },
    },
  ];

  return (
    <DataTable
      data={assets}
      columns={columns}
      onRowClick={(asset) => router.push(`/asset/${asset.id}`)}
      emptyMessage="No assets found"
    />
  );
}
