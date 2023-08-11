const poputil_windowName = '--poputil-window';
const poputil_clientName = '--poputil-client';

const poputil_escapeKeyCode = 27;
var poputil_keyupWindow_current = null;

var poputil_client_defaultStyle = '--poputil-client-default-style';

function poputil_parentOnlyEvent(element, inner)
{
	return function poputil_parentOnlyOuter(event)
	{
		// Only fire for element event is registered on.
		if (event.target === element)
		{ return inner(event); }
	}
}

function poputil_removeKeyupEvent()
{ document.body.removeEventListener
	('keyup', poputil_keyupWindow_current); }

function poputilWindow$()
{ return document.getElementById(poputil_windowName); }

function poputil_closeWindow()
{
	const w = poputilWindow$(); // event.target;
	poputil_hideElement(w);
	// w.classList.add('poputil-window-default');
	w.classList.remove('poputil-window-active');

	const c = document.getElementById(poputil_clientName);
	c.parentElement.removeChild(c);

	poputil_removeKeyupEvent();
}

function poputil_clickWindow(element)
{
	return poputil_parentOnlyEvent(element,
		function poputil_clickWindow_inner(event)
		{ poputil_closeWindow(); });
}

function poputil_keyupWindow(element)
{
	poputil_keyupWindow_current =
		function poputil_keyupWindow_inner(event)
		{
			// Todo: what is event.isComposing?  needed?
			// console.log(event.keyCode);

			if (event.keyCode == poputil_escapeKeyCode)
				{ poputil_closeWindow(); }
		};

	return poputil_keyupWindow_current;
}

function poputil_addKeyupEvent()
{ document.body.addEventListener
	('keyup', poputil_keyupWindow()); }

function poputil_createWindow()
{
	w = document.createElement('div');
	w.id = poputil_windowName;
	poputil_showElement(w);
	w.classList.add('poputil-window-default');

	document.body.appendChild(w);

	return w;
}

function poputilWindow()
{
	const w = poputilWindow$();
	return w === null ? poputil_createWindow() : w;
}

function poputil_buildIFrame(link)
{
	return `<iframe class="--poputil-frame" src="${link}"></iframe>`;
}

function poputil_showElement(e)
{ e.classList.remove('poputil-hidden'); }
function poputil_hideElement(e)
{ e.classList.add('poputil-hidden'); }

function poputil_showWindow(w)
{
	poputil_showElement(w);
	// w.classList.remove('poputil-window-default');
	// w.classList.add('poputil-window-active');
}

function poputil_defaultWidth()
{ return 600; }

function poputil_defaultHeight()
{ return 400; }

function poputil_parseSize(size, defaultSize, windowSize)
{
	if (size === undefined)
		return defaultSize();

	else if (typeof size == 'string' && size.endsWith('%'))
	{
		size = size.substring(0, size.length-1);
		size = parseInt() / 100.0;

		return size * windowSize;
	}

	return size;
}

function poputil_setClientSizeAndPosition(c, width, height, windowWidth, windowHeight)
{
	width = poputil_parseSize(width, poputil_defaultWidth, windowWidth);
	height = poputil_parseSize(height, poputil_defaultHeight, windowHeight);

	var s = c.style;

	// c.clientWidth = width;
	// c.clientHeight = height;

	s.width = width;
	s.height = height;

	s.left = (windowWidth - width) / 2;
	s.top = (windowHeight - height) / 2;

	// console.log(`top: ${c.style.top} left: ${c.style.left}`);
	// console.log(`width: ${width} height ${height}`);
	// console.log(`window-width: ${windowWidth} window-height ${windowHeight}`);	
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

const poputil_revealTimeout = 25;
const poputil_revealClientTimeout = 500;

function poputil_reveal(w, c)
{
	poputil_showWindow(w);

	setTimeout(function () {
		w.classList.add('poputil-window-active');

		setTimeout(function () {
			poputil_showElement(c);
		}, poputil_revealClientTimeout);
	}, poputil_revealTimeout);
}

function poputilCreateClient(w, options)
{
	const {type, content, width = undefined, height = undefined,
		   client_style = poputil_client_defaultStyle} = options;

	const c = document.createElement('div');

	c.id = poputil_clientName;
	poputil_hideElement(c);

	client_style && c.classList.add(client_style);

	if (type == 'html') {
		c.innerHTML = content;
	} else if (type == 'iframe') {
		c.innerHTML = poputil_buildIFrame(content);
	} else {
		throw new error(`Unknown type: ${type}`);
	}

	poputil_setClientSizeAndPosition
		(c, width, height,
		 window.innerWidth,
		 window.innerHeight);

	poputil_appendClient(w, c);

	w.addEventListener('click', poputil_clickWindow(w));
	poputil_addKeyupEvent();

	poputil_reveal(w, c);

	return c;
}

function poputil(options, blurElement)
{
	const w = poputilWindow();
	const c = poputilCreateClient(w, options);

	blurElement !== undefined && blurElement.blur();

	return c;
}
