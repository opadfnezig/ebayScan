cp -r ./global/logger ./listener
cd ./listener
./build.sh
cp -r ../global/logger ../search
cd ../search
./build.sh