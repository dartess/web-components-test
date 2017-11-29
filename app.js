class TComponent extends window.HTMLElement {
    constructor(args) {
        super();

        console.log(args);
    }

    setTitle(title) {
        this.dispatchEvent(new CustomEvent('t.component.set.title', {
            bubbles: true,
            composed: true,
            detail: {title},
        }));
    }
}


class TRoute extends window.HTMLElement {
    constructor() {
        super();
    }

    get path() {
        return this.getAttribute('path');
    }

    get component() {
        return this.getAttribute('component');
    }

    connectedCallback() {
        const {path, component} = this;
        this.dispatchEvent(new CustomEvent('t.route.registration', {
            bubbles: true,
            detail: {
                path,
                component,
            }
        }));
    }
}

class TLink extends window.HTMLElement {
    constructor() {
        super();
    }

    get href() {
        return this.getAttribute('href');
    }

    connectedCallback() {
        const shadowRoot = this.attachShadow({mode: 'open'});
        const tmpl = document.getElementById('t-link');
        const node = document.importNode(tmpl.content, true);
        shadowRoot.appendChild(node);
        this.link = shadowRoot.querySelector('a');
        this.link.href = this.href;

        this.addEventListener('click', event => {
            event.preventDefault();
            this.dispatchEvent(new CustomEvent('t.route.to', {
                bubbles: true,
                composed: true,
                detail: {
                    path: this.href,
                }
            }));
        })
    }
}


class T404 extends TComponent {
    constructor(args) {
        super(args);
    }

    connectedCallback() {
        const shadowRoot = this.attachShadow({mode: 'open'});
        const tmpl = document.getElementById('t-404');
        const node = document.importNode(tmpl.content, true);
        shadowRoot.appendChild(node);

        this.setTitle("404");
    }
}

class TMain extends TComponent {
    constructor(args) {
        super(args);
    }

    connectedCallback() {
        const shadowRoot = this.attachShadow({mode: 'open'});
        const tmpl = document.getElementById('t-main');
        const node = document.importNode(tmpl.content, true);
        shadowRoot.appendChild(node);

        this.setTitle('Главная');
    }
}

class TNewsList extends TComponent {
    constructor(args) {
        super(args);
    }

    connectedCallback() {
        const shadowRoot = this.attachShadow({mode: 'open'});
        const tmpl = document.getElementById('t-news-list');
        shadowRoot.appendChild(tmpl.content.cloneNode(true));

        this.dispatchEvent(new CustomEvent('t.loading.start', {
            bubbles: true,
            composed: true,
        }));

        fetch('https://jsonplaceholder.typicode.com/posts')
            .then(response => response.json())
            .then(data => {
                shadowRoot.querySelector('.news-list').innerHTML = data.map(item => `<h2><t-link href="/news/${item['id']}/">${item['title']}</t-link></h2>`).join('');

                this.setTitle('Список новостей');

                this.dispatchEvent(new CustomEvent('t.loading.end', {
                    bubbles: true,
                    composed: true,
                }));
            });
    }
}

class TNewsDetail extends TComponent {
    constructor(args) {
        super(args);

        this.options = {
            id: args[0]
        }
    }

    connectedCallback() {
        const shadowRoot = this.attachShadow({mode: 'open'});
        const tmpl = document.getElementById('t-news-detail');
        shadowRoot.appendChild(tmpl.content.cloneNode(true));

        this.dispatchEvent(new CustomEvent('t.loading.start', {
            bubbles: true,
            composed: true,
        }));

        fetch('https://jsonplaceholder.typicode.com/posts/' + this.options.id)
            .then(response => response.json())
            .then(data => {
                this.setTitle(data.title);

                shadowRoot.querySelector('.news-detail').innerHTML = `<p>${data.body}</p>`;

                this.dispatchEvent(new CustomEvent('t.loading.end', {
                    bubbles: true,
                    composed: true,
                }));
            });
    }
}

class TBarcodes extends TComponent {
    constructor(args) {
        super(args);
    }

    connectedCallback() {
        const shadowRoot = this.attachShadow({mode: 'open'});
        const tmpl = document.getElementById('t-barcodes');
        const node = document.importNode(tmpl.content, true);
        shadowRoot.appendChild(node);

        this.setTitle('Регистрация шк');
    }
}

customElements.define("t-route", TRoute);
customElements.define("t-link", TLink);
customElements.define("t-404", T404);

customElements.define("t-main", TMain);
customElements.define("t-news-list", TNewsList);
customElements.define("t-news-detail", TNewsDetail);
customElements.define("t-barcodes", TBarcodes);

window['TMain'] = TMain;
window['TNewsList'] = TNewsList;
window['TNewsDetail'] = TNewsDetail;
window['TBarcodes'] = TBarcodes;

function makeUpperCamelCase(text) {
    const capitalizedBlockNoFirstLetter = text.replace(/-([a-z])/g, (str, a) => a.toUpperCase());
    return capitalizedBlockNoFirstLetter.charAt(0).toUpperCase() + capitalizedBlockNoFirstLetter.slice(1);
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/serviceWorker.js', {
        scope: '/'
    });
}