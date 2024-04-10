import React, { useEffect, useRef, useState } from 'react';
import {
	ReactZoomPanPinchRef,
	TransformComponent,
	TransformWrapper,
} from 'react-zoom-pan-pinch';

export function Village() {
	const canvasRef = useRef(null);
	const [scale, setScale] = useState(1.2);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

	let wasRealPanning = false;
	const onPanningStart = (
		ref: ReactZoomPanPinchRef,
		event: TouchEvent | MouseEvent
	) => {
		wasRealPanning = false;
	};
	const onPanning = (
		ref: ReactZoomPanPinchRef,
		event: TouchEvent | MouseEvent
	) => {
		wasRealPanning = true;
	};

	const onTransformed = (
		ref: ReactZoomPanPinchRef,
		state: {
			scale: number;
			positionX: number;
			positionY: number;
		}
	) => {};

	useEffect(() => {
		const canvas = canvasRef.current;
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
			{ src: 'buildings/building1.png', x: 880, y: 150 },
			{ src: 'buildings/building2.png', x: 1220, y: 170 },
			{ src: 'buildings/building3.png', x: 1520, y: 150 },
			{ src: 'buildings/building4.png', x: 1600, y: 490 },
			{ src: 'buildings/building5.png', x: 500, y: 500 },
			{ src: 'buildings/building6.png', x: 1150, y: 450 },
			{ src: 'buildings/building7.png', x: 1030, y: 760 },
			{ src: 'buildings/building8.png', x: 1340, y: 560 },
			{ src: 'buildings/building9.png', x: 350, y: 380 },
			{ src: 'buildings/building10.png', x: 1200, y: 700 },
			{ src: 'buildings/building11.png', x: 870, y: 450 },
			{ src: 'buildings/building12.png', x: 1300, y: 300 },
			{ src: 'buildings/building13.png', x: 500, y: 200 },
			{ src: 'buildings/building14.png', x: 830, y: 650 },
			{ src: 'buildings/building15.png', x: 840, y: 330 },
		];
		const buildings = buildingImages.map((building) => {
			const img = new Image();
			img.src = building.src;
			return { ...building, img };
		});

		const aircraftImage = new Image();
		aircraftImage.src = '/effects/farmBlade.png';

		const smokeImage = new Image();
		smokeImage.src = '/effects/smoke.png';
		let smokes = [] as any;

		const rippleImage = new Image();
		rippleImage.src = '/effects/ripple.png';

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

		canvas.addEventListener('mousemove', handleMouseMove);

		function handleMouseMove(event) {
			const rect = canvas.getBoundingClientRect();
			const x =
				((event.clientX - rect.left) / (rect.right - rect.left)) * canvas.width;
			const y =
				((event.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height;
			setMousePosition({ x, y });
		}

		function isMouseOverBuilding(building) {
			const scaledMouseX = mousePosition.x / scale - position.x;
			const scaledMouseY = mousePosition.y / scale - position.y;

			const buildingWidth = building.img.width;
			const buildingHeight = building.img.height;

			return (
				scaledMouseX >= building.x &&
				scaledMouseX <= building.x + buildingWidth &&
				scaledMouseY >= building.y &&
				scaledMouseY <= building.y + buildingHeight
			);
		}

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

			buildings.forEach((building) => {
				if (building.img.complete) {
					context.drawImage(building.img, building.x, building.y);

					// Se o mouse estiver sobre um prédio, desenhe um destaque
					if (isMouseOverBuilding(building)) {
						context.strokeStyle = 'red';
						context.strokeRect(
							building.x,
							building.y,
							building.img.width,
							building.img.height
						);
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
		}

		animate();

		return () => {
			canvas.removeEventListener('mousemove', handleMouseMove);
		};
	}, [mousePosition]);

	return (
		<TransformWrapper
			centerOnInit={true}
			centerZoomedOut={true}
			smooth={false}
			onPanningStart={onPanningStart}
			onPanning={onPanning}
			onTransformed={onTransformed}
			wheel={{ step: 0.25 }}
			minScale={0.5} // Ajuste o limite mínimo de zoom
			maxScale={3} // Ajuste o limite máximo de zoom
		>
			<TransformComponent wrapperStyle={{ width: '100vw', height: '100vh' }}>
				<canvas ref={canvasRef} />
			</TransformComponent>
		</TransformWrapper>
	);
}
