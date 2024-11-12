"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer } from "react-toastify";
import { ProductCard } from "@/app/components/ProductCard";
import { FormValues, Items } from '@/app/types/type';
import { AddProduct } from "@/app/components/AddProduct";
import api from "@/app/services/api";
import "react-toastify/dist/ReactToastify.css";

export default function Products() {
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [product, setProduct] = useState<Items[]>([]);

  const {
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  const handleOpenRegisterProductModal = () => {
    setModalIsVisible(!modalIsVisible);
    reset();
  };

  useEffect(() => {
    async function handleGetProducts() {
      try {
        const response = await api.get("/");
        setProduct(response.data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    }

    handleGetProducts();
    const intervalId = setInterval(handleGetProducts, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <ToastContainer />
      <div className="max-w-[90rem] w-full mx-auto px-8 sm-max:px-3">
        <div className="flex items-center justify-between mt-[1.563rem] mb-[5.938rem] sm-max:flex-col sm-max:items-start sm-max:mb-6">
          <p className="text-[0.875rem] font-thin text-white">
            {"Home > Produtos > Alimentação"}
          </p>
          <button
            type="button"
            className="max-w-[12.5rem] w-full h-[3.125rem] bg-yellow rounded-[0.875rem] text-[1.25rem] font-bold text-white sm-max:mt-3 sm-max:text-[1rem]"
            onClick={handleOpenRegisterProductModal}
          >
            Novo Produto
          </button>
        
          {modalIsVisible && (
            <AddProduct
              setModalIsVisible={setModalIsVisible}
              setProduct={setProduct}
            />
          )}
        </div>

        <ProductCard
          product={product}
          modalIsVisible={modalIsVisible}
          setModalIsVisible={setModalIsVisible}
          setProduct={setProduct}
        />
      </div>
    </div>
  );
}