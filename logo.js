const setFavicon = (mode) => {
    const link =
      document.querySelector("link[rel='icon']") ||
      document.createElement("link");
    link.rel = "icon";
    link.type = "image/svg+xml";
    link.href = mode === "dark" ? "/logoDark.svg" : "/logo.svg";
    document.head.appendChild(link);
  };

  const darkMode = window.matchMedia("(prefers-color-scheme: dark)");
  setFavicon(darkMode.matches ? "dark" : "light");

  darkMode.addEventListener("change", (e) => {
    setFavicon(e.matches ? "dark" : "light");
  });