import { useState, useEffect } from "react";
import DeliveryPartnerTable from "../../components/adminComponents/deliveryComponents/DeliveryPartnerTable";
import DeliveryPartnerFormModal from "../../components/adminComponents/deliveryComponents/DeliveryPartnerFormModal";
import {
  getDeliveryPartners,
  updatePartnerStatus,
  saveDeliveryPartner,
} from "../../services/admin/deliveryPartnerApi";

const DeliveryPartnersPage = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const data = await getDeliveryPartners();
        setPartners(data);
      } catch (error) {
        console.error("Error fetching delivery partners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const updated = await updatePartnerStatus(id, currentStatus);
      setPartners((prev) => prev.map((p) => (p._id === id ? updated : p)));
    } catch (error) {
      console.error("Error toggling partner status:", error);
    }
  };

  const handleSave = async (partnerData) => {
    try {
      const saved = await saveDeliveryPartner(partnerData, editingPartner);
      setPartners((prev) =>
        editingPartner
          ? prev.map((p) => (p._id === saved._id ? saved : p))
          : [...prev, saved]
      );
      setShowFormModal(false);
      setEditingPartner(null);
    } catch (error) {
      console.error("Error saving delivery partner:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Delivery Partners</h1>
        <button
          onClick={() => {
            setEditingPartner(null);
            setShowFormModal(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Add New Partner
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading delivery partners...</div>
      ) : (
        <DeliveryPartnerTable
          partners={partners}
          onEdit={(partner) => {
            setEditingPartner(partner);
            setShowFormModal(true);
          }}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {showFormModal && (
        <DeliveryPartnerFormModal
          partner={editingPartner}
          onSave={handleSave}
          onClose={() => {
            setShowFormModal(false);
            setEditingPartner(null);
          }}
        />
      )}
    </div>
  );
};

export default DeliveryPartnersPage;
