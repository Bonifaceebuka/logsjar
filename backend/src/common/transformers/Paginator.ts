import { IPaginator } from "@common/types/IPagination";

export function paginator({
  data,
  total,
  currentPage,
  perPage,
}: IPaginator) {
  const lastPage = Math.ceil(total / perPage);
  const from = total === 0 ? null : (currentPage - 1) * perPage + 1;
  const to = total === 0 ? null : Math.min(currentPage * perPage, total);

  return {
    current_page: currentPage,
    data,
    from,
    last_page: lastPage,
    per_page: perPage,
    to,
    total,
  };
}
