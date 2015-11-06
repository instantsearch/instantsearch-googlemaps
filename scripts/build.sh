#!/usr/bin/env bash

set -ev # exit when error

mkdir -p dist/
mkdir -p dist-es5-module/

VERSION=`cat package.json | json version`

bundle='instantsearch-googlemaps'

license="/*! ${bundle} ${VERSION:-UNRELEASED} | © Algolia | github.com/instantsearch/instantsearch-googlemaps */"

webpack --config webpack.config.jsdelivr.babel.js

# only transpile to ES5 for package.json main entry
babel -q index.js -o dist-es5-module/index.js
declare -a sources=("src")
for source in "${sources[@]}"
do
  babel -q --out-dir dist-es5-module/${source} ${source}
done

printf "$license" | cat - dist/${bundle}.js > /tmp/out && mv /tmp/out dist/${bundle}.js
cd dist
uglifyjs ${bundle}.js --source-map ${bundle}.min.map --preamble "$license" -c warnings=false -m -o ${bundle}.min.js
cd ..

printf "=> ${bundle}.min.js gzipped will weight `cat dist/${bundle}.min.js | gzip -9 | wc -c | pretty-bytes`\n"
