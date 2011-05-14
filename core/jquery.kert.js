		 $(document).ready(function() {
			$("#test-plan-tree").dynatree({title: "DynaTree root", rootVisible: true});
			$("#test-plan-tree").dynatree("getTree").getNodeByKey("tree-1")
				.span.children[1].style.backgroundImage = 'url(resources/images/passed.png)';
			$("#test-plan-tree").dynatree("getTree").getNodeByKey("tree-2")
				.span.children[1].style.backgroundImage = 'url(resources/images/failed.png)';
			$("#test-plan-tree").dynatree("getTree").getNodeByKey("tree-3")
				.span.children[1].style.backgroundImage = 'url(resources/images/warning.png)';

			var $dialog = $("#open-test-dialog")
				.dialog({
					autoOpen: false,
					width : 700,
					buttons: {
						"Open": function() {
							openPlan( $( "#plan-uri" ).val() );
							$( this ).dialog( "close" );
						},
						Cancel: function() {
							$( this ).dialog( "close" );
						}
					}
			});
			$('#open-test').click(function() {
				$dialog.dialog('open');
				return false;
			});
			$("ul.sf-menu").superfish();
			oTable = $("#test-results").dataTable({
				"bJQueryUI": true,
				"bAutoWidth": false,
				"sPaginationType": "full_numbers",
				"aoColumns": [
					{ "bSearchable": false, "sWidth": "10px" },
					null,
					{ "sWidth": "170px" },
					{ "bSortable": false, "bSearchable": false, "sWidth": "100px" },
				]
			});
		 } );
		function openPlan(planURI) {
			$.get(planURI, function(xml) {
				//clear test plan
				$("#units-details").empty();
				$("#units-details").append($(xml.documentElement).clone());
				$("#dynatree-data").append($("#units-details collections").clone());
				//$("#test-plan-tree").append($("#units-details #data").clone());//.dynatree();

				//alert($("#test-plan-tree").html());
				
// 				$("#dynatree-data").transform({
// 					success: function () {
// 						$("#test-plan-tree").html($("#dynatree-data").html()).dynatree();
// 						$("#dynatree-data").remove();
// 					},
// 					xmlstr: $("#dynatree-data").html().replace(/" id="/g, ""),
// 					xsl: "test-plan2json.xsl"
// 				});
				$("#units-description").text($("#units-details description:first").text());
				var resultTokens = $("#units-details result").map(function() {return $(this).attr("id");}).get().join(' ');
				//clear tests views
				oTable.fnClearTable();
				//clear results' summary
				$("#custom-tests").empty();
				//render results' summary
				$("#all-tests output").text($("#units-details test").length);
				$("#units-details results > result").each(function(index) {
					$("<div class=\"field\" id=\"" + $(this).attr("id") + "-tests\"><label>" + $(this).text() + " tests:</label><output>0</output></div>").appendTo("#custom-tests");
				});
				//render the collections of tests
				$("#units-details test").each(function(index) {
					oTable.fnAddData( [index + 1, $(this).children("description").text(), "Testing ...", ""] );
				});
				//run tests
				$("#units-details test").each(function(index) {
					var tr = oTable.fnGetNodes(index);
					$(tr).css('background-color', 'orange').css('font-weight', 'bold')
						.css('color', 'white')
						.children("td:eq(2)").css('text-align', 'center');
					//$("<div/>", {"id" : "unit-div-" + index}).appendTo("body").load($(this).children("test-url").text(), function(){$("#b1").click();}).error(function(){alert('error');});
					$.ajax({url: $(this).children("test-url").text(), testId: $(this).attr("id")})
						.error(function() {
							oTable.fnUpdate( "Test not found", index, 2 );
							$(tr).css({"background-color": "white", "color": "black"});
							//update status of test
							$("#units-details test-url:contains('" + this.url + "')").siblings("run-status").text('unfound').attr("timestamp", new Date().toUTCString());
							//update summary
							$("#unfound-tests > output").text(Number($("#results-summary #unfound > output").text()) + 1);
							//update result score
							$("#unfound").attr("score", Number($("#units-details #unfound").attr("score")) + 1)
						})
						.success(function() {
							$("<iframe/>", {"id" : "test-iframe-" + this.testId, "src" : this.url})
								.appendTo("#iframes-host")
								.load(function(){
									var resultId = $(this).contents().find($("#units-details test:eq(" + index + ")").children("evaluation").text()).text(),
										resultId = resultId ? resultId : 'unknown';
									if (resultTokens.indexOf(resultId) == -1) {
										resultId = "undefined";
									}
									var resultDescription = $("#" + resultId);
									//update status of test in tree view
									oTable.fnUpdate( resultDescription.text(), index, 2 );
									$(tr).css({"background-color": resultDescription.attr("background-color"), "color": resultDescription.attr("font-color")});
									var iconURL = resultDescription.attr("icon-url"),
										backgroundImageName = iconURL ? iconURL : 'resources/images/warning.png';
									$("#test-plan-tree").dynatree("getTree").getNodeByKey("tree-" + $(this).attr("id").substring(12))
										.span.children[1].style.backgroundImage = 'url(' + backgroundImageName + ')';
									//update status of test
									$("#units-details test-url:contains('" + this.src + "')").siblings("run-status").text(resultId).attr("timestamp", new Date().toUTCString());
									//update summary
									$("#" + resultId + "-tests > output").text(Number($("#" + resultId + "-tests > output").text()) + 1);
									//update result score
									$("#" + resultId).attr("score", Number($("#" + resultId).attr("score")) + 1);
									$("#test-iframe-" + this.testId).remove();
							});
						});
				});
			}, "xml").error(function() { alert("Cannot load file: " + this.url + "."); });
		}
