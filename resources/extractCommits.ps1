$CurrentDateTime = Get-Date -f "yy-MM-dd.HH-mm-ss"

$OutputPath = ".\git-log-$CurrentDateTime.txt"

git log --all --decorate --oneline --graph > $OutputPath

Add-Content -path $OutputPath $CommandResponse
