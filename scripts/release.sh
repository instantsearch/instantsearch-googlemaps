#!/usr/bin/env bash

set -ev # exit when error

mversion ${SEMVER_TOKEN:-PLEASE_PROVIDE_A_SEMVER_TOKEN_LIKE_MAJOR_MINOR_PATCH}
conventional-changelog -p angular -i CHANGELOG.md -w
doctoc --maxlevel 3 README.md
git commit -am `cat package.json | json version`
git push origin master
git push origin --tags
npm publish
