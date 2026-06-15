import './style.css'

import './01-srp/product-bloc'
import './02-ocp/news-service'
import './03-lsp/vehicle-manager'
import './04-isp/bird-catalog'
import './05-dip/post-service'

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <h1>CleanCode y SOLID</h1>
  <span>Revisar la consola de JavaScript</span>
`
