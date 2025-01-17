
export const formatDate = (isoString) => {
    const date = new Date(isoString);
  
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
  
    return date.toLocaleDateString("en-US", options);
  };