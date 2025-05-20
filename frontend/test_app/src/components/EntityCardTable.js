import { Card, CardHeader, Box, Table, TableHead, TableRow, TableCell, TableBody, Typography } from '@mui/material';

export default function EntityCardTable({ title, columns, rows, actions, loading }) {
  return (
    <Card>
      <CardHeader title={title} action={actions} />
      <Box sx={{ overflowX: 'auto', minHeight: 360 }}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map(col => (
                <TableCell key={col.field}>{col.headerName}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <Typography>불러오는 중...</Typography>
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <Typography color="text.secondary">등록된 데이터가 없습니다.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, idx) => (
                <TableRow key={row.id}>
                  {columns.map(col => (
                    <TableCell key={col.field}>
                      {typeof col.renderCell === 'function'
                        ? col.renderCell(row, idx)
                        : row[col.field]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Box>
    </Card>
  );
}
