const ENUM_DAYS = {
	DOMINGO: 0,
	LUNES: 1,
	MARTES: 2,
	MIERCOLES: 3,
	JUEVES: 4,
	VIERNES: 5,
	SABADO: 6,
}
const ACTIVIDADES = {
	IMPLEMENTACION: 911278,
	OTROS: 911285,
	ACTUALIZACIONES_REPOSITORIO: 911263,
	ADMINISTRACION: 911264,
	ADMON_CONFIGURACION: 911265,
	ANALISIS: 911266,
	ASESORIA: 911267,
	ASESORIA_PROYECTOS: 911268,
	AUDITORIA: 911269,
	CAPACITACION: 911270,
	CAPACITACION_OPERACIONES: 911271,
	DESARROLLO: 911272,
	DISENO: 911273,
	DOCUMENTACION: 911274,
	ENTREVISTAS: 911275,
	EVALUACIONES_SCAMPI: 911276,
	HORAS_STAND_BY: 911277,
	INICIATIVAS: 911279,
	INNOVACIONES: 911280,
	LIBERACION: 911281,
	MANTENIMIENTO: 911282,
	MANTENIMIENTO_AMMI: 911283,
	METRICAS: 911284,
	PREANALISIS: 911286,
	PRESENTACION: 911287,
	PREVENTA: 911288,
	PRUEBAS: 911289,
	REUNIONES: 911290,
	REVISION_DOCUMENTAL: 911291,
	SEGUIMIENTO: 911292,
	SUPERVISION: 911293,
	VENTAS: 911294,
	VACACIONES: 1133951,
}

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

	await sleep(1200)
}

async function cargarMes() {
	const dias = [...document.querySelectorAll('.ui-datepicker-calendar td')]
		.filter(
			(td) =>
				td.cellIndex !== DIA_NO_LABORAL && // excluir días no laborables
				!td.classList.contains('ui-datepicker-other-month') &&
				td.innerText.trim() !== ''
		)
		.map((td) => td.innerText.trim())

	for (const diaNumero of dias) {
		const celda = [
			...document.querySelectorAll('.ui-datepicker-calendar td'),
		].find(
			(td) =>
				td.innerText.trim() === diaNumero &&
				td.cellIndex !== DIA_NO_LABORAL &&
				!td.classList.contains('ui-datepicker-other-month')
		)

		if (!celda) continue

		console.log('Procesando día:', diaNumero)

		celda.click()

		await sleep(900)

		for (const actividad of PLAN_DIA) {
			await registrarActividad(
				actividad.actividad,
				actividad.horas,
				actividad.comentario || ''
			)
		}
		await sleep(800)
	}

	console.log('Carga completa terminada')
}

cargarMes()
