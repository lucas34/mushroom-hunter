var offset = 20;
var tailleGrille = 500;
var borne = 5;
var couleur = "#AFAFAF";
var isElement = false;
var isMakeOnRiver = true;
var nbLigne = "a";
var grille;
var isConstruit = false;
var murEnConstruction = new Array();
var listeChampignon = new Array();
var elementName = "arbre";

$(function() {
	$("#idArbre").click(function() {
		$(this).removeClass("transparent");
		$("#idRiver").addClass("transparent");
		$("#idNeph").addClass("transparent");
		for(var i=0;i<listeChampignon.length;i++) {
			$("#"+listeChampignon[i]).addClass("transparent");
		}
		isElement = true; 
		isMakeOnRiver = false;
		elementName = "arbre";
	});
	$("#idRiver").click(function() {
		$(this).removeClass("transparent");
		$("#idArbre").addClass("transparent");
		$("#idNeph").addClass("transparent");
		for(var i=0;i<listeChampignon.length;i++) {
			$("#"+listeChampignon[i]).addClass("transparent");
		}
		isElement = false; 
		isMakeOnRiver = false;
		elementName = "riviere";
	});  
	$("#idNeph").click(function() {
		$(this).removeClass("transparent");
		$("#idRiver").addClass("transparent");
		$("#idArbre").addClass("transparent");
		for(var i=0;i<listeChampignon.length;i++) {
			$("#"+listeChampignon[i]).addClass("transparent");
		}
		isElement = true; 
		isMakeOnRiver = true;
		elementName = "nenuphar";
	});

	var listeChampignon = new Array();
	listeChampignon[0] = "Cuphophyllus_niveus";
	listeChampignon[1] = "Disciotis_venosa";
	listeChampignon[2] = "Agaricus_aestivalis";
	$(".champignonElement").click(function() {
		$("#idArbre").addClass("transparent");
		$("#idRiver").addClass("transparent");
		$("#idNeph").addClass("transparent");
		for(var i=0;i<listeChampignon.length;i++) {
			$("#"+listeChampignon[i]).addClass("transparent");
		}
		$(this).removeClass("transparent");
		isElement = true; 
		isMakeOnRiver = false;
		elementName = $(this).attr("id");
	});		

	bootLucasCode();

});

function loadSVG() {
	$("#divInventaire").hide();
	$("#divResultat").show();
}

function loadInventaire() {
	$("#divResultat").hide();
	$("#divInventaire").show();
}

function loadElementsForm() {
	$("#archiToolDiv").hide();
	$("#divFormulaire").show();
}

function loadArchitool() {
	$("#divFormulaire").hide();
	$("#archiToolDiv").show();
}

function writeLog(text){
	var message = document.getElementById("console").innerHTML;
	message = "> " + text + "<br />" ;//+Message_prototype;
	document.getElementById("console").innerHTML = message;

}


function bootLucasCode() {

	function proche(souris){
		return (
				(((souris[0] % offset) < borne) || ((souris[0] % offset) > (offset - borne))) 
				&& 
				(((souris[1] % offset) < borne) || ((souris[1] % offset) > (offset - borne)))
			   );
	}

	function getCoordonnees(souris){
		var x = offset * Math.round(souris[0] / offset);
		var y = offset * Math.round(souris[1] / offset);
		var coordonnes = new Array();
		coordonnes[0] = x;
		coordonnes[1] = y;
		return coordonnes;
	}

	function init(){
		var y=0;
		var nb = tailleGrille / offset + 1;
		grille = d3.select("#grille")
			.append("svg")
			.attr("width", tailleGrille)
			.attr("height", tailleGrille);

		// X
		for(var i=0;i<nb;i++){
			grille.append("line")
				.style("stroke", couleur)
				.attr("x1", 0)
				.attr("x2", tailleGrille)
				.attr("y1", y)
				.attr("y2", y)
				.on("mouseover", function(){d3.select(this).style("fill", "aliceblue");})
				.on("mouseout", function(){d3.select(this).style("fill", "white");});
			y +=offset;
		}
		// Y
		var x =0;
		for(var i=0;i<nb;i++){
			grille.append("line")
				.style("stroke", couleur)
				.attr("x1", x)
				.attr("x2", x)
				.attr("y1", 0)
				.attr("y2", tailleGrille);
			x +=offset;
		}

		grille.on("click", function(){
			var souris = d3.mouse(this);

			if(!isConstruit){
				if(proche(souris)){

					if(isElement){

						if(isMakeOnRiver){
							writeLog("Merci de le mettre sur une rivière");
						}
						else{
							writeLog("Nouveau "+elementName);
							var cxy = getCoordonnees(souris);
							cxy = getCoordonnees(souris);
							if(elementName === "arbre") {

								grille.append("svg:image")
			.attr("xlink:href", link_arbre)
			.attr("y", cxy[1]-15)
			.attr("x", cxy[0]-15)
			.attr("cx",cxy[0])
			.attr("cy",cxy[1])
			.attr("width",30)
			.attr("height",30)
			.attr("element",elementName)
			.attr("id", "element");
							}
							else{
								switch(elementName){
									case "Cuphophyllus_niveus":
										img = link_Cuphophyllus_niveus;
										break;
									case "Disciotis_venosa":
										img = link_Disciotis_venosa;
										break;
									case "Agaricus_aestivalis":
										img = link_Agaricus_aestivalis;
										break;
								}
								grille.append("svg:image")
									.attr("xlink:href",img)
									.attr("y", cxy[1]-20)
									.attr("x",cxy[0]-15)
									.attr("cx",cxy[0])
									.attr("cy",cxy[1])
									.attr("width",30)
									.attr("height",30)
									.attr("type", "mushroom")
									.attr("element",elementName)
									.attr("id", "element");
							}

						}
					}else{
						writeLog("Selectionnez le point d'arrivé de la rivière");
						isConstruit = true;
						murEnConstruction = getCoordonnees(souris);
						grille.append("line")
							.style("stroke", "#FF0000")
							.attr("x1", murEnConstruction[0])
							.attr("y1", murEnConstruction[1])
							.attr("x2", souris[0])
							.attr("y2", souris[1])
							.attr("id", "temp");
					}
				}
			}else{

				if(proche(souris)){
					writeLog("Nouvelle rivière");
					nbLigne+= "a";
					isConstruit = false;
					var coordonnes =  getCoordonnees(souris);
					grille.select("#temp").remove();

					grille.append("line")
						.style("stroke", "#8888FF")
						.attr("x1", murEnConstruction[0])
						.attr("y1", murEnConstruction[1])
						.attr("x2", coordonnes[0])
						.attr("y2", coordonnes[1])
						.attr("id", nbLigne)
						.attr("isWall",true)
						.on("mouseover", 

								function(){
									if(isMakeOnRiver){
										this.setAttribute("style", "stroke: #00FF00");
									}
								})
					.on("mouseout",
							function(){
								if(isMakeOnRiver){
									this.setAttribute("style", "stroke: #0000FF");
								}
							})
					.on("contextmenu", function(data, index) {
						writeLog("supression de la rivière et de tous les markeurs associés");
						var id = "#"+d3.select(this).attr("id");
						d3.selectAll(id).remove();
						d3.event.preventDefault();
					})

					.on("click",function(){
						if(isMakeOnRiver){
							var id = d3.select(this).attr("id");
							var souris = d3.mouse(this);
							writeLog("Nouveau nenuphar");
							grille.append("svg:image")
						.attr("xlink:href",link_nenuphar)
						.attr("y", souris[1]-15)
						.attr("x", souris[0]-15)
						.attr("cx",souris[0])
						.attr("cy",souris[1])
						.attr("height",30)
						.attr("width",30)
						.attr("id", id)
						.attr("element","nenuphar");
					this.setAttribute("style", "stroke: #0000FF");


						}
					});
				}
			}
		});
		grille.on("mousemove",function(){
			if(isConstruit){
				var souris = d3.mouse(this);

				if(proche(souris)){
					grille.select("#temp")
			.style("stroke", "#00FF00")
			.attr("x1", murEnConstruction[0])
			.attr("y1", murEnConstruction[1])
			.attr("x2", souris[0])
			.attr("y2", souris[1]);
				}else{
					grille.select("#temp")
			.style("stroke", "#FF0000")
			.attr("x1", murEnConstruction[0])
			.attr("y1", murEnConstruction[1])
			.attr("x2", souris[0])
			.attr("y2", souris[1]);
				}
			}
		});
	}
	init();

}

function open3D(){

	var page = 'play/3';
	window.open(page,"3D View","menubar=no, status=no, scrollbars=no, menubar=no, width=800, height=600");

}


function generateJASON(){

	var listeDesElements = "[";
	d3.selectAll("image").each(function(){
		var cx = d3.select(this).attr("cx")*4-(tailleGrille*2);
		var cy = d3.select(this).attr("cy")*4-(tailleGrille*2);
		var element = d3.select(this).attr("element");
		var type = d3.select(this).attr("type");
		if(element){
			if(type !== null) {
				listeDesElements +=
					'{"x1":'+ cx +
					',"x2":'+ cx +
					',"y1":'+ cy +
					',"y2":' + cy +
					',"type":' + '"'+type+'"' +
					',"element":' + '"'+element+'"';
				listeDesElements += "},";
			}else{
				listeDesElements +=
					'{"x1":'+ cx +
					',"x2":'+ cx +
					',"y1":'+ cy +
					',"y2":' + cy +
					',"element":' + '"'+element+'"';
				listeDesElements += "},";
			}
		}
	});

	d3.selectAll("line").each(function(){

		var x1 = d3.select(this).attr("x1")*4-(tailleGrille*2);
		var y1 = d3.select(this).attr("y1")*4-(tailleGrille*2);
		var x2 = d3.select(this).attr("x2")*4-(tailleGrille*2);
		var y2 = d3.select(this).attr("y2")*4-(tailleGrille*2);
		var  isWall =  d3.select(this).attr("isWall");
		if(isWall){
			listeDesElements +=
				'{"x1":'+ x1 +
				',"x2":'+ x2 +
				',"y1":'+ y1 +
				',"y2":' + y2 +
				',"element": "riviere"},';
		}
	});
	
	var taille = listeDesElements.length - 1;
	listeDesElements = listeDesElements.substring(0,taille);
	if(listeDesElements !== "") {
		listeDesElements += "]";
		localStorage["json"] = listeDesElements;	
		writeLog("Carte enregistrée");
	}
}
