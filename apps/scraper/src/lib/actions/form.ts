export const enhance = (
	form: HTMLFormElement,
	{ result }: { result: (resp: any, form?: HTMLFormElement) => void }
) => {
	const handleSubmit = async (event: Event) => {
		event.preventDefault();

		try {
			const res = await fetch(form.action, {
				headers: { accept: 'application/json' },
				method: form.method,
				body: new FormData(form)
			});
			if (res.ok) {
				result(await res.json(), form);
			} else {
				console.log('Fetch error:', await res.text());
			}
		} catch (error) {
			console.error('Could not submit the form:', error);
		}
	};

	form.addEventListener('submit', handleSubmit);

	return {
		destroy() {
			form.removeEventListener('submit', handleSubmit);
		}
	};
};
