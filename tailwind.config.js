/** Build do CSS: `npm install` e depois `npm run build:css` (gera css/tailwind.css) */
module.exports = {
  content: ["./index.html", "./js/**/*.js"],
  theme: { extend: { fontFamily: { mono: ["VT323", "IBM Plex Mono", "monospace"] }, gridTemplateColumns: { "18": "repeat(18, minmax(0, 1fr))" } } },
  plugins: []
};
