async function sleep(ms) {
	return new Promise((r) => setTimeout(r, ms))
}

async function esperarBotonSi() {
	while (true) {
		const botones = [
			...document.querySelectorAll('.ui-dialog-buttonset button'),
		]

		const botonSi = botones.find((b) => b.innerText.trim() === 'Si')

		if (botonSi) return botonSi

		await sleep(100)
	}
}

async function borrarTodo() {
	while (true) {
		const botonBorrar = document.querySelector(
			'#divActividadesCapturaActividades .botonBorrar'
		)

		if (!botonBorrar) {
			console.log('No quedan actividades')
			break
		}

		botonBorrar.click()

		const botonSi = await esperarBotonSi()

		botonSi.click()

		console.log('Actividad eliminada')

		await sleep(1200)
	}
}

borrarTodo()
