import { createColumnHelper } from "@tanstack/react-table"

import { Group } from "@/components/Group"
import { getFileUrl } from "@/utils/file"

import type { AudioPlaylistItem } from "../api/types"
import { timeToMinutes } from "@/utils/zod-codecs"

const columnHelper = createColumnHelper<AudioPlaylistItem>()

export type AudioPlaylistColumnProps = {
	playlistPath: string
}

export const getColumns = ({ playlistPath }: AudioPlaylistColumnProps) => [
	columnHelper.accessor("title", {
		header: "Morceau",
		cell: props => (
			<Group className="items-center" size="xl">
				<img src={getFileUrl(`${playlistPath}${props.row.original.artwork}`)} className="size-12 rounded" />
				<div>
					<p className="text-white">{props.getValue()}</p>
					<p className="@3xl:hidden">{props.row.original.artist}</p>
				</div>
			</Group>
		),
		meta: {
			className: "w-1/3",
		},
	}),
	columnHelper.accessor("artist", {
		header: "Artiste",
		cell: props => (
			<p>{props.getValue()}</p>
		),
		meta: {
			className: "w-1/3",
			responsiveClassName: "hidden",
		},
	}),
	columnHelper.accessor("album", {
		header: "Album",
		cell: props => (
			<p>{props.getValue()}</p>
		),
		meta: {
			className: "w-1/3",
			responsiveClassName: "hidden",
		},
	}),
	columnHelper.accessor("duration", {
		header: "Durée",
		cell: props => (
			<p className="w-9 text-right">{timeToMinutes.encode(Math.floor(props.getValue()/1000))}</p>
		),
		meta: {
			className: "table-cell w-12",
			responsiveClassName: "hidden",
		},
	}),
]
