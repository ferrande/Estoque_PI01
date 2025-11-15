import "./StockMain.css";
import NavBar from "../components/NavBar";
import Table from "../components/Table";
import AddItemModal from "../components/AddItemModal";
import { useState, useRef } from "react";

function StockMain() {
  const [isAddItemModalVisible, setIsAddItemModalVisible] = useState(false);
  const tableRef = useRef<{ reloadData: (inputSearch: string) => void } | null>(
    null
  );

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInputSearch(event.target.value);
    if (tableRef.current) {
      tableRef.current.reloadData(event.target.value);
    }
  }

  function handleAddItem() {
    setIsAddItemModalVisible(true);
  }

  function handleCloseAddItemModal() {
    setIsAddItemModalVisible(false);
    if (tableRef.current) {
      tableRef.current.reloadData(inputSearch);
    }
  }

  const [inputSearch, setInputSearch] = useState("");

  return (
    <>
      <NavBar />
      {isAddItemModalVisible && (
        <AddItemModal onClose={() => handleCloseAddItemModal()} />
      )}
      <div className="wrapper-main">
        <h1 className="heading-main">Estoque</h1>
        <div className="wrapper-item-actions">
          <input
            type="search"
            className="search-item body-regular"
            placeholder="Procurar por produto..."
            value={inputSearch}
            onChange={(event) => {
              handleSearchChange(event);
            }}
          />
          <button
            className="add-item button-semibold"
            onClick={() => handleAddItem()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
            >
              <g clipPath="url(#clip0_64_262)">
                <path
                  d="M15 7.5H9V1.5C9 0.947719 8.55228 0.5 8 0.5C7.44772 0.5 7 0.947719 7 1.5V7.5H1C0.447719 7.5 0 7.94772 0 8.5C0 9.05228 0.447719 9.5 1 9.5H7V15.5C7 16.0523 7.44772 16.5 8 16.5C8.55228 16.5 9 16.0523 9 15.5V9.5H15C15.5523 9.5 16 9.05228 16 8.5C16 7.94772 15.5523 7.5 15 7.5Z"
                  fill="#FEFEFE"
                />
              </g>
              <defs>
                <clipPath id="clip0_64_262">
                  <rect
                    width="16"
                    height="16"
                    fill="white"
                    transform="translate(0 0.5)"
                  />
                </clipPath>
              </defs>
            </svg>
            Adicionar produto
          </button>
        </div>
        <Table ref={tableRef} />
      </div>
    </>
  );
}

export default StockMain;
