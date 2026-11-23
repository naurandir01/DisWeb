rule find_SANS {
    meta:
        description = "Find SANS keyword"
    strings:
        $s0 = "SANS" fullword
    condition:
        all of them
}