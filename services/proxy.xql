xquery version "1.0";

declare namespace http= "http://expath.org/ns/http-client";

let $url := request:get-parameter('url', '')

return
	<http:response>
		{
			http:send-request(
				<http:request
					href="{$url}"
					method="get"
					username="admin"
					password="admin123"
					auth-method="basic"/>
			)
		}
	</http:response>

(:
util:eval(xs:anyURI('http://google.com'), false())
, $request := 
	<http:request method="xml"
		      href="{xs:anyURI($url)}"
		      username="admin"
		      password=""
		      auth-method="Basic"/>
	

return http:send-request($request)
:)