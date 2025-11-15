import { useState, useEffect } from "react";
import ButtonMain from "./ButtonMain";
import "./Modal.css";
import type { Lot } from "./LotDrawer";

type Props = {
  onClose: () => void;
  lotToEdit: Lot;
};

const EditLotModal = ({ onClose, lotToEdit }: Props) => {
  const [lotNumber, setLotNumber] = useState("");
  const [lotQuantity, setLotQuantity] = useState<number | "">("");
  const [lotExpiryDate, setLotExpiryDate] = useState<Date | "">("");
  const [lotId, setLotId] = useState<number | "">("");

  const parseDateFromLocale = (dateString: string): Date | "" => {
    const [day, month, year] = dateString.split("/").map(Number);
    if (!day || !month || !year) return "";
    return new Date(year, month - 1, day);
  };

  useEffect(() => {
    if (lotToEdit) {
      setLotNumber(lotToEdit.number);
      setLotQuantity(lotToEdit.quantity);
      setLotExpiryDate(parseDateFromLocale(lotToEdit.expiry_date) || "");
      setLotId(lotToEdit.id);
    }
  }, [lotToEdit]);

  const handleSave = async () => {
    if (!lotNumber || !lotQuantity || !lotExpiryDate) {
      alert("Por favor, preencha todos os campos corretamente.");
      return;
    }

    const formattedDate =
      lotExpiryDate instanceof Date
        ? lotExpiryDate.toISOString().split("T")[0]
        : lotExpiryDate;

    const lotData = {
      number: lotNumber,
      quantity: lotQuantity,
      expiry_date: formattedDate,
    };

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:5000/api/lots/" + lotId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(lotData),
      });

      if (!response.ok) {
        throw new Error("Não foi possível editar o lote.");
      }

      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="modal-bg">
      <div className="modal-container">
        <div className="modal-header">
          <h1>Editar Lote</h1>
          <div onClick={() => onClose()} className="close-modal">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M14.1211 12.0002L23.5608 2.56161C24.1467 1.97565 24.1467 1.02563 23.5608 0.439714C22.9748 -0.146246 22.0248 -0.146246 21.4389 0.439714L12.0002 9.8793L2.56161 0.439714C1.97565 -0.146246 1.02563 -0.146246 0.439714 0.439714C-0.146199 1.02567 -0.146246 1.9757 0.439714 2.56161L9.8793 12.0002L0.439714 21.4389C-0.146246 22.0248 -0.146246 22.9748 0.439714 23.5608C1.02567 24.1467 1.9757 24.1467 2.56161 23.5608L12.0002 14.1211L21.4388 23.5608C22.0248 24.1467 22.9748 24.1467 23.5607 23.5608C24.1467 22.9748 24.1467 22.0248 23.5607 21.4389L14.1211 12.0002Z"
                fill="#0D0D0D"
              />
            </svg>
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="lot-name">Número do lote</label>
          <input
            id="lot-name"
            type="text"
            className="input-modal"
            placeholder="ASS123"
            value={lotNumber}
            onChange={(e) => setLotNumber(e.target.value)}
          />

          <label htmlFor="lot-price">Quantidade</label>
          <input
            id="lot-price"
            type="number"
            step="1"
            className="input-modal"
            placeholder="5"
            value={lotQuantity}
            onChange={(e) =>
              setLotQuantity(e.target.value ? parseInt(e.target.value) : "")
            }
          />

          <label htmlFor="product-expiry">Validade</label>
          <input
            id="lot-expiry"
            type="date"
            className="input-modal"
            value={
              lotExpiryDate ? lotExpiryDate.toISOString().split("T")[0] : ""
            }
            onChange={(e) => {
              const dateParts = e.target.value.split("-");
              const utcDate = new Date(
                parseInt(dateParts[0], 10),
                parseInt(dateParts[1], 10) - 1,
                parseInt(dateParts[2], 10)
              );
              setLotExpiryDate(e.target.value ? utcDate : "");
            }}
          />
        </div>
        <ButtonMain text="Salvar" disabled={false} onClick={handleSave} />
      </div>
    </div>
  );
};

export default EditLotModal;
