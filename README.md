# kert

Automatic asynchronous test runner, accessible as web page.

Usage

Call kert as follows:
Press Test plan / Open menu items, add URL of test plan in dialog box, and press Open button.

```xml
<plugin>
	<groupId>org.codehaus.mojo</groupId>
	<artifactId>xml-maven-plugin</artifactId>
	<executions>
		<execution>
			<id>generate-index.html</id>
			<phase>generate-resources</phase>
			<goals>
				<goal>transform</goal>
			</goals>
			<configuration>
				<forceCreation>true</forceCreation>
				<transformationSets>
					<transformationSet>
						<dir>../${project.artifactId}/tests</dir>
						<includes>
							<include>test-plan.xml</include>
						</includes>
						<stylesheet>http://kert.sourceforge.net/latest/resources/xsl/generate-tests-presentation.xsl</stylesheet>
						<fileMappers>
							<fileMapper
								implementation="org.codehaus.plexus.components.io.filemappers.RegExpFileMapper">
								<pattern>^(.*)\.xml$</pattern>
								<replacement>index.html</replacement>
							</fileMapper>
						</fileMappers>
						<outputDir>tests</outputDir>
					</transformationSet>
				</transformationSets>
			</configuration>
		</execution>
	</executions>
</plugin>
```
