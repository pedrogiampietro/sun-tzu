import React, { useEffect, useRef } from 'react';

export function Village() {
	const canvasRef = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current;
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
		let smokes = [];

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

		function animate() {
			context.clearRect(0, 0, canvas.width, canvas.height);

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
			requestAnimationFrame(animate);
		}

		animate();

		return () => {
			smokes = [];
		};
	}, []);

	useEffect(() => {
		const resizeCanvas = () => {
			const canvas = canvasRef.current;
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};

		resizeCanvas();
		window.addEventListener('resize', resizeCanvas);

		return () => {
			window.removeEventListener('resize', resizeCanvas);
		};
	}, []);

	return <canvas ref={canvasRef} />;
}
