
"use client";

import { useState } from 'react';
import { MainLayout } from '@/components/main-layout';
import { initialProviders } from '@/lib/data';
import type { Provider } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Wrench, Plus, Edit, Trash2, Phone, Mail, User } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ProviderFormModal } from '@/components/provider-form-modal';
import { Badge } from '@/components/ui/badge';

const specialtyColors: Record<Provider['specialty'], string> = {
  'Maquinaria': 'bg-sky-100 text-sky-800 border-sky-400',
  'Materia Prima': 'bg-amber-100 text-amber-800 border-amber-400',
  'Servicios Generales': 'bg-slate-100 text-slate-800 border-slate-400',
};

export default function MaintenancePage() {
  const [providers, setProviders] = useState<Provider[]>(initialProviders);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | undefined>(undefined);
  const { toast } = useToast();
  
  const handleOpenModal = (provider?: Provider) => {
    setSelectedProvider(provider);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProvider(undefined);
  };

  const handleSaveProvider = (providerData: Omit<Provider, 'id'> | Provider) => {
    if ('id' in providerData) {
      // Update existing provider
      setProviders(prev => prev.map(p => p.id === providerData.id ? providerData : p));
      toast({ title: 'Proveedor Actualizado', description: `Los datos de ${providerData.name} han sido actualizados.` });
    } else {
      // Add new provider
      const newProvider: Provider = {
        ...providerData,
        id: `prov_${Date.now()}`
      };
      setProviders(prev => [...prev, newProvider]);
      toast({ title: 'Proveedor Añadido', description: `${newProvider.name} ha sido añadido a la lista.` });
    }
    handleCloseModal();
  };

  const handleDeleteProvider = (providerId: string) => {
    const providerName = providers.find(p => p.id === providerId)?.name;
    setProviders(prev => prev.filter(p => p.id !== providerId));
    toast({ title: 'Proveedor Eliminado', description: `${providerName} ha sido eliminado.`, variant: 'destructive' });
  };
  
  return (
    <MainLayout>
      <main className="max-w-screen-xl mx-auto p-4 lg:p-8">
        <section className="bg-white p-6 rounded-xl shadow-2xl">
          <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h1 className="text-xl font-bold text-slate-700 flex items-center font-headline">
              <Wrench className="w-5 h-5 mr-2 text-slate-500" />
              Gestión de Proveedores
            </h1>
            <Button onClick={() => handleOpenModal()} size="sm" className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-2" /> Añadir Proveedor
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.length === 0 ? (
              <p className="text-center text-gray-500 py-12 col-span-full">No hay proveedores registrados.</p>
            ) : (
              providers.map(provider => (
                <div key={provider.id} className={`p-4 rounded-lg shadow-sm border-l-4 ${specialtyColors[provider.specialty]} transition-transform hover:scale-105`}>
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-gray-800">{provider.name}</h3>
                    <Badge className={specialtyColors[provider.specialty]}>{provider.specialty}</Badge>
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span>{provider.contact_person}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <a href={`tel:${provider.phone}`} className="hover:underline">{provider.phone}</a>
                    </div>
                    {provider.email && (
                       <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <a href={`mailto:${provider.email}`} className="hover:underline truncate">{provider.email}</a>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-300/50">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600 hover:bg-slate-200" onClick={() => handleOpenModal(provider)}>
                      <Edit className="h-4 w-4"/>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-100">
                            <Trash2 className="h-4 w-4"/>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Confirmas la eliminación?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta acción es permanente. Se eliminará al proveedor "{provider.name}" de la lista.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteProvider(provider.id)} className="bg-destructive hover:bg-destructive/90">
                                Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                      </AlertDialogContent>
                   </AlertDialog>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      <ProviderFormModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveProvider}
        provider={selectedProvider}
      />
    </MainLayout>
  );
}
