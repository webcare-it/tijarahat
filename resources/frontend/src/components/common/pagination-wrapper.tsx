import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { cn } from '@/lib/utils';

export interface PaginationDataType {
  current_page: number;
  from: number;
  last_page: number;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  path: string;
  per_page: number;
  to: number;
  total: number;
}

interface PaginationWrapperProps {
  paginationData: PaginationDataType;
  onPageChange: (page: number) => void;
  className?: string;
}

export const PaginationWrapper = ({ paginationData, onPageChange, className = 'mb-10 mt-10 md:mb-20 container mx-auto' }: PaginationWrapperProps) => {
  const { current_page, last_page } = paginationData;

  const handlePageClick = (page: number) => {
    if (page !== current_page && page >= 1 && page <= last_page) {
      onPageChange(page);
    }
  };

  const generatePaginationLinks = () => {
    const paginationItems = [];

    if (last_page <= 5) {
      for (let i = 1; i <= last_page; i++) {
        paginationItems.push({
          page: i,
          label: i?.toString(),
          active: current_page === i,
        });
      }
    } else if (last_page >= 6 && last_page <= 20) {
      if (current_page <= 3) {
        for (let i = 1; i <= 3; i++) {
          paginationItems.push({
            page: i,
            label: i?.toString(),
            active: current_page === i,
          });
        }

        if (last_page > 4) {
          paginationItems.push({
            page: null,
            label: '...',
            active: false,
          });
        }

        if (last_page > 3) {
          paginationItems.push({
            page: last_page - 1,
            label: (last_page - 1)?.toString(),
            active: current_page === last_page - 1,
          });
        }

        paginationItems.push({
          page: last_page,
          label: last_page?.toString(),
          active: current_page === last_page,
        });
      } else if (current_page >= last_page - 2) {
        paginationItems.push({
          page: 1,
          label: '1'.toString(),
          active: current_page === 1,
        });

        if (last_page > 4) {
          paginationItems.push({
            page: null,
            label: '...',
            active: false,
          });
        }

        for (let i = last_page - 2; i <= last_page; i++) {
          paginationItems.push({
            page: i,
            label: i?.toString(),
            active: current_page === i,
          });
        }
      } else {
        paginationItems.push({
          page: 1,
          label: '1',
          active: current_page === 1,
        });

        paginationItems.push({
          page: null,
          label: '...',
          active: false,
        });

        for (let i = current_page - 1; i <= current_page + 1; i++) {
          paginationItems.push({
            page: i,
            label: i.toString(),
            active: current_page === i,
          });
        }

        paginationItems.push({
          page: null,
          label: '...',
          active: false,
        });

        paginationItems.push({
          page: last_page,
          label: last_page?.toString(),
          active: current_page === last_page,
        });
      }
    } else {
      const delta = 2;

      if (last_page > 0) {
        paginationItems.push({
          page: 1,
          label: '1',
          active: current_page === 1,
        });
      }

      if (current_page > 4) {
        paginationItems.push({
          page: null,
          label: '...',
          active: false,
        });
      }

      for (let i = Math.max(2, current_page - delta); i <= Math.min(last_page - 1, current_page + delta); i++) {
        if (i !== 1 && i !== last_page && i !== 2) {
          paginationItems.push({
            page: i,
            label: i?.toString(),
            active: current_page === i,
          });
        }
      }

      if (current_page < last_page - 3) {
        paginationItems.push({
          page: null,
          label: '...',
          active: false,
        });
      }

      if (last_page > 1) {
        paginationItems.push({
          page: last_page,
          label: last_page?.toString(),
          active: current_page === last_page,
        });
      }
    }

    return paginationItems;
  };

  const paginationItems = generatePaginationLinks();

  return (
    <section className={className}>
      <Pagination>
        <PaginationContent className={cn('flex items-center flex-wrap px-4')}>
          <PaginationItem>
            <PaginationPrevious
              onClick={(e) => {
                e.preventDefault();
                if (current_page > 1) {
                  handlePageClick(current_page - 1);
                }
              }}
              className={current_page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>

          {paginationItems?.map((item, index) => {
            if (item.page === null) {
              return (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            } else {
              return (
                <PaginationItem key={item.page}>
                  <PaginationLink
                    isActive={item.active}
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageClick(item.page!);
                    }}
                    className="cursor-pointer">
                    {item.label}
                  </PaginationLink>
                </PaginationItem>
              );
            }
          })}

          <PaginationItem>
            <PaginationNext
              onClick={(e) => {
                e.preventDefault();
                if (current_page < last_page) {
                  handlePageClick(current_page + 1);
                }
              }}
              className={current_page >= last_page ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </section>
  );
};
