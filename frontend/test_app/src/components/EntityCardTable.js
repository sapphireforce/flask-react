import {
  Card,
  CardHeader,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  TableContainer,
  Paper,
  Chip,
} from "@mui/material";

export default function EntityCardTable({
  title,
  columns,
  rows,
  actions,
  loading,
}) {
  return (
    <Card
      elevation={8}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        background: "#2A2A2A",
        border: "1px solid #DA48FE",
        boxShadow: "0 0 30px rgba(218, 72, 254, 0.3)",
        color: "#FFFFFF",
      }}
    >
      <CardHeader
        title={
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: "bold",
              color: "#DA48FE",
              textShadow: "0 0 10px #DA48FE",
            }}
          >
            {title}
          </Typography>
        }
        action={actions}
        sx={{
          backgroundColor: "#1A1A1A",
          borderBottom: "2px solid #DA48FE",
          "& .MuiCardHeader-action": {
            "& button": {
              color: "#FFFFFF",
              borderColor: "#DA48FE",
              backgroundColor: "transparent",
              "&:hover": {
                backgroundColor: "rgba(218, 72, 254, 0.1)",
                borderColor: "#DA48FE",
                transform: "translateY(-2px)",
                boxShadow: "0 0 15px rgba(218, 72, 254, 0.4)",
              },
              "&.MuiButton-contained": {
                backgroundColor: "#DA48FE",
                color: "#FFFFFF",
                "&:hover": {
                  backgroundColor: "#B03EE6",
                  boxShadow: "0 0 20px rgba(218, 72, 254, 0.6)",
                },
              },
              transition: "all 0.3s ease",
            },
          },
        }}
      />

      <TableContainer
        component={Paper}
        sx={{
          maxHeight: 500,
          backgroundColor: "#1A1A1A",
          "&::-webkit-scrollbar": {
            width: "10px",
            height: "10px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "rgba(218, 72, 254, 0.1)",
            borderRadius: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#DA48FE",
            borderRadius: "6px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#B03EE6",
          },
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.field}
                  sx={{
                    backgroundColor: "#2A2A2A",
                    color: "#DA48FE",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    borderBottom: "2px solid #DA48FE",
                    textAlign: "center",
                  }}
                >
                  {col.headerName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  align="center"
                  sx={{
                    backgroundColor: "#1A1A1A",
                    color: "#FFFFFF",
                    py: 4,
                    fontSize: "1.1rem",
                  }}
                >
                  <Typography sx={{ color: "#DA48FE" }}>
                    불러오는 중...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  align="center"
                  sx={{
                    backgroundColor: "#1A1A1A",
                    color: "#FFFFFF",
                    py: 4,
                    fontSize: "1.1rem",
                  }}
                >
                  <Typography sx={{ color: "#DA48FE" }}>
                    등록된 데이터가 없습니다.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, idx) => (
                <TableRow
                  key={row.id}
                  sx={{
                    backgroundColor: idx % 2 === 0 ? "#2A2A2A" : "#1F1F1F",
                    "&:hover": {
                      backgroundColor: "#3A3A3A !important",
                      transform: "scale(1.01)",
                      transition: "all 0.2s ease",
                      boxShadow: "0 0 15px rgba(218, 72, 254, 0.2)",
                    },
                    cursor: "pointer",
                    borderBottom: "1px solid rgba(218, 72, 254, 0.2)",
                  }}
                >
                  {columns.map((col) => (
                    <TableCell
                      key={col.field}
                      sx={{
                        color: "#FFFFFF",
                        borderBottom: "1px solid rgba(218, 72, 254, 0.2)",
                        textAlign: "center",
                        py: 2,
                        fontSize: "0.9rem",
                      }}
                    >
                      {typeof col.renderCell === "function" ? (
                        col.renderCell(row, idx)
                      ) : col.field === "character_level" ||
                        col.field === "character_class_level" ? (
                        <Chip
                          label={row[col.field]}
                          size="small"
                          sx={{
                            fontWeight: "bold",
                            backgroundColor: "#DA48FE",
                            color: "#FFFFFF",
                            boxShadow: "0 0 10px rgba(218, 72, 254, 0.4)",
                          }}
                        />
                      ) : col.field === "character_exp_rate" ? (
                        <Chip
                          label={`${row[col.field]}%`}
                          size="small"
                          sx={{
                            fontWeight: "bold",
                            backgroundColor: "#B03EE6",
                            color: "#FFFFFF",
                            boxShadow: "0 0 10px rgba(176, 62, 230, 0.4)",
                          }}
                        />
                      ) : (
                        row[col.field]
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
