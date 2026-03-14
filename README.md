# Script para cargar horas automáticamente
Este repositorio contiene un script en `cargarHoras.js` que automatiza la carga de horas en la plataforma de registro.
Antes de ejecutarlo, es necesario modificar el plan diario `PLAN_DIA` para ajustar las actividades, horas, comentarios que se cargarán automáticamente y modificar el `DIA_NO_LABORAL`.

## Uso
1. Ingresar a la página donde se cargan las horas.
2. Abrir la consola del navegador.
3. Abrir el archivo `cargarHoras.js`.
4. Modificar la constante `PLAN_DIA` según tus necesidades.
5. Modificar la constante `DIA_NO_LABORAL` según tus necesidades.
6. Copiar todo el contenido del archivo.
7. Pegar el script en la consola y presionar Enter.

## PLAN_DIA (actividades a cargar por día)
Aca definis qué actividades se cargarán, cuántas horas y qué comentario tendrá cada una.
```js
const PLAN_DIA = [
    {
        actividad: ACTIVIDADES.OTROS,
        horas: HORAS.H30,
        comentario: 'Break',
    },
    {
        actividad: ACTIVIDADES.OTROS,
        horas: HORAS.H2_5,
    },
    {
        actividad: ACTIVIDADES.IMPLEMENTACION,
        horas: HORAS.H3,
    },
]

```
> [!TIP]
> Podes agregar, borrar o modificar elementos de la constante según tus necesidades.

## DIA_NO_LABORAL (día a omitir)
Esta variable define qué día de la semana debe excluirse del registro automático.
Por defecto se omite el sábado.

```js
const DIA_NO_LABORAL = ENUM_DAYS.SABADO
```

Puedes cambiarlo por cualquier otro valor de ENUM_DAYS, por ejemplo:
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

## ACTIVIDADES (catálogo de actividades)
```js
const ACTIVIDADES = {
    IMPLEMENTACION: 911278,
    OTROS: 911285,
    ...
}
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

> [!IMPORTANT]  
> Al finalizar la ejecución del script, el usuario debe revisar y validar manualmente que todas las horas, actividades y comentarios hayan sido cargados correctamente en cada día del mes.

