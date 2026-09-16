import http from 'http';

function getUrl(path: string): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    http.get({ hostname: 'localhost', port: 3000, path }, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => resolve({ status: res.statusCode || 0, body }));
    }).on('error', reject);
  });
}

async function verify() {
  console.log('Verifying /login page and CSS assets...');
  const page = await getUrl('/login');
  console.log(`/login page status: ${page.status}`);

  // Extract all CSS links from the HTML
  const cssPaths: string[] = [];
  const cssRegex = /href="(\/_next\/static\/css\/[^"]+\.css)"/g;
  let match: RegExpExecArray | null;
  while ((match = cssRegex.exec(page.body)) !== null) {
    cssPaths.push(match[1]);
  }
  console.log(`Found ${cssPaths.length} CSS link(s) in HTML.`);

  for (const cssPath of cssPaths) {
    const cssRes = await getUrl(cssPath);
    console.log(`CSS asset: ${cssPath} -> HTTP ${cssRes.status} (Length: ${cssRes.body.length} bytes)`);
    if (cssRes.status !== 200 || cssRes.body.length < 500) {
      console.error(`ERROR: CSS asset failed to load!`);
      process.exit(1);
    }
  }

  // Extract JS chunks
  const jsPaths: string[] = [];
  const jsRegex = /src="(\/_next\/static\/chunks\/[^"]+\.js)"/g;
  while ((match = jsRegex.exec(page.body)) !== null) {
    jsPaths.push(match[1]);
  }
  console.log(`Found ${jsPaths.length} JS script(s) in HTML.`);
  for (const jsPath of jsPaths.slice(0, 5)) {
    const jsRes = await getUrl(jsPath);
    console.log(`JS chunk: ${jsPath} -> HTTP ${jsRes.status} (Length: ${jsRes.body.length} bytes)`);
    if (jsRes.status !== 200) {
      console.error(`ERROR: JS asset failed to load!`);
      process.exit(1);
    }
  }

  console.log('\nALL CSS AND JS ASSETS LOADED SUCCESSFULLY WITH HTTP 200!');
}

verify().catch((err) => {
  console.error(err);
  process.exit(1);
});
