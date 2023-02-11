import axios from "axios";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import { useEnvironment } from "../context/environment";

export const useDcsCommand = () => {
  const { environment } = useEnvironment();
  const [submitting, setSubmitting] = useState(false);
  const [responses, setResponses] = useState([]);

  const submitCommand = async (command) => {
    localStorage.setItem('dcs-fiddle-script', command);
    try {
      setSubmitting(true);
      const { data } = await axios.get(
        `http://127.0.0.1:${environment.port}/${btoa(command)}`,
        {
          params: { env: environment.selectedState || "default" },
        }
      );

      setResponses([
        ...responses,
        [new Date().toISOString(), data.result || data.error || ""],
      ]);
    } catch (e) {
      showNotification({
        title: "Failed to Submit Command: " + e.message,
        message: e.response.data.error,
        color: "red",
        autoClose: false,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return { submitCommand, responses, submitting };
};
