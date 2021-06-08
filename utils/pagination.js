import { useState, useCallback, useMemo, useReducer } from 'react'

export const getPreviousEnabled = (currentPage) => currentPage > 0;

export const getNextEnabled = (currentPage, totalPages) => currentPage + 1 < totalPages;

export const getTotalPages = (totalItems, pageSize) => Math.ceil(totalItems / pageSize);

export const getStartIndex = (pageSize, currentPage) => pageSize * currentPage;

export const getEndIndex = (pageSize, currentPage, totalItems) => {
  const lastPageEndIndex = pageSize * (currentPage + 1);

  if (lastPageEndIndex > totalItems) {
    return totalItems - 1;
  }

  return lastPageEndIndex - 1;
};

export const getPaginationState = ({
  totalItems,
  pageSize,
  currentPage,
}) => {
  const totalPages = getTotalPages(totalItems, pageSize);
  return {
    totalPages,
    startIndex: getStartIndex(pageSize, currentPage),
    endIndex: getEndIndex(pageSize, currentPage, totalItems),
    previousEnabled: getPreviousEnabled(currentPage),
    nextEnabled: getNextEnabled(currentPage, totalPages),
  };
};

// Action type
// { type: "SET", page: number }
// { type: "NEXT" | "PREV" }
export function usePagination({
  totalItems = 0,
  initialPage = 0,
  initialPageSize = 0,
} = {}) {
  const [pageSize, setPageSize] = useState(initialPageSize);

  const [currentPage, dispatch] = useReducer(
    (state = initialPage, action = {}) => {
      switch (action.type) {
        case "SET":
          return action.page;
        case "NEXT":
          if (!getNextEnabled(state, getTotalPages(totalItems, pageSize))) {
            return state;
          }
          return state + 1;
        case "PREV":
          if (!getPreviousEnabled(state)) {
            return state;
          }
          return state - 1;
        default:
          return state;
      }
    },
    initialPage
  );

  const setPage = useCallback(
    (page) => {
      dispatch({
        type: "SET",
        page,
      });
    },
    [dispatch]
  )
  const setNextPage = useCallback(() => {
    dispatch({ type: "NEXT" });
  }, [dispatch])
  const setPreviousPage = useCallback(() => {
    dispatch({ type: "PREV" });
  }, [dispatch])
  const resetPageSize = useCallback(
    (pageSize, nextPage = 0) => {
      setPageSize(pageSize);
      dispatch({ type: "SET", page: nextPage });
    },
    [setPageSize]
  )
  
  const paginationState = useMemo(
    () => getPaginationState({ totalItems, pageSize, currentPage }),
    [totalItems, pageSize, currentPage]
  )

  const pagination = useMemo(
    () => ({
      setNextPage,
      setPreviousPage,
      setPage,
      resetPageSize,
      currentPage,
      pageSize,
      totalItems,
      ...paginationState,
    }),
    [paginationState]
  )

  return pagination;
}

function Pagination({
  children,
  totalItems = 0,
  initialPage = 0,
  initialPageSize,
}) {
  return children(usePagination({ totalItems, initialPage, initialPageSize }));
}

Pagination.displayName = "Pagination";

export default Pagination;