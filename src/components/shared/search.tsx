import { Input } from "antd";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Search() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [q, setQ] = useState<string>(params.get("q") || "");

  const onSubmit = () => {
    navigate(`/items?q=${q}`);
  };

  return (
    <Input.Search
      value={q}
      placeholder="Type to search"
      onChange={({ target: { value } }) => setQ(value)}
      onSearch={onSubmit}
    />
  );
}
