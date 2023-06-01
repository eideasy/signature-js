/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-shadow */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-use-before-define */
const args = require('minimist')(process.argv.slice(2));
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const semver = require('semver');
const { prompt } = require('enquirer');
const execa = require('execa');
const currentVersion = require('../package.json').version;
const mainBuildArtifact = require('../package.json').main;
const ssri = require('ssri');

const preId = args.preid
  || (semver.prerelease(currentVersion) && semver.prerelease(currentVersion)[0]);

const isDryRun = args.dry;
let { skipTests } = args;
skipTests = true; // TODO: remove this line when tests are ready
const { skipBuild } = args;

const versionIncrements = [
  'patch',
  'minor',
  'major',
  ...(preId ? ['prepatch', 'preminor', 'premajor', 'prerelease'] : []),
];

const inc = (i) => semver.inc(currentVersion, i, preId);
const bin = (name) => path.resolve(__dirname, `../node_modules/.bin/${name}`);
const run = (bin, args, opts = {}) => execa(bin, args, { stdio: 'inherit', ...opts });
const dryRun = (bin, args, opts = {}) => console.log(chalk.blue(`[dryrun] ${bin} ${args.join(' ')}`), opts);
const runIfNotDry = isDryRun ? dryRun : run;
const step = (msg) => console.log(chalk.cyan(msg));

async function main() {
  let targetVersion = args._[0];

  if (!targetVersion) {
    // no explicit version, offer suggestions
    const { release } = await prompt({
      type: 'select',
      name: 'release',
      message: 'Select release type',
      choices: versionIncrements.map((i) => `${i} (${inc(i)})`).concat(['custom']),
    });

    if (release === 'custom') {
      targetVersion = (await prompt({
        type: 'input',
        name: 'version',
        message: 'Input custom version',
        initial: currentVersion,
      })).version;
    } else {
      targetVersion = release.match(/\((.*)\)/)[1];
    }
  }

  if (!semver.valid(targetVersion)) {
    throw new Error(`invalid target version: ${targetVersion}`);
  }

  const { yes } = await prompt({
    type: 'confirm',
    name: 'yes',
    message: `Releasing v${targetVersion}. Confirm?`,
  });

  if (!yes) {
    return;
  }

  // run tests before release
  step('\nRunning tests...');
  if (!skipTests && !isDryRun) {
    await run(bin('jest'), ['--clearCache']);
    await run('yarn', ['test', '--bail']);
  } else {
    console.log('(skipped)');
  }

  // update all package versions and inter-dependencies
  step('\nUpdating package.json version ...');
  updateVersion(targetVersion);

  // build
  step('\nBuilding ...');
  if (!skipBuild && !isDryRun) {
    await run('yarn', ['build']);
    // generate sri after js is built
    const buildArtifact = path.resolve(__dirname, '../' + mainBuildArtifact);
    const integrityObj = ssri.fromData(fs.readFileSync(buildArtifact), {
      algorithms: ['sha256'],
    });
    const integrityString = integrityObj.toString();
    updatePackageSri(integrityString, targetVersion);
    await run('yarn', ['docs:build']);
  } else {
    console.log('(skipped)');
  }

  // generate changelog
  await run('yarn', ['changelog']);

  const { stdout } = await run('git', ['diff'], { stdio: 'pipe' });
  if (stdout) {
    step('\nCommitting changes...');
    await runIfNotDry('git', ['add', '-A']);
    await runIfNotDry('git', ['commit', '-S', '-m', `release: v${targetVersion}`]);
  } else {
    console.log('No changes to commit.');
  }

  // publish package to npm
  step('\nPublishing to NPM ...');
  await publishToNpm(targetVersion, runIfNotDry);

  // push to GitHub
  step('\nPushing to GitHub...');
  await runIfNotDry('git', ['tag', `v${targetVersion}`]);
  await runIfNotDry('git', ['push', 'origin', `refs/tags/v${targetVersion}`]);
  await runIfNotDry('git', ['push']);

  if (isDryRun) {
    console.log('\nDry run finished - run git diff to see package changes.');
  }
}

function updateVersion(version) {
  // update root package.json
  updatePackage(path.resolve(__dirname, '..'), 'version', version);

  // productionReleaseVersion is the version we show in our docs
  // and we do not want to display alpha or beta versions there,
  // because outside devs are in the majority of cases interested in installing a stable production ready version
  if (!version.includes('alpha') && !version.includes('beta')) {
    updatePackage(path.resolve(__dirname, '..'), 'productionReleaseVersion', version);
  }
}

function updatePackageSri(sri, version) {
  // update root package.json
  updatePackage(path.resolve(__dirname, '..'), 'sri', sri);
  if (!version.includes('alpha') && !version.includes('beta')) {
    updatePackage(path.resolve(__dirname, '..'), 'productionReleaseSri', sri);
  }
}

function updatePackage(pkgRoot, key, value) {
  const pkgPath = path.resolve(pkgRoot, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  pkg[key] = value;
  fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
}

async function publishToNpm(version, runIfNotDry) {
  const pkgRoot = path.resolve(__dirname, '..');
  const pkgPath = path.resolve(pkgRoot, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  const pkgName = pkg.name;

  if (pkg.private) {
    return;
  }

  let releaseTag = args.tag || null;
  if (version.includes('alpha')) {
    releaseTag = 'alpha';
  } else if (version.includes('beta')) {
    releaseTag = 'beta';
  }

  step('Publishing ...');
  try {
    await runIfNotDry(
      'yarn',
      [
        'publish',
        '--new-version',
        version,
        ...(releaseTag ? ['--tag', releaseTag] : []),
        '--access',
        'public',
      ],
      {
        cwd: pkgRoot,
        stdio: 'pipe',
      },
    );
    console.log(chalk.green(`Successfully published ${pkgName}@${version}`));
  } catch (e) {
    if (e.stderr.match(/previously published/)) {
      console.log(chalk.red(`Skipping already published: ${pkgName}`));
    } else {
      throw e;
    }
  }

  step('Posting release notes to Slack...');
  await run('yarn', ['slack-release-notes']);
}

main().catch((err) => {
  console.error(err);
});
