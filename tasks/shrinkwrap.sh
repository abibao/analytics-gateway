#!/usr/bin/env bash

echo "Regenerating shrinkwrap.json file (this operation can take several minutes)"

#
# Re-set installed packages
#
echo "-> 1/5 Remove project's modules"
rm -rf node_modules
rm -f npm-shrinkwrap.json
echo "-> 2/5 Clean npm cache"
npm cache clean
echo "-> 3/5 Install dependencies"
npm install

#
# Remove extraneous packages
#
echo "-> 4/5 Remove extraneous packages"
npm prune

#
# Regenerate shrinkwrap file (dependencies locked versions)
#
echo "-> 5/5 Generate shrinkwrap"
npm shrinkwrap
RETVAL=$?
if [ $RETVAL -ne 0 ]
then
  printf "Shrinkwrap generation failed, check that you have an up-to-date version of npm (npm -v)\n"
  exit 1
fi
