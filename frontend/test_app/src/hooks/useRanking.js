import { useState, useCallback } from "react";
import * as rankingApi from "../api/rankingApi";

export default function useRanking() {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRankings = useCallback(async (rankType = "total") => {
    setLoading(true);
    try {
      const data = await rankingApi.fetchRankings(rankType);
      setRankings(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const createRanking = useCallback(async (payload) => {
    await rankingApi.createRanking(payload);
  }, []);

  const updateRanking = useCallback(async (id, payload) => {
    await rankingApi.updateRanking(id, payload);
  }, []);

  const deleteRanking = useCallback(async (id) => {
    await rankingApi.deleteRanking(id);
  }, []);

  return {
    rankings,
    loading,
    fetchRankings,
    createRanking,
    updateRanking,
    deleteRanking,
    setRankings,
  };
}
