import { useState } from "react";
import ButtonMain from "./ButtonMain";
import "./Modal.css";

type Props = {
  itemId: number;
  onClose: () => void;
};

const AddLotModal = ({ itemId, onClose }: Props) => {
  const [lotNumber, setLotNumber] = useState("");
  const [lotQuantity, setLotQuantity] = useState<number | "">("");
  const [lotExpiryDate, setLotExpiryDate] = useState("");

  const handleSave = async () => {
    if (!lotNumber || !lotQuantity || !lotExpiryDate) {
      alert("Por favor, preencha todos os campos corretamente.");
      return;
    }

    const lotData = {
      number: lotNumber,
      quantity: lotQuantity,
      expiry_date: lotExpiryDate,
      item_id: itemId,
    };

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:5000/api/lots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(lotData),
      });

      if (!response.ok) {
        throw new Error("Não foi possível adicionar o lote.");
      }

      onClose();
    } catch (error) {
      console.error(error);
      alert("Erro ao adicionar lote. Tente novamente.");
    }
  };

  return (
    <div className="modal-bg">
      <div className="modal-container">
        <div className="modal-header">
          <h1>Adicionar Lote</h1>
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
          <label htmlFor="lot-number">Número do lote</label>
          <input
            id="lot-number"
            type="text"
            className="input-modal"
            placeholder="LOTE-2024-001"
            value={lotNumber}
            onChange={(e) => setLotNumber(e.target.value)}
          />

          <label htmlFor="lot-quantity">Quantidade</label>
          <input
            id="lot-quantity"
            type="number"
            step="1"
            min="1"
            className="input-modal"
            placeholder="100"
            value={lotQuantity}
            onChange={(e) =>
              setLotQuantity(e.target.value ? parseInt(e.target.value) : "")
            }
          />

          <label htmlFor="lot-expiry">Data de Vencimento</label>
          <input
            id="lot-expiry"
            type="date"
            className="input-modal"
            value={lotExpiryDate}
            onChange={(e) => setLotExpiryDate(e.target.value)}
          />
        </div>
        <ButtonMain text="Adicionar" disabled={false} onClick={handleSave} />
      </div>
    </div>
  );
};

export default AddLotModal;
