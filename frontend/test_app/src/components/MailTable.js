import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";

export default function MailTable({ mails, onRead, onDelete }) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>상태</TableCell>
          <TableCell>구분</TableCell>
          <TableCell>제목</TableCell>
          <TableCell>내용</TableCell>
          <TableCell>수신자</TableCell>
          <TableCell>관리</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {!mails || mails.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} align="center">
              받은 메일이 없습니다.
            </TableCell>
          </TableRow>
        ) : (
          mails.map((mail) => (
            <TableRow key={mail.id}>
              <TableCell>{mail.status === "unread" ? "📧" : "📭"}</TableCell>
              <TableCell>{mail.type === "notice" ? "공지" : "일반"}</TableCell>
              <TableCell>{mail.title}</TableCell>
              <TableCell>{mail.content}</TableCell>
              <TableCell>
                {mail.receiver === "ALL" ? "전체" : mail.receiver}
              </TableCell>
              <TableCell>
                {mail.status === "unread" && (
                  <Button size="small" onClick={() => onRead(mail.id, "read")}>
                    읽음처리
                  </Button>
                )}
                <Button size="small" onClick={() => onDelete(mail.id)}>
                  삭제
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
