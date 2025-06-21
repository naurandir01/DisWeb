rule find_7zipe {
    meta:
        description = "Recherche de 7zip"
    strings:
        $s0 = "7-Zip" fullword
    condition:
        all of them
} 