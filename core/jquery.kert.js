		 $(document).ready(function() {
			//node-set
// 			alert($(document).simpath("//results").find("result").attr("icon-url"));
			//boolean value
// 			alert($(document).simpath("//result/@class = 'passed'"));
			//numeric value
// 			alert($(document).simpath("//result[7]/@no div 2"));
			//single node
// 			alert($(document).simpath("//result[7]").attr("id"));
			//attribute
// 			alert($(document).simpath("//result[@id = 'passed']/@icon-url"));


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
		 } );
		function openPlan(planURI) {
			$.get(planURI, function(xml) {
				//clear test plan
				$("#units-details").empty();
				//clear tree data
				$("#dynatree-data").empty();
				//clear results' summary
				$("#custom-tests").empty();
				//load test plan
				$("#units-details").append($(xml.documentElement).clone());
				//render the collections of tests
				$("#dynatree-data").append($("#units-details test-tree > ul").clone());
				if ($("#test-plan-tree > ul").hasClass('dynatree-container')) {
					$("#test-plan-tree").html($("#dynatree-data").html());
					$("#test-plan-tree").dynatree("getTree").reload();
				} else {
					$("#test-plan-tree").html($("#dynatree-data").html());
					$("#test-plan-tree").dynatree();
				}

				$("#plan-description").text($("#units-details description:first").text());
				var resultTokens = $("#units-details result").map(function() {return $(this).attr("id");}).get().join(' ');
				//render results' summary
				$("#all-tests output").text($("#units-details test").length);
				$("#units-details results > result").each(function(index) {
					$("<div class=\"field\" id=\"" + $(this).attr("id") + "-tests\"><label>" + $(this).text() + " tests:</label><output>0</output></div>").appendTo("#custom-tests");
				});

				//run tests
				$("#units-details test").each(function(index) {
					//$("<div/>", {"id" : "unit-div-" + index}).appendTo("body").load($(this).children("test-url").text(), function(){$("#b1").click();}).error(function(){alert('error');});
					$.ajax({url: $(this).children("test-url").text(), testId: $(this).attr("id")})
						.error(function() {
							
							//oTable.fnUpdate( "Test not found", index, 2 );
							//$(tr).css({"background-color": "white", "color": "black"});
							//update status of test in tree view

							//update status of test in test plan
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
									var resultDescription = $(document).simpath("//*[local-name() = 'result'][@id = '" + resultId + "']");
									//update status of test in tree view
// 									$(tr).css({"background-color": resultDescription.attr("background-color"), "color": resultDescription.attr("font-color")});
									var iconURL = resultDescription.attr("icon-url"),
										backgroundImageURL = iconURL ? iconURL : 'resources/images/warning.png';
									$("#test-plan-tree").dynatree("getTree").getNodeByKey("tree-" + $(this).attr("id").substring(12))
										.span.children[1].style.backgroundImage = 'url(' + backgroundImageURL + ')';
									//update status of test in test plan
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
