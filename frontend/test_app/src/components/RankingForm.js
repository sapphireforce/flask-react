import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import EntityFormDialog from "./EntityFormDialog";

export default function RankingForm({
  open,
  isEdit,
  form,
  onChange,
  onClose,
  onSubmit,
  characterList = [],
}) {
  return (
    <EntityFormDialog
      open={open}
      title={isEdit ? "랭킹 수정" : "랭킹 등록"}
      onClose={onClose}
      onSubmit={onSubmit}
      submitLabel={isEdit ? "저장" : "등록"}
    >
      {!isEdit && (
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>캐릭터</InputLabel>
          <Select
            name="character_id"
            value={form.character_id || ""}
            onChange={onChange}
            label="캐릭터"
            required
          >
            {characterList && characterList.length > 0 ? (
              characterList.map((character) => (
                <MenuItem key={character.id} value={character.id}>
                  {character.character_name} (Lv.{character.character_level},{" "}
                  {character.world_name})
                </MenuItem>
              ))
            ) : (
              <MenuItem value="" disabled>
                캐릭터가 없습니다
              </MenuItem>
            )}
          </Select>
        </FormControl>
      )}

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>랭킹 타입</InputLabel>
        <Select
          name="rank_type"
          value={form.rank_type || "total"}
          onChange={onChange}
          label="랭킹 타입"
          required
        >
          <MenuItem value="total">전체</MenuItem>
          <MenuItem value="level">레벨</MenuItem>
          <MenuItem value="exp">경험치</MenuItem>
        </Select>
      </FormControl>

      {isEdit && (
        <>
          <TextField
            label="캐릭터 레벨"
            name="character_level"
            type="number"
            value={form.character_level || ""}
            onChange={onChange}
            fullWidth
            sx={{ mb: 2 }}
            inputProps={{ min: 1 }}
          />
          <TextField
            label="경험치"
            name="character_exp"
            type="number"
            value={form.character_exp || ""}
            onChange={onChange}
            fullWidth
            sx={{ mb: 2 }}
            inputProps={{ min: 0 }}
          />
        </>
      )}

      <TextField
        label="날짜"
        name="date"
        type="date"
        value={form.date || ""}
        onChange={onChange}
        fullWidth
        sx={{ mb: 2 }}
        InputLabelProps={{ shrink: true }}
      />
    </EntityFormDialog>
  );
}
