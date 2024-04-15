import { useEffect, useRef, useState } from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { CharacterStatus } from './CharacterStatus'; // Importe o componente CharacterStatus
import { Button } from './ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';

export function Village({ characterStatus }: any) {
	const canvasRef = useRef(null);
	const statusContainerRef = useRef(null); // Referência para o contêiner da barra de status
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

	function evolveBuilding() {
		if (selectedBuilding) {
			const { evolutionCost } = selectedBuilding;
			const updatedResources = { ...characterStatus.resources };

			// Verifica se possui recursos suficientes para evoluir
			const canEvolve = Object.entries(evolutionCost).every(
				([resource, cost]) =>
					updatedResources[resource] &&
					updatedResources[resource].amount >= cost
			);

			if (canEvolve) {
				// Subtrai os recursos necessários do estado do personagem
				Object.entries(evolutionCost).forEach(([resource, cost]) => {
					if (updatedResources[resource]) {
						updatedResources[resource].amount -= cost;
					}
				});

				// Atualiza o nível da construção
				selectedBuilding.level++;

				// Atualiza o estado do personagem com os recursos atualizados
				setCharacterStatus({
					...characterStatus,
					resources: updatedResources,
				});

				// Fecha o modal
				setIsModalOpen(false);
			} else {
				alert('You do not have enough resources to evolve this building.');
			}
		}
	}

	useEffect(() => {
		const canvas = canvasRef.current as any;
		canvas.width = 3840;
		canvas.height = 2160;

		const context = canvas.getContext('2d');
		let rotation = 0;

		const cityImage = new Image();
		cityImage.src = '/cityBackground.jpg';
		cityImage.onload = animate;
		cityImage.onerror = () => {
			console.error('Erro ao carregar a imagem da cidade.');
		};

		const groundImage = new Image();
		groundImage.src = '/grounds/ground.jpg';
		groundImage.onload = () => {
			const pattern = context.createPattern(groundImage, 'repeat');
			context.fillStyle = pattern;
			context.fillRect(0, 0, canvas.width, canvas.height);
		};

		const buildingImages = [
			{
				id: 1,
				src: 'buildings/building1.png',
				x: 880,
				y: 150,
				level: 1,
				evolutionCost: {
					wood: 100,
					iron: 50,
					// Adicione outros recursos necessários para evolução
				},
				evolutionTime: 60, // Tempo em segundos
			},
			{
				id: 2,
				src: 'buildings/building2.png',
				x: 1220,
				y: 170,
				level: 1,
				evolutionCost: {
					wood: 150,
					stone: 100,
					// Adicione outros recursos necessários para evolução
				},
				evolutionTime: 90, // Tempo em segundos
			},
		];

		const buildings = buildingImages.map((building) => {
			const img = new Image();
			img.src = building.src;
			return { ...building, img };
		});

		canvas.addEventListener('mousemove', handleMouseMove);

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

		canvas.addEventListener('mousedown', (event: any) => {
			dragStart = { x: event.clientX, y: event.clientY };
		});

		canvas.addEventListener('mouseup', (event: any) => {
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
				const pattern = context.createPattern(groundImage, 'repeat');
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
						context.strokeStyle = 'red';
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
			canvas.removeEventListener('mousemove', handleMouseMove);
		};
	}, [mousePosition]);

	return (
		<>
			<div style={{ position: 'relative' }}>
				<TransformWrapper
					doubleClick={{ disabled: true }}
					panning={{ excluded: ['input', 'textarea'] }}
					centerOnInit={false}
					minScale={0.5}
				>
					<TransformComponent
						wrapperStyle={{
							height: '100vh',
							width: '100vw',
						}}
						contentStyle={{
							boxSizing: 'border-box',
						}}
					>
						<canvas ref={canvasRef} />
					</TransformComponent>
				</TransformWrapper>
				<div
					ref={statusContainerRef}
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						padding: '20px',
						boxSizing: 'border-box',
					}}
				>
					<CharacterStatus characterStatus={characterStatus} />
				</div>
			</div>
			<Dialog open={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
				<DialogContent className='sm:max-w-[425px]'>
					<DialogHeader>
						<DialogTitle>Building Details</DialogTitle>
						<DialogDescription>
							Here are the details of the selected building.
						</DialogDescription>
					</DialogHeader>
					<div className='grid gap-4 py-4'>
						<div className='grid grid-cols-4 items-center gap-4'>
							<Label htmlFor='name' className='text-right'>
								Building ID
							</Label>
							<Input
								id='name'
								value={selectedBuilding ? selectedBuilding.id : ''}
								className='col-span-3'
								readOnly
							/>
						</div>
						<div className='grid grid-cols-4 items-center gap-4'>
							<Label htmlFor='username' className='text-right'>
								Building Position
							</Label>
							<Input
								id='username'
								value={
									selectedBuilding
										? `x: ${selectedBuilding.x}, y: ${selectedBuilding.y}`
										: ''
								}
								className='col-span-3'
								readOnly
							/>
						</div>
						{selectedBuilding && (
							<>
								<div className='grid grid-cols-4 items-center gap-4'>
									<Label htmlFor='evolutionCost' className='text-right'>
										Evolution Cost
									</Label>
									<div className='col-span-3'>
										{Object.entries(selectedBuilding.evolutionCost).map(
											([resource, cost]) => (
												<div key={resource}>
													{resource}: {cost}
												</div>
											)
										)}
									</div>
								</div>
								<div className='grid grid-cols-4 items-center gap-4'>
									<Label htmlFor='evolutionTime' className='text-right'>
										Evolution Time
									</Label>
									<Input
										id='evolutionTime'
										value={`${selectedBuilding.evolutionTime} seconds`}
										className='col-span-3'
										readOnly
									/>
								</div>
							</>
						)}
					</div>
					<DialogFooter>
						<Button type='button' onClick={evolveBuilding}>
							Evolve Building
						</Button>
						<Button type='button' onClick={() => setIsModalOpen(false)}>
							Close
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
