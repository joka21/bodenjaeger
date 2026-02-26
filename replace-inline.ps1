$files = @(
  'src\components\AlertModal.tsx',
  'src\app\cart\page.tsx',
  'src\components\checkout\OrderSummary.tsx',
  'src\components\product\TotalPrice.tsx',
  'src\components\VersandLieferzeitPage.tsx',
  'src\components\KontaktPage.tsx',
  'src\components\KarrierePage.tsx'
)

$replacements = @(
  @{ From = "color: '#28a745'"; To = "color: 'var(--color-success)'" },
  @{ From = "background: 'linear-gradient(135deg, #2e2d32 0%, #4c4c4c 100%)'"; To = "background: 'var(--gradient-dark)'" }
)

foreach ($filePath in $files) {
  $full = Join-Path (Get-Location) $filePath
  $content = [System.IO.File]::ReadAllText($full)
  $original = $content
  foreach ($r in $replacements) {
    $content = $content.Replace($r.From, $r.To)
  }
  if ($content -ne $original) {
    [System.IO.File]::WriteAllText($full, $content, [System.Text.UTF8Encoding]::new($false))
    Write-Host "Changed: $filePath"
  }
}
Write-Host "Done"
