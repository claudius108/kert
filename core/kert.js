$(document).ready(function() {
    $("#test-plan-details").tabs();
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
	var q = document.location.search || document.location.hash;
	if (q) {
		openPlan(q.substring(5));	
	}
});
function openPlan(planURI) {
	//define data instance for test plan data
	$x.instance('test-plan').load($x.parseFromString("<test-plan xmlns:kert=\"http://kuberam.ro/ns/kert\"/>"));
	//load annotator's toolbar
	$x.submission({
		"ref" : "simpath:instance('test-plan')",
		"resource" : planURI,
		"mode" : "synchronous",
		"method" : "get"
	});

	//clear results' summary
	$("#custom-tests").empty();

	var testPlanResults = $($x.xpath("simpath:instance('test-plan')//kert:result"))
	, testPlanTests = $($x.xpath("simpath:instance('test-plan')//kert:test"))
	, resultTokens = testPlanResults.map(function() {return $(this).attr("id");}).get().join(' ')
	, oUnfoundResultDescription = $($x.xpath("simpath:instance('test-plan')//kert:result[@id = 'unfound']")[0])
	, sTestPlanTree = $x.serializeToString($x.xpath("simpath:instance('test-plan')//kert:test-tree/*")[0])
	;

	if ($("#test-plan-tree > ul").hasClass('dynatree-container')) {
		$("#test-plan-tree").html(sTestPlanTree);
		oTestsTree.reload();
	} else {
		$("#test-plan-tree").html(sTestPlanTree);
		$("#test-plan-tree").dynatree({
			onActivate: function(node) {
				var sTestID = node.data.key.substring(5);
				$("#test-author").text($x.xpath("simpath:instance('test-plan')//kert:test[@id = '" + sTestID + "']/kert:author/text()"));
				$("#test-description").text($x.xpath("simpath:instance('test-plan')//kert:test[@id = '" + sTestID + "']/kert:description/text()"));
				if ($x.xpath("simpath:instance('test-" + sTestID + "')//*[local-name() = 'actual-result']")[0]) {$("#test-result").text($x.serializeToString($x.xpath("simpath:instance('test-" + sTestID + "')//*[local-name() = 'actual-result']")[0]));}
				$("#test-assertion").text($x.xpath("simpath:instance('test-plan')//kert:test[@id = '" + sTestID + "']/kert:assertion/text()"));
				$("#test-source").text($x.xpath("simpath:instance('test-" + sTestID + "-source')//kert:source/text()"));
				$("#test-error-message").text($x.serializeToString($x.xpath("simpath:instance('test-" + sTestID + "')//*[local-name() = 'exception']")[0]));
			}
		});
		var oTestsTree = $("#test-plan-tree").dynatree("getTree");
	}
	$("#plan-description").text($($x.xpath("simpath:instance('test-plan')/kert:test-plan/kert:description")).text());
	//render results' summary
	$("#all-tests-output").html($x.xpath("count(//kert:test)"));
	testPlanResults.each(function(index) {
		var sResultSummaryId = "kert-test-result-" + $(this).attr("id");
		$("<div/>", {"id": sResultSummaryId, "class": "field"}).appendTo("#custom-tests");
		$("#" + sResultSummaryId).append("<label>" + $(this).text() + " tests: </label>").append("<html5:output id=\"" + sResultSummaryId + "-output\">0</html5:output>", {"value" : "0"});
	});
	//run tests
	testPlanTests.each(function(index) {
		var testPlanTest = $(this)
		, sTestID = testPlanTest.attr("id")
		;
		$.ajaxSetup({
			timeout: 600000
		});
		var testTreeNode = oTestsTree.getNodeByKey("tree-" + sTestID);
		testTreeNode.focus();
		testTreeNode.span.children[1].style.backgroundImage = 'url(../resources/images/loading.gif)';
		$.get($x.xpath("//kert:test-url/text()", testPlanTest[0]))
		.success(function(xml) {
			var sTestID = testPlanTest.attr("id");
			$x.instance('test-' + sTestID).load((typeof xml == "string") ? $x.parseFromString(xml.replace(/<!DOCTYPE html>/, "")) : xml);
			var oTestAssertion = $x.xpath("//kert:assertion/text()", testPlanTest[0])
			, resultId = $($x.xpath("simpath:instance('" + 'test-' + sTestID + "')" + oTestAssertion)).text();
			resultId = resultId ? resultId : 'unknown';
			if (resultTokens.indexOf(resultId) == -1) {
				resultId = 'undefined-result-token';
			}
			var resultDescription = $($x.xpath("simpath:instance('test-plan')//kert:result[@id = '" + resultId + "']"));
			//update status of test in tree view
			//$(tr).css({"background-color": resultDescription.attr("background-color"), "color": resultDescription.attr("font-color")});
			var iconURL = resultDescription.attr("icon-url")
			, backgroundImageURL = iconURL ? iconURL : '../resources/images/warning.png';
			testTreeNode.focus();
			testTreeNode.span.children[1].style.backgroundImage = 'url(' + backgroundImageURL + ')';
			//update status of test in test plan
			$x.setvalue("simpath:instance('test-plan')//kert:test[@id = '" + sTestID + "']/kert:run-status", "'" + resultId + "'");
			$x.setvalue("simpath:instance('test-plan')//kert:test[@id = '" + sTestID + "']/kert:run-status/@timestamp", "'" + new Date().toUTCString() + "'");
			//update summary
			$("#kert-test-result-" + resultId + "-output").text(Number($("#kert-test-result-" + resultId + " > html5\\:output").text()) + 1);
			//update result score
			$x.setvalue("simpath:instance('test-plan')//kert:result[@id = '" + resultId + "']/@score", ". + 1");
			//get the test's source
			$.get($x.xpath("//kert:source-url/text()", testPlanTest[0]))
			.success(function(text) {
				text = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
				$x.instance("test-" + sTestID + "-source").load($x.parseFromString("<kert:test-source xmlns:kert=\"http://kuberam.ro/ns/kert\"><kert:source>" + text + "</kert:source></kert:test-source>"));
			})
			.error(function() {
				$x.instance("test-" + sTestID + "-source").load($x.parseFromString("<kert:test-source xmlns:kert=\"http://kuberam.ro/ns/kert\"><kert:source>The source of this test is not available.</kert:source></kert:test-source>"));
			});
		})
		.error(function(text) {//alert(text);
			var sTestID = testPlanTest.attr("id");
			//oTable.fnUpdate( "Test not found", index, 2 );
			//$(tr).css({"background-color": "white", "color": "black"});
			//update status of test in tree view
			//update status of test in test plan
			$x.setvalue("simpath:instance('test-plan')//kert:test[@id = '" + sTestID + "']/kert:run-status", "'unfound'");
			$x.setvalue("simpath:instance('test-plan')//kert:test[@id = '" + sTestID + "']/kert:run-status/@timestamp", "'" + new Date().toUTCString() + "'");
			//update summary
			$("#kert-test-result-unfound-output").text(Number($("#kert-test-result-unfound > html5\\:output").text()) + 1);
			//update result score
			$x.setvalue("simpath:instance('test-plan')//kert:result[@id = 'unfound']/@score", ". + 1");
		})
		;
	});	
}
//TODO:
//result and error tabs are too related to eXist