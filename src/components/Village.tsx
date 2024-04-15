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
    evolutionTime: 4,
  },
  {
    id: 1,
    src: "buildings/building1.png",
    x: 880,
    y: 150,
    level: 3,
    evolutionCost: {
      wood: 300,
      iron: 150,
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
  {
    id: 3,
    src: "buildings/building3.png",
    x: 1520,
    y: 150,
    level: 2,
    evolutionCost: {
      wood: 300,
      iron: 200,
    },
    evolutionTime: 8,
  },
  {
    id: 4,
    src: "buildings/building4.png",
    x: 1600,
    y: 490,
    level: 2,
    evolutionCost: {
      wood: 300,
      iron: 200,
    },
    evolutionTime: 8,
  },
  {
    id: 5,
    src: "buildings/building5.png",
    x: 500,
    y: 500,
    level: 2,
    evolutionCost: {
      wood: 300,
      iron: 200,
    },
    evolutionTime: 8,
  },
  {
    id: 6,
    src: "buildings/building6.png",
    x: 1150,
    y: 450,
    level: 2,
    evolutionCost: {
      wood: 300,
      iron: 200,
    },
    evolutionTime: 8,
  },
  {
    id: 7,
    src: "buildings/building7.png",
    x: 1030,
    y: 760,
    level: 2,
    evolutionCost: {
      wood: 300,
      iron: 200,
    },
    evolutionTime: 8,
  },
  {
    id: 8,
    src: "buildings/building8.png",
    x: 1340,
    y: 560,
    level: 2,
    evolutionCost: {
      wood: 300,
      iron: 200,
    },
    evolutionTime: 8,
  },
  {
    id: 9,
    src: "buildings/building9.png",
    x: 350,
    y: 380,
    level: 2,
    evolutionCost: {
      wood: 300,
      iron: 200,
    },
    evolutionTime: 8,
  },
  {
    id: 10,
    src: "buildings/building10.png",
    x: 1200,
    y: 700,
    level: 2,
    evolutionCost: {
      wood: 300,
      iron: 200,
    },
    evolutionTime: 8,
  },
  {
    id: 11,
    src: "buildings/building11.png",
    x: 870,
    y: 450,
    level: 2,
    evolutionCost: {
      wood: 300,
      iron: 200,
    },
    evolutionTime: 8,
  },
  {
    id: 12,
    src: "buildings/building12.png",
    x: 1300,
    y: 300,
    level: 2,
    evolutionCost: {
      wood: 300,
      iron: 200,
    },
    evolutionTime: 8,
  },
  {
    id: 13,
    src: "buildings/building13.png",
    x: 500,
    y: 200,
    level: 2,
    evolutionCost: {
      wood: 300,
      iron: 200,
    },
    evolutionTime: 8,
  },
  {
    id: 14,
    src: "buildings/building14.png",
    x: 830,
    y: 650,
    level: 2,
    evolutionCost: {
      wood: 300,
      iron: 200,
    },
    evolutionTime: 8,
  },
  {
    id: 15,
    src: "buildings/building15.png",
    x: 840,
    y: 330,
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
        characterStatus.buildings.find((b) => b.id === building.id)?.level || 1; // Obtenha o nível do edifício do characterStatus ou use 1 como padrão
      const evolutionCost =
        level < 3 // Verifique se o nível é menor que 3 para evitar erros
          ? buildingImages.find(
              (b) => b.id === building.id && b.level === level + 1
            )?.evolutionCost || null // Obtenha os custos de evolução do próximo nível, se existirem
          : null; // Para o nível 3, não há custos de evolução

      setSelectedBuilding({ ...building, level, evolutionCost }); // Armazene os dados do edifício selecionado no estado
      setIsModalOpen(true); // Abra o modal
    }
  }

  const handleCloseModal = () => {
    setSelectedBuilding(null);
    setIsModalOpen(false);
  };

  function getBenefitsForNextLevel(building: any) {
    const nextLevel = building.level + 1;
    const nextLevelInfo = buildingImages.find(
      (b) => b.id === building.id && b.level === nextLevel
    );

    if (nextLevelInfo) {
      const benefits = Object.entries(nextLevelInfo.evolutionCost).map(
        ([resource, cost]) => {
          if (resource === "food") {
            return `${cost} de food por segundo`;
          } else {
            return `${cost} de ${resource}`;
          }
        }
      );
      return benefits.join(", ");
    }
    return null;
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

    const aircraftImage = new Image();
    aircraftImage.src = "/effects/farmBlade.png";

    const lumberjackImage = new Image();
    lumberjackImage.src = "/characters_effects/lumberjack.png";

    const workerImage = new Image();
    workerImage.src = "/characters_effects/worker.png";

    const smokeImage = new Image();
    smokeImage.src = "/effects/smoke.png";
    let smokes = [];

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

    function animateRipples() {
      rippleOffsets.forEach((offset, index) => {
        // Reduzir a velocidade de deslocamento vertical
        rippleOffsets[index] = (offset + 0.1) % rippleImage.height;
      });
    }

    let frameIndex = 0;
    const totalFrames = 4;
    let frameWidth = lumberjackImage.width / totalFrames;

    let frameWidthWorker = workerImage.width / 3;
    let frameHeightWorker = workerImage.height / 2;
    let currentFrameWorker = 0;
    let counter = 0;
    let speed = 10; // Ajuste este valor para controlar a velocidade da animação
    let xPosWorker = 0; // Posição x inicial do trabalhador

    // Adicione um setInterval para atualizar o frame a cada 200 milissegundos
    const frameInterval = setInterval(() => {
      // Atualize o índice do frame para o próximo frame
      frameIndex = (frameIndex + 1) % totalFrames;
    }, 350);

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

      function updateCustomCursor(isOverBuilding: boolean) {
        if (isOverBuilding) {
          canvas.classList.remove("custom-cursor");
          canvas.classList.add("custom-cursor-pointer");
        } else {
          canvas.classList.remove("custom-cursor-pointer");
          canvas.classList.add("custom-cursor");
        }
      }

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

      if (lumberjackImage.complete) {
        context.save();
        // Posicione o lenhador no mesmo local em cada frame
        context.translate(1770, 340);

        // Desenhe apenas o frame atual da imagem
        context.drawImage(
          lumberjackImage,
          frameIndex * frameWidth,
          0, // posição x, y na imagem de origem
          frameWidth,
          lumberjackImage.height, // largura e altura na imagem de origem
          -frameWidth / 2,
          -lumberjackImage.height / 2, // posição x, y no canvas
          frameWidth,
          lumberjackImage.height // largura e altura no canvas
        );
        context.restore();
      }

      if (workerImage.complete) {
        context.save();
        context.translate(1050 + xPosWorker, 250); // Adicione xPosWorker à posição x

        let frameX = (currentFrameWorker % 3) * frameWidthWorker;
        let frameY = 0; // Use sempre a linha superior da imagem

        context.drawImage(
          workerImage,
          frameX,
          frameY,
          frameWidthWorker,
          frameHeightWorker,
          -frameWidthWorker / 2,
          -frameHeightWorker / 2,
          frameWidthWorker,
          frameHeightWorker
        );

        // Incrementa currentFrameWorker apenas quando o contador atinge o valor de 'speed'
        if (counter >= speed) {
          currentFrameWorker = (currentFrameWorker + 1) % 3; // Limita currentFrameWorker a 0, 1, 2
          counter = 0;
          xPosWorker += 5; // Move o trabalhador 5 pixels para a direita a cada frame
        } else {
          counter++;
        }

        context.restore();
      }

      smokes.forEach((smoke, index) => {
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
        // Diminui a frequência de geração de fumaça
        smokes.push({
          x: 400,
          y: 340,
          opacity: 1,
        });
      }

      drawRippleEffects();

      // Atualiza a posição das ondulações
      animateRipples();

      rotation += 0.01;

      context.restore();
      requestAnimationFrame(animate);

      if (mouseOverBuilding) {
        updateCustomCursor(true);
      } else {
        updateCustomCursor(false);
      }
    }

    animate();

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      clearInterval(frameInterval); // Limpe o intervalo quando o componente for desmontado
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
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Building Details</DialogTitle>
            <DialogDescription>
              Here are the details of the selected building.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Adicionar o nível atual */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="currentLevel" className="text-right">
                Current Level
              </Label>
              <Input
                id="currentLevel"
                value={selectedBuilding ? selectedBuilding.level : ""}
                className="col-span-3"
                readOnly
              />
            </div>
            {/* Adicionar os benefícios do próximo nível */}
            {selectedBuilding && selectedBuilding.level < 3 && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nextLevelBenefits" className="text-right">
                  Next Level Benefits
                </Label>
                <Input
                  id="nextLevelBenefits"
                  value={getBenefitsForNextLevel(selectedBuilding)}
                  className="col-span-3"
                  readOnly
                />
              </div>
            )}
            {/* Adicionar Building ID e Building Position */}
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

            {/* Adicionar Evolution Cost e Evolution Time */}
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

            {/* Adicionar Building Timer se estiver em progresso */}
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
