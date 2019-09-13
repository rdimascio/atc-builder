let url = new URL(window.location);

const OUTPUT = `
<pre class="prettyprint linenums lang-js">
&lt;script type="text/javascript"&gt;
	(function(d, s, id){
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) {return;}
		js = d.createElement(s); js.id = id;
		js.async = true; js.defer = true;
		js.src = "https://cdn.jsdelivr.net/gh/rdimascio/atc@1.3.7/dist/main.js";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'cb-jsclp'));

	(function(w) {
		setTimeout(() => {
			if (!w.CB) {return;}
			${displayOfferings()}
			${displayAction()}
			w.CB.init();
		}, 1000)
	}(window));
&lt;/script&gt;
</pre>
`;

function displayOfferings() {
	let keyString = 'w.CB.offerings = {}';

	if (url.search) {
		keyString = 'w.CB.offerings = {\n';

		const LINE_START = '\t\t\t\t';
		const LINE_END = ',\n';

		url.searchParams.forEach((value, key) => {
			keyString += `${LINE_START}'${key}': '${value}'${LINE_END}`;
		});

		keyString += '\t\t\t}'
	}

	return keyString;
}

function displayAction() {
	let actionString = 'w.CB.action = "window"';

	if (window.location.hash) {
		let action = window.location.hash.split('#')[1];
		actionString = `w.CB.action = "${action}"`;
	}

	return actionString;
}

function removeInputGroup() {
	event.preventDefault();

	const PARENT = event.target.parentNode;
	PARENT.remove();
}

function addNewInputGroup() {
	event.preventDefault();

	const PARENT = event.target.parentNode;
	const NEW_GROUP = PARENT.cloneNode(true);
	NEW_GROUP.querySelector('.asin').value = '';
	NEW_GROUP.querySelector('.offerID').value = '';
	document.querySelector('.input-groups').appendChild(NEW_GROUP);

	event.target.removeEventListener('click', addNewInputGroup);
	event.target.addEventListener('click', removeInputGroup);
	NEW_GROUP.querySelector('.add').addEventListener('click', addNewInputGroup);
}

function addInputsToOfferings() {
	url.search = '';

	const INPUT_GROUPS = document.querySelectorAll('.input-group');
	[...INPUT_GROUPS].map(form => {
		const ASIN = form.querySelector('.asin').value;
		const OFFER_ID = form.querySelector('.offerID').value;

		if (ASIN && OFFER_ID) {
			url.searchParams.set(ASIN, OFFER_ID);
		}
	});

	let actionValue = document.querySelector('.select select').value;
	url.hash = actionValue;

	return url.href;
}

function generateOutputCode() {
	document.body.querySelector('.output').innerHTML = OUTPUT;
}

function populateInputGroups() {
	if (window.location.search) {
		let urlKeys = window.location.search.split('?')[1].split('&');

		document.querySelector('.input-groups').innerHTML = '';
	
		urlKeys.forEach(entry => {
			entry = entry.split('=');
	
			let key = entry[0];
			let value = entry[1];
	
			document.querySelector('.input-groups').innerHTML += `
				<div class="input-group">
					<label for="asin">
						ASIN
						<input name="asin" class="asin" type="text" placeholder="B07PQ97CRW" value="${key}" />
					</label>
					<label for="offerID">
						Offering ID
						<input name="offerID" class="offerID" type="text" placeholder="1zSBzzHPQPIi75K7G1p5BST6KdcGV%2BvnMiOqMPbXi85AsstG%2BW32t7U2hTKS4eowhLRAFhob8cWXh%2F5Ps%2Fy8T9N%2B9pkatlr3u9w7Av5dWkRVwo1IE1jXsD3SxabgMYkVZslKVLHOqNdbtEcbowdtkQ%3D%3D" value="${value}" />
					</label>
					<a class="add" href="#"></a>
				</div>
			`;
		})
	}

	return false;
}

function populateSelectField() {
	if (window.location.hash) {
		document.querySelector('.select select').value = window.location.hash.split('#')[1]
	}
}

function addEventListeners() {
	document.querySelector('#submitBtn').addEventListener('click', () => {
		event.preventDefault();

		let newUrl = addInputsToOfferings();

		if (window.location !== newUrl) {
			window.location.href = newUrl;
		}
	});

	document.querySelector('#clearBtn').addEventListener('click', () => {
		event.preventDefault();

		url.search = '';
		url.hash = '';
		window.location.href = url.href;
	});

	document.querySelector('.input-group .add').addEventListener('click', addNewInputGroup);
}

(function() {
	generateOutputCode();
	populateInputGroups();
	populateSelectField();
	addEventListeners();
}());
