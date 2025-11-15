import {
  useMemo,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
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

  async function itemDelete(id: number) {
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
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Produto",
        cell: (info: CellContext<Item, string>) => info.getValue(),
        meta: { align: "left" },
      }),
      columnHelper.accessor("price", {
        header: "Valor",
        cell: (info: CellContext<Item, number>) =>
          `R$ ${info.getValue().toFixed(2)}`,
        meta: { align: "left" },
      }),
      columnHelper.display({
        id: "acoes",
        header: "Ações",
        cell: (cell) => {
          const handleEdit = () => {
            const item = cell.row.original;
            handleEditItem(item);
          };

          const handleDelete = () => {
            const item = cell.row.original.id;
            itemDelete(item);
          };

          return (
            <>
              <button className="btn-action" onClick={handleEdit}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <g clip-path="url(#clip0_111_523)">
                    <path
                      d="M22.824 1.176C22.0597 0.44565 21.0432 0.0380859 19.986 0.0380859C18.9288 0.0380859 17.9124 0.44565 17.148 1.176L1.61101 16.713C1.09893 17.2223 0.69288 17.828 0.416359 18.4952C0.139839 19.1624 -0.00167058 19.8778 1.48806e-05 20.6V22.5C1.48806e-05 22.8978 0.15805 23.2794 0.439355 23.5607C0.720659 23.842 1.10219 24 1.50001 24H3.40001C4.12257 24.0019 4.83833 23.8606 5.50588 23.584C6.17343 23.3075 6.7795 22.9013 7.28901 22.389L22.824 6.852C23.5756 6.09874 23.9977 5.07809 23.9977 4.014C23.9977 2.9499 23.5756 1.92926 22.824 1.176V1.176ZM5.16601 20.268C4.6964 20.7346 4.062 20.9975 3.40001 21H3.00001V20.6C3.00207 19.9373 3.26505 19.3022 3.73201 18.832L15.3 7.267L16.733 8.7L5.16601 20.268ZM20.7 4.731L18.854 6.58L17.42 5.146L19.27 3.3C19.463 3.11558 19.7196 3.01266 19.9865 3.01266C20.2534 3.01266 20.5101 3.11558 20.703 3.3C20.8916 3.49056 20.9972 3.748 20.9966 4.01612C20.996 4.28423 20.8894 4.54123 20.7 4.731V4.731Z"
                      fill="#0F64E5"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_111_523">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </button>
              <button className="btn-action" onClick={handleDelete}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="24"
                  viewBox="0 0 22 24"
                  fill="none"
                >
                  <path
                    d="M22 4.5C22 3.67158 21.3285 3 20.5 3H16.724C16.0921 1.20736 14.4007 0.00609375 12.5 0H9.50002C7.59928 0.00609375 5.90789 1.20736 5.27602 3H1.5C0.671578 3 0 3.67158 0 4.5C0 5.32842 0.671578 6 1.5 6H2.00002V18.5C2.00002 21.5376 4.46245 24 7.5 24H14.5C17.5376 24 20 21.5376 20 18.5V6H20.5C21.3285 6 22 5.32842 22 4.5ZM17 18.5C17 19.8807 15.8807 21 14.5 21H7.5C6.1193 21 5.00002 19.8807 5.00002 18.5V6H17V18.5Z"
                    fill="#E4515E"
                  />
                  <path
                    d="M8.5 18C9.32842 18 10 17.3284 10 16.5V10.5C10 9.67158 9.32842 9 8.5 9C7.67158 9 7 9.67158 7 10.5V16.5C7 17.3284 7.67158 18 8.5 18Z"
                    fill="#E4515E"
                  />
                  <path
                    d="M13.5 18C14.3284 18 15 17.3284 15 16.5V10.5C15 9.67158 14.3284 9 13.5 9C12.6716 9 12 9.67158 12 10.5V16.5C12 17.3284 12.6716 18 13.5 18Z"
                    fill="#E4515E"
                  />
                </svg>
              </button>
            </>
          );
        },
        meta: { align: "right" },
      }),
    ],
    []
  );

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 4,
  });

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
