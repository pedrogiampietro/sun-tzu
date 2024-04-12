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
    if (building) {
      setSelectedBuilding(building);
      setIsModalOpen(true);
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
    ];

    const buildings = buildingImages.map((building) => {
      const img = new Image();
      img.src = building.src;
      return { ...building, img };
    });

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

    let dragStart = null as any;

    canvas.addEventListener("mousedown", (event: any) => {
      dragStart = { x: event.clientX, y: event.clientY };
    });

    canvas.addEventListener("mouseup", (event: any) => {
      if (dragStart) {
        const dragEnd = { x: event.clientX, y: event.clientY };
        const dragDistance = Math.hypot(
          dragEnd.x - dragStart.x,
          dragEnd.y - dragStart.y
        );

        // Consider it a click if the mouse has moved less than 10 pixels.
        if (dragDistance < 10) {
          const building = getMouseOverBuilding();
          if (building && building.id === currentBuildingId) {
            handleBuildingClick(building);
          } else {
            setSelectedBuilding(null);
            setIsModalOpen(false);
          }
        }
      }
      dragStart = null; // Reset dragStart for the next drag operation.
    });

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

      const mouseOverBuilding = getMouseOverBuilding();

      buildings.forEach((building) => {
        if (building.img.complete) {
          context.drawImage(building.img, building.x, building.y);

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

      rotation += 0.01;

      context.restore();
      requestAnimationFrame(animate);
    }

    animate();

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
      <Dialog open={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
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
                value={selectedBuilding ? selectedBuilding.id : ""}
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
                value={
                  selectedBuilding
                    ? `x: ${selectedBuilding.x}, y: ${selectedBuilding.y}`
                    : ""
                }
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
