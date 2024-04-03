import React, { useEffect, useRef } from "react";

export function Village() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Carregue a imagem da cidade
    const cityImage = new Image();
    cityImage.src = "/cityBackground.jpg";
    cityImage.onload = () => {
      context.drawImage(cityImage, 0, 0, 2100, 1128);
    };

    cityImage.onerror = () => {
      console.error("Erro ao carregar a imagem da cidade.");
    };

    // Carregue as imagens das construções
    const buildingImages = [
      { src: "building1.png", x: 880, y: 150 },
      { src: "building2.png", x: 100, y: 100 },
      // { src: "building3.png", x: 100, y: 200 },
      // { src: "building4.png", x: 100, y: 100 },
      // { src: "building5.png", x: 100, y: 200 },
      // { src: "building6.png", x: 100, y: 100 },
      // { src: "building7.png", x: 100, y: 200 },
      // { src: "building8.png", x: 100, y: 100 },
      // { src: "building9.png", x: 100, y: 200 },
      // { src: "building10.png", x: 100, y: 100 },
      // { src: "building11.png", x: 100, y: 100 },
      // { src: "building12.png", x: 100, y: 100 },
      // { src: "building13.png", x: 100, y: 100 },
      // { src: "building14.png", x: 100, y: 100 },
      // { src: "building15.png", x: 100, y: 100 },
      // Adicione mais construções conforme necessário
    ];

    buildingImages.forEach((building) => {
      const buildingImage = new Image();
      buildingImage.src = building.src;
      buildingImage.onload = () => {
        context.drawImage(buildingImage, building.x, building.y);
      };
    });
  }, []);

  return <canvas ref={canvasRef} width={2100} height={1128} />;
}
