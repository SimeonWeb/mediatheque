export type PlaceholderProps = {
	rowIndex: number
	index: number
}

export const Placeholder = ({ rowIndex, index }: PlaceholderProps) => {
	const random = String(
		5
		+rowIndex%2+rowIndex%3+rowIndex%4+rowIndex%5+rowIndex%6+rowIndex%7+rowIndex%8+rowIndex%9+rowIndex%10
		+index%2+index%3+index%4+index%5+index%6+index%7+index%8+index%9+index%10
	)
	const ratio = Number(random[random.length-1])/10

	return (
		<span
			className="inline-block bg-current h-[.85em] rounded-xs animate-pulse"
			style={{ width: `${30 + ratio * 30}%` }}
		/>
	)
}
