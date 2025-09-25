const { Octokit } = require("@octokit/core");

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { name, email, password } = JSON.parse(event.body);

  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  const repoOwner = "TuyenKhuusk"; // Thay bằng tên người dùng GitHub của bạn
  const repoName = "inschool-website"; // Thay bằng tên kho lưu trữ của bạn
  const filePath = "users.json";

  try {
    const { data } = await octokit.request(`GET /repos/{owner}/{repo}/contents/{path}`, {
      owner: repoOwner,
      repo: repoName,
      path: filePath,
    });

    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    let users = JSON.parse(content);

    users.push({ name, email, password });

    await octokit.request(`PUT /repos/{owner}/{repo}/contents/{path}`, {
      owner: repoOwner,
      repo: repoName,
      path: filePath,
      message: `Add new user: ${name}`,
      content: Buffer.from(JSON.stringify(users, null, 2)).toString('base64'),
      sha: data.sha,
    });

    return { statusCode: 200, body: JSON.stringify({ success: true }) };

  } catch (error) {
    if (error.status === 404) {
      const users = [{ name, email, password }];
      await octokit.request(`PUT /repos/{owner}/{repo}/contents/{path}`, {
        owner: repoOwner,
        repo: repoName,
        path: filePath,
        message: `Create users.json and add first user: ${name}`,
        content: Buffer.from(JSON.stringify(users, null, 2)).toString('base64'),
      });

      return { statusCode: 200, body: JSON.stringify({ success: true }) };
    }
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ success: false, message: 'Internal Server Error' }) };
  }
};
