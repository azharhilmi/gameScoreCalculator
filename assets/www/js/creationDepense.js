document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
	recupererTousLesParticipants();
	gestionDeLAjoutDeDepense();
}

function gestionDeLAjoutDeDepense() {
	$("#ajouterDepense")
			.click(
					function() {
						var db = window.openDatabase("Database", "1.0",
								"Cordova Demo", 200000);
						db
								.transaction(
										function(tx) {
											tx
													.executeSql(
															'INSERT INTO DEPENSE (montant,participant_id) VALUES (?,?)',
															[
																	$(
																			"#depense")
																			.val(),
																	$(
																			"#participantSelectionne")
																			.val() ],
															errorCB);
										}, errorCB);
					});
}

function recupererTousLesParticipants() {
	var idProjetCourant = window.localStorage.getItem("idProjetCourant");
	var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
	db
			.transaction(function(tx) {
				tx
						.executeSql(
								"SELECT * FROM PARTICIPANT WHERE projet_id = ?",
								[ idProjetCourant ],
								function(tx, results) {
									var len = results.rows.length;
									Handlebars
											.registerHelper(
													'listeDesParticipants',
													function(selected) {
														var ret = "";
														for ( var i = 0; i < len; i++) {
															var selectedVal = "";
															var id = results.rows
																	.item(i).id;
															var nom_participant = results.rows
																	.item(i).nom_participant;
															if (typeof (selected) == "string"
																	&& nom_participant === selected
																			.toUpperCase()) {
																selectedVal = "selected";
															}

															ret += "<option "
																	+ selectedVal
																	+ " value='"
																	+ id
																	+ "'>"
																	+ nom_participant
																	+ "</option>";
														}
														return new Handlebars.SafeString(
																ret);
													});
									this.allerAPageDeSyntheseTpl = Handlebars
											.compile($(
													"#aller-a-la-page-de-synthese-tpl")
													.html());
									$('body')
											.append(
													Handlebars
															.compile($(
																	"#afficher-liste-deroulante-participant-tpl")
																	.html()))
											.append(
													Handlebars
															.compile($(
																	"#aller-a-la-page-de-synthese-tpl")
																	.html()));
								}, errorCB);
			});
}
function errorCB(err) {
	console.log("Error processing SQL: " + err.code);
}