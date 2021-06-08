import styled from 'styled-components'

const PaginationWrapper = styled.div`
  display: flex;
  .page-item {
    font-size: 14px;
    line-height: 21px;
    font-weight: bold;
    color: var(--color-black);
    &.active {
      color: var(--color-red2);
    }
    padding: 5px;
    img {
      height: 13px;
    }
  }
  .prev {
    img {
      transform: rotate(180deg);
    }
  }
`

export default function Pagination({
  currentPage,
  totalPages,
  setPage,
  setNextPage,
  setPreviousPage,
  nextEnabled,
  previousEnabled,
  className = ''
}) {
  const startPage = Math.max(0, currentPage - 2)
  const endPage = Math.min(totalPages - 1, currentPage + 2)
  const pages = Array(endPage - startPage + 1).fill().map((_, idx) => startPage + idx)
  return (
    <PaginationWrapper className={className}>
      <span className="page-item prev" onClick={() => previousEnabled && setPreviousPage()}>
        <img src="/assets/arrow-point-to-right.svg" alt="Prev Page" className="cursor" />
      </span>
      {pages.map(page => (
        <span key={page} className={`page-item cursor${page === currentPage ? ' active' : ''}`} onClick={() => setPage(page)}>{page + 1}</span>
      ))}
      <span className="page-item next" onClick={() => nextEnabled && setNextPage()}>
        <img src="/assets/arrow-point-to-right.svg" alt="Next page" className="cursor" />
      </span>
    </PaginationWrapper>
  )
}