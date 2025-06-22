import "hash"

rule find_404html{
    meta:
        description = "find_404.html"
    condition:
        hash.sha256(0, filesize) == "f0f0d0c79f1f6bc913676627dae89dd1b3ab13ec3fcbf2d345b6ff1429a947da"
}