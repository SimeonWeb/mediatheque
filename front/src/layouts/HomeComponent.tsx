export const HomeComponent = () => {
	return (
		<>
			<div className="flex flex-col justify-between grow px-[6vw] pb-[3vw] is-horizontal:hidden">
				<span className="grow max-h-[15vh]" />
				<img
					src="/assets/visuel-vertical-2.svg"
					className="w-full translate-0 starting:translate-y-2 starting:opacity-0 transition duration-500"
				/>
				<div>
					<img
						src="/assets/visuel-vertical-1.svg"
						className="w-full translate-0 starting:translate-y-4 starting:opacity-0 transition duration-600 delay-100"
					/>
					<div
						className="flex justify-between w-full pt-[2vw] translate-0 starting:translate-y-4 starting:opacity-0 transition duration-800 delay-300"
					>
						<h1 className="w-[55%]">
							<img src="/assets/mariesimon.svg" className="block w-full" alt="Marie • Simon" />
						</h1>
						<img src="/assets/date.svg" className="block w-1/3" alt="11.07.2026" />
					</div>
				</div>
			</div>

			<div className="flex flex-col justify-between grow p-[2.5vw] pl-0 is-vertical:hidden">
				<span className="grow max-h-[20vh]" />
				<img
					src="/assets/visuel-horizontal-2.svg"
					className="w-full translate-0 starting:translate-y-4 starting:opacity-0 transition duration-500"
				/>
				<img
					src="/assets/visuel-horizontal-1.svg"
					className="w-full translate-0 starting:translate-y-8 starting:opacity-0 transition duration-600 delay-100"
				/>
			</div>
		</>
	)
}
