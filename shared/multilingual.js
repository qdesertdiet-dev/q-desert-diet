export function localizedText(value,language='en'){
	if(typeof value === 'string') return value;
	if(value && typeof value === 'object'){
		const selected = value[language];
		if(typeof selected === 'string' && selected.trim()) return selected;
		const english = value.en;
		if(typeof english === 'string') return english;
	}
	return '';
}

export function localizedValue(english,arabic){
	return {en:typeof english === 'string' ? english : '',ar:typeof arabic === 'string' ? arabic : ''};
}