
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Provider } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Wrench } from 'lucide-react';

interface ProviderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (provider: Omit<Provider, 'id'> | Provider) => void;
  provider?: Provider;
}

export function ProviderFormModal({ isOpen, onClose, onSave, provider }: ProviderFormModalProps) {
  const { toast } = useToast();
  
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState<Provider['specialty']>('Maquinaria');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (provider) {
        setName(provider.name);
        setSpecialty(provider.specialty);
        setContactPerson(provider.contact_person);
        setPhone(provider.phone);
        setEmail(provider.email || '');
      } else {
        // Reset form for new provider
        setName('');
        setSpecialty('Maquinaria');
        setContactPerson('');
        setPhone('');
        setEmail('');
      }
    }
  }, [isOpen, provider]);

  const handleSubmit = () => {
    if (!name.trim() || !contactPerson.trim() || !phone.trim()) {
      toast({
        title: "Datos inválidos",
        description: "Los campos Nombre, Contacto y Teléfono son obligatorios.",
        variant: "destructive",
      });
      return;
    }

    const providerData = {
      name,
      specialty,
      contact_person: contactPerson,
      phone,
      email: email || undefined,
    };

    if (provider) {
      onSave({ ...providerData, id: provider.id });
    } else {
      onSave(providerData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-indigo-700 flex items-center">
            <Wrench className="w-5 h-5 mr-2" />
            {provider ? 'Editar Proveedor' : 'Añadir Nuevo Proveedor'}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="provider-name">Nombre del Proveedor</Label>
            <Input id="provider-name" value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Suministros Industriales S.A.S." />
          </div>
          <div>
            <Label htmlFor="provider-specialty">Especialidad</Label>
            <Select value={specialty} onValueChange={(v) => setSpecialty(v as Provider['specialty'])}>
              <SelectTrigger id="provider-specialty"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Maquinaria">Maquinaria</SelectItem>
                <SelectItem value="Materia Prima">Materia Prima</SelectItem>
                <SelectItem value="Servicios Generales">Servicios Generales</SelectItem>
              </SelectContent>
            </Select>
          </div>
           <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="provider-contact">Persona de Contacto</Label>
              <Input id="provider-contact" value={contactPerson} onChange={e => setContactPerson(e.target.value)} placeholder="Ej: Juan Arias" />
            </div>
             <div>
              <Label htmlFor="provider-phone">Teléfono</Label>
              <Input id="provider-phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Ej: 3101234567" />
            </div>
          </div>
          <div>
            <Label htmlFor="provider-email">Email (Opcional)</Label>
            <Input id="provider-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Ej: contacto@empresa.com" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">Cancelar</Button>
          <Button onClick={handleSubmit} className="bg-indigo-600 hover:bg-indigo-700">Guardar Proveedor</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
