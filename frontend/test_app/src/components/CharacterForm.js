import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import EntityFormDialog from "./EntityFormDialog";
import { WORLD_NAMES, GENDERS, CLASSES } from "../constants/enums";

export default function CharacterForm({
  open,
  isEdit,
  form,
  onChange,
  onClose,
  onSubmit,
}) {
  return (
    <EntityFormDialog
      open={open}
      title={isEdit ? "캐릭터 수정" : "캐릭터 등록"}
      onClose={onClose}
      onSubmit={onSubmit}
      submitLabel={isEdit ? "저장" : "등록"}
    >
      <TextField
        label="이름"
        name="character_name"
        value={form.character_name}
        onChange={onChange}
        fullWidth
        required
        sx={{ mb: 2 }}
      />
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>월드</InputLabel>
        <Select
          name="world_name"
          value={form.world_name}
          onChange={onChange}
          label="월드"
        >
          {WORLD_NAMES.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>성별</InputLabel>
        <Select
          name="character_gender"
          value={form.character_gender}
          onChange={onChange}
          label="성별"
        >
          {GENDERS.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>직업</InputLabel>
        <Select
          name="character_class"
          value={form.character_class}
          onChange={onChange}
          label="직업"
        >
          {CLASSES.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="클래스 레벨"
        name="character_class_level"
        type="number"
        value={form.character_class_level}
        onChange={onChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="캐릭터 레벨"
        name="character_level"
        type="number"
        value={form.character_level}
        onChange={onChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="경험치"
        name="character_exp"
        type="number"
        value={form.character_exp}
        onChange={onChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="경험치율(%)"
        name="character_exp_rate"
        type="number"
        value={form.character_exp_rate}
        onChange={onChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="길드명"
        name="character_guild_name"
        value={form.character_guild_name}
        onChange={onChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="이미지 URL"
        name="character_image"
        value={form.character_image}
        onChange={onChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="날짜"
        name="date"
        type="date"
        value={form.date}
        onChange={onChange}
        fullWidth
        sx={{ mb: 2 }}
        InputLabelProps={{ shrink: true }}
      />
    </EntityFormDialog>
  );
}
