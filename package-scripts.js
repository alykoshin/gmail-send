//const npsUtils = require('nps-utils');
const {series, concurrent, rimraf} = require('nps-utils');

module.exports = {
  scripts: {
    audit: 'npm audit || echo \'\n*** Please check warnings above ***\n\' && npm audit --production --audit-level high && echo \'\n*** npm audit reported no high-level vulnerabilities for production configuration ***\n\' ',

    deps: {
      update:     'echo \'* Updating packages versions... \';' +
                    ' npm-check-updates -u --upgradeAll --error-level 1 &&' +
                    ' npm install',
      updateDeps: 'nps check && nps deps.update && git commit -am \'updated deps\'"',
      check:      'ncu' +
                    ' --error-level 2' +
                    ' --packageFile package.json', // fix for https://github.com/tjunnone/npm-check-updates/issues/136#issuecomment-155721102
    },

    checkChanges: 'echo \'* Checking if git directory is clean... \'; ' +
                    'bash -c \'' +
                    '  [[ -z $(git status -uno --porcelain) ]]; ' +
                    '  rc=$?; ' +
                    '  if [ $rc -eq 0 ]; ' +
                    '    then echo "* git directory is clean"; exit $rc; ' +
                    '    else echo "* git directory is not clean"; exit $rc; ' +
                    '  fi ' +
                    '\' ',

    test: {
      //default: npsUtils.concurrent.nps(
      //  'test.pretest'
      //),
      default:   series.nps(
        'test.pretest',
        'test.disabled',
      ),
      lint:      'eslint -f unix .',
      inspect:   'jsinspect --ignore \'coverage|test\'',
      //pretest: "nps test.lint && nps test.inspect && nps audit && npm run _deps-check",
      pretest:   concurrent.nps(
        'test.lint',
        'test.inspect',
        'audit',
        'deps.check',
      ),
      coveralls: 'cat ./coverage/coverage.lcov | ./node_modules/coveralls/bin/coveralls.js',
      //test: "echo \"Warning: no test specified; imitating clean result...\" && exit 0",
      disabled:  'echo "Warning: no test specified; imitating clean result...." && exit 0',
    },

    git: {
      commit:        'git commit -am "commit by \'git.commit\'"',
      push:          'git push --follow-tags',
      commitAndPush: 'nps git.commit && nps test && nps git.push"',
    },

    publish: {
      public:  'npm publish --access public',
      private: 'npm publish --access private',
    },

    "_patch-release": series(
      "npm version patch",
      "git commit --allow-empty -am 'npm version patch'",
      "nps publish.private",
    ),
    "_minor-release": "npm version minor && " +
                        "git commit -am 'npm version minor' " +
                        "&& npm run _publish",
    "_major-release": "npm version major && " +
                        "git commit -am 'npm version major' && " +
                        "npm run _publish",

    patchRelease: series.nps('test', '_patch-release', 'git.push',),
    minorRelease: series.nps('test', '_minor-release', 'git.push',),
    majorRelease: series.nps('test', '_major-release', 'git.push',),


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
