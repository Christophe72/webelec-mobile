"use client";

import { useState, useEffect } from "react";
import { Chantier, Client } from "@/types";
import ImagePicker from "@/components/ImagePicker";

interface ChantierFormProps {
  chantier?: Chantier;
  clients: Client[];
  onSubmit: (data: Omit<Chantier, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
}

export default function ChantierForm({ chantier, clients, onSubmit, onCancel }: ChantierFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    clientId: "",
    clientName: "",
    address: "",
    city: "",
    postalCode: "",
    status: "A demarrer" as Chantier["status"],
    startDate: "",
    endDate: "",
    description: "",
    photo: "",
    notes: "",
  });

  useEffect(() => {
    if (chantier) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        title: chantier.title,
        clientId: chantier.clientId,
        clientName: chantier.clientName || "",
        address: chantier.address,
        city: chantier.city,
        postalCode: chantier.postalCode || "",
        status: chantier.status,
        startDate: chantier.startDate || "",
        endDate: chantier.endDate || "",
        description: chantier.description || "",
        photo: chantier.photo || "",
        notes: chantier.notes || "",
      });
    }
  }, [chantier]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "clientId") {
      const selectedClient = clients.find((c) => c.id === value);
      setFormData((prev) => ({
        ...prev,
        clientId: value,
        clientName: selectedClient?.name || "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const inputClassName = "w-full px-4 py-3 bg-[var(--surface)] border border-[var(--surface-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";
  const labelClassName = "block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section Informations générales */}
      <div className="space-y-5">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Informations générales
        </h3>

        <div>
          <label htmlFor="title" className={labelClassName}>
            Titre du chantier <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Ex: École Sainte-Marie"
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="clientId" className={labelClassName}>
            Client <span className="text-red-500">*</span>
          </label>
          <select
            id="clientId"
            name="clientId"
            value={formData.clientId}
            onChange={handleChange}
            required
            className={inputClassName}
          >
            <option value="">Sélectionner un client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="status" className={labelClassName}>
            Statut <span className="text-red-500">*</span>
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className={inputClassName}
          >
            <option value="A demarrer">À démarrer</option>
            <option value="En cours">En cours</option>
            <option value="Controle final">Contrôle final</option>
            <option value="Termine">Terminé</option>
            <option value="Suspendu">Suspendu</option>
          </select>
        </div>
      </div>

      {/* Section Adresse */}
      <div className="space-y-5">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Localisation
        </h3>

        <div>
          <label htmlFor="address" className={labelClassName}>
            Adresse <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            placeholder="Ex: Rue des Écoles 12"
            className={inputClassName}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className={labelClassName}>
              Ville <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              placeholder="Ex: Bruxelles"
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="postalCode" className={labelClassName}>
              Code postal
            </label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="Ex: 1000"
              className={inputClassName}
            />
          </div>
        </div>
      </div>

      {/* Section Dates */}
      <div className="space-y-5">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Planning
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className={labelClassName}>
              Date de début
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="endDate" className={labelClassName}>
              Date de fin
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className={inputClassName}
            />
          </div>
        </div>
      </div>

      {/* Section Description */}
      <div className="space-y-5">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Description
        </h3>
        <div>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Description du chantier..."
            className={`${inputClassName} resize-none`}
          />
        </div>
      </div>

      {/* Section Photo */}
      <div className="space-y-5">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Photo
        </h3>
        <ImagePicker
          currentImage={formData.photo}
          onImageSelect={(image) => setFormData((prev) => ({ ...prev, photo: image || "" }))}
          label=""
        />
      </div>

      {/* Section Notes */}
      <div className="space-y-5">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Notes
        </h3>
        <div>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            placeholder="Informations complémentaires..."
            className={`${inputClassName} resize-none`}
          />
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex gap-3 pt-6 border-t border-(--surface-border)">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 border border-(--surface-border) rounded-lg font-medium hover:bg-(--surface-hover) transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md"
        >
          {chantier ? "Enregistrer" : "Créer le chantier"}
        </button>
      </div>
    </form>
  );
}
