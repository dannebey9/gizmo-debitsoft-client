import { Button, ButtonGroup } from "@material-ui/core"

type PaginationProps = {
  count: number
  page: number
  siblingCount?: number
  boundaryCount?: number
  onChange: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, value: number) => void
}

const Pagination = ({
  count,
  page,
  onChange,
  siblingCount = 1,
  boundaryCount = 1,
}: PaginationProps) => {
  const range = (start: number, end: number) => {
    const length = end - start + 1
    return Array.from({ length }, (_, i) => start + i)
  }

  const startPages = range(1, Math.min(boundaryCount, count))
  const endPages = range(Math.max(count - boundaryCount + 1, boundaryCount + 1), count)

  const siblingsStart = Math.max(
    Math.min(page - siblingCount, count - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2
  )

  const siblingsEnd = Math.min(
    Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
    endPages[0] ?? 0 - 2
  )

  const siblingPages = range(siblingsStart, siblingsEnd)

  const buttonPages = [
    ...startPages,
    ...(siblingsStart > boundaryCount + 2
      ? ["start-ellipsis"]
      : boundaryCount + 1 < count - boundaryCount
      ? [boundaryCount + 1]
      : []),
    ...siblingPages,
    ...(siblingsEnd < count - boundaryCount - 1
      ? ["end-ellipsis"]
      : count - boundaryCount > boundaryCount
      ? [count - boundaryCount]
      : []),
    ...endPages,
  ]

  return (
    <ButtonGroup>
      <Button
        color="secondary"
        onClick={(event) => onChange(event, Math.max(1, page - 1))}
        disabled={page === 1}
      >
        {"<"}
      </Button>

      {buttonPages.map((pageNumber, idx) => {
        if (pageNumber === "start-ellipsis" || pageNumber === "end-ellipsis") {
          return (
            <Button key={idx} disabled>
              {"..."}
            </Button>
          )
        }

        return (
          <Button
            key={idx}
            color={pageNumber === page ? "primary" : "secondary"}
            onClick={(event) => {
              if (typeof pageNumber === "number") onChange(event, pageNumber)
            }}
          >
            {pageNumber}
          </Button>
        )
      })}

      <Button
        color="secondary"
        onClick={(event) => onChange(event, Math.min(count, page + 1))}
        disabled={page === count}
      >
        {">"}
      </Button>
    </ButtonGroup>
  )
}

export default Pagination
