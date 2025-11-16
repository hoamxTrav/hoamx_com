document.addEventListener("DOMContentLoaded", () => {
  const nodes = document.querySelectorAll("[data-include]");
  const tasks = [];

  nodes.forEach((el) => {
    const url = el.getAttribute("data-include");
    if (!url) return;

    console.log("Including:", url);

    const task = fetch(url, { cache: "no-cache" })
      .then((res) => {
        if (!res.ok) {
          console.error("Include HTTP error:", url, res.status);
          el.innerHTML = `<!-- include error: ${url} (${res.status}) -->`;
          return;
        }
        return res.text();
      })
      .then((html) => {
        if (html !== undefined) el.innerHTML = html;
      })
      .catch((err) => {
        console.error("Include failed:", url, err);
        el.innerHTML = `<!-- include failed: ${url} -->`;
      });

    tasks.push(task);
  });

  // After all includes are done, fix the footer year if present
  Promise.all(tasks).then(() => {
    const yearEl = document.getElementById("footer-year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  });
});
