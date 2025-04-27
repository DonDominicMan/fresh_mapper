export function tooltip(element: SVGPathElement) {
	let div: HTMLElement;
	let title: string | null;

	function mouseOver(event: MouseEvent) {
		title = element.getAttribute('data-title');		
		if(event.pageX && event.pageY && title) {
			div = document.createElement('div');
			div.textContent = title;
			div.style = `
				border: 1px solid #ddd;
				box-shadow: 1px 1px 1px #ddd;
				background: white;
				border-radius: 4px;
				padding: 4px;
				position: absolute;
				top: ${event.pageX + 5}px;
				left: ${event.pageY + 5}px;
			`;
			document.body.appendChild(div);
		}
	}
	function mouseMove(event: MouseEvent) {
		div.style.left = `${event.pageX + 5}px`;
		div.style.top = `${event.pageY + 5}px`;
	}
	function mouseLeave() {
		document.body.removeChild(div);
	}
	
	element.addEventListener('mouseover', mouseOver);
  	element.addEventListener('mouseleave', mouseLeave);
	element.addEventListener('mousemove', mouseMove);
	
	return {
		destroy() {
			element.removeEventListener('mouseover', mouseOver);
			element.removeEventListener('mouseleave', mouseLeave);
			element.removeEventListener('mousemove', mouseMove);
		}
	}
}