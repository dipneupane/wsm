import { getAllInventoryItems } from '@/services/inventory-item';
import { queryOptions } from '@tanstack/react-query';

import { INVENTORY_QUERY_KEY } from '@/config/query-keys';

function getInvertoryListQueryOption() {
  return queryOptions({
    queryKey: INVENTORY_QUERY_KEY,
    queryFn: () => getAllInventoryItems({ filterText: '', filterParams: [] }),
  });
}
