//const npsUtils = require('nps-utils');
const {series, concurrent, rimraf} = require('nps-utils');

const handleResult = (prefix, successMsg, errorMsg, failOnError) =>
  `rc=$?;` +
  `if [ $rc -eq 0 ]; ` +
  ` then ( echo "\n* SUCCESS: ${prefix} ${successMsg}\n"; exit 0; ) ` +
  ` else ( echo "\n* ERROR: ${prefix} ${errorMsg}\n"; exit ${ failOnError ? 1 : 0 }; ) ` +
  `fi `;


module.exports = {
  scripts: {
    ttt: 'eee || echo 1 && echo 2',
    audit: {
      default: concurrent.nps( 'audit.all', 'audit.prod' ),
      all:
               'echo "* Checking dev/prod packages for any vulnerabilities...";' +
                 'npm audit;' +
                 handleResult(
                   'for dev/prod configuration npm audit reported',
                   'no vulnerabilities',
                   'some vulnerabilities. Please check messages above.',
                   false,
                 ),
      //'rc=$?; if [ $rc -eq 0 ]; ' +
      // '  then ( echo "\n* SUCCESS: npm audit reported no vulnerabilities in dev/prod configuration\n"; exit 0; )' +
      //'  else ( echo "\n* WARNING: npm audit reported some vulnerabilities in dev/prod configuration. Please check messages above\n"; exit 0; ) ' +
      //'fi ',
      prod:
               'echo "* Checking prod packages for high-level vulnerabilities...";' +
                 'npm audit --production --audit-level high ; ' +
        handleResult(
          'for prod configuration npm audit reported',
          'no high-level vulnerabilities',
          'high-level vulnerabilities',
          true,
        ),
                 //'rc=$?; if [ $rc -eq 0 ]; ' +
                 //' then ( echo "\n* SUCCESS: npm audit reported no high-level vulnerabilities in prod configuration\n"; exit 0; )' +
                 //' else ( echo "\n* ERROR: npm audit reported high-level vulnerabilities in prod configuration\n"; exit 1; ) ' +
                 //'fi ',
    },
    deps: {
      update:     'echo \'* Updating packages versions... \';' +
                    ' npm-check-updates -u --upgradeAll --error-level 1 &&' +
                    ' npm install',
      updateDeps: 'nps check && nps deps.update && git commit -am \'updated deps\'"',
      check:      'ncu' +
                    ' --error-level 2' +
                    ' --packageFile package.json', // fix for https://github.com/tjunnone/npm-check-updates/issues/136#issuecomment-155721102
    },


    test: {
      //default: npsUtils.concurrent.nps(
      //  'test.pretest'
      //),
      default: series.nps(
        'test.pre',
        'test.disabled',
        //'test.post',
      ),


      pre: {
        lint:    'eslint -f unix .',
        inspect: 'jsinspect --ignore \'coverage|test\'',

        //pretest: "nps test.lint && nps test.inspect && nps audit && npm run _deps-check",
        default: concurrent.nps(
          'test.pre.lint',
          'test.pre.inspect',
          'audit',
          'deps.check',
        ),
      },

      //test: "echo \"Warning: no test specified; imitating clean result...\" && exit 0",
      disabled: {
        default: 'nps test.disabled.warn',
        warn:    'echo "* WARNING: no test specified; imitating clean result..." && exit 0',
        error:   'echo "* ERROR: no test specified; imitating clean result..."   && exit 1',
      },

      run: {
        mocha:     'nyc ./node_modules/mocha/bin/_mocha -- -R spec ./test/**/*',
        report:    'nyc report --reporter=html && nyc report --reporter=text-lcov > coverage/coverage.lcov',
        coveralls: 'cat ./coverage/coverage.lcov | ./node_modules/coveralls/bin/coveralls.js',
        default:   series.nps( 'test.run.test', 'test.run.report', 'test.run.coveralls'),
      },

      //post: {
      //default: series.nps(
      //),
      //},
    },

    git: {
      commit:        'git commit -am "commit by \'git.commit\'"',
      push:          'git push --follow-tags',
      commitAndPush: 'nps git.commit && nps test && nps git.push"',
      checkClean:     'echo \'* Checking if git directory is clean... \'; ' +
                        'bash -c \'' +
                        '  [[ -z $(git status -uno --porcelain) ]]; ' +
                        //'  rc=$?; if [ $rc -eq 0 ]; ' +
                        //'    then echo "* SUCCESS: git directory is clean"; exit $rc; ' +
                        //'    else echo "* ERROR: git directory is not clean"; exit $rc; ' +
                        //'  fi ' +
                        handleResult(
                          'git directory',
                          'is clean',
                          'is not clean',
                          true,
                        ) +
                        '\' ',
    },

    publish: {
      public:  'npm publish --access public',
      private: 'npm publish --access private',
    },

    release: {
      //version: series(
      //  'echo "release.version: start"',
      //  "echo [$0 $1 $2 $3]",
      //  //(...args) => { console.log('args:', args); return "echo OK"; },
      //  //"npm version $0",
      //  //"git commit -am 'npm version $0'",
      //  //"nps publish.public",
      //),
      version: {
        "patch": series(
          "npm version patch",
          "git commit --allow-empty -am 'npm version patch'",
          "nps publish.public",
        ),
        "minor": series(
          "npm version minor",
          "git commit --allow-empty -am 'npm version minor' ",
          "nps publish.public",
        ),
        "major": series(
          "npm version major",
          "git commit --allow-empty -am 'npm version major'",
          "nps publish.public",
        ),
      },

      xxx: 'rr=',
      //xxx: (...args) => { console.log('args:', args); return "dummy"; },
      //patch: series.nps('test', '"release.version patch"', 'git.push',),
      //ttt: series('nps test', 'nps "release.xxx patch"', 'nps git.push',),
      //ttt: 'nps test && nps "release.xxx patch" && nps git.push',
      //ttt: 'nps "release.xxx patch"',

      patch: series.nps('test', 'release.version.patch', 'git.push',),
      minor: series.nps('test', 'release.version.minor', 'git.push',),
      major: series.nps('test', 'release.version.major', 'git.push',),
    },

    // https://docs.travis-ci.com/user/job-lifecycle/
    travis:             {
      before_install: '',
      //install: '',
      before_script: '',
      script:       'nps test',
      //before_cache: '',
      //after_success: '',
      //after_failure: '',
      //before_deploy: '',
      //deploy: '',
      //after_deploy: '',
      after_script:  'nps test.coveralls'
    },
    dummy: 'echo "dummy"',
  },
  options: {
    silent:   false,
    logLevel: 'info'
  }
};
/*
  "_npm-audit": "npm audit || echo '\n*** Please check warnings above ***\n' && npm audit --production --audit-level high && echo '\n*** npm audit reported no high-level vulnerabilities for production configuration ***\n' ",
  "_deps-check": "npm-check-updates --error-level 2",
  "_deps-update": "echo '* Updating packages versions... '; npm-check-updates -u --upgradeAll --error-level 1 && npm install",
  "_check-changes": "echo '* Checking if git directory is clean... '; bash -c '[[ -z $(git status -uno --porcelain) ]]'",
  "update-deps": "npm run _check-changes && npm run _deps-update && git commit -am 'updated deps'",
  "lint": "eslint -f unix .",
  "inspect": "jsinspect --ignore 'coverage|test'",
  "pretest": "npm run lint && npm run inspect && npm run _npm-audit && npm run _deps-check",
  "_test": "echo \"Warning: no test specified\" && exit 0",
  "test": "echo \"Warning: no test specified; imitating clean result....\" && exit 0",
  "_commit": "git commit -am \"commit by 'npm run commit'\"",
  "_push": "git push --follow-tags",
  "commit-and-push": "npm run _commit && npm test && npm run _push",
  "_publish": "npm publish --access public",
  "_patch-release": "npm version patch && git commit -am 'npm version patch' && npm run _publish",
  "_minor-release": "npm version minor && git commit -am 'npm version minor' && npm run _publish",
  "_major-release": "npm version major && git commit -am 'npm version major' && npm run _publish",
  "patch-release": "npm test && npm run _patch-release && npm run _push",
  "minor-release": "npm test && npm run _minor-release && npm run _push",
  "__major-release": "npm test && npm run _major-release && npm run _push",
  "_coveralls": "cat ./coverage/coverage.lcov | ./node_modules/coveralls/bin/coveralls.js",
  "__travis-before-install": "",
  "__travis-before-script": "",
  "__travis-script": "npm run test",
  "__travis-after-script": "npm run _coveralls"
*/
