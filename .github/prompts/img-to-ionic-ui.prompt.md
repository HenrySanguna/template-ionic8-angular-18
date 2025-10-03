---
mode: agent
---
#title: Convert screenshot to Ionic UI (standalone component)
#description: Genera un componente Ionic standalone a partir de una captura de diseño.


Tarea: A partir de la imagen adjunta, genera un componente **standalone** de Angular + Ionic (Ionic 8, Angular 18, Capacitor 7) que reproduzca la interfaz.


Requisitos:
- Usa componentes de Ionic (ion-header, ion-content, ion-grid/row/col, ion-button, ion-input, ion-list, ion-item, ion-icon, ion-card, ion-toolbar, etc.) según convenga.
- **Tailwind CSS v3.4**: puedes combinar clases de utilidad de Tailwind (`flex`, `p-4`, `text-center`, `bg-primary`, etc.) con componentes de Ionic y estilos SCSS personalizados.
- **No cambies el nombre del componente**: usa exactamente el nombre que el desarrollador indique. Si el prompt no incluye nombre, usa el nombre de archivo que el usuario proporcione.
- Estructura de archivos: `component.ts`, `component.html`, `component.scss`.
- Mantén el orden del código conforme a las instrucciones globales (Inputs, Outputs, variables públicas, variables privadas, getters/setters, lifecycle hooks, funciones públicas, funciones privadas).
- Si se requieren subcomponentes (por ejemplo, una card o una lista reutilizable), créalos como componentes separados con su propio archivo y **reutiliza cualquier componente ya existente en el proyecto** cuando sea detectado.
- Genera `@Input()` para datos estáticos detectables (títulos, subtítulos, badges) y `@Output()` para acciones (clicks principales, submit).
- Añade accesibilidad mínima: `aria-label` en botones no textuales, roles si aplica.
- Si hay formularios, usar `ReactiveFormsModule` y mostrar validaciones básicas con `FormUtilsService`.
- **Transloco para i18n**: usa claves de traducción de `assets/i18n/{es,en,pt}.json` cuando corresponda. En templates: `{{ 'KEY' | transloco }}`, en código: `translocoService.translate('KEY')`.
- Usa **Observables con RxJS** para cualquier flujo asíncrono (NO usar Signals).
- Inyección de dependencias: usar `inject()` en lugar del constructor.
- **NO crear archivos .md de documentación**. Explicaciones SOLO en el chat.
- Entrega: 1) Código de los archivos (.ts, .html, .scss), 2) Snippet para uso en una página/route, 3) Indicar qué componentes nuevos se crearon y si se reutilizaron componentes existentes, 4) Notas de integración SOLO en el chat.