//	----------------------------------------------------------------------------------------------------------------------------
//	
//	2021 NutriLife - Pietro Rodrigues, Niko Araújo, Guilherme Gomes, Alecsander Fischer.
//	
//	----------------------------------------------------------------------------------------------------------------------------

/*	Wrote this ENTIRELY myself! It is SO ridiculously over-engineered, hahah.
	It was fun, though. No idea how good it actually is. It seems fairly extendable! 
	Which is useless, because this project will be dead soon and the IMC table
	is not dynamic in the slightest. Also, the readability seems to be quite sucky.
	Oops. And, also, I think I've got a bit of trauma with not being able to specify
	data types. Or maybe it's Stockholm Syndrome that is making me dislike it. Does
	parsed languages perform worse with more lines and whitespace and comments?
	I wonder. It's probably easy to look up, but my brain has almost completely rotten.
	--AlecsF
*/

//	----------------------------------------------------------------------------------------------------------------------------
//	strings
//	----------------------------------------------------------------------------------------------------------------------------

let jns_imc = [];	/*	String array	*/

function jns_imc_r(){	/*	load strings stored in html to array	*/
	let jns_x_r = [	//	jns_imc[n]
		"jns_x_0",	
		"jns_x_1",
		"jns_x_2",
		"jns_x_3",
		"jns_x_4",
		"jns_x_5",
		"jns_x_6",
		"jns_x_7"
	];
	for (let i = 0; i < jns_x_r.length; i++){
		jns_imc[i] = document.getElementById(jns_x_r[i]).innerHTML;
	}
}

//	----------------------------------------------------------------------------------------------------------------------------
//	IMC calculator
//	----------------------------------------------------------------------------------------------------------------------------

function jni_calc(w,h){	/*	calculates IMC based on weight (kg) and height (cm)	*/
	return parseFloat( ( w/((h*h)/10000) ).toFixed(1) );	/*	HACKHACK: parseFloat to undo toFixed's conversion to string	*/
}

function jni_tab(imcrn){	/*	Take IMC result and evaluate where it falls on the table.
							Return useable UI text.	*/
	let table = [0,16,20,25,30,40,"array_end"];
	function eval(imcrn_e){			/*	Return which range it lies.	*/
		function range(a,b,n){
			if (n >= a && b > n)
				return 1;
		}
		function c(imcrn_e_c){		/*	Current iteration is end A, current iteration plus one is end B.
									If testing between end A and B succeeds, break and return i. If not,
									shift ends (A B) to (B C). Repeat until success or array exhaust, in
									which B is undefined and A is "array_end". Return "overf" if true.	*/
			let i = 0;
			let b = 0;
			for (; i < table.length; i++){
				b = i + 1;
				if ( range(table[i],table[b],imcrn_e_c) )
					break;
			}
			if ( isNaN(table[i]-1) )
				return "overf";
			else
				return i;
		}
		return ( c(imcrn_e) );
	}
	function msgf(m){	/*	those labels are always the last strings in the array	*/
		if	(m == "overf")	{ return( jns_imc[ (jns_imc.length)	-		1 ] ); }
		else				{ return( jns_imc[ (jns_imc.length) + (m - 6) ] ); }
	}
	return msgf( eval(imcrn) );
}

function j_u_imcresult(){	/*	UI button func; set boxes to jni_calc/tab results	*/
	let w = document.getElementById("peso").value;
	let h = document.getElementById("altura").value;
	if ( isNaN(w) || isNaN(h) || !(w > 0) || !(h > 0) ){	/* don't use NaN or >= 0; warn user	*/
		document.getElementById("resultadoimc").setAttribute("value", jns_imc[1]);
		document.getElementById("avaliacaoimc").setAttribute("value", jns_imc[0]);
	}
	else{
		let n = jni_calc(w,h);
		let e = jni_tab(n);
		document.getElementById("resultadoimc").setAttribute("value", n);
		document.getElementById("avaliacaoimc").setAttribute("value", e);
	}
}

//	----------------------------------------------------------------------------------------------------------------------------
//	init
//	----------------------------------------------------------------------------------------------------------------------------

jns_imc_r();



//	----------------------------------------------------------------------------------------------------------------------------
//	Bonus! This was what I initially wrote. Has a couple of real problems, but it doesn't do more than it NEEDS to.
//	----------------------------------------------------------------------------------------------------------------------------
/*
	function jni_imc(w,h){
		w = w / (h*h);
		return w;
	}
	function jni_lok(x){
		if (x < 16)
			return("Subpeso Severo");
		if (20 > x && x >=16)
			return("Subpeso");
		if (25 > x && x >= 20)
			return("Normal");
		if (30 > x && x >= 25)
			return("Sobrepeso");
		if (40 > x && x >= 30)
			return("Obeso");
		if (x >= 40)
			return("Obeso Mórbido");
	}
	function jni_prn() {
		var w = document.getElementById("peso").value;
		var h = document.getElementById("altura").value;
		if ( isNaN(w) || isNaN(h) || !(w > 0) || !(h > 0) ){
			document.getElementById("resultadoimc").setAttribute("value", "Valor inválido!");
			document.getElementById("avaliacaoimc").setAttribute("value", "");
		}
		else{
			var result_n = jni_imc(w,h);
			var result_t = jni_lok(result_n);
			document.getElementById("resultadoimc").setAttribute("value", result_n.toFixed(2)); // TODO: possibly problematic
			document.getElementById("avaliacaoimc").setAttribute("value", result_t);
		}
	}
*/