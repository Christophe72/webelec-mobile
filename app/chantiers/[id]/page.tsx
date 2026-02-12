import ChantierPhotoUpload from "@/components/chantiers/ChantierPhotoUpload";
import ChantierGallery from "@/components/chantiers/ChantierGallery";

export default function ChantierDetail({ params }: { params: { id: string } }) {
  const chantierId = Number(params.id);

  return (
    <div className="p-4 pb-24 space-y-8">
      <h1 className="text-xl font-bold">Détail chantier</h1>

      <ChantierPhotoUpload chantierId={chantierId} />
      <ChantierGallery chantierId={chantierId} />
    </div>
  );
}
