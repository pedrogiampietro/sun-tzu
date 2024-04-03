import React, { useEffect, useRef } from "react";

export function Village() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current as any;
    const context = canvas.getContext("2d");

    const cityImage = new Image();
    cityImage.src = "/cityBackground.jpg";
    cityImage.onload = () => {
      context.drawImage(cityImage, 0, 0, 2100, 1128);
    };

    cityImage.onerror = () => {
      console.error("Erro ao carregar a imagem da cidade.");
    };

    const buildingImages = [
      { src: "building1.png", x: 880, y: 150 },
      { src: "building2.png", x: 1220, y: 170 },
      { src: "building3.png", x: 1520, y: 150 },
      { src: "building4.png", x: 1600, y: 490 },
      { src: "building5.png", x: 500, y: 500 },
      { src: "building6.png", x: 1150, y: 450 },
      { src: "building7.png", x: 1030, y: 760 },
      { src: "building8.png", x: 1340, y: 560 },
      { src: "building9.png", x: 350, y: 380 },
      { src: "building10.png", x: 1200, y: 700 },
      { src: "building11.png", x: 870, y: 450 },
      { src: "building12.png", x: 1300, y: 300 },
      { src: "building13.png", x: 500, y: 200 },
      { src: "building14.png", x: 830, y: 650 },
      { src: "building15.png", x: 840, y: 330 },
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
