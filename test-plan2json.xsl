<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:output method="xml"/>
    <xsl:template match="/">
	<ul id="data" style="display: none;">
			<xsl:apply-templates/>
	</ul>
    </xsl:template>
    <xsl:template match="collection">
	<li xml:id="{generate-id()}" class="folder" title="{title}"><xsl:value-of select="description"/>
		<ul>
			<xsl:apply-templates/>
		</ul>
	</li>
    </xsl:template>
    <xsl:template match="test-unit">
	<li xml:id="{generate-id()}" title="{title}"><xsl:value-of select="description"/></li>
    </xsl:template>
</xsl:stylesheet>