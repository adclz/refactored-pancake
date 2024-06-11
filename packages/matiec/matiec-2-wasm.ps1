docker build  -t matiec_img ./
docker create --name temp matiec_img
docker cp temp:/src/matiec/. ./src/matiec
docker rm -f temp
Rename-Item -Path "./src/matiec/iec2c" -NewName "iec2c.js"
Rename-Item -Path "./src/matiec/iec2iec" -NewName "iec2iec.js"