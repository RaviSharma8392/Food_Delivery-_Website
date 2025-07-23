// DeliveryPartners.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import PartnerTable from "./PartnerTable";
import PartnerForm from "./PartnerForm";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DeliveryPartners = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin/delivery-partners`);
        setPartners(response.data);
      } catch (error) {
        console.error("Error fetching delivery partners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  const handleSave = async (partnerData) => {
    try {
      let response;
      if (editingPartner) {
        response = await axios.put(
          `${BASE_URL}/admin/delivery-partners/${editingPartner._id}`,
          partnerData
        );
        setPartners(
          partners.map((p) =>
            p._id === editingPartner._id ? response.data : p
          )
        );
      } else {
        response = await axios.post(
          `${BASE_URL}/admin/delivery-partners`,
          partnerData
        );
        setPartners([...partners, response.data]);
      }

      setShowForm(false);
      setEditingPartner(null);
    } catch (error) {
      console.error("Error saving delivery partner:", error);
    }
  };

  const togglePartnerStatus = async (id, currentStatus) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/admin/delivery-partners/${id}/status`,
        {
          active: !currentStatus,
        }
      );
      setPartners(partners.map((p) => (p._id === id ? response.data : p)));
    } catch (error) {
      console.error("Error toggling partner status:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Delivery Partner Management</h1>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => {
            setEditingPartner(null);
            setShowForm(true);
          }}>
          Add New Partner
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading delivery partners...</div>
      ) : (
        <PartnerTable
          partners={partners}
          onEdit={(partner) => {
            setEditingPartner(partner);
            setShowForm(true);
          }}
          onToggleStatus={togglePartnerStatus}
        />
      )}

      {showForm && (
        <PartnerForm
          partner={editingPartner}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditingPartner(null);
          }}
        />
      )}
    </div>
  );
};

export default DeliveryPartners;
