import { useEffect, useRef, useState } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export function Village() {
  const canvasRef = useRef(null);
  const [scale] = useState(1.2);
  const [position] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<any>(null);

  function handleBuildingClick(building: any) {
    if (building && selectedBuilding && building.id === selectedBuilding.id) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current as any;
    canvas.width = 3840;
    canvas.height = 2160;

    const context = canvas.getContext("2d");
    let rotation = 0;

    const cityImage = new Image();
    cityImage.src = "/cityBackground.jpg";
    cityImage.onload = animate;
    cityImage.onerror = () => {
      console.error("Erro ao carregar a imagem da cidade.");
    };

    const groundImage = new Image();
    groundImage.src = "/grounds/ground.jpg";
    groundImage.onload = () => {
      const pattern = context.createPattern(groundImage, "repeat");
      context.fillStyle = pattern;
      context.fillRect(0, 0, canvas.width, canvas.height);
    };

    const buildingImages = [
      { id: 1, src: "buildings/building1.png", x: 880, y: 150 },
      { id: 2, src: "buildings/building2.png", x: 1220, y: 170 },
      { id: 3, src: "buildings/building3.png", x: 1520, y: 150 },
      { id: 4, src: "buildings/building4.png", x: 1600, y: 490 },
      { id: 5, src: "buildings/building5.png", x: 500, y: 500 },
      { id: 6, src: "buildings/building6.png", x: 1150, y: 450 },
      { id: 7, src: "buildings/building7.png", x: 1030, y: 760 },
      { id: 8, src: "buildings/building8.png", x: 1340, y: 560 },
      { id: 9, src: "buildings/building9.png", x: 350, y: 380 },
      { id: 10, src: "buildings/building10.png", x: 1200, y: 700 },
      { id: 11, src: "buildings/building11.png", x: 870, y: 450 },
      { id: 12, src: "buildings/building12.png", x: 1300, y: 300 },
      { id: 13, src: "buildings/building13.png", x: 500, y: 200 },
      { id: 14, src: "buildings/building14.png", x: 830, y: 650 },
      { id: 15, src: "buildings/building15.png", x: 840, y: 330 },
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
    let smokes = [] as any;

    const rippleImage = new Image();
    rippleImage.src = "/effects/ripple.png";

    // Array para armazenar os pontos de animação de ripple
    const ripplePoints = [
      { x: 770, y: 190 },
      { x: 770, y: 200 },
      { x: 770, y: 210 },
      { x: 770, y: 220 },
      { x: 770, y: 230 },
    ];

    // Array para armazenar o deslocamento vertical das ondulações
    const rippleOffsets = new Array(ripplePoints.length).fill(0);

    // Adiciona a animação de ripple nos pontos demarcados
    function drawRippleEffects() {
      ripplePoints.forEach((point, index) => {
        const offsetY = rippleOffsets[index];
        // Calcula a opacidade com base na posição vertical da ondulação
        const opacity =
          1 -
          Math.abs(offsetY - rippleImage.height / 2) / (rippleImage.height / 2);
        context.globalAlpha = opacity;
        context.drawImage(rippleImage, point.x, point.y + offsetY);
        context.globalAlpha = 1; // Restaura a opacidade para o valor padrão
      });
    }

    // Atualiza a posição das ondulações para criar o efeito de animação
    function animateRipples() {
      rippleOffsets.forEach((offset, index) => {
        // Reduzir a velocidade de deslocamento vertical
        rippleOffsets[index] = (offset + 0.1) % rippleImage.height;
      });
    }

    canvas.addEventListener("mousemove", handleMouseMove);

    function handleMouseMove(event: any) {
      const rect = canvas.getBoundingClientRect();
      const x =
        ((event.clientX - rect.left) / (rect.right - rect.left)) * canvas.width;
      const y =
        ((event.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height;
      setMousePosition({ x, y });
    }

    let currentBuildingId = null as any;

    function getMouseOverBuilding() {
      const scaledMouseX = mousePosition.x / scale - position.x;
      const scaledMouseY = mousePosition.y / scale - position.y;

      for (let building of buildings) {
        const buildingWidth = building.img.width;
        const buildingHeight = building.img.height;

        if (
          scaledMouseX >= building.x &&
          scaledMouseX <= building.x + buildingWidth &&
          scaledMouseY >= building.y &&
          scaledMouseY <= building.y + buildingHeight
        ) {
          return building;
        }
      }

      return null;
    }

    function animate() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.save();
      context.scale(scale, scale);
      context.translate(position.x, position.y);

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

          const mouseOverBuilding = getMouseOverBuilding();
          if (mouseOverBuilding && mouseOverBuilding === building) {
            context.strokeStyle = "red";
            context.strokeRect(
              building.x,
              building.y,
              building.img.width,
              building.img.height
            );
            if (building.id !== currentBuildingId) {
              console.log(`Mouse is over building with ID: ${building.id}`);
              currentBuildingId = building.id;
            }
          }
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

      smokes.forEach((smoke: any, index: number) => {
        context.globalAlpha = smoke.opacity;
        context.drawImage(smokeImage, smoke.x, smoke.y);
        context.globalAlpha = 1;
        smoke.y -= 0.5; // Reduz a velocidade vertical
        smoke.x -= 0.2; // Movimento horizontal para a esquerda
        smoke.opacity -= 0.005; // Reduz a opacidade de forma mais lenta
        if (smoke.opacity <= 0) {
          smokes.splice(index, 1);
        }
      });

      if (Math.random() < 0.02) {
        smokes.push({
          x: 400,
          y: 340,
          opacity: 1,
        });
      }

      drawRippleEffects();
      animateRipples();

      rotation += 0.01;

      context.restore();
      requestAnimationFrame(animate);
    }

    animate();

    canvas.addEventListener("click", () => {
      const building = getMouseOverBuilding();
      if (building) {
        console.log(`Clique detectado no edifício com ID: ${building.id}`);
        setSelectedBuilding(building);
        handleBuildingClick(building);
      }
    });

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mousePosition]);

  return (
    <>
      <TransformWrapper
        centerOnInit={true}
        centerZoomedOut={true}
        smooth={false}
        wheel={{ step: 0.25 }}
        minScale={0.5} // Ajuste o limite mínimo de zoom
        maxScale={3} // Ajuste o limite máximo de zoom
      >
        <TransformComponent wrapperStyle={{ width: "100vw", height: "100vh" }}>
          <canvas ref={canvasRef} />
        </TransformComponent>
      </TransformWrapper>
      <Dialog
        open={isModalOpen}
        onOpenChange={(isOpen) => {
          setIsModalOpen(isOpen);
          if (!isOpen) {
            setSelectedBuilding(null); // Limpar selectedBuilding ao fechar o modal
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Building Details</DialogTitle>
            <DialogDescription>
              Here are the details of the selected building.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Building ID
              </Label>
              <Input
                id="name"
                value={selectedBuilding ? selectedBuilding.id : ""} // Definir como string vazia se selectedBuilding for null
                className="col-span-3"
                readOnly
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Building Position
              </Label>
              <Input
                id="username"
                value={`x: ${selectedBuilding?.x}, y: ${selectedBuilding?.y}`}
                className="col-span-3"
                readOnly
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
