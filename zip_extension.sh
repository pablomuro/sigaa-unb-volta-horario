rm -rf extension_folder/
mkdir extension_folder

cp *.js extension_folder/
cp manifest.json extension_folder/
cp -r icons extension_folder/

cd extension_folder

zip extension.zip *
cp extension.zip ../
cd ..
rm -rf extension_folder/