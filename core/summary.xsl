<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:kert="http://kuberam.ro/ns/kert" version="1.0">
    <xsl:output method="html"/>
    <xsl:template match="/">
        <html>
            <head>
                <title/>
                <style type="text/css">
					body { 
						font-family: arial;
						font-size: 14px;
					}
					div {
						display: block;
						border: solid 1px;
						margin-bottom: 10px;
					}
		</style>
            </head>
            <body>
                <h1>
                    <xsl:value-of select="/kert:test-plan/kert:description"/>
                </h1>
                <xsl:apply-templates select="//kert:test"/>
            </body>
        </html>
    </xsl:template>
    <xsl:template match="kert:test">
        <div>
            <h2>
                <xsl:value-of select="kert:title"/>
            </h2>
		    Author: <xsl:value-of select="kert:author"/>
            <br/>
		    Version: <xsl:value-of select="kert:version"/>
            <br/>
		    Description: <xsl:value-of select="kert:description"/>
            <br/>
		    Test URL: <a href="{kert:test-url}">
                <xsl:value-of select="kert:test-url"/>
            </a>
            <br/>
		    Test source URL: <a href="{kert:source-url}">
                <xsl:value-of select="kert:source-url"/>
            </a>
            <br/>
        </div>
    </xsl:template>
</xsl:stylesheet>