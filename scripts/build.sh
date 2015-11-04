#!/usr/bin/env bash

set -ev # exit when error

mkdir -p dist/

VERSION=`cat package.json | json version`

bundle='instantsearch-googlemaps'

license="/*! ${bundle} ${VERSION:-UNRELEASED} | © Algolia | github.com/instantsearch/instantsearch-googlemaps */"

webpack --config webpack.config.jsdelivr.babel.js

printf "$license" | cat - dist/${bundle}.js > /tmp/out && mv /tmp/out dist/${bundle}.js
cd dist
uglifyjs ${bundle}.js --source-map ${bundle}.min.map --preamble "$license" -c warnings=false -m -o ${bundle}.min.js
cd ..

printf "=> ${bundle}.min.js gzipped will weight `cat dist/${bundle}.min.js | gzip -9 | wc -c | pretty-bytes`\n"
