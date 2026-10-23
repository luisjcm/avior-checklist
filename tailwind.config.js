export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      keyframes: {
        pop: { '0%': { transform: 'scale(.6)', opacity: '.3' }, '60%': { transform: 'scale(1.18)', opacity: '1' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        shake: { '0%,100%': { transform: 'translateX(0)' }, '20%,60%': { transform: 'translateX(-5px)' }, '40%,80%': { transform: 'translateX(5px)' } },
        flash: { '0%': { boxShadow: '0 0 0 0 rgba(16,185,129,.55)' }, '100%': { boxShadow: '0 0 0 12px rgba(16,185,129,0)' } },
      },
      animation: { shake: 'shake .4s ease-in-out', pop: 'pop .45s cubic-bezier(.2,.8,.3,1) both', flash: 'flash .7s ease-out both' },
      backgroundImage: { metal: 'linear-gradient(180deg,#2D3034 0%,#222427 100%)' },
      colors: {
        // Lineamientos de marca Avior Airlines
        avior: {
          DEFAULT: '#830F10', // Rojo base (menú lateral)
          bright: '#991C1F',  // Rojo brillante (botón activo / logo)
          bg: '#191A1C',      // Fondo general
          panel: '#1B1C1E',   // Paneles / tarjetas
          field: '#26282B',   // Campos de entrada (tono derivado)
          nav: '#35383C',     // Barra de navegación (gris pizarra)
          line: '#3F4348',    // Bordes (gris metálico)
          well: '#16171A',    // Campos / zonas hundidas
          light: '#F28B8D',   // Rojo claro para textos sobre fondo oscuro
          ink: '#F1F2F4',     // Texto principal
          muted: '#A3A8AF',   // Texto secundario
          silver: '#151618',  // Fondo de barras fijas
        },
      },
    },
  },
  plugins: [],
};
