import { useEffect, useRef } from "react";

export function Village() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current as any;
    const context = canvas.getContext("2d");
    let rotation = 0;

    const cityImage = new Image();
    cityImage.src = "/cityBackground.jpg";
    cityImage.onload = () => {
      context.drawImage(cityImage, 0, 0, 2100, 1128);
    };

    cityImage.onerror = () => {
      console.error("Erro ao carregar a imagem da cidade.");
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

    // Carregue a imagem de fumaça
    const smokeImage = new Image();
    smokeImage.src = "/effects/smoke.png";
    let smokeY = 340; // posição inicial da fumaça ajustada
    let smokeOpacity = 1; // opacidade inicial da fumaça

    function animate() {
      context.clearRect(0, 0, canvas.width, canvas.height);
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
        context.globalAlpha = 1; // resetar a opacidade
      }
      smokeY -= 2; // mover a fumaça para cima mais rápido
      smokeOpacity -= 0.02; // diminuir a opacidade mais rápido
      if (smokeY < 190 || smokeOpacity <= 0) {
        smokeY = 340; // resetar a posição da fumaça quando ela sai do canvas
        smokeOpacity = 1; // resetar a opacidade
      }

      rotation += 0.01;
      requestAnimationFrame(animate);
    }

    cityImage.onload = animate;
  }, []);

  return <canvas ref={canvasRef} width={2100} height={1128} />;
}
