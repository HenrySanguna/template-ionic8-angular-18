---
applyTo: '**'
---
# Instrucciones globales para Copilot (Ionic + Angular)

## Contexto del proyecto
- Proyecto: Ionic 8 con Angular 18 y Capacitor 7
- Estilo: SCSS por componente y `src/global.scss` como global
- Tailwind CSS: configurado e integrado (**v3.4**). Las utilidades de Tailwind pueden usarse en plantillas junto con clases de Ionic
- Internacionalización: **Transloco** (`@jsverse/transloco`) - soporta español, inglés y portugués. Respetar claves existentes en `assets/i18n/` (es.json, en.json, pt.json)
- Componentes: Preferir **standalone components** siempre que sea posible
- Inyección: Usar `inject()` (API de Angular) para dependencias en lugar del constructor
- Storage: Usar `@capacitor/preferences` a través del `StorageService` centralizado (NO usar `localStorage` directamente)


## Estándares de código
- Tipo: TypeScript estricto (strict mode on)
- Usar **Observables con RxJS** para flujos asíncronos (NO usar Signals)
- Operadores declarativos: `map`, `switchMap`, `debounceTime`, `catchError`, `takeUntil`, `tap`, etc.
- Gestión de suscripciones:
  - Para Observables que se completan automáticamente (HttpClient, Capacitor Preferences): NO necesitan `takeUntil`
  - Para Observables infinitos (interval, fromEvent, valueChanges, router.events): SÍ usar `destroy$ = new Subject<void>()` + `takeUntil(this.destroy$)`
  - Limpiar `setTimeout`/`setInterval` en `ngOnDestroy`
- Orden en los componentes:
  1. `@Input()`
  2. `@Output()`
  3. Variables públicas
  4. Variables privadas (preferir `private readonly` cuando aplique)
  5. Getters y setters
  6. Lifecycle hooks (`ngOnInit`, `ngAfterViewInit`, `ngOnDestroy`, etc.)
  7. Funciones públicas
  8. Funciones privadas
- Nombres descriptivos (verbos para funciones, sustantivos para datos)
- Comentarios: solo cuando agregan valor. NO repetir lo obvio del nombre de función/variable


## Patrones y librerías
- **RxJS**: usar Observables como fuente primaria para flujos asíncronos. Evitar Signals
- **Ionic**: usar componentes oficiales (`ion-header`, `ion-content`, `ion-button`, `ion-list`, `ion-item`, `ion-input`, `ion-modal`, etc.)
- **Tailwind CSS**: mezclar utilidades de Tailwind (`flex`, `p-4`, `text-center`, `bg-primary`, etc.) con clases SCSS del componente según convenga
- **Transloco**: 
  - En templates: `{{ 'ERRORS.REQUIRED' | transloco }}`
  - En código: `transloco.translate('ERRORS.REQUIRED')`
  - Claves existentes en `assets/i18n/` (es.json, en.json, pt.json)
- **Capacitor**: usar plugins oficiales con manejo de errores
- **Storage**: NO usar `localStorage` directamente, usar `StorageService` con `@capacitor/preferences`


## Servicios del proyecto
- `ApiCallService`: para llamadas HTTP (GET, POST, PUT, PATCH, DELETE)
- `StorageService`: para persistencia con Capacitor Preferences (get, set, remove, clear, keys)
- `AuthService`: autenticación (login, logout, register, refreshToken, checkTokenValidity, getUserData, recoverPassword, updatePassword, deleteAccount, isEmailTaken)
- `ToastService`: notificaciones toast (presentToast, presentToastDanger, presentToastWarning, presentToastInfo, presentToastSuccess)
- `ModalService`: gestión de modales con breakpoints (presentModal, presentSmallModal, presentMediumModal, presentFullScreenModal, dismissModal)
- `LoadingService`: indicadores de carga (present, dismiss, isPresenting)
- `AlertService`: alerts y action sheets (presentAlert, presentActionSheet)
- `FormUtilsService`: validación y errores de formularios (getFormControl, getFormError, getErrorMessage)


## Guards disponibles
- `authGuard`: verificar autenticación y token válido. Redirige a `/login` si falla
- `publicGuard`: permitir acceso solo si NO está autenticado. Redirige a `/home` si ya tiene sesión
- `roleGuard`: verificar roles de usuario. Muestra toast y ejecuta `navCtrl.back()` si no tiene permisos (debe usarse siempre con authGuard)


## Tests
- NO generar tests unitarios por defecto
- NO agregar archivos `.spec.ts` salvo solicitud explícita


## Entregables cuando se solicita código
- Archivo de componente `.ts` (standalone si aplica)
- Template `.html`
- Archivo de estilos `.scss` (módulo por componente), pudiendo usar utilidades de Tailwind
- Exportaciones necesarias
- **Explicaciones SOLO en el chat** (NUNCA crear `.md`, `README.md`, `USAGE.md`, `.example.ts`)
- Si es necesario documentar: comentarios JSDoc breves en el código
- Notas de integración (routes, providers, assets) SOLO en el chat


## Estructura de carpetas
```
src/
├── app/
│   ├── core/
│   │   ├── guards/          # authGuard, publicGuard, roleGuard
│   │   ├── interfaces/      # Tipos compartidos (auth.ts, storage.ts)
│   │   ├── services/        # Servicios core (auth, api-call, storage)
│   │   └── i18n/            # Configuración de Transloco
│   ├── pages/               # Páginas de la app
│   ├── shared/              # Componentes compartidos
│   └── utils/
│       └── services/        # Servicios utilitarios (toast, modal, loading, alert, form-utils)
└── assets/
    └── i18n/                # Traducciones (es.json, en.json, pt.json)
```