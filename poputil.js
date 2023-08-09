function poputil_clickWindow(event)
{
	const w = event.target;
	w.classList.add('poputil-hidden');

	const c = document.getElementById('--poputil-client');
	c.parentElement.removeChild(c);
}

function poputil_createWindow()
{
	w = document.createElement('div');
	w.id = '--poputil-window';
	w.classList.add('poputil-hidden');
	w.addEventListener('click', poputil_clickWindow);
	document.body.appendChild(w);

	return w;
}

function poputilWindow()
{
	const w = document.getElementById('--poputil-window');
	return w === null ? poputil_createWindow() : w;
}

function poputil_buildIFrame(link)
{
	return `<iframe class="poputil-frame" src="${link}"></iframe>`;
}

function poputil_defaultWidth()
{
	return 600;
}

function poputil_defaultHeight()
{
	return 400;
}

function poputil_setClientSizeAndPosition(c, width, height)
{
	if (width === undefined)
		width = poputil_defaultWidth();
	if (height === undefined)
		height = poputil_defaultHeight();

	c.clientWidth = width;
	c.clientHeight = height;
}

function poputil_clearContents(w)
{
	w.innerHTML = '';
}

function poputil_appendClient(w, c)
{
	poputil_clearContents(w);
	w.appendChild(c);
}

function poputilCreateClient(w, options)
{
	const {type, content, width = undefined, height = undefined} = options;
	const c = document.createElement('div');

	c.id = '--poputil-client';
	c.classList.add('poputil-hidden');

	if (type == 'html') {
		c.innerHTML = content;
	} else if (type == 'iframe') {
		c.innerHTML = poputil_buildIFrame(content);
	} else {
		throw new error(`Unknown type: ${type}`);
	}

	poputil_setClientSizeAndPosition(c, width, height);

	poputil_appendClient(w, c);

	c.classList.remove('poputil-hidden');
	w.classList.remove('poputil-hidden');

	return c;
}

function poputil(options)
{
	const w = poputilWindow();
	const c = poputilCreateClient(w, options);

	return c;
}
