const priceFormatter = new Intl.NumberFormat('en',{
	minimumFractionDigits:2,
	maximumFractionDigits:2
});

export function formatPrice(value){
	const amount = Number(value);
	return priceFormatter.format(Number.isFinite(amount) ? amount : 0);
}