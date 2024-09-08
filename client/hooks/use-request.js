import axios from "axios";
import { useState } from "react";

export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    try {
      setErrors(null);
      const { data } = await axios[method](url, body);

      if (onSuccess) onSuccess(data);
      return data;
    } catch (error) {
      const err = error.response.data.errors;
      setErrors(
        <div className="alert alert-danger">
          <h4>Ooops..</h4>
          <ul className="my-0">
            {err.map((e) => (
              <li key={e.message}>{e.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};
