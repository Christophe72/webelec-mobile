"use client";

import { useState, useEffect } from "react";
import { Client } from "@/types";
import ImagePicker from "@/components/ImagePicker";

interface ClientFormProps {
  client?: Client;
  onSubmit: (data: Omit<Client, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
}

export default function ClientForm({ client, onSubmit, onCancel }: ClientFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    photo: "",
    notes: "",
  });

  useEffect(() => {
    if (client) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: client.name,
        contact: client.contact,
        phone: client.phone || "",
        email: client.email || "",
        address: client.address || "",
        city: client.city,
        postalCode: client.postalCode || "",
        photo: client.photo || "",
        notes: client.notes || "",
      });
    }
  }, [client]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
          <label htmlFor="name" className={labelClassName}>
            Nom du client <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Ex: Dupont Electricité"
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="contact" className={labelClassName}>
            Personne de contact <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="contact"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            required
            placeholder="Ex: Mme Dupont"
            className={inputClassName}
          />
        </div>
      </div>

      {/* Section Contact */}
      <div className="space-y-5">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Coordonnées
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className={labelClassName}>
              Téléphone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Ex: 0470 12 34 56"
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="email" className={labelClassName}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ex: contact@exemple.be"
              className={inputClassName}
            />
          </div>
        </div>
      </div>

      {/* Section Adresse */}
      <div className="space-y-5">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Adresse
        </h3>

        <div>
          <label htmlFor="address" className={labelClassName}>
            Rue et numéro
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Ex: Rue de la Gare 123"
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
              placeholder="Ex: Liège"
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
              placeholder="Ex: 4000"
              className={inputClassName}
            />
          </div>
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
          {client ? "Enregistrer" : "Créer le client"}
        </button>
      </div>
    </form>
  );
}
