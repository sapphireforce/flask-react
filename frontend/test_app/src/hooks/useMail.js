import { useState, useCallback } from "react";
import * as mailApi from "../api/mailApi";

export default function useMail() {
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMails = useCallback(async (receiver) => {
    setLoading(true);
    try {
      const data = await mailApi.fetchMails(receiver);
      setMails(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMail = useCallback(async (payload) => {
    await mailApi.sendMail(payload);
  }, []);

  const updateMailStatus = useCallback(async (id, status) => {
    await mailApi.updateMailStatus(id, status);
  }, []);

  const deleteMail = useCallback(async (id) => {
    await mailApi.deleteMail(id);
  }, []);

  return {
    mails,
    loading,
    fetchMails,
    sendMail,
    updateMailStatus,
    deleteMail,
    setMails,
  };
}
