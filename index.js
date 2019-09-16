let url = new URL(window.location);

const OUTPUT = `
<pre class="prettyprint linenums lang-js">
&lt;script type="text/javascript"&gt;
	(function() {
		if (window.location.host === "advertising.amazon.com") {return;}

		(function(d, s, id){
			var js, jsdlvr, cbjs = d.getElementsByTagName(s)[0];
			jsdlvr = d.createElement('link');
			jsdlvr.setAttribute("rel", "dns-prefetch preconnect");
			jsdlvr.href = "https://cdn.jsdelivr.net";
			cbjs.parentNode.insertBefore(jsdlvr, cbjs);
			if (d.getElementById(id)) {return;}
			js = d.createElement(s); js.id = id;
			js.async = true; js.defer = true;
			js.src = "https://cdn.jsdelivr.net/gh/rdimascio/atc@1.7.1/dist/main.js";
			cbjs.parentNode.insertBefore(js, cbjs);
		}(document, 'script', 'cb-js'));
	
		(function(d, l, id){
			var css, cbcss = d.getElementsByTagName(l)[0];
			if (d.getElementById(id)) {return;}
			css = d.createElement(l); css.id = id;
			css.setAttribute("rel", "stylesheet");
			css.href = "https://cdn.jsdelivr.net/gh/rdimascio/atc@1.7.1/dist/main.css";
			cbcss.parentNode.insertBefore(css, cbcss);
		}(document, 'link', 'cb-css'));
	
		(function(w) {
			setTimeout(() => {
				if (!w.CB) {return;}
				${displayOfferings()}
				${displayAction()}
				w.CB.init();
			}, 500)
		}(window));
	}());
&lt;/script&gt;
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
					offeringID: '${offer.offeringID}',
					price: '${offer.price}'
				},`;
		});

		keyString += '\n\t\t\t]'
	}

	return keyString;
}

function displayAction() {
	let actionString = 'w.CB.action = "window"';

	if (url.searchParams.has('action')) {
		let action = url.searchParams.get('action');
		actionString = `w.CB.action = "${action}"`;
	}

	return actionString;
}

const removeInputGroup = () => {
	event.preventDefault();

	const PARENT = event.target.parentNode;
	PARENT.remove();
}

const addNewInputGroup = () => {
	event.preventDefault();

	const PARENT = event.target.parentNode;
	const NEW_GROUP = PARENT.cloneNode(true);
	NEW_GROUP.querySelector('.asin').value = '';
	NEW_GROUP.querySelector('.offerID').value = '';
	NEW_GROUP.querySelector('.price').value = '';
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
		const PRICE = form.querySelector('.price').value;

		if (ASIN && OFFER_ID && PRICE) {
			offering.asin = ASIN;
			offering.offeringID = OFFER_ID;
			offering.price = PRICE;

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
					<label for="price">
						Price
						<input name="price" class="price" type="text" placeholder="45.99" value="${offer.price}" />
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
