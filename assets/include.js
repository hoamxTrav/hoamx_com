<script>
(async () => {
  const nodes = document.querySelectorAll('[data-include]');
  await Promise.all([...nodes].map(async el => {
    const url = el.getAttribute('data-include');
    const res = await fetch(url, {cache: 'no-cache'});
    el.innerHTML = await res.text();
  }));
})();
</script>
