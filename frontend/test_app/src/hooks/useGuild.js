import { useState, useCallback } from "react";
import * as guildApi from "../api/guildApi";

export default function useGuild() {
  const [guilds, setGuilds] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchGuilds = useCallback(async () => {
    setLoading(true);
    try {
      const data = await guildApi.fetchGuilds();
      setGuilds(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const createGuild = useCallback(async (payload) => {
    await guildApi.createGuild(payload);
  }, []);

  const updateGuild = useCallback(async (id, payload) => {
    await guildApi.updateGuild(id, payload);
  }, []);

  const deleteGuild = useCallback(async (id) => {
    await guildApi.deleteGuild(id);
  }, []);

  const addGuildMember = useCallback(async (guildId, characterName) => {
    return await guildApi.addGuildMember(guildId, characterName);
  }, []);

  return {
    guilds,
    loading,
    fetchGuilds,
    createGuild,
    updateGuild,
    deleteGuild,
    setGuilds,
    addGuildMember,
  };
}
