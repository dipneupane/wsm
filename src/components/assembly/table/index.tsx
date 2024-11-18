import { AssemblyGetAllType } from '@/types/assembly';

import DataTable from '@/components/generic-table/generic-table';

import { columns } from './column';

interface IUsersTableProps {
  data: AssemblyGetAllType[] | any;
}

export default function AssemblyTable({ data }: IUsersTableProps) {
  return (
    <DataTable<AssemblyGetAllType>
      data={data}
      columns={columns}
      searchFields={[{ column: 'code', label: 'Code' }]}
    />
  );
}
