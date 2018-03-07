/* Load And Export Model */
/*
 *	Export as .json file with file reader api
 */
function exportModel(dots,cons,shapes,unnamed) {
	const filename = document.getElementById("filename");
	let tmpP = [];
	let pushInMe = [];
	let tmpS = [];
	let tmpPush;
	for (let i = 0; i < dots.length; i++) {
		const p = dots[i];
		tmpP.push([p.x,p.y,p.oldx,p.oldy,p.pinned, p.color]);
	}
	console.log(JSON.stringify(dots))
	for (let j = 0; j < cons.length; j++) {
		const c = cons[j];
		tmpPush = c.id;
		tmpPush.push(c.hidden);
		pushInMe.push(tmpPush);
	}
	for (let j = 0; j < shapes.length; j++) {
		const c = shapes[j];
		tmpS.push([c.id,c.color]);
	}
	//Compilation For Verlet.create And Verlet.clamp
	const strP = JSON.stringify(tmpP);
	const strC = JSON.stringify(pushInMe);
	const strS = JSON.stringify(tmpS);
	const compiled = strP + ' || ' + strC + ' || ' + strS;

	let time = new Date().toLocaleString();
	fs.create({
		type : 'application/json',
		name : unnamed ? time + '.json' : filename.value + '.json',
		content : compiled
	});
}

/*Load Model*/
/*
 *	load .json file and parse it to verlet
 *	update Interact
 *	superUpdate
 */
function loadFile(dots,cons,shapes,verlet) {
	const PhysicsAccuracy = document.getElementById('Iterrations');
	let data = fs.read('#loadPoints');
	dots.splice(0,dots.length);
	cons.splice(0,cons.length);
	data[0].onload = function() {
		let result = data[0].result.split(' || ');
		let arrDots = JSON.parse(result[0]); //Points
		let arrCons = JSON.parse(result[1]); //Constrains
		verlet.create(arrDots,dots);
		verlet.clamp(arrCons,cons,dots);

		if(result[2]) { //Backward Save File Compat // Forms
			let arrForms = JSON.parse(result[2]);
			for (let i = 0; i < arrForms.length; i++) {
				verlet.shape(arrForms[i][0],shapes,dots,arrForms[i][1]);
			}
		}
	};
	verlet.Interact.move(dots,cons,10,'white');
	verlet.superUpdate(dots,cons,PhysicsAccuracy.value);
}
