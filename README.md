# ✈️ Avior IT Checklist - PWA

Una aplicación web progresiva (PWA) desarrollada para el departamento de Informática / Soporte Técnico IT, diseñada para digitalizar el proceso de revisión operativa ("Checklist Aeropuerto") durante las guardias en las distintas estaciones.

Este proyecto elimina la dependencia de plantillas de papel y aplicaciones de terceros con publicidad, agilizando la recolección de datos y firmas por parte de los supervisores directamente desde el dispositivo móvil del técnico de guardia.

## ✨ Características Principales

* **📱 Diseño Mobile-First:** Interfaz táctil optimizada para usarse con una sola mano mientras se recorren las áreas del aeropuerto (Counters, Carga, Ventas, Puertas de Embarque).
* **✍️ Firma Digital Integrada:** Uso de HTML5 Canvas para recolectar las firmas de los supervisores directamente en la pantalla del dispositivo.
* **📄 Exportación Automática a PDF:** Generación instantánea del documento oficial estructurado con todas las verificaciones y firmas incrustadas, listo para compartir.
* **💾 Persistencia de Datos:** Guardado automático local para evitar la pérdida de información ante cortes de cobertura móvil dentro del aeropuerto.

## 🛠️ Stack Tecnológico

* **Frontend:** React + Vite
* **Estilos:** Tailwind CSS
* **Íconos:** Lucide React
* **Firmas:** React Signature Canvas / HTML5 Canvas
* **Documentos:** jsPDF + html2canvas (Exportación a PDF)

## 🚀 Instalación y Uso Local

1. Clona este repositorio:
   ```bash
   git clone https://github.com/luisjcm/avior-checklist.git
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Abre `http://localhost:5173` en tu navegador para ver la aplicación en funcionamiento.
