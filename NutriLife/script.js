//	----------------------------------------------------------------------------------------------------------------------------
/*	html to js data
	 jnt_imc_r: don't want to hardcode the elements we're dealing with
	 jns_imc_r: Iterate through list and add (current index).innerHTML content to jns_imc[] (useable, shares same index).
	 TODO: this whole thing could be more automatic
*/
//	----------------------------------------------------------------------------------------------------------------------------

/* PURPOSE:
@@ interface for use in code
*/
let jnt_imc = [];
function jnt_imc_r() //0 weight, 1 height, 2 result, 3 eval, +4 for value types
{	
	let jnt_x_r = [ // TODO: typing this all out is silly
		"jnt_x_w",
		"jnt_x_h",
		"jnt_x_r",
		"jnt_x_e",
		"jnt_x_w_t",
		"jnt_x_h_t",
		"jnt_x_r_t",
		"jnt_x_e_t"
	];
	
	// fetch jnt_x_r[] strings stored on the html, add to useable array
	for (let i = 0; i < jnt_x_r.length; i++) {
		jnt_imc[i] = document.getElementById(jnt_x_r[i]).innerHTML;
	}

}

/* PURPOSE:
@@ ui strings
*/
let jns_imc = [];
function jns_imc_r()
{
	let jns_x_r = [	// TODO: typing this all out is silly
		"jns_x_0",	
		"jns_x_1",
		"jns_x_2",
		"jns_x_3",
		"jns_x_4",
		"jns_x_5",
		"jns_x_6",
		"jns_x_7"
	];

	// fetch jns_x_r[] strings stored on the html, add to useable array
	for (let i = 0; i < jns_x_r.length; i++) {
		jns_imc[i] = document.getElementById(jns_x_r[i]).innerHTML;
	}
}

//	----------------------------------------------------------------------------------------------------------------------------
/*	IMC calculator
	 jni_calc calculates IMC based on weight (kg) and height (cm).
	 jni_tab finds where it falls on the eval table, it being organized as (zero to before 16, 16 to before 20, 20 to before 25,
	etc.) and returns appropriate string.
	 jni_tab -> eval -> c: Current iteration is end A, current iteration plus one is end B. If testing between end A and B
	succeeds, break and return i. If not, shift ends (A B) to (B C). Repeat until success or array exhaust, in which B is
	undefined and A is "array_end". Return "overf" if true.
	 TODO: j_u_imcresult could be more elegant. And by that I meant STUPIDIER.
	 TODO: unify jni_tab->eval and jni_tab->msgf?
*/
//	----------------------------------------------------------------------------------------------------------------------------

/* PURPOSE:
@@ Calculate IMC
*/
function jni_calc( w , h )
{
	// WEIGHT / HEIGHT^2
	// since height is in centimetres...
	// WEIGHT / (HEIGHT/100)^2
	// or...
	// WEIGHT / ( HEIGHT^2 / 100^2 )
	
	return parseFloat( ( w/((h*h)/10000) ).toFixed(1) ); // HACKHACK: parseFloat to undo toFixed's (rounding) conversion to string
}

/* PURPOSE:
@@ Evaluate IMC rating
*/
function jni_tab( input )
{
	// IMC rating intervals
	let table = [0,16,20,25,30,40,"array_end"]; // TODO: overcomplicate this further? ;)
	
	// evaluate
	function eval( input )
	{
		
		// 0 -> 15.9, 16 -> 19.9, etc.
		function e_test( a, b, n )
		{
			if (n >= a && b > n)
				return 1;
		}
		
		/* PURPOSE:
		@@ evaluate through
		@@ return position on table
		*/
		function runthrough( input )
		{
			for ( let i=0,b=0 ; i < (table.length -1) ; i++ )
			{
				b = i + 1;
				if ( e_test(table[i],table[b],input) ) break;
			}
			
			return i;
		}
		
		return ( eval(input) );
	}
	
	// return useable string based on eval
	function msgf(m) // relevant ui index should always be at the end of jns_imc[]
	{
		if	(m == "array_end")	return( jns_imc[ (jns_imc.length)	-		1 ] );
		else					return( jns_imc[ (jns_imc.length) 	+ (m - 6) ] );
	}
	
	return msgf( eval(input) );
}

function j_u_imcresult()
{
	//TODO: hardcoded to get "value"; ideally we should use jnt_imc;
	let w = document.getElementById(jnt_imc[0]).value;
	let h = document.getElementById(jnt_imc[1]).value;
	
	//don't use NaN or >= 0; warn user
	if ( isNaN(w) || isNaN(h) || !(w > 0) || !(h > 0) )
	{
		document.getElementById(jnt_imc[2]).setAttribute(jnt_imc[6], jns_imc[1]);
		document.getElementById(jnt_imc[3]).setAttribute(jnt_imc[7], jns_imc[0]);
	}

	else
	{
		let n = jni_calc(w,h);
		let e = jni_tab(n);
		document.getElementById(jnt_imc[2]).setAttribute(jnt_imc[6], n);
		document.getElementById(jnt_imc[3]).setAttribute(jnt_imc[7], e);
	}
}
//	----------------------------------------------------------------------------------------------------------------------------
//	init
//	----------------------------------------------------------------------------------------------------------------------------
jnt_imc_r();//set up imc calc hooks
jns_imc_r();//load strings

/*
//	----------------------------------------------------------------------------------------------------------------------------
//	Bonus! This was what I initially wrote. Has a couple of real problems, but it doesn't do more than it NEEDS to.
//	----------------------------------------------------------------------------------------------------------------------------
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