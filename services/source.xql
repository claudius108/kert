xquery version "1.0";

declare option exist:serialize "method=text media-type=text/html omit-xml-declaration=yes"; 

let $url := request:get-parameter('url', '')

return util:binary-to-string(util:binary-doc($url))