rule find_SANS {
    meta:
        description = "Recherche de SANS"
    strings:
        $s0 = "SANS" fullword
    condition:
        all of them
}