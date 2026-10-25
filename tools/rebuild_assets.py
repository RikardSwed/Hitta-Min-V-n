"""Rebuild all illustrated assets in the correct order.
Requires Python packages Pillow, NumPy, OpenCV, SciPy. Playing the game requires none.
"""
import subprocess,sys
from pathlib import Path
root=Path(__file__).resolve().parent
scripts=['build_sprites.py','extract_side.py','build_side_walk.py','build_park_assets.py','build_tile_variants.py','build_panorama.py']
for script in scripts:
 print('Rebuilding:',script,flush=True)
 subprocess.run([sys.executable,str(root/script)],check=True)
print('All resources rebuilt.')
