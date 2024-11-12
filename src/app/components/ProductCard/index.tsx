import { useState } from "react";
import Image from "next/image";
import Produto from "@/app/assets/logo.png";
import { PenIcon } from "@/app/assets/pen";
import { EyesIcon } from "@/app/assets/eyes";
import { MinicartIcon } from "@/app/assets/minicart";
import { FormValues, Items } from '@/app/types/type';
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { formatToCurrency } from "@/app/utils/FormatBRL";
import { formatDate } from "@/app/utils/FormatDate";
import { isExpired, isManufactureAfterExpiration } from "@/app/utils/ValidationDateProduct";
import api from "@/app/services/api";

export function ProductCard({
  product,
  setModalIsVisible,
  setProduct
}: any) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<FormValues>()

  const [currentPage, setCurrentPage] = useState(1);
  const [viewProduct, setViewProduct] = useState<Items | null>(null);
  const [editProductId, setEditProductId] = useState<string | null>(null);
  
  const itemsPerPage = 8;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = product.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(product.length / itemsPerPage);

  const handleViewProduct = (product: Items) => {
    setViewProduct(product);
  };

  const handleCloseViewModal = () => {
    setViewProduct(null);
  };

  const handleOpenEditProduct = (item: any) => {
    setEditProductId(item.id);

    reset({
      id: item.id,
      name: item.name,
      unitMeasurement: item.unitMeasurement,
      amount: item.amount,
      price: item.price,
      perishable: item.perishable,
      expirationDate: item.expirationDate,
      dateManufacture: item.dateManufacture,
    });
  }; 

  const handleCloseEditModal = () => {
    setEditProductId(null);
  };

  async function handleEditProduct(data: FormValues) {
    const parsedPrice = parseFloat(String(data.price).replace(/[^\d,]/g, "").replace(",", "."));

    if (data.perishable && isManufactureAfterExpiration(data.dateManufacture, data.expirationDate)) {
      toast.error("A data de fabricação não pode ser superior à data de validade para produtos perecíveis.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }

    try {
      const response = await api.put(`http://localhost:5000/${data.id}`, {
        "id": String(data.id),
        "name": String(data.name),
        "unitMeasurement": String(data.unitMeasurement),
        "amount": Number(data.amount),
        "price": parsedPrice,
        "perishable": data.perishable,
        "expirationDate": formatDate(data.expirationDate),
        "dateManufacture": formatDate(data.dateManufacture),
      }, {
        headers: {
          "Content-Type": "application/json"
        },
      });

      setModalIsVisible(false);
      setProduct((prevProducts: any) => [...prevProducts, response.data]);
      toast.success("Produto registrado com sucesso", { theme: "dark" });
    } catch (err) {
      console.error("Erro ao editar o produto:", err);
    }
  }

  const perishable = watch("perishable");

  return (
    <div className="flex flex-row flex-wrap gap-[1.625rem]">
      <div className="grid grid-cols-4 gap-4 w-full sm-max:grid-cols-1">
        {currentItems.map((item: Items) => (
          <div
            key={item.id}
            className="border-2 border-[#1B1C29] rounded-[0.875rem] p-4 min-w-[13.25rem]"
          >
            <div className="relative">
              <button
                type="button"
                onClick={() => handleOpenEditProduct(item)}
                className="text-white absolute left-2 top-2 w-[30px]"
              >
                <PenIcon className="w-[20px]" />
              </button>

              {editProductId === item.id && (
                <div className="w-full h-full flex justify-center items-center left-0 top-0 bg-black bg-opacity-50 z-10 fixed">
                  <div className="w-full max-w-[42.188rem] bg-[#12131B] rounded-[0.625rem] relative sm-max:mx-5">
                    <p className="text-[1.25rem] font-bold text-white text-center pt-[0.938rem] pb-[2rem]">
                      Editar produto
                    </p>
            
                    <form
                      onSubmit={handleSubmit(handleEditProduct)}
                      className="px-[28px] mx-auto flex flex-col"
                    >
                      <div className="mb-2">
                        <input
                          {...register("name", {
                            required: true,
                            maxLength: 30,
                            pattern: /^[A-Za-zÀ-ÿ\s]+$/
                          })}
                          placeholder="Nome do item"
                          className="w-full p-4 bg-[#12131B] border-2 border-[#1B1C29] rounded-[0.875rem] outline-none text-[1rem] font-medium text-[#B6B6B6]"
                        />
                        {errors.name && (
                          <p className="text-red-500 mt-1 ml-1">
                            {errors.name.type === "required" && "Nome do item é obrigatório"}
                            {errors.name.type === "maxLength" && "Tamanho máximo de 30 caracteres"}
                            {errors.name.type === "pattern" && "Somente letras são permitidas"}
                          </p>
                        )}
                      </div>
            
                      <div className="mb-2">
                        <input
                          {...register("unitMeasurement", { required: true })}
                          placeholder="Unidade de medida"
                          className="w-full p-4 bg-[#12131B] border-2 border-[#1B1C29] rounded-[0.875rem] outline-none text-[1rem] font-medium text-[#B6B6B6]"
                        />
                        {errors.unitMeasurement && (
                          <p className="text-red-500 mt-1 ml-1">Unidade de medida é obrigatória</p>
                        )}
                      </div>
            
                      <div className="flex flex-col w-full">
                        <input
                          type="number"
                          {...register("amount", { required: true })}
                          placeholder="amount"
                          className="w-full p-4 bg-[#12131B] border-2 border-[#1B1C29] rounded-[0.875rem] outline-none text-[1rem] font-medium text-[#B6B6B6]"
                        />
                        {errors.amount && (
                          <p className="text-red-500 mt-1 ml-1">Quantidade é obrigatória</p>
                        )}
                      </div>
            
                      <div className="flex flex-col gap-4 my-5">
                        <input
                          type="text"
                          {...register("price", { required: true })}
                          placeholder="Preço"
                          onChange={(e) => {
                            const formattedValue = formatToCurrency(e.target.value);
                            setValue("price", formattedValue, { shouldValidate: true });
                          }}
                          className="w-full p-4 bg-[#12131B] border-2 border-[#1B1C29] rounded-[0.875rem] outline-none text-[1rem] font-medium text-[#B6B6B6]"
                        />
                        {errors.price && (
                          <p className="text-red-500 mt-1 ml-1">Preço é obrigatório</p>
                        )}
                        
                        <input
                          type="date"
                          {...register("dateManufacture", { required: true })}
                          placeholder="Data de fabricação"
                          className="w-full p-4 bg-[#12131B] border-2 border-[#1B1C29] rounded-[0.875rem] outline-none text-[1rem] font-medium text-[#B6B6B6]"
                        />
                        {errors.dateManufacture && (
                          <p className="text-red-500 mt-1 ml-1">Data de fabricação é obrigatória</p>
                        )}

                        <input
                          type="date"
                          {...register("expirationDate", {
                            required: perishable, 
                            validate: (value) => {
                              if (value && isExpired(value)) {
                                return "O produto está vencido";
                              }
                            }
                          })}
                          placeholder="Data de validade"
                          className="w-full p-4 bg-[#12131B] border-2 border-[#1B1C29] rounded-[0.875rem] outline-none text-[1rem] font-medium text-[#B6B6B6]"
                        />
                        {perishable && errors.expirationDate && (
                          <p className="text-red-500 mt-1 ml-1">{errors.expirationDate.message || "Data de validade é obrigatória"}</p>
                        )}
                      </div>
            
                      <div className="flex flex-col w-full">
                        <label className="flex items-center gap-2 text-[1rem] font-medium text-[#B6B6B6]">
                          <input
                            type="checkbox"
                            {...register("perishable")}
                            className="bg-gray-700"
                          />
                          Produto perecível
                        </label>
                        {errors.perishable && (
                          <p className="text-red-500 mt-1 ml-1">
                            É obrigatório informar se é ou não perecível
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="submit"
                          className="w-full max-w-[12.5rem] mx-auto bg-yellow rounded mt-[3rem] mb-[2rem] h-[2.813rem] text-[1rem] font-semibold text-white"
                        >
                          Editar produto
                        </button>
            
                        <button
                          type="button"
                          onClick={() => {
                            handleCloseEditModal(),
                            reset();
                          }}
                          className="w-full max-w-[12.5rem] mx-auto bg-[#FF0000] rounded mt-[3rem] mb-[2rem] h-[2.813rem] text-[1rem] font-semibold text-white"
                        >
                          Fechar
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className="w-full flex justify-center items-center pt-4 pb-2">
                <Image
                  src={Produto}
                  alt="Imagem do produto"
                  className="w-16 h-16 rounded-full"
                />
              </div>

              <button
                type="button"
                onClick={() => handleViewProduct(item)}
                className="text-white absolute right-2 top-2 w-[30px]"
              >
                <EyesIcon className="w-[20px]" />
              </button>
            </div>

            <div className="border-2 border-[#1B1C29] rounded-[0.875rem] px-4 py-4 mt-2">
              <p className="text-[0.875rem] font-medium text-white pb-1">
                {item.name}
              </p>

              <div className="flex flex-col gap-1">
                <p className="text-[0.875rem] font-normal text-white">
                  Preço: {formatToCurrency(item.price)}
                </p>
                <p className="text-[0.875rem] font-normal text-white">
                  Kg: {item.unitMeasurement}
                </p>
                <p className="text-[0.875rem] font-normal text-white">
                  Disponível: {item.amount}
                </p>
                <p className="text-[0.875rem] font-normal text-white">
                  Perecível: { item.perishable ? "Sim" : "Não" }
                </p>
                <p className="text-[0.875rem] font-normal text-white">
                  Fabricado: {item.dateManufacture}
                </p>
                <p className="text-[0.875rem] font-normal text-white">
                  Validade: {item.expirationDate}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {}}
                className="flex items-center justify-center border-2 border-[#1B1C29] rounded-[0.875rem] mt-4 w-full h-10 gap-2 text-[0.875rem] font-semibold text-white duration-100 hover:bg-lightBlue"
              >
                Comprar
                <MinicartIcon />
              </button>
            </div>
          </div>
        ))}
        
        {viewProduct && (
          <div className="w-full h-full flex justify-center items-center left-0 top-0 bg-black bg-opacity-50 z-10 fixed">
            <div className="w-full max-w-[42.188rem] bg-[#12131B] rounded-[0.625rem] relative p-8 sm-max:mx-5">
              <button
                type="button"
                className="absolute right-5 top-4 text-[1.25rem] font-bold text-white"
                onClick={handleCloseViewModal}
              >
                X
              </button>
              <p className="text-[1.25rem] font-bold text-white text-center">
                Detalhes do Produto
              </p>
              <div className="mt-4 text-white flex flex-col gap-2">
                <p><strong>Nome:</strong> {viewProduct.name}</p>
                <p><strong>Preço:</strong> {formatToCurrency(viewProduct.price)}</p>
                <p><strong>Unidade:</strong> {viewProduct.unitMeasurement}</p>
                <p><strong>Quantidade:</strong> {viewProduct.amount}</p>
                <p><strong>Perecível:</strong> {viewProduct.perishable ? "Sim" : "Não"}</p>
                <p><strong>Data de Validade:</strong> {viewProduct.expirationDate}</p>
                <p><strong>Data de Fabricação:</strong> {viewProduct.dateManufacture}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center items-center w-full my-4">
        {[...Array(totalPages)].map((_, index) => {
          const pageNumber = index + 1;
          return (
            <button
              type="button"
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`px-3 py-1 mx-1 rounded-[8px] ${
                currentPage === pageNumber ? "bg-yellow text-white" : "bg-gray-200"
              }`}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>
    </div>
  );
}
