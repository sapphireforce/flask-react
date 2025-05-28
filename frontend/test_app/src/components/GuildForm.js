import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import EntityFormDialog from "./EntityFormDialog";
import { WORLD_NAMES } from "../constants/enums";

export default function GuildForm({
  open,
  isEdit,
  form,
  onChange,
  onClose,
  onSubmit,
  characterList = [],
}) {
  const memberValue = Array.isArray(form.guild_member)
    ? form.guild_member
    : form.guild_member
    ? form.guild_member
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean)
    : [];

  const handleMemberChange = (e) => {
    // Select의 value는 배열
    onChange({
      target: {
        name: "guild_member",
        value: e.target.value,
      },
    });
  };

  return (
    <EntityFormDialog
      open={open}
      title={isEdit ? "길드 수정" : "길드 등록"}
      onClose={onClose}
      onSubmit={onSubmit}
      submitLabel={isEdit ? "저장" : "등록"}
    >
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>월드</InputLabel>
        <Select
          name="world_name"
          value={form.world_name}
          onChange={onChange}
          label="월드"
          required
        >
          {WORLD_NAMES.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="길드명"
        name="guild_name"
        value={form.guild_name}
        onChange={onChange}
        fullWidth
        required
        sx={{ mb: 2 }}
      />
      <TextField
        label="레벨"
        name="guild_level"
        type="number"
        value={form.guild_level}
        onChange={onChange}
        fullWidth
        required
        inputProps={{ min: 1 }}
        sx={{ mb: 2 }}
      />
      <TextField
        label="명성"
        name="guild_fame"
        type="number"
        value={form.guild_fame}
        onChange={onChange}
        fullWidth
        required
        inputProps={{ min: 0 }}
        sx={{ mb: 2 }}
      />
      <TextField
        label="포인트"
        name="guild_point"
        type="number"
        value={form.guild_point}
        onChange={onChange}
        fullWidth
        required
        inputProps={{ min: 0 }}
        sx={{ mb: 2 }}
      />
      <TextField
        label="길드장"
        name="guild_master_name"
        value={form.guild_master_name}
        onChange={onChange}
        fullWidth
        required
        sx={{ mb: 2 }}
      />
      <TextField
        label="멤버 수"
        name="guild_member_count"
        type="number"
        value={form.guild_member_count}
        onChange={onChange}
        fullWidth
        required
        inputProps={{ min: 1 }}
        sx={{ mb: 2 }}
      />
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>멤버</InputLabel>
        <Select
          name="guild_member"
          multiple
          value={memberValue}
          onChange={handleMemberChange}
          label="멤버"
          required
          renderValue={(selected) => selected.join(", ")}
        >
          {characterList.map((c) => (
            <MenuItem key={c.character_name} value={c.character_name}>
              {c.character_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </EntityFormDialog>
  );
}
