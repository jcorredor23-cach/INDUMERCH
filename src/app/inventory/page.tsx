
'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/main-layout';
import { MaterialsSection } from '@/components/materials-section';
import { initialMaterials } from '@/lib/data';
import type { Material } from '@/lib/types';

export default function InventoryPage() {
  const [materials] = useState<Material[]>(initialMaterials);

  return (
    <MainLayout>
      <main className="max-w-screen-xl mx-auto p-4 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-3">
                <MaterialsSection materials={materials} />
            </div>
        </div>
      </main>
    </MainLayout>
  );
}
