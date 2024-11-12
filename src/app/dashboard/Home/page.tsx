"use client";

import { useState, useEffect } from "react";
import { Items } from "@/app/types/type";
import { MinicartIcon } from "@/app/assets/minicart";
import { EyesIcon } from "@/app/assets/eyes";
import Produto from "@/app/assets/logo.png";
import Banner from "@/app/assets/banner.jpg";
import SecondBanner from "@/app/assets/banner-2.jpg";
import Image from "next/image";
import api from "@/app/services/api";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";

export default function Home() {
  const [product, setProduct] = useState<Items[]>([]);

  var settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
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
      <div className="max-h-[600px]">
        <Slider {...settings}>
          <div>
            <Image
              src={Banner}
              alt="Banner - Home"
              className="w-full h-full max-h-[600px] object-cover"
            />
          </div>
          <div>
            <Image
              src={SecondBanner}
              alt="Banner - Home"
              className="w-full h-full max-h-[600px] object-cover"
            />
          </div>
        </Slider>
      </div>

      <div className="flex items-center justify-center flex-col mt-10 mb-5">
        <p className="text-[20px] font-semibold text-white">Novidades</p>

        <Link href={"/dashboard/Products"} className="text-white text-[18px] font-normal underline">Ver todos</Link>
      </div>

      <div className="grid grid-cols-4 gap-4 w-full max-w-[90rem] mx-auto mb-10 px-4 sm-max:px-2 sm-max:grid-cols-1 ">
        {product.slice(0, 4).map((item: Items) => (
          <div
            key={item.id}
            className="border-2 border-[#1B1C29] rounded-[0.875rem] p-4 min-w-[13.25rem]"
          >
            <div className="relative">
              <div className="w-full flex justify-center items-center pt-4 pb-2">
                <Image
                  src={Produto}
                  alt="Imagem do produto"
                  className="w-16 h-16 rounded-full"
                />
              </div>
            </div>

            <div className="border-2 border-[#1B1C29] rounded-[0.875rem] px-4 py-4 mt-2">
              <p className="text-[0.875rem] font-medium text-white pb-1">
                {item.name}
              </p>

              <div className="flex flex-col gap-1">
                <p className="text-[0.875rem] font-normal text-white">
                  Preço: {item.price}
                </p>
                <p className="text-[0.875rem] font-normal text-white">
                  Kg: {item.unitMeasurement}
                </p>
                <p className="text-[0.875rem] font-normal text-white">
                  Disponível: {item.amount}
                </p>
                <p className="text-[0.875rem] font-normal text-white">
                  Perecível: {item.perishable ? "Sim" : "Não"}
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
      </div>
    </div>
  );
}
