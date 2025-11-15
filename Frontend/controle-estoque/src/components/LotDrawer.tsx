import { useCallback, useEffect, useMemo, useState } from "react";
import "./LotDrawer.css";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import type { CellContext } from "@tanstack/table-core";
import EditLotModal from "./EditLotModal";
import AddLotModal from "./AddLotModal";

declare module "@tanstack/table-core" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    align?: "left" | "right";
  }
}

export type Lot = {
  id: number;
  number: string;
  quantity: number;
  expiry_date: string;
  item_id: number;
};

type LotAPI = {
  id: number;
  number: string;
  quantity: number;
  expiry_date: string;
  item_id: number;
};

type Props = {
  isOpen: boolean;
  itemId: number;
  itemName: string;
  onClose: () => void;
};

const LotDrawer = ({ isOpen, itemId, itemName, onClose }: Props) => {
  const [data, setData] = useState<Lot[]>([]);
  const [lotToEdit, setLotToEdit] = useState<Lot>();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(
          `http://localhost:5000/api/lots/item/${itemId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result: LotAPI[] = await response.json();
        const formattedData = result.map((lot) => ({
          id: lot.id,
          number: lot.number,
          quantity: lot.quantity,
          expiry_date: lot.expiry_date,
          item_id: lot.item_id,
        }));
        setData(formattedData);
      } catch (error) {
        console.error("Erro ao buscar lotes:", error);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen, itemId]);

  const handleRefreshData = useCallback(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem("authToken");
          const response = await fetch(
            `http://localhost:5000/api/lots/item/${itemId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const result: LotAPI[] = await response.json();
          const formattedData = result.map((lot) => ({
            id: lot.id,
            number: lot.number,
            quantity: lot.quantity,
            expiry_date: lot.expiry_date,
            item_id: lot.item_id,
          }));
          setData(formattedData);
        } catch (error) {
          console.error("Erro ao buscar lotes:", error);
        }
      };
      fetchData();
    }
  }, [isOpen, itemId]);

  const handleEditLot = useCallback((lot: Lot) => {
    setLotToEdit(lot);
    setIsEditModalVisible(true);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalVisible(false);
    setLotToEdit(undefined);
    handleRefreshData();
  }, [handleRefreshData]);

  const handleCloseAddModal = useCallback(() => {
    setIsAddModalVisible(false);
    handleRefreshData();
  }, [handleRefreshData]);

  const handleDeleteLot = useCallback(
    async (id: number) => {
      if (!confirm("Tem certeza que deseja deletar este lote?")) {
        return;
      }

      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`http://localhost:5000/api/lots/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status !== 200) {
          alert("Não foi possível deletar este lote. Tente novamente.");
          return;
        }

        handleRefreshData();
      } catch (error) {
        console.error("Erro ao deletar lote:", error);
      }
    },
    [handleRefreshData]
  );

  const columnHelper = createColumnHelper<Lot>();

  const columns = useMemo(() => {
    return [
      columnHelper.accessor("number", {
        header: "Número",
        size: 100,
        cell: (info: CellContext<Lot, string>) => info.getValue(),
        meta: { align: "left" },
      }),
      columnHelper.accessor("quantity", {
        header: "Quantidade",
        size: 120,
        cell: (info: CellContext<Lot, number>) => info.getValue(),
        meta: { align: "left" },
      }),
      columnHelper.accessor("expiry_date", {
        header: "Validade",
        size: 120,
        cell: (info: CellContext<Lot, string>) => info.getValue(),
        meta: { align: "left" },
      }),
      columnHelper.display({
        id: "acoes",
        header: "Ações",
        size: 80,
        cell: (cell) => {
          const lot = cell.row.original;

          return (
            <div className="lot-actions">
              <button
                className="btn-action"
                onClick={() => handleEditLot(lot)}
                title="Editar lote"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.06575 18.9283H6.49675L15.8653 9.55975L14.4463 8.13475L5.06575 17.5153V18.9283ZM2.79675 21.2033V16.5708L15.9848 3.40175C16.1928 3.20642 16.4236 3.05675 16.6773 2.95275C16.9308 2.84875 17.1968 2.79675 17.4755 2.79675C17.7502 2.79675 18.0185 2.84875 18.2805 2.95275C18.5423 3.05675 18.7729 3.21275 18.9723 3.42075L20.6043 5.05975C20.8123 5.25509 20.9651 5.48475 21.0628 5.74875C21.1604 6.01259 21.2093 6.2775 21.2093 6.5435C21.2093 6.82217 21.1604 7.08925 21.0628 7.34475C20.9651 7.60042 20.8123 7.83225 20.6043 8.04025L7.44125 21.2033H2.79675ZM15.1463 8.85375L14.4463 8.13475L15.8653 9.55975L15.1463 8.85375Z"
                    fill="#D27000"
                  />
                </svg>

                <span>Editar</span>
              </button>
              <button
                className="btn-action"
                onClick={() => handleDeleteLot(lot.id)}
                title="Excluir lote"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.93423 21.2033C6.30456 21.2033 5.76798 20.9815 5.32448 20.538C4.88098 20.0945 4.65923 19.5579 4.65923 18.9283V6.06576C4.34006 6.06576 4.07065 5.95601 3.85098 5.73651C3.63148 5.51684 3.52173 5.24743 3.52173 4.92826C3.52173 4.60909 3.63148 4.33968 3.85098 4.12001C4.07065 3.90051 4.34006 3.79076 4.65923 3.79076H8.86248C8.86248 3.47159 8.97223 3.20218 9.19173 2.98251C9.4114 2.76301 9.68081 2.65326 9.99998 2.65326H13.988C14.3071 2.65326 14.5766 2.76301 14.7962 2.98251C15.0157 3.20218 15.1255 3.47159 15.1255 3.79076H19.3407C19.6599 3.79076 19.9293 3.90051 20.149 4.12001C20.3685 4.33968 20.4782 4.60909 20.4782 4.92826C20.4782 5.24743 20.3685 5.51684 20.149 5.73651C19.9293 5.95601 19.6599 6.06576 19.3407 6.06576V18.9283C19.3407 19.5579 19.119 20.0945 18.6755 20.538C18.232 20.9815 17.6954 21.2033 17.0657 21.2033H6.93423ZM17.0657 6.06576H6.93423V18.9283H17.0657V6.06576ZM9.96423 16.994C10.2634 16.994 10.5158 16.8912 10.7215 16.6855C10.9271 16.48 11.03 16.2276 11.03 15.9283V9.05976C11.03 8.76043 10.9271 8.50801 10.7215 8.30251C10.5158 8.09684 10.2634 7.99401 9.96423 7.99401C9.6649 7.99401 9.4114 8.09684 9.20373 8.30251C8.99623 8.50801 8.89248 8.76043 8.89248 9.05976V15.9283C8.89248 16.2276 8.99623 16.48 9.20373 16.6855C9.4114 16.8912 9.6649 16.994 9.96423 16.994ZM14.0417 16.994C14.3411 16.994 14.5936 16.8912 14.7992 16.6855C15.0047 16.48 15.1075 16.2276 15.1075 15.9283V9.05976C15.1075 8.76043 15.0047 8.50801 14.7992 8.30251C14.5936 8.09684 14.3411 7.99401 14.0417 7.99401C13.7426 7.99401 13.4891 8.09684 13.2815 8.30251C13.0738 8.50801 12.97 8.76043 12.97 9.05976V15.9283C12.97 16.2276 13.0738 16.48 13.2815 16.6855C13.4891 16.8912 13.7426 16.994 14.0417 16.994Z"
                    fill="#D41A1A"
                  />
                </svg>

                <span>Excluir</span>
              </button>
            </div>
          );
        },
        meta: { align: "right" },
      }),
    ];
  }, [columnHelper, handleDeleteLot, handleEditLot]);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 4,
  });

  useEffect(() => {
    if (isOpen) {
      setPagination({
        pageIndex: 0,
        pageSize: 4,
      });
    }
  }, [isOpen]);

  const table = useReactTable({
    data,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      {isOpen && <div className="lot-drawer-overlay" onClick={onClose} />}

      <div
        className={`lot-drawer ${isOpen ? "open" : "closed"}`}
        data-testid="lot-drawer"
      >
        <div className="lot-drawer-header">
          <div className="lot-drawer-title">
            <h2>Lotes de {itemName}</h2>
          </div>
          <button className="close-drawer" onClick={onClose} title="Fechar">
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
          </button>
        </div>

        <div className="lot-drawer-top-bar">
          <button
            className="btn-add-lot-top"
            data-testid="btn-add-lot"
            onClick={() => {
              setIsAddModalVisible(true);
            }}
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
            Adicionar Lote
          </button>
        </div>

        <div className="lot-drawer-content">
          {data.length > 0 ? (
            <>
              <div className="table-wrapper">
                <table className="table-custom">
                  <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className={
                              (header.column.columnDef.meta?.align === "right"
                                ? "col-right"
                                : "col-left") + " body-medium"
                            }
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.map((row) => (
                      <tr key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className={
                              (cell.column.columnDef.meta?.align === "right"
                                ? "col-right"
                                : "col-left") + " body-medium"
                            }
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pagination">
                <button
                  className="body-medium"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  ← Anterior
                </button>
                <span className="pagination-count small-medium">
                  Página {table.getState().pagination.pageIndex + 1} de{" "}
                  {table.getPageCount()}
                </span>
                <button
                  className="body-medium"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Próxima →
                </button>
              </div>
            </>
          ) : (
            <div className="no-lots-message">
              <p>Nenhum lote encontrado para este produto.</p>
            </div>
          )}
        </div>
      </div>

      {isEditModalVisible && lotToEdit && (
        <EditLotModal lotToEdit={lotToEdit} onClose={handleCloseEditModal} />
      )}

      {isAddModalVisible && (
        <AddLotModal itemId={itemId} onClose={handleCloseAddModal} />
      )}
    </>
  );
};

export default LotDrawer;
