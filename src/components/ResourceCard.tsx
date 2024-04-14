import React from 'react';

export function ResourceCard({ image, quantity }) {
	return (
		<div
			style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}
		>
			<img
				src={image}
				alt='Resource'
				style={{ width: '30px', marginRight: '10px' }}
			/>
			<span>{quantity}</span>
		</div>
	);
}
