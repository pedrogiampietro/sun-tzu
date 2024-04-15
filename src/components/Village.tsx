import { useEffect, useRef, useState } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { CharacterStatus } from "./CharacterStatus";
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

const buildingImages = [
  {
    id: 1,
    src: "buildings/building1.png",
    x: 880,
    y: 150,
    level: 1,
    evolutionCost: {
      wood: 100,
      iron: 50,
    },
    evolutionTime: 3,
  },
  {
    id: 1,
    src: "buildings/building1.png",
    x: 880,
    y: 150,
    level: 2,
    evolutionCost: {
      wood: 200,
      iron: 100,
    },
    evolutionTime: 5,
  },
  {
    id: 1,
    src: "buildings/building1.png",
    x: 880,
    y: 150,
    level: 3,
    evolutionCost: {
      wood: 250,
      iron: 250,
    },
    evolutionTime: 5,
  },
  {
    id: 2,
    src: "buildings/building2.png",
    x: 1220,
    y: 170,
    level: 1,
    evolutionCost: {
      wood: 150,
      iron: 100,
    },
    evolutionTime: 5,
  },
  {
    id: 2,
    src: "buildings/building2.png",
    x: 1220,
    y: 170,
    level: 2,
    evolutionCost: {
      wood: 300,
      iron: 200,
    },
    evolutionTime: 8,
  },
];

export function Village({ characterStatus, setCharacterStatus }: any) {
  const canvasRef = useRef(null);
  const statusContainerRef = useRef(null); // Referência para o contêiner da barra de status
  const [scale] = useState(1.2);
  const [position] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<any>(null);
  const [isBuildingInProgress, setIsBuildingInProgress] = useState(false);
  const [buildingTimeLeft, setBuildingTimeLeft] = useState(0);

  function evolveBuilding() {
    if (isBuildingInProgress) {
      return;
    }

    // Verifica se há recursos suficientes para evoluir o edifício
    const canAfford = checkResources();
    if (!canAfford) {
      alert("You do not have enough resources to evolve this building.");
      return;
    }

    // Desconta os recursos necessários do characterStatus
    for (let resource in selectedBuilding.evolutionCost) {
      const requiredAmount = selectedBuilding.evolutionCost[resource];
      characterStatus.resources[resource].amount -= requiredAmount;
    }

    setIsBuildingInProgress(true);
    setBuildingTimeLeft(selectedBuilding.evolutionTime);

    const timer = setInterval(() => {
      setBuildingTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    setTimeout(() => {
      setIsBuildingInProgress(false);
      clearInterval(timer);
      setBuildingTimeLeft(0);

      // Atualiza o nível do edifício
      const updatedLevel = selectedBuilding.level + 1;
      const updatedBuilding = {
        ...selectedBuilding,
        level: updatedLevel,
        evolutionCost:
          updatedLevel === 3
            ? null
            : buildingImages.find(
                (b) => b.id === selectedBuilding.id && b.level === updatedLevel
              ).evolutionCost,
      };

      // Atualiza o estado do characterStatus com o edifício atualizado
      updateCharacterStatus(updatedBuilding);
      setSelectedBuilding(updatedBuilding); // Atualiza o selectedBuilding com o edifício atualizado
    }, selectedBuilding.evolutionTime * 1000);
  }

  function checkResources() {
    for (let resource in selectedBuilding.evolutionCost) {
      const requiredAmount = selectedBuilding.evolutionCost[resource];
      const availableAmount = characterStatus.resources[resource].amount;

      if (availableAmount < requiredAmount) {
        return false; // Retorna false se não houver recursos suficientes
      }
    }
    return true; // Retorna true se todos os recursos estiverem disponíveis
  }

  function updateCharacterStatus(updatedBuilding: any) {
    const updatedBuildings = [...characterStatus.buildings];
    const index = updatedBuildings.findIndex(
      (building) => building.id === updatedBuilding.id
    );

    if (index !== -1) {
      updatedBuildings[index] = updatedBuilding;
    } else {
      updatedBuildings.push(updatedBuilding);
    }

    setCharacterStatus((prevStatus: any) => ({
      ...prevStatus,
      buildings: updatedBuildings,
    }));
  }

  function handleBuildingClick(building: any) {
    if (building) {
      const level =
        characterStatus.buildings.find((b: any) => b.id === building.id)
          ?.level || 1; // Obtenha o nível do edifício do characterStatus ou use 1 como padrão
      const evolutionCost =
        level < 3 // Verifique se o nível é menor que 3 para evitar erros
          ? buildingImages.find(
              (b) => b.id === building.id && b.level === level + 1
            )?.evolutionCost || null // Obtenha os custos de evolução do próximo nível, se existirem
          : null; // Para o nível 3, não há custos de evolução

      setSelectedBuilding({ ...building, evolutionCost }); // Atualize o estado do edifício selecionado com as informações atualizadas
      setIsModalOpen(true); // Abra o modal
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
      <div style={{ position: "relative" }}>
        <TransformWrapper
          doubleClick={{ disabled: true }}
          panning={{ excluded: ["input", "textarea"] }}
          centerOnInit={false}
          minScale={0.5}
        >
          <TransformComponent
            wrapperStyle={{
              height: "100vh",
              width: "100vw",
            }}
            contentStyle={{
              boxSizing: "border-box",
            }}
          >
            <canvas ref={canvasRef} />
          </TransformComponent>
        </TransformWrapper>
        <div
          ref={statusContainerRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            padding: "20px",
            boxSizing: "border-box",
          }}
        >
          <CharacterStatus characterStatus={characterStatus} />
        </div>
      </div>
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

            {selectedBuilding && selectedBuilding.evolutionCost && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="evolutionCost" className="text-right">
                    Evolution Cost
                  </Label>
                  <div className="col-span-3">
                    {Object.entries(selectedBuilding.evolutionCost).map(
                      ([resource, cost]) => (
                        <div key={resource}>
                          {resource}: {cost}
                        </div>
                      )
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="evolutionTime" className="text-right">
                    Evolution Time
                  </Label>
                  <Input
                    id="evolutionTime"
                    value={`${selectedBuilding.evolutionTime} seconds`}
                    className="col-span-3"
                    readOnly
                  />
                </div>
              </>
            )}

            {isBuildingInProgress && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="buildingTimer" className="text-right">
                  Building Timer
                </Label>
                <Input
                  id="buildingTimer"
                  value={`${buildingTimeLeft} seconds left`}
                  className="col-span-3"
                  readOnly
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              onClick={evolveBuilding}
              disabled={isBuildingInProgress}
            >
              {isBuildingInProgress ? "Building..." : "Evolve Building"}
            </Button>
            <Button type="button" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
