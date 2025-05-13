'use client'

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowUpDown, ChevronDown, MoreHorizontal, Trophy } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@workspace/ui/components/tooltip'
import { Input } from '@workspace/ui/components/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table'
import { useState, useEffect } from 'react'
import { TableData } from './types.ts'
import { formatDistanceToNow } from 'date-fns'
import { useHotkeys } from 'react-hotkeys-hook'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu.tsx'

export function LeaderboardBody({ tableData, isSkillBased }: LeaderboardProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [isMounted, setIsMounted] = useState(false)
  const [resultsPerPage, setResultsPerPage] = useState(20)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const columns: ColumnDef<TableData>[] = [
    {
      accessorKey: 'placement',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="text-center"
          >
            Placement
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => {
        const formattedPlacement = parseInt(row.getValue('placement')) + 1
        let placeColor: 'gold' | 'silver' | 'brown' | '' = ''
        if (formattedPlacement >= 1 && formattedPlacement <= 3) {
          switch (formattedPlacement) {
            case 1:
              placeColor = 'gold'
              break
            case 2:
              placeColor = 'silver'
              break
            case 3:
              placeColor = 'brown'
              break
            default:
              break
          }
        }
        return (
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
              formattedPlacement === 1
                ? 'bg-yellow-500 text-black'
                : formattedPlacement === 2
                  ? 'bg-gray-400 text-black'
                  : formattedPlacement === 3
                    ? 'bg-amber-700 text-white'
                    : ''
            }`}
          >
            <p className="text-center">{formattedPlacement}</p>
          </div>
        )
      },
    },
    {
      accessorKey: 'playerName',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="text-center"
          >
            Player Name
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="text-center">{row.getValue('playerName')}</div>
      ),
    },
    {
      accessorKey: 'endingNum',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="text-center"
          >
            Total Gained
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('endingNum'))
        const prefix = amount > 0 ? '+' : ''
        const appendix = isSkillBased ? (amount > 10000 ? 'k' : '') : ' kills'
        const formatted = `${prefix}${amount > 10000 ? (amount / 1000).toFixed(0) : amount.toLocaleString()}${appendix}`

        return (
          <div className="text-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p
                    className={`text-center ${amount > 0 ? 'text-green-500' : ''}`}
                  >
                    {formatted}
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="flex flex-row gap-x-0.5">
                    <p>{amount.toLocaleString()}</p>
                    <p>{isSkillBased ? 'xp' : 'kills'}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )
      },
    },
    {
      accessorKey: 'lastUpdatedAtStr',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="text-center"
          >
            Last Updated
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => {
        const lastUpdated: string = row.getValue('lastUpdatedAtStr')

        if (!isMounted) {
          return <div className="text-center">Loading...</div>
        }
        const dateToFormat = new Date(lastUpdated)
        const formatted = formatDistanceToNow(dateToFormat, {
          addSuffix: true,
        })

        return <div className="text-center">{formatted}</div>
      },
    },
  ]

  const table = useReactTable({
    data: tableData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  })

  // Hotkeys to switch pages
  useHotkeys('right', () => {
    if (table.getCanNextPage()) {
      table.nextPage()
    }
  })

  useHotkeys('left', () => {
    if (table.getCanPreviousPage()) {
      table.previousPage()
    }
  })

  function onPageSizeChange(newSize: number) {
    setResultsPerPage(newSize)
    table.setPageSize(newSize)
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter Players..."
          value={
            (table.getColumn('playerName')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('playerName')?.setFilterValue(event.target.value)
          }
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex flex-row items-center gap-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Results per page: {resultsPerPage}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => onPageSizeChange(20)}>
                  20
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onPageSizeChange(50)}>
                  50
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onPageSizeChange(100)}>
                  100
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <p className="text-muted-foreground flex-1 text-sm">
            {table.getFilteredRowModel().rows.length} row(s) total.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

type LeaderboardProps = {
  tableData: TableData[]
  isSkillBased: boolean
}
