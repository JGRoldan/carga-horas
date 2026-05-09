# Script para cargar horas automáticamente

Este repositorio contiene un script en `cargarHoras.js` que automatiza la carga de horas en la plataforma de registro para **múltiples proyectos** en un mismo mes.

Antes de ejecutarlo, solo necesitás modificar la constante `PLAN` al comienzo del archivo para definir qué cargar en cada proyecto, y ajustar `DIA_NO_LABORAL` si es necesario.

## Uso

1. Ingresar a la página donde se cargan las horas.
2. Abrir la consola del navegador.
3. Abrir el archivo `cargarHoras.js`.
4. Modificar la constante `PLAN` según tus necesidades (ver más abajo).
5. Modificar la constante `DIA_NO_LABORAL` si es necesario.
6. Copiar todo el contenido del archivo.
7. Pegar el script en la consola y presionar Enter.

---

## PLAN (actividades a cargar por proyecto)

El `PLAN` es un objeto donde cada **key** identifica un proyecto y su valor es una lista de actividades a cargar.

```js
const PLAN = {
	'claro cloud': [
		{
			dias: [],
			actividad: (A) => A.IMPLEMENTACION,
			horas: HORAS.H3,
		},
		{
			dias: [],
			actividad: (A) => A.OTROS,
			horas: HORAS.H30,
			comentario: 'Break',
		},
		{
			dias: [],
			actividad: (A) => A.OTROS,
			horas: HORAS.H2_5,
		},
	],
	drive: [
		{
			dias: [1, 2, 3, 15],
			actividad: (A) => A.OTROS,
			horas: HORAS.H1,
		},
	],
}
```

### Identificar el proyecto (key)

La key de cada proyecto puede ser:

- **Nombre parcial:** `'claro cloud'`, `'drive'`
- **Código numérico:** `'12345'`, `'76543'`
- **Con guiones bajos:** `'claro_cloud'` equivale a `'claro cloud'`

El script hace match parcial e ignora mayúsculas, minúsculas y tildes, así que no hace falta escribir el nombre completo.

| Key en PLAN     | Proyecto que matchea  |
| --------------- | --------------------- |
| `'claro cloud'` | Soporte Técnico N1/N2 |
| `'drive'`       | PROYECTO DRIVE        |
| `'12345'`       | PROSPECTOS NN         |
| `'mix'`         | PROSPECTOS NN         |

> [!WARNING]
> Si la key matchea más de un proyecto (por ejemplo `'claro'` matchea tanto "Claro Drive" como "Claro Cloud"), el script va a tomar el primero que encuentre. Usá un término más específico si hay ambigüedad.

### Campos de cada actividad

| Campo        | Requerido | Descripción                                                   |
| ------------ | --------- | ------------------------------------------------------------- |
| `actividad`  | ✅        | Actividad a registrar. Usar `(A) => A.NOMBRE_ACTIVIDAD`       |
| `horas`      | ✅        | Horas a cargar. Usar una constante de `HORAS`                 |
| `dias`       | ✅        | Días del mes a cargar. `[]` o `null` = todos los días hábiles |
| `comentario` | ❌        | Comentario opcional para la actividad                         |

### Ejemplos de `dias`

```js
dias: [] // Todos los días hábiles del mes
dias: null // Igual que []
dias: [1, 15] // Solo los días 1 y 15
dias: [1, 2, 3] // Solo los primeros 3 días
```

> [!TIP]
> Podés agregar tantos proyectos y actividades como necesites. El script los procesa uno por uno en el orden en que están definidos.

---

## DIA_NO_LABORAL (día a omitir)

Define qué día de la semana se excluye del registro automático. Por defecto se omite el sábado.

```js
const DIA_NO_LABORAL = ENUM_DAYS.SABADO
```

Podés cambiarlo por cualquier valor de `ENUM_DAYS`:

```js
const DIA_NO_LABORAL = ENUM_DAYS.DOMINGO
```

## ENUM_DAYS (días de la semana)

```js
const ENUM_DAYS = {
	DOMINGO: 0,
	LUNES: 1,
	MARTES: 2,
	MIERCOLES: 3,
	JUEVES: 4,
	VIERNES: 5,
	SABADO: 6,
}
```

---

## ACTIVIDADES (catálogo de actividades)

```
ACTUALIZACIONES A REPOSITORIO
ADMINISTRACION
ADMON DE LA CONFIGURACION
ANALISIS
ASESORIA
ASESORIA A PROYECTOS
AUDITORIA
CAPACITACION
CAPACITACION A OPERACIONES
DESARROLLO
DISEÑO
DOCUMENTACION
ENTREVISTAS
EVALUACIONES (SCAMPI)
HORAS STAND BY
IMPLEMENTACION
INICIATIVAS
INNOVACIONES
LIBERACION
MANTENIMIENTO
MANTENIMIENTO AMMI
METRICAS
OTROS
PREANALISIS
PRESENTACION
PREVENTA
PRUEBAS
REUNIONES
REVISION DOCUMENTAL
SEGUIMIENTO
SUPERVISION
VACACIONES
VENTAS
```

## HORAS (catálogo de horas disponibles)

```js
const HORAS = {
	H30: '0.5',
	H1: '1',
	H1_5: '1.5',
	H2: '2',
	H2_5: '2.5',
	H3: '3',
	H4: '4',
	H5: '5',
	H6: '6',
	H7: '7',
	H8: '8',
}
```

---

> [!IMPORTANT]
> Al finalizar la ejecución del script, revisá y validá manualmente que todas las horas, actividades y comentarios hayan sido cargados correctamente en cada día del mes.
