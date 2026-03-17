Write-Host "Resizing Android Icons..."
$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\VIGNESH\.gemini\antigravity\brain\166b9f54-6d4f-4fb5-8489-46858325336d\routo_app_icon_1773752530608.png"
$resDir = "D:\Bus_Intelligence_Tracker\bus-tracker-intelligent\UserApp\android\app\src\main\res"

$sizes = @{
    "mipmap-mdpi"    = 48
    "mipmap-hdpi"    = 72
    "mipmap-xhdpi"   = 96
    "mipmap-xxhdpi"  = 144
    "mipmap-xxxhdpi" = 192
}

try {
    $srcImage = [System.Drawing.Image]::FromFile($srcPath)
    
    foreach ($key in $sizes.Keys) {
        $size = $sizes[$key]
        $outDir = Join-Path $resDir $key
        
        if (-not (Test-Path $outDir)) {
            New-Item -ItemType Directory -Path $outDir | Out-Null
        }
        
        $bmp = New-Object System.Drawing.Bitmap($size, $size)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        
        $g.DrawImage($srcImage, 0, 0, $size, $size)
        $g.Dispose()
        
        foreach ($name in @('ic_launcher.png', 'ic_launcher_round.png')) {
            $out = Join-Path $outDir $name
            $bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
            Write-Host "Created: $out"
        }
        
        $bmp.Dispose()
    }
    
    $srcImage.Dispose()
    Write-Host "Success! Icons generated."
} catch {
    Write-Error $_
}
