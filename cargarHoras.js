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

function crearPlanDia(ACTIVIDADES) {
	return [
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
}

const DIA_NO_LABORAL = ENUM_DAYS.SABADO

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
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toUpperCase()
		.replace(/[^A-Z0-9]+/g, '_')
		.replace(/^_|_$/g, '')
}

async function obtenerActividades() {
	const select = await esperarElemento('#cmbActividades')
	const opciones = [...select.options]

	const ACTIVIDADES = {}

	opciones.forEach(opt => {
		if (opt.value === "0") return

		const key = limpiar(opt.textContent)
		ACTIVIDADES[key] = opt.value
	})

	return ACTIVIDADES
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

	await sleep(1000)
}

async function cargarMes(plan) {
	const dias = [...document.querySelectorAll('.ui-datepicker-calendar td')]
		.filter(
			(td) =>
				td.cellIndex !== DIA_NO_LABORAL &&
				!td.classList.contains('ui-datepicker-other-month') &&
				td.innerText.trim() !== ''
		)
		.map((td) => td.innerText.trim())

	for (const diaNumero of dias) {
		const celda = [...document.querySelectorAll('.ui-datepicker-calendar td')].find(
			(td) =>
				td.innerText.trim() === diaNumero &&
				td.cellIndex !== DIA_NO_LABORAL &&
				!td.classList.contains('ui-datepicker-other-month')
		)

		if (!celda) continue

		console.log('Procesando día:', diaNumero)

		celda.click()

		await sleep(700)

		for (const actividad of plan) {
			await registrarActividad(
				actividad.actividad,
				actividad.horas,
				actividad.comentario || ''
			)
		}

		await sleep(600)
	}

	console.log('Carga completa terminada')
}

async function iniciar() {
	const ACTIVIDADES = await obtenerActividades()
	const PLAN_DIA = crearPlanDia(ACTIVIDADES)
	await cargarMes(PLAN_DIA)
}

iniciar()
