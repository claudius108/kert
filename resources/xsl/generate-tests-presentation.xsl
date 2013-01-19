<?xml version="1.0" encoding="UTF-8"?>
<!-- kert, web test runner By Claudius Teodorescu Licensed under LGPL. -->
<xsl:stylesheet xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:kert="http://kuberam.ro/ns/kert" version="1.0">
    <xsl:output method="xml"/>
    <xsl:variable name="testPlanBaseUri" select="/kert:test-plan/@xml:base"/>
    <xsl:template match="/">
        <html>
            <head>
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
                <style>
					body {
					font-family: 'Verdana', sans-serif;
					width: 100%;
					margin: 0;
					padding: 0;
					background-color: #fbfbef;
					}
					html {
					width: 100%;
					padding: 5px;
					}
					.title {
					margin-left: 3%;
					}
					.test-summary {
					float: left;
					width: 98%;
					margin-bottom:
					15px;
					}
					.logo {
					width: 3%;
					height: 100%;
					float: left;
					margin-top: 10px;
					text-align: center;
					}
					.test-summary-content {
					float: left;
					width: 94%;
					height: 100%;
					}
					.test-description {
					float: left;
					width: 95%;
					margin-top: 10px;
					}
					.test-summary-title {
					margin: 0 0 10 22;
					font-weight:
					bold;
					width: 90%;
					}
					.test-summary-description {
					width: 90%;
					}
					.test-summary-operations {
					margin-left: 12px;
					}
					.test-status-passed {
					color: green;
					}
					.test-status-passed:after {
					content: " passed";
					} 
					.test-status-failed {
					color: red;
					}
					.test-status-failed:after {
					content: " failed";
					}					
				</style>
            </head>
            <body>
                <h2 class="title">
                    <xsl:value-of select="/kert:test-plan/kert:description"/>
                </h2>
                <h6 class="title">
                    <xsl:value-of select="concat('(test plan version: ', /kert:test-plan/kert:version, ')')"/>
                </h6>
                <xsl:apply-templates/>
            </body>
        </html>
    </xsl:template>
    <xsl:template match="//*[local-name() = 'li']">
        <xsl:variable name="testId" select="substring-after(./@id, 'tree-')"/>
        <xsl:variable name="unitTest" select="//kert:test[@id = $testId]"/>
        <div id="{$unitTest/@id}" class="test-summary">
            <div class="logo">
                <img src="../icon.png" width="24" height="24"/>
            </div>
            <div class="test-summary-content">
                <xsl:choose>
                    <xsl:when test="contains(./@class, 'folder')">
                        <div class="test-summary-title">
                            <xsl:value-of select="."/>
                        </div>
                    </xsl:when>
                    <xsl:otherwise>
                        <div class="test-summary-title">
                            <xsl:value-of select="$unitTest//kert:title"/>
                            <xsl:text> (status:</xsl:text>
                            <span class="test-status-"/>
                            <xsl:text>)</xsl:text>
                            <span class="test-summary-operations">
                                <a href="{concat($testPlanBaseUri, $unitTest//kert:test-url)}">Run test</a>
                            </span>
                        </div>
                        <div class="test-summary-description">
                            <xsl:value-of select="$unitTest//kert:description"/>
                        </div>
                    </xsl:otherwise>
                </xsl:choose>
            </div>
            <xsl:apply-templates/>
        </div>
    </xsl:template>
    <xsl:template match="text()"/>
</xsl:stylesheet>