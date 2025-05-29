import EntityCardTable from "./EntityCardTable";

export default function GuildTable({ columns, rows, actions, loading }) {
  return (
    <EntityCardTable
      title="길드 대시보드"
      columns={columns}
      rows={rows}
      actions={actions}
      loading={loading}
    />
  );
}
