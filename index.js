let url = new URL(window.location);

const OUTPUT = `
<pre class="prettyprint linenums lang-js">
// Freeform #1
&lt;script type="text/javascript"&gt;
	(function(w) {
		if (w.CB && w.CB.offerings.length && w.CB.action) {return;}
		var CB = {}
		w.CB = CB

		${displayOfferings()}

		if (!w.CB.action) {
			${displayAction()}
		}
	}(window));
&lt;/script&gt;

// Freeform #2
&lt;script type="text/javascript"&gt;
(function(d, s, id){
  var jsdlvr, ajs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {return;}
  jsdlvr = d.createElement('link');
  jsdlvr.setAttribute("rel", "dns-prefetch preconnect");
  jsdlvr.href = "https://cdn.jsdelivr.net";
  ajs.parentNode.insertBefore(jsdlvr, ajs);
}(document, 'script', 'jsdelivr'));
&lt;/script&gt;

&lt;script id="cbjs" type="text/javascript" src="https://cdn.jsdelivr.net/gh/Channel-Bakers/amazon-add-to-cart@1.0.0/dist/main.min.js"&gt;&lt;/script&gt;

// Freeform #3 (use server side rendering)
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Channel-Bakers/amazon-add-to-cart@1.0.0/dist/main.css"&gt;
</pre>
`;

function displayOfferings() {
	let keyString = 'w.CB.offerings = []';

	if (url.searchParams.has('offering')) {
		keyString = 'w.CB.offerings = [';

		const OFFERINGS = url.searchParams.getAll('offering');

		OFFERINGS.map(offer => {
			offer = decodeURIComponent(offer);
			offer = JSON.parse(offer);

			keyString += `
				{
					asin: '${offer.asin}',
					offeringID: '${offer.offeringID}'
				},`;
		});

		keyString += '\n\t\t\t]'
	}

	return keyString;
}

function displayAction() {
	let actionString = 'w.CB.action = "background"';

	if (url.searchParams.has('action')) {
		let action = url.searchParams.get('action');
		actionString = `w.CB.action = "${action}"`;
	}

	return actionString;
}

const removeInputGroup = (event) => {
	event.preventDefault();

	const PARENT = event.target.parentNode;
	PARENT.remove();
}

const addNewInputGroup = (event) => {
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

const addInputsToOfferings = () => {
	url.search = '';

	const INPUT_GROUPS = document.querySelectorAll('.input-group');
	[...INPUT_GROUPS].map(form => {
		let offering = {};
		const ASIN = form.querySelector('.asin').value;
		const OFFER_ID = form.querySelector('.offerID').value;

		if (ASIN && OFFER_ID) {
			offering.asin = ASIN;
			offering.offeringID = OFFER_ID;

			offering = JSON.stringify(offering);
			offering = encodeURIComponent(offering);

			url.searchParams.append('offering', offering);
		}
	});

	let actionValue = document.querySelector('.select select').value;
	url.searchParams.set('action', actionValue);

	return url.href;
}

const generateOutputCode = () => {
	document.body.querySelector('.output').innerHTML = OUTPUT;
}

const populateInputGroups = () => {
	if (window.location.search) {
		let offerings = url.searchParams.getAll('offering')

		document.querySelector('.input-groups').innerHTML = '';
	
		offerings.map(offer => {
			offer = decodeURIComponent(offer);
			offer = JSON.parse(offer);
	
			document.querySelector('.input-groups').innerHTML += `
				<div class="input-group">
					<label for="asin">
						ASIN
						<input name="asin" class="asin" type="text" placeholder="B07PQ97CRW" value="${offer.asin}" />
					</label>
					<label for="offerID">
						Offering ID
						<input name="offerID" class="offerID" type="text" placeholder="1zSBzzHPQPIi75K7G1p5BST6KdcGV%2BvnMiOqMPbXi85AsstG%2BW32t7U2hTKS4eowhLRAFhob8cWXh%2F5Ps%2Fy8T9N%2B9pkatlr3u9w7Av5dWkRVwo1IE1jXsD3SxabgMYkVZslKVLHOqNdbtEcbowdtkQ%3D%3D" value="${offer.offeringID}" />
					</label>
					<a class="add" href="#"></a>
				</div>
			`;
		})
	}

	return false;
}

const populateSelectField = () => {
	if (url.searchParams.has('action')) {
		document.querySelector('.select select').value = url.searchParams.get('action');
	}
}

const addEventListeners = () => {
	document.querySelector('#submitBtn').addEventListener('click', (event) => {
		event.preventDefault();

		let newUrl = addInputsToOfferings();

		if (window.location !== newUrl) {
			window.location.href = newUrl;
		}
	});

	document.querySelector('#clearBtn').addEventListener('click', (event) => {
		event.preventDefault();

		url.search = '';
		window.location.href = url.href;
	});

	document.querySelector('.input-group:last-child .add').addEventListener('click', addNewInputGroup);
	document.querySelector('.input-group:not(:last-child) .add').addEventListener('click', removeInputGroup);
}

const init = () => {
	generateOutputCode();
	populateInputGroups();
	populateSelectField();
	addEventListeners();
}

(function() {
	init();
}());
