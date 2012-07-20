<?xml version="1.0" encoding="UTF-8"?>
<!-- kert, web test runner By Claudius Teodorescu Licensed under LGPL. -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:kert="http://kuberam.ro/ns/kert"
  xmlns="http://www.w3.org/1999/xhtml" version="1.0">
  <xsl:output method="xml" />
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <style>
          body {
          font-family: 'Verdana', sans-serif;
          width: 100%;
          margin: 0;
          padding: 0;
          background-color: #EFF5FB;
          }
          html {
          width: 100%;
          margin: 5 0 0 0;
          padding: 0;
          }
          .test-summary {
          width: 98%;
          border: 1px solid black;
          border-radius: 15px;
          margin: 5 5 15 5;
          }
          .test-summary-title {
          margin: 0 0 10 22;
          width: 100%;
          font-weight: bold;
          }
          .test-summary-description {
          margin-left:
          12px;
          }
          .test-summary-operations {
          margin-left: 12px;
          }
        </style>
      </head>
      <body>
        <h2>
          <xsl:value-of select="/kert:test-plan/kert:description" />
        </h2>
        <xsl:apply-templates />
      </body>
    </html>
  </xsl:template>
  <xsl:template match="//*[local-name() = 'li']">
    <xsl:variable name="testId" select="substring-after(./@id, 'tree-')" />
    <xsl:variable name="testDetails" select="//kert:test[@id = $testId]" />
    <div class="test-summary">
      <xsl:choose>
        <xsl:when test="contains(./@class, 'folder')">
          <div class="test-summary-title">
            <xsl:value-of select="." />
          </div>
        </xsl:when>
        <xsl:otherwise>
          <div class="test-summary-title">
            <xsl:value-of select="$testDetails//kert:title" />
            <span class="test-summary-operations">
              <a href="{normalize-space($testDetails//kert:test-url)}">Run test</a>
            </span>
          </div>
          <div class="test-summary-description">
            <xsl:value-of select="$testDetails//kert:description" />
          </div>
        </xsl:otherwise>
      </xsl:choose>
      <xsl:apply-templates />
    </div>
  </xsl:template>
  <xsl:template match="text()" />
</xsl:stylesheet>