$srcPath = 'src'
$files = Get-ChildItem -Path $srcPath -Recurse -Include '*.tsx','*.ts','*.css' | Where-Object { $_.Name -ne 'globals.css' }

$replacements = @(
  @{ From = '\[#2e2d32\]'; To = '-dark' },
  @{ From = '\[#2E2D32\]'; To = '-dark' },
  @{ From = '\[#ed1b24\]'; To = '-brand' },
  @{ From = '\[#ED1B24\]'; To = '-brand' },
  @{ From = '\[#4c4c4c\]'; To = '-mid' },
  @{ From = '\[#4C4C4C\]'; To = '-mid' },
  @{ From = '\[#e5e5e5\]'; To = '-ash' },
  @{ From = '\[#E5E5E5\]'; To = '-ash' },
  @{ From = '\[#1e40af\]'; To = '-navy' },
  @{ From = '\[#1E40AF\]'; To = '-navy' },
  @{ From = '\[#5095cb\]'; To = '-ocean' },
  @{ From = '\[#5095CB\]'; To = '-ocean' },
  @{ From = '\[#f9f9fb\]'; To = '-pale' },
  @{ From = '\[#F9F9FB\]'; To = '-pale' }
)

$totalChanged = 0
foreach ($file in $files) {
  $content = [System.IO.File]::ReadAllText($file.FullName)
  $original = $content
  foreach ($r in $replacements) {
    $content = $content -replace $r.From, $r.To
  }
  if ($content -ne $original) {
    [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.UTF8Encoding]::new($false))
    $totalChanged++
    $rel = $file.FullName -replace [regex]::Escape((Get-Location).Path + '\'), ''
    Write-Host "Changed: $rel"
  }
}
Write-Host "Total files changed: $totalChanged"
