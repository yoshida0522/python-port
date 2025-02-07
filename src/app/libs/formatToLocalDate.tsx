export const formatToLocalDate = (): string => {
  const now = new Date();
  const localDate = now.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const formattedDate = localDate.replace(/\//g, "-");
  return formattedDate;
};
