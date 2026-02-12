export interface Client {
  id: string;
  name: string;
  contact: string;
  phone?: string;
  email?: string;
  address?: string;
  city: string;
  postalCode?: string;
  photo?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Chantier {
  id: string;
  title: string;
  clientId: string;
  clientName?: string;
  address: string;
  city: string;
  postalCode?: string;
  status: "A demarrer" | "En cours" | "Controle final" | "Termine" | "Suspendu";
  startDate?: string;
  endDate?: string;
  description?: string;
  photo?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
