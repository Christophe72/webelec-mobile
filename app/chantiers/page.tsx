"use client";

import { useState } from "react";
import { useChantiers } from "@/hooks/useChantiers";
import { useClients } from "@/hooks/useClients";
import { Chantier } from "@/types";
import Modal from "@/components/Modal";
import ChantierForm from "@/components/forms/ChantierForm";
import { syncQueue } from "@/lib/offline";

type ChantierStatus =
  | "A demarrer"
  | "En cours"
  | "Controle final"
  | "Termine"
  | "Suspendu";

export default function ChantiersPage() {
  const { chantiers, addChantier, updateChantier, deleteChantier } =
    useChantiers();
  const { clients } = useClients();
  const [showModal, setShowModal] = useState(false);
  const [editingChantier, setEditingChantier] = useState<Chantier | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ChantierStatus | "all">(
    "all",
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [chantierToDelete, setChantierToDelete] = useState<string | null>(null);

  const statusOptions: {
    value: ChantierStatus | "all";
    label: string;
    color: string;
  }[] = [
    { value: "all", label: "Tous", color: "gray" },
    { value: "A demarrer", label: "À démarrer", color: "blue" },
    { value: "En cours", label: "En cours", color: "green" },
    { value: "Controle final", label: "Contrôle final", color: "orange" },
    { value: "Termine", label: "Terminé", color: "gray" },
    { value: "Suspendu", label: "Suspendu", color: "red" },
  ];

  const filteredChantiers =
    selectedStatus === "all"
      ? chantiers
      : chantiers.filter((c) => c.status === selectedStatus);

  const getStatusCount = (status: ChantierStatus | "all") => {
    if (status === "all") return chantiers.length;
    return chantiers.filter((c) => c.status === status).length;
  };

  const getStatusColor = (status: ChantierStatus) => {
    const option = statusOptions.find((o) => o.value === status);
    return option?.color || "gray";
  };

  const handleAdd = () => {
    setEditingChantier(null);
    setShowModal(true);
  };

  const handleEdit = (chantier: Chantier) => {
    setEditingChantier(chantier);
    setShowModal(true);
  };

  const handleDeleteClick = (id: string) => {
    setChantierToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    if (chantierToDelete) {
      deleteChantier(chantierToDelete);

      // Ajouter à la queue de synchronisation si le chantier existait déjà
      syncQueue.add({
        type: "DELETE",
        entity: "chantier",
        data: { id: chantierToDelete } as Record<string, unknown>,
      });
    }
    setShowDeleteConfirm(false);
    setChantierToDelete(null);
  };

  const handleSubmit = (
    chantierData: Omit<Chantier, "id" | "createdAt" | "updatedAt">,
  ) => {
    if (editingChantier) {
      updateChantier(editingChantier.id, chantierData);

      // Ajouter à la queue de synchronisation
      syncQueue.add({
        type: "UPDATE",
        entity: "chantier",
        data: { id: editingChantier.id, ...chantierData } as unknown as Record<
          string,
          unknown
        >,
      });
    } else {
      const newChantier = addChantier(chantierData);

      // Ajouter à la queue de synchronisation
      syncQueue.add({
        type: "CREATE",
        entity: "chantier",
        data: newChantier as unknown as Record<string, unknown>,
      });
    }
    setShowModal(false);
    setEditingChantier(null);
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditingChantier(null);
  };

  return (
    <div className="p-4 pb-24 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Chantiers</h1>
          <p className="app-muted text-sm">
            Gérer vos chantiers et suivre leur avancement
          </p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="app-button-primary flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Nouveau
        </button>
      </div>

      {/* Filtres par statut */}
      <div className="flex flex-wrap gap-2">
        {statusOptions.map((option) => {
          const count = getStatusCount(option.value);
          const isActive = selectedStatus === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setSelectedStatus(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "app-button-primary"
                  : "app-surface app-hover-surface"
              }`}
            >
              {option.label}
              <span className={`ml-2 ${isActive ? "opacity-90" : "app-muted"}`}>
                ({count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Liste des chantiers */}
      {filteredChantiers.length === 0 ? (
        <div className="text-center py-12 app-surface rounded-xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-16 h-16 mx-auto app-muted mb-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z"
            />
          </svg>
          <p className="text-lg font-medium mb-2">Aucun chantier</p>
          <p className="app-muted text-sm mb-6">
            {selectedStatus === "all"
              ? "Commencez par créer votre premier chantier"
              : `Aucun chantier avec le statut "${statusOptions.find((o) => o.value === selectedStatus)?.label}"`}
          </p>
          {selectedStatus === "all" && (
            <button
              type="button"
              onClick={handleAdd}
              className="app-button-primary"
            >
              Créer un chantier
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredChantiers.map((chantier) => {
            const client = clients.find((c) => c.id === chantier.clientId);
            const statusColor = getStatusColor(chantier.status);

            return (
              <div
                key={chantier.id}
                className="app-surface rounded-xl overflow-hidden app-hover-surface transition-all"
              >
                {/* Photo ou placeholder */}
                {chantier.photo ? (
                  <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={chantier.photo}
                      alt={chantier.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-20 h-20 text-white opacity-50"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z"
                      />
                    </svg>
                  </div>
                )}

                {/* Contenu */}
                <div className="p-4 space-y-3">
                  {/* Titre et statut */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-lg leading-tight">
                        {chantier.title}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap bg-${statusColor}-100 text-${statusColor}-700 dark:bg-${statusColor}-900/30 dark:text-${statusColor}-300`}
                      >
                        {chantier.status}
                      </span>
                    </div>
                    {client && (
                      <p className="text-sm app-muted">Client: {client.name}</p>
                    )}
                  </div>

                  {/* Adresse */}
                  <div className="flex items-start gap-2 text-sm app-muted">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4 mt-0.5 shrink-0"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                      />
                    </svg>
                    <span>
                      {chantier.address}
                      {chantier.city && `, ${chantier.city}`}
                    </span>
                  </div>

                  {/* Dates */}
                  {(chantier.startDate || chantier.endDate) && (
                    <div className="flex items-center gap-2 text-sm app-muted">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4 shrink-0"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                        />
                      </svg>
                      <span>
                        {chantier.startDate
                          ? new Date(chantier.startDate).toLocaleDateString()
                          : "Non défini"}
                        {" → "}
                        {chantier.endDate
                          ? new Date(chantier.endDate).toLocaleDateString()
                          : "Non défini"}
                      </span>
                    </div>
                  )}

                  {/* Description */}
                  {chantier.description && (
                    <p className="text-sm app-muted line-clamp-2">
                      {chantier.description}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(chantier)}
                      className="flex-1 app-button-secondary text-sm"
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(chantier.id)}
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50 transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal formulaire */}
      <Modal
        isOpen={showModal}
        onClose={handleCancel}
        title={editingChantier ? "Modifier le chantier" : "Nouveau chantier"}
        maxWidth="xl"
      >
        <ChantierForm
          chantier={editingChantier ?? undefined}
          clients={clients}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </Modal>

      {/* Modal confirmation suppression */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Confirmer la suppression"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="app-muted">
            Êtes-vous sûr de vouloir supprimer ce chantier ? Cette action est
            irréversible.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 app-button-secondary"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleDeleteConfirm}
              className="flex-1 px-4 py-2 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Supprimer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
