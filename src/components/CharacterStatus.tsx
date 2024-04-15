import { useState, useEffect, useRef } from 'react';
import { ResourceCard } from './ResourceCard';
import BorderMagicAvatar from '../../public/avatar/border/border-magic.png';

export function CharacterStatus({ characterStatus }: any) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	let modalRef = useRef() as any;

	if (!characterStatus) {
		return null;
	}

	const { resources, avatar, username, email, village, server } =
		characterStatus;

	const handleAvatarClick = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	useEffect(() => {
		function handleClickOutside(event: any) {
			if (modalRef.current && !modalRef.current.contains(event.target)) {
				closeModal();
			}
		}

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<>
			<div style={{ display: 'flex', alignItems: 'center' }}>
				<div
					style={{ position: 'relative', width: '125px', height: '116px' }}
					onClick={handleAvatarClick}
				>
					<img
						src={BorderMagicAvatar} // Imagem de borda circular
						alt='Border'
						style={{
							position: 'absolute',
							width: '100%',
							height: '100%',
							marginTop: '-12px', // Ajuste: movendo a borda para cima
							zIndex: 4, // Ajuste: definindo zIndex
						}}
					/>
					<img
						src={avatar}
						alt='Avatar'
						style={{
							width: '60px',
							height: '60px',
							borderRadius: '50%',
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
							cursor: 'pointer',
							zIndex: 3, // Ajuste: definindo zIndex maior para o avatar
						}}
					/>
				</div>
				<div
					style={{
						backgroundColor: 'rgba(255, 255, 255, 0.7)',
						padding: '10px',
						borderRadius: '10px',
						maxWidth: '100%',
						marginLeft: '10px',
						display: 'flex', // Ajuste: para os recursos ficarem ao lado um do outro
					}}
				>
					<ResourceCard
						image='/public/resources/ironIcon.xs.png'
						quantity={resources.iron.amount}
					/>
					<ResourceCard
						image='/public/resources/foodIcon.xs.png'
						quantity={resources.food.amount}
					/>
					<ResourceCard
						image='/public/resources/goldIcon.xs.png'
						quantity={resources.gold.amount}
					/>
					<ResourceCard
						image='/public/resources/woodIcon.xs.png'
						quantity={resources.wood.amount}
					/>
				</div>
			</div>
			{isModalOpen && (
				<div
					style={{
						position: 'fixed',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
						backgroundColor: 'rgba(0, 0, 0, 0.5)',
						zIndex: 999,
					}}
				>
					<div
						ref={modalRef}
						style={{
							backgroundColor: '#fff',
							padding: '20px',
							borderRadius: '10px',
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
						}}
					>
						<button
							style={{
								position: 'absolute',
								top: '10px',
								right: '10px',
								background: 'none',
								border: 'none',
								cursor: 'pointer',
								fontSize: '20px',
								color: '#333',
							}}
							onClick={closeModal}
						>
							&times;
						</button>
						<h2>User Profile</h2>
						<img
							src={avatar}
							alt='Avatar'
							style={{ width: '100px', height: '100px', borderRadius: '50%' }}
						/>
						<p>Username: {username}</p>
						<p>Email: {email}</p>
						<p>Village: {village}</p>
						<p>Server: {server}</p>
					</div>
				</div>
			)}
		</>
	);
}
