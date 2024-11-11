"use client"

import { FormValues } from "@/app/types/type";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import api from "@/app/services/api";
import { formatToCurrency } from "@/app/utils/FormatBRL";
import { formatDate } from "@/app/utils/FormatDate";

export function AddProduct({
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
  } = useForm<FormValues>();
  const isExpired = (date: string) => {
    const today = new Date();
    const expirationDate = new Date(date);
    return expirationDate < today;
  };

  const isManufactureAfterExpiration = (manufactureDate: string, expirationDate: string) => {
    if (!manufactureDate || !expirationDate) return false;
    const manufacture = new Date(manufactureDate);
    const expiration = new Date(expirationDate);
    return manufacture > expiration;
  };

  async function handleAddNewProduct(data: FormValues) {
    try {
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

      const response = await api.post("/",
        {
          "name": String(data.name),
          "unitMeasurement": String(data.unitMeasurement),
          "amount": Number(data.amount),
          "price": parsedPrice,
          "perishable": data.perishable,
          "expirationDate": formatDate(data.expirationDate),
          "dateManufacture": formatDate(data.dateManufacture),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setModalIsVisible(false);
      setProduct((prevProducts: any) => [...prevProducts, response.data]);
      toast.success("Produto registrado com sucesso", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } catch (err) {
      console.error("Erro ao registrar produto:", err);
    }
  }

  const perishable = watch("perishable");

  return (
    <div className="w-full h-full flex justify-center items-center left-0 top-0 bg-black bg-opacity-50 z-10 fixed">
      <div className="w-full max-w-[42.188rem] bg-[#12131B] rounded-[0.625rem] relative">
        <p className="text-[1.25rem] font-bold text-white text-center pt-[0.938rem] pb-[2rem]">
          Registrar um novo produto
        </p>

        <form
          onSubmit={handleSubmit(handleAddNewProduct)}
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
            <input
              type="date"
              {...register("dateManufacture", { required: true })}
              placeholder="Data de fabricação"
              className="w-full p-4 bg-[#12131B] border-2 border-[#1B1C29] rounded-[0.875rem] outline-none text-[1rem] font-medium text-[#B6B6B6]"
            />
            {errors.dateManufacture && (
              <p className="text-red-500 mt-1 ml-1">Data de fabricação é obrigatória</p>
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
              Registrar produto
            </button>

            <button
              type="button"
              onClick={() => {
                setModalIsVisible(false);
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
  );
}
