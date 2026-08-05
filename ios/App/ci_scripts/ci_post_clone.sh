#!/bin/sh
cd $CI_WORKSPACE
npm install
npm run build
npx cap sync ios
