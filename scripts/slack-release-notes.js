const axios = require('axios');
const fs = require('fs');
const execa = require('execa');
const slackifyMarkdown = require('slackify-markdown');
require('dotenv').config({
  path: 'scripts/.env',
});
const run = (bin, args, opts = {}) => execa(bin, args, { stdio: 'inherit', ...opts });

const getLatestReleaseNotes = async function getLatestReleaseNotes() {
  const latestChangelogPath = __dirname + '/../CHANGELOG-LATEST.md';

  // delete the previous latest changelog
  try {
    fs.unlinkSync(latestChangelogPath);
  } catch (error) {}
  // generate new latest changelog
  await run('yarn', ['changelog:latest']);
  const data = fs.readFileSync(latestChangelogPath);

  return data.toString();
}

const postReleaseNotesToSlack = async function postReleaseNotesToSlack() {
  let latestNotes = await getLatestReleaseNotes();
  latestNotes = slackifyMarkdown(latestNotes);

  const body = {
    "blocks": [
      {
        "type": "header",
        "text": {
          "type": "plain_text",
          "text": ":strawberry: Signature JS :strawberry:",
          "emoji": true
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "I'm glad to inform you that a new version of the @eid-easy/signature-js has been published to <https://www.npmjs.com/package/@eid-easy/signature-js|npm>"
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "*Release Notes:*"
        },
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": latestNotes
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "<https://github.com/eideasy/signature-js/blob/master/CHANGELOG.md|View full changelog>"
        }
      }
    ]
  };

  return axios.post(process.env.SLACK_RELEASE_NOTES_WEBHOOK_URL, JSON.stringify(body))
}

postReleaseNotesToSlack()
  .then(function(response) {
    console.log(response.data);
  })
  .catch(function(error) {
    console.log(error);
  });
