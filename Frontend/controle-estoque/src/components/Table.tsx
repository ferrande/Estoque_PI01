import {
  useMemo,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import "./Table.css";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import type { CellContext } from "@tanstack/table-core";
import EditItemModal from "./EditItemModal";
import LotDrawer from "./LotDrawer";

declare module "@tanstack/table-core" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    align?: "left" | "right";
  }
}

type ItemAPI = {
  id: number;
  name: string;
  price: number;
};

export type Item = {
  id: number;
  name: string;
  price: number;
};

const Table = forwardRef((_, ref) => {
  const [data, setData] = useState<Item[]>([]);
  const [itemToEdit, setItemToEdit] = useState<Item>();
  const [lotDrawerId, setLotDrawerId] = useState<number | undefined>();
  const [lotDrawerName, setLotDrawerName] = useState<string>("");
  const [isLotDrawerOpen, setIsLotDrawerOpen] = useState(false);

  const [isEditItemModalVisible, setIsEditItemModalVisible] = useState(false);
  function handleEditItem(item: Item) {
    setItemToEdit(item);
    setIsEditItemModalVisible(true);
  }

  function handleCloseEditItemModal() {
    setIsEditItemModalVisible(false);
    fetchData("");
  }

  const fetchData = async (inputSearch: string) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        "http://localhost:5000/api/items?name=" + inputSearch,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result: ItemAPI[] = await response.json();
      const formattedData = result.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
      }));
      setData(formattedData);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  useEffect(() => {
    fetchData("");
  }, []);

  useImperativeHandle(ref, () => ({
    reloadData: fetchData,
  }));

  const columnHelper = createColumnHelper<Item>();

  const itemDelete = useCallback(async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar este item?")) {
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:5000/api/items/" + id, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status !== 200) {
        alert(
          "Não foi possível deletar este item no momento. Tente novamente."
        );
        return;
      }
      fetchData("");
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  }, []);

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Produto",
        size: 200,
        cell: (info: CellContext<Item, string>) => info.getValue(),
        meta: { align: "left" },
      }),
      columnHelper.accessor("price", {
        header: "Valor",
        size: 100,
        cell: (info: CellContext<Item, number>) =>
          `R$ ${info.getValue().toFixed(2)}`,
        meta: { align: "left" },
      }),
      columnHelper.display({
        id: "acoes",
        header: "Ações",
        size: 120,
        cell: (cell) => {
          const handleDetails = () => {
            const itemId = cell.row.original.id;
            const itemName = cell.row.original.name;
            setLotDrawerId(itemId);
            setLotDrawerName(itemName);
            setIsLotDrawerOpen(true);
          };
          const handleEdit = () => {
            const item = cell.row.original;
            handleEditItem(item);
          };

          const handleDelete = () => {
            const item = cell.row.original.id;
            itemDelete(item);
          };

          return (
            <div className="actions-container">
              <button className="btn-action" onClick={handleDetails}>
                <svg
                  width="25"
                  height="24"
                  viewBox="0 0 25 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_190_1827)">
                    <path
                      d="M11.1464 7H13.1731V9H11.1464V7ZM11.1464 11H13.1731V17H11.1464V11ZM12.1597 2C6.56625 2 2.02661 6.48 2.02661 12C2.02661 17.52 6.56625 22 12.1597 22C17.7532 22 22.2929 17.52 22.2929 12C22.2929 6.48 17.7532 2 12.1597 2ZM12.1597 20C7.69103 20 4.05324 16.41 4.05324 12C4.05324 7.59 7.69103 4 12.1597 4C16.6284 4 20.2662 7.59 20.2662 12C20.2662 16.41 16.6284 20 12.1597 20Z"
                      fill="#0F64E5"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_190_1827">
                      <rect width="24.3195" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <span>Detalhes</span>
              </button>

              <button className="btn-action" onClick={handleEdit}>
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
              <button className="btn-action" onClick={handleDelete}>
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
    ],
    [columnHelper, itemDelete]
  );

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 4,
  });

  useEffect(() => {
    setPagination({
      pageIndex: 0,
      pageSize: 4,
    });
  }, [data]);

  const table = useReactTable({
    data,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="table-container">
      <LotDrawer
        isOpen={isLotDrawerOpen}
        itemId={lotDrawerId || 0}
        itemName={lotDrawerName}
        onClose={() => setIsLotDrawerOpen(false)}
      />

      {isEditItemModalVisible && itemToEdit && (
        <EditItemModal
          itemToEdit={itemToEdit}
          onClose={() => handleCloseEditItemModal()}
        />
      )}
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
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          className="body-medium"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
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
          Próxima
        </button>
      </div>
    </div>
  );
});

export default Table;
