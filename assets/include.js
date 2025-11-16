<script>
(async function () {
  // Run after DOM is ready
  if (document.readyState === "loading") {
    await new Promise(resolve =>
      document.addEventListener("DOMContentLoaded", resolve, { once: true })
    );
  }

  const nodes = document.querySelectorAll("[data-include]");
  const tasks = [];

  for (const el of nodes) {
    const url = el.getAttribute("data-include");
    if (!url) continue;

    const task = fetch(url, { cache: "no-cache" })
      .then(async res => {
        if (!res.ok) {
          el.innerHTML = `<!-- include error: ${url} (${res.status}) -->`;
          return;
        }
        el.innerHTML = await res.text();
      })
      .catch(err => {
        console.error("Include failed:", url, err);
        el.innerHTML = `<!-- include failed: ${url} -->`;
      });

    tasks.push(task);
  }

  await Promise.all(tasks);
})();
</script>
