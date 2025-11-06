import { useEffect, useState } from "react";

export const useChromeStorage = <T>(
  key: string,
  defaultValue?: T
): [T | undefined, (value: T) => void] => {
  const [value, setValue] = useState<T | undefined>(defaultValue);

  useEffect(() => {
    chrome?.storage?.sync?.get(key, (data) => {
      if (data[key] !== undefined) setValue(data[key]);
    });
  }, [key]);

  useEffect(() => {
    if (value !== undefined) {
      chrome?.storage?.sync?.set({ [key]: value });
    }
  }, [key, value]);

  return [value, setValue];
};
