import React, { useEffect, useRef } from "react";

export function Village() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    let rotation = 0;

    const cityImage = new Image();
    cityImage.src = "/cityBackground.jpg";
    cityImage.onload = animate;
    cityImage.onerror = () => {
      console.error("Erro ao carregar a imagem da cidade.");
    };

    // Carregar a imagem de ground
    const groundImage = new Image();
    groundImage.src = "/grounds/ground.jpg"; // substitua pelo caminho real para a imagem
    groundImage.onload = () => {
      const pattern = context.createPattern(groundImage, "repeat");
      context.fillStyle = pattern;
      context.fillRect(0, 0, canvas.width, canvas.height);
    };

    const buildingImages = [
      { src: "buildings/building1.png", x: 880, y: 150 },
      { src: "buildings/building2.png", x: 1220, y: 170 },
      { src: "buildings/building3.png", x: 1520, y: 150 },
      { src: "buildings/building4.png", x: 1600, y: 490 },
      { src: "buildings/building5.png", x: 500, y: 500 },
      { src: "buildings/building6.png", x: 1150, y: 450 },
      { src: "buildings/building7.png", x: 1030, y: 760 },
      { src: "buildings/building8.png", x: 1340, y: 560 },
      { src: "buildings/building9.png", x: 350, y: 380 },
      { src: "buildings/building10.png", x: 1200, y: 700 },
      { src: "buildings/building11.png", x: 870, y: 450 },
      { src: "buildings/building12.png", x: 1300, y: 300 },
      { src: "buildings/building13.png", x: 500, y: 200 },
      { src: "buildings/building14.png", x: 830, y: 650 },
      { src: "buildings/building15.png", x: 840, y: 330 },
    ];

    const buildings = buildingImages.map((building) => {
      const img = new Image();
      img.src = building.src;
      return { ...building, img };
    });

    const aircraftImage = new Image();
    aircraftImage.src = "/effects/farmBlade.png";

    const smokeImage = new Image();
    smokeImage.src = "/effects/smoke.png";
    let smokeY = 340;
    let smokeOpacity = 1;

    function animate() {
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Preenche o canvas com o padrão de ground
      if (groundImage.complete) {
        const pattern = context.createPattern(groundImage, "repeat");
        context.fillStyle = pattern;
        context.fillRect(0, 0, canvas.width, canvas.height);
      }

      if (cityImage.complete) {
        context.drawImage(cityImage, 0, 0, 2100, 1128);
      }

      buildings.forEach((building) => {
        if (building.img.complete) {
          context.drawImage(building.img, building.x, building.y);
        }
      });

      if (aircraftImage.complete) {
        context.save();
        context.translate(1745, 540);
        context.rotate(rotation);
        context.drawImage(
          aircraftImage,
          -aircraftImage.width / 2,
          -aircraftImage.height / 2
        );
        context.restore();
      }

      if (smokeImage.complete) {
        context.globalAlpha = smokeOpacity;
        context.drawImage(smokeImage, 400, smokeY);
        context.globalAlpha = 1;
      }
      smokeY -= 1;
      smokeOpacity -= 0.02;
      if (smokeY < 190 || smokeOpacity <= 0) {
        smokeY = 340;
        smokeOpacity = 1;
      }

      rotation += 0.01;
      requestAnimationFrame(animate);
    }
  }, []);

  // Defina o tamanho do canvas para ocupar 100% da tela
  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} />;
}
