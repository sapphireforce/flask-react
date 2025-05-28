import EntityCardTable from "./EntityCardTable";

export default function RankingTable({ columns, rows, actions, loading }) {
  return (
    <EntityCardTable
      title="랭킹 대시보드"
      columns={columns}
      rows={rows}
      actions={actions}
      loading={loading}
    />
  );
}
