# Fer Alcaraz — Jungle Session

Landing page para vender entradas del recital acústico.
HTML + CSS + JS vanilla. Sin frameworks. Lista para deploy en Vercel.

## Estructura

```
/
├── index.html         Landing principal (hero, info, compra, FAQ, footer)
├── gracias.html       Página post-compra con form y entrada digital generada
├── styles.css         Sistema de diseño completo (mobile first)
├── script.js          Interacciones (selector qty, scroll reveal, sticky CTA)
├── favicon.svg
├── vercel.json        Headers y cleanUrls
└── assets/
    ├── hero.jpg       Frame del video (poster del hero)
    ├── hero-loop.mp4  Video loop optimizado (~1MB)
    ├── artist.jpg     Foto sección "sobre el artista"
    └── about.jpg      Frame alternativo
```

## Deploy en Vercel

### Opción 1 — Vercel CLI
```bash
npm i -g vercel
vercel
```

### Opción 2 — Drag & drop
Subí la carpeta `jungle-session/` completa a [vercel.com/new](https://vercel.com/new).

### Opción 3 — Git
```bash
git init
git add .
git commit -m "init: jungle session landing"
gh repo create jungle-session --public --source=. --push
```
Luego conectá el repo desde el dashboard de Vercel.

## Links de Mercado Pago (ya integrados)

Configurados en `script.js` con un link por cantidad:

| Cantidad | Precio  | Link |
| -------- | ------- | ---- |
| 1        | $10.000 | https://mpago.la/1K9EB21 |
| 2        | $14.000 | https://mpago.la/1kc98TN |
| 3        | $21.000 | https://mpago.la/1XXrqcH |
| 4        | $28.000 | https://mpago.la/1DNuDuK |

El contador en la página está limitado a 4 entradas. Para vender más, generá
nuevos links en MP y agregalos al objeto `MP_LINKS` en `script.js`.

## Cambios opcionales antes de salir a producción

1. **Back URL en Mercado Pago**
   En cada link de preferencia de MP, configurar `back_urls.success` →
   `https://tudominio.com/gracias` para que los compradores caigan en
   `gracias.html` después del pago.

2. **Envío real del formulario en gracias.html**
   Actualmente el form es solo UI. Conectalo a Formspree, Tally, o una
   Vercel Serverless Function para guardar datos y mandar el email.

3. **Redes sociales en el footer**
   Reemplazar los `href="#"` con tus links reales de Instagram, YouTube, Spotify.

4. **OG image absoluta**
   En producción, cambiar `og:image` por la URL absoluta (`https://tudominio.com/assets/hero.jpg`)
   para que el preview funcione bien en WhatsApp, Twitter, etc.

## Performance

- Video hero comprimido (CRF 26, 1280px, sin audio, ~1.1 MB)
- Fuentes con `display=swap`
- `loading="lazy"` en imágenes secundarias
- `IntersectionObserver` para animaciones (no se ejecuta lo que no se ve)
- `prefers-reduced-motion` respetado

## Notas de diseño

- Paleta cálida y oscura inspirada en atardecer correntino
- Tipografías: Fraunces (display) + Inter (UI)
- Grain cinematográfico sutil sobre toda la página
- Glassmorphism leve en card de compra y sticky CTA
- Sin colores fluor, sin sensación de plantilla
