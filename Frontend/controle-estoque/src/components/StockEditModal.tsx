import { useState, useEffect } from "react";
import ButtonMain from "./ButtonMain";
import "./StockEditModal.css";
import type { Item } from "./Table";

type Props = {
  onClose: () => void;
  itemToEdit: Item;
};

const StockEditModal = ({ onClose, itemToEdit }: Props) => {
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState<number | "">("");
  const [itemId, setItemId] = useState<number | "">("");

  useEffect(() => {
    if (itemToEdit) {
      setItemName(itemToEdit.name);
      setItemPrice(itemToEdit.price);
      setItemId(itemToEdit.id);
    }
  }, [itemToEdit]);

  const handleSave = async () => {
    if (!itemName || !itemPrice) {
      alert("Por favor, preencha todos os campos corretamente.");
      return;
    }

    const itemData = {
      name: itemName,
      price: itemPrice,
    };

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        "http://localhost:5000/api/items/" + itemId,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(itemData),
        }
      );

      if (!response.ok) {
        throw new Error("Não foi possível editar o produto.");
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
          <h1>Editar produto</h1>
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
          <label htmlFor="item-name">Nome do produto</label>
          <input
            id="item-name"
            type="text"
            className="input-modal"
            placeholder="Coca-Cola Lata"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />

          <label htmlFor="item-price">Valor (R$)</label>
          <input
            id="item-price"
            type="number"
            step="0.01"
            className="input-modal"
            placeholder="5.99"
            value={itemPrice}
            onChange={(e) =>
              setItemPrice(e.target.value ? parseFloat(e.target.value) : "")
            }
          />
        </div>
        <ButtonMain text="Salvar" disabled={false} onClick={handleSave} />
      </div>
    </div>
  );
};

export default StockEditModal;
