rule with_urls : mail {
	meta:
		author = "Antonio Sanchez <asanchez@hispasec.com>"
		reference = "http://laboratorio.blogs.hispasec.com/"
		description = "Rule to detect the presence of an or several urls"
	strings:
		$url_regex = /https?:\/\/([\w\.-]+)([\/\w \.-]*)/
	condition:
		all of them
}
