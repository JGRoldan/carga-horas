const HORAS = {
	H30: '0.5',
	H1: '1',
	H2: '2',
	H2_5: '2.5',
	H3: '3',
	H4: '4',
	H5: '5',
	H6: '6',
	H7: '7',
	H8: '8',
}
const ENUM_DAYS = {
	DOMINGO: 0,
	LUNES: 1,
	MARTES: 2,
	MIERCOLES: 3,
	JUEVES: 4,
	VIERNES: 5,
	SABADO: 6,
}
const DIA_NO_LABORAL = ENUM_DAYS.SABADO

const PLAN = {
	claro_cloud: [
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
			dias: [1, 3, 15],
			actividad: (A) => A.OTROS,
			horas: HORAS.H1,
		},
	],
}

async function sleep(ms) {
	return new Promise((r) => setTimeout(r, ms))
}

function esperarElemento(selector, timeout = 5000) {
	return new Promise((resolve, reject) => {
		const intervalo = setInterval(() => {
			const el = document.querySelector(selector)
			if (el) {
				clearInterval(intervalo)
				resolve(el)
			}
		}, 350)
		setTimeout(() => {
			clearInterval(intervalo)
			reject('Elemento no encontrado: ' + selector)
		}, timeout)
	})
}

function limpiar(texto) {
	return texto
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toUpperCase()
		.replace(/[^A-Z0-9]+/g, '_')
		.replace(/^_|_$/g, '')
}

async function obtenerActividades() {
	const select = await esperarElemento('#cmbActividades')
	const opciones = [...select.options]
	const ACTIVIDADES = {}
	opciones.forEach((opt) => {
		if (opt.value === '0') return
		const key = limpiar(opt.textContent)
		ACTIVIDADES[key] = opt.value
	})
	return ACTIVIDADES
}

// Devuelve lista de proyectos: { value, label, codigo }
async function obtenerProyectos() {
	const select = await esperarElemento('#Id_Proyecto')
	const opciones = [...select.options]
	return opciones
		.filter((opt) => opt.value !== '0')
		.map((opt) => {
			const texto = opt.textContent.trim()
			// Extrae el código entre corchetes: "[76935] Nombre proyecto"
			const matchCodigo = texto.match(/^\[(\d+)\]/)
			const codigo = matchCodigo ? matchCodigo[1] : opt.value
			const nombre = texto.replace(/^\[\d+\]\s*/, '')
			return { value: opt.value, label: nombre, codigo }
		})
}

// Busca por match parcial en nombre, código entre corchetes, o value
function encontrarProyecto(proyectos, query) {
	const q = limpiar(String(query))
	return proyectos.find(
		(p) =>
			limpiar(p.label).includes(q) ||
			limpiar(p.codigo).includes(q) ||
			limpiar(p.value).includes(q)
	)
}

async function seleccionarProyecto(value) {
	const select = await esperarElemento('#Id_Proyecto')
	select.value = value
	select.dispatchEvent(new Event('change', { bubbles: true }))
	await sleep(1000)
}

async function registrarActividad(actividadId, horas, comentario = '') {
	const actividadSelect = await esperarElemento('#cmbActividades')
	actividadSelect.value = actividadId
	actividadSelect.dispatchEvent(new Event('change', { bubbles: true }))
	const horasSelect = await esperarElemento('#HorasCapturadas')
	horasSelect.value = horas
	horasSelect.dispatchEvent(new Event('change', { bubbles: true }))
	const comentarioBox = await esperarElemento('#Comentario')
	comentarioBox.value = comentario
	await sleep(200)
	document.querySelector('#btnOk').click()
	await sleep(700)
}

// Carga las actividades de UN proyecto para los días que correspondan
async function cargarMesParaProyecto(actividadesDeDia) {
	// actividadesDeDia: [{ actividad, horas, comentario, dias }]
	// dias: [] o null => todo el mes | [1,5,15] => solo esos días

	const todasLasCeldas = () =>
		[...document.querySelectorAll('.ui-datepicker-calendar td')].filter(
			(td) =>
				td.cellIndex !== DIA_NO_LABORAL &&
				!td.classList.contains('ui-datepicker-other-month') &&
				td.innerText.trim() !== ''
		)

	const diasDelMes = todasLasCeldas().map((td) => Number(td.innerText.trim()))

	for (const diaNumero of diasDelMes) {
		// Filtrá qué actividades aplican a este día
		const actividadesDelDia = actividadesDeDia.filter((a) => {
			const dias = a.dias
			if (!dias || dias.length === 0) return true // todo el mes
			return dias.includes(diaNumero)
		})

		if (actividadesDelDia.length === 0) continue

		// Buscá la celda y hacé click
		const celda = todasLasCeldas().find(
			(td) => Number(td.innerText.trim()) === diaNumero
		)
		if (!celda) continue

		console.log(
			`📅 Día ${diaNumero}: ${actividadesDelDia.length} actividad(es)`
		)
		celda.click()
		await sleep(700)

		for (const actividad of actividadesDelDia) {
			await registrarActividad(
				actividad.actividad,
				actividad.horas,
				actividad.comentario || ''
			)
		}
		await sleep(700)
	}
}

async function iniciar(plan) {
	const proyectos = await obtenerProyectos()

	const porProyecto = new Map()

	for (const [queryProyecto, actividades] of Object.entries(plan)) {
		const match = encontrarProyecto(proyectos, queryProyecto)
		if (!match) {
			console.warn(`⚠️ Proyecto no encontrado: "${queryProyecto}"`)
			continue
		}
		// Guardamos las entradas SIN resolver actividad todavía
		porProyecto.set(match.value, {
			label: match.label,
			entradas: actividades,
		})
	}

	for (const [proyectoId, { label, entradas }] of porProyecto) {
		console.log(`\n🚀 Proyecto: ${label}`)

		await seleccionarProyecto(proyectoId)
		await sleep(600)
		const ACTIVIDADES = await obtenerActividades()

		// Resolvemos los IDs con las actividades correctas
		const actividades = entradas.map((entrada) => ({
			...entrada,
			actividad: entrada.actividad(ACTIVIDADES),
			dias: entrada.dias || [],
		}))

		await cargarMesParaProyecto(actividades)
	}

	console.log('\n✅ Carga completa terminada')
}

iniciar(PLAN)
