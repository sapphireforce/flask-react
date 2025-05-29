import EntityCardTable from "./EntityCardTable";

export default function CharacterTable({ columns, rows, actions, loading }) {
  return (
    <EntityCardTable
      title="캐릭터 대시보드"
      columns={columns}
      rows={rows}
      actions={actions}
      loading={loading}
    />
  );
}
