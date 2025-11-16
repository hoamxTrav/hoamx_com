<script>
class UICard extends HTMLElement {
  static get observedAttributes() { return ['title','subtitle','href']; }
  constructor(){
    super();
    const root = this.attachShadow({mode: 'open'});
    root.innerHTML = `
      <style>
        .card{border:1px solid #B6B3AA66; border-radius:16px; padding:16px; background:#fff;}
        .title{font-weight:600; color:#1C1C1B;}
        .subtitle{color:#1C1C1B99; margin-top:4px;}
        a.btn{display:inline-block; margin-top:10px; padding:8px 12px; border-radius:12px;
              background:#C1502E; color:#F5F2EC; text-decoration:none}
      </style>
      <div class="card">
        <div class="title"></div>
        <div class="subtitle"></div>
        <slot></slot>
        <div class="cta"></div>
      </div>
    `;
  }
  attributeChangedCallback(){
    const r = this.shadowRoot;
    r.querySelector('.title').textContent = this.getAttribute('title') || '';
    r.querySelector('.subtitle').textContent = this.getAttribute('subtitle') || '';
    const href = this.getAttribute('href');
    r.querySelector('.cta').innerHTML = href ? `<a class="btn" href="${href}">Learn more</a>` : '';
  }
}
customElements.define('ui-card', UICard);
</script>
