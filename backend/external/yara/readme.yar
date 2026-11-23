import "hash"

rule readme {
    meta:
        description = "readme"
    condition:
        hash.sha256(0, filesize) == "be861546a0514c553d32469b713295c4dfbe101819cb655223f99fa602221ea9"
}