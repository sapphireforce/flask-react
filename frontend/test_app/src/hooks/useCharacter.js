import { useState, useCallback } from "react";
import * as characterApi from "../api/characterApi";

export default function useCharacter() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCharacters = useCallback(async () => {
    setLoading(true);
    try {
      const data = await characterApi.fetchCharacters();
      setCharacters(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCharacter = useCallback(async (payload) => {
    await characterApi.createCharacter(payload);
  }, []);

  const updateCharacter = useCallback(async (id, payload) => {
    await characterApi.updateCharacter(id, payload);
  }, []);

  const deleteCharacter = useCallback(async (id) => {
    await characterApi.deleteCharacter(id);
  }, []);

  return {
    characters,
    loading,
    fetchCharacters,
    createCharacter,
    updateCharacter,
    deleteCharacter,
    setCharacters,
  };
}
