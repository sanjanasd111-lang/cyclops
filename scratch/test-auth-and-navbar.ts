import http from 'http';

interface TestResult {
  name: string;
  passed: boolean;
  details: string;
}

const results: TestResult[] = [];

function makeRequest(
  path: string,
  cookie?: string
): Promise<{ statusCode: number; headers: http.IncomingHttpHeaders; body: string }> {
  return new Promise((resolve, reject) => {
    const headers: Record<string, string> = {};
    if (cookie) {
      headers['Cookie'] = cookie;
    }

    const req = http.request(
      {
        hostname: 'localhost',
        port: 3000,
        path,
        method: 'GET',
        headers,
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode || 0,
            headers: res.headers,
            body,
          });
        });
      }
    );

    req.on('error', (err) => reject(err));
    req.end();
  });
}

async function runTests() {
  console.log('============================================================');
  console.log('AYUSHSetu AI - Authentication & Website Visibility Tests');
  console.log('============================================================\n');

  // Test 1: Unauthenticated user can view main landing page
  try {
    const res = await makeRequest('/');
    const ok = res.statusCode === 200;
    results.push({
      name: 'Unauthenticated user can view main landing page (/)',
      passed: ok,
      details: `Status: ${res.statusCode} (Expected: 200)`,
    });
  } catch (err: any) {
    results.push({
      name: 'Unauthenticated user can view main landing page (/)',
      passed: false,
      details: err.message,
    });
  }

  // Test 2: Unauthenticated access to /student/dashboard is blocked (redirects to /login)
  try {
    const res = await makeRequest('/student/dashboard');
    const isRedirect = res.statusCode === 307 || res.statusCode === 302;
    const location = (res.headers['location'] as string) || '';
    const redirectsToLogin = location.includes('/login');
    results.push({
      name: 'Unauthenticated access to /student/dashboard redirects to /login',
      passed: isRedirect && redirectsToLogin,
      details: `Status: ${res.statusCode}, Location: ${location}`,
    });
  } catch (err: any) {
    results.push({
      name: 'Unauthenticated access to /student/dashboard redirects to /login',
      passed: false,
      details: err.message,
    });
  }

  // Test 3: Unauthenticated access to /industry/dashboard redirects to /login
  try {
    const res = await makeRequest('/industry/dashboard');
    const isRedirect = res.statusCode === 307 || res.statusCode === 302;
    const location = (res.headers['location'] as string) || '';
    results.push({
      name: 'Unauthenticated access to /industry/dashboard redirects to /login',
      passed: isRedirect && location.includes('/login'),
      details: `Status: ${res.statusCode}, Location: ${location}`,
    });
  } catch (err: any) {
    results.push({
      name: 'Unauthenticated access to /industry/dashboard redirects to /login',
      passed: false,
      details: err.message,
    });
  }

  // Test 4: Unauthenticated access to /faculty/dashboard redirects to /login
  try {
    const res = await makeRequest('/faculty/dashboard');
    const isRedirect = res.statusCode === 307 || res.statusCode === 302;
    const location = (res.headers['location'] as string) || '';
    results.push({
      name: 'Unauthenticated access to /faculty/dashboard redirects to /login',
      passed: isRedirect && location.includes('/login'),
      details: `Status: ${res.statusCode}, Location: ${location}`,
    });
  } catch (err: any) {
    results.push({
      name: 'Unauthenticated access to /faculty/dashboard redirects to /login',
      passed: false,
      details: err.message,
    });
  }

  // Test 5: Unauthenticated access to /institution/dashboard redirects to /login
  try {
    const res = await makeRequest('/institution/dashboard');
    const isRedirect = res.statusCode === 307 || res.statusCode === 302;
    const location = (res.headers['location'] as string) || '';
    results.push({
      name: 'Unauthenticated access to /institution/dashboard redirects to /login',
      passed: isRedirect && location.includes('/login'),
      details: `Status: ${res.statusCode}, Location: ${location}`,
    });
  } catch (err: any) {
    results.push({
      name: 'Unauthenticated access to /institution/dashboard redirects to /login',
      passed: false,
      details: err.message,
    });
  }

  // Test 6: Unauthenticated access to /admin/dashboard redirects to /login
  try {
    const res = await makeRequest('/admin/dashboard');
    const isRedirect = res.statusCode === 307 || res.statusCode === 302;
    const location = (res.headers['location'] as string) || '';
    results.push({
      name: 'Unauthenticated access to /admin/dashboard redirects to /login',
      passed: isRedirect && location.includes('/login'),
      details: `Status: ${res.statusCode}, Location: ${location}`,
    });
  } catch (err: any) {
    results.push({
      name: 'Unauthenticated access to /admin/dashboard redirects to /login',
      passed: false,
      details: err.message,
    });
  }

  // Test 7: Unauthenticated user can view /login
  try {
    const res = await makeRequest('/login');
    results.push({
      name: 'Unauthenticated user can view /login',
      passed: res.statusCode === 200,
      details: `Status: ${res.statusCode}`,
    });
  } catch (err: any) {
    results.push({
      name: 'Unauthenticated user can view /login',
      passed: false,
      details: err.message,
    });
  }

  // Test 8: Unauthenticated user can view /register
  try {
    const res = await makeRequest('/register');
    results.push({
      name: 'Unauthenticated user can view /register',
      passed: res.statusCode === 200,
      details: `Status: ${res.statusCode}`,
    });
  } catch (err: any) {
    results.push({
      name: 'Unauthenticated user can view /register',
      passed: false,
      details: err.message,
    });
  }

  // Test 9: Authenticated Student CAN view the website (/) without being redirected away
  try {
    const res = await makeRequest('/', 'ayush_demo_session=STUDENT');
    results.push({
      name: 'Authenticated Student CAN view the website (/)',
      passed: res.statusCode === 200,
      details: `Status: ${res.statusCode} (Expected: 200)`,
    });
  } catch (err: any) {
    results.push({
      name: 'Authenticated Student CAN view the website (/)',
      passed: false,
      details: err.message,
    });
  }

  // Test 10: Authenticated Student can view /student/dashboard
  try {
    const res = await makeRequest('/student/dashboard', 'ayush_demo_session=STUDENT');
    results.push({
      name: 'Authenticated Student can view /student/dashboard',
      passed: res.statusCode === 200,
      details: `Status: ${res.statusCode}`,
    });
  } catch (err: any) {
    results.push({
      name: 'Authenticated Student can view /student/dashboard',
      passed: false,
      details: err.message,
    });
  }

  // Test 11: Authenticated Student visiting /login redirects to their dashboard
  try {
    const res = await makeRequest('/login', 'ayush_demo_session=STUDENT');
    const isRedirect = res.statusCode === 307 || res.statusCode === 302;
    const location = (res.headers['location'] as string) || '';
    results.push({
      name: 'Authenticated Student visiting /login redirects to /student/dashboard',
      passed: isRedirect && location.includes('/student/dashboard'),
      details: `Status: ${res.statusCode}, Location: ${location}`,
    });
  } catch (err: any) {
    results.push({
      name: 'Authenticated Student visiting /login redirects to /student/dashboard',
      passed: false,
      details: err.message,
    });
  }

  // Test 12: Authenticated Industry user CAN view the website (/)
  try {
    const res = await makeRequest('/', 'ayush_demo_session=INDUSTRY');
    results.push({
      name: 'Authenticated Industry user CAN view the website (/)',
      passed: res.statusCode === 200,
      details: `Status: ${res.statusCode}`,
    });
  } catch (err: any) {
    results.push({
      name: 'Authenticated Industry user CAN view the website (/)',
      passed: false,
      details: err.message,
    });
  }

  // Test 13: Authenticated Industry user can view /industry/dashboard
  try {
    const res = await makeRequest('/industry/dashboard', 'ayush_demo_session=INDUSTRY');
    results.push({
      name: 'Authenticated Industry user can view /industry/dashboard',
      passed: res.statusCode === 200,
      details: `Status: ${res.statusCode}`,
    });
  } catch (err: any) {
    results.push({
      name: 'Authenticated Industry user can view /industry/dashboard',
      passed: false,
      details: err.message,
    });
  }

  // Test 14: Authenticated Faculty user CAN view the website (/)
  try {
    const res = await makeRequest('/', 'ayush_demo_session=FACULTY');
    results.push({
      name: 'Authenticated Faculty user CAN view the website (/)',
      passed: res.statusCode === 200,
      details: `Status: ${res.statusCode}`,
    });
  } catch (err: any) {
    results.push({
      name: 'Authenticated Faculty user CAN view the website (/)',
      passed: false,
      details: err.message,
    });
  }

  // Test 15: Authenticated Institution user CAN view the website (/)
  try {
    const res = await makeRequest('/', 'ayush_demo_session=INSTITUTION');
    results.push({
      name: 'Authenticated Institution user CAN view the website (/)',
      passed: res.statusCode === 200,
      details: `Status: ${res.statusCode}`,
    });
  } catch (err: any) {
    results.push({
      name: 'Authenticated Institution user CAN view the website (/)',
      passed: false,
      details: err.message,
    });
  }

  // Test 16: Authenticated Admin user CAN view the website (/)
  try {
    const res = await makeRequest('/', 'ayush_demo_session=ADMIN');
    results.push({
      name: 'Authenticated Admin user CAN view the website (/)',
      passed: res.statusCode === 200,
      details: `Status: ${res.statusCode}`,
    });
  } catch (err: any) {
    results.push({
      name: 'Authenticated Admin user CAN view the website (/)',
      passed: false,
      details: err.message,
    });
  }

  // Test 17: Authenticated Admin can view /admin/dashboard
  try {
    const res = await makeRequest('/admin/dashboard', 'ayush_demo_session=ADMIN');
    results.push({
      name: 'Authenticated Admin can view /admin/dashboard',
      passed: res.statusCode === 200,
      details: `Status: ${res.statusCode}`,
    });
  } catch (err: any) {
    results.push({
      name: 'Authenticated Admin can view /admin/dashboard',
      passed: false,
      details: err.message,
    });
  }

  // Output results
  let passCount = 0;
  for (const r of results) {
    if (r.passed) {
      passCount++;
      console.log(`PASS: ${r.name} [${r.details}]`);
    } else {
      console.log(`FAIL: ${r.name} [${r.details}]`);
    }
  }

  console.log(`\n============================================================`);
  console.log(`SUMMARY: ${passCount} / ${results.length} TESTS PASSED (${Math.round((passCount / results.length) * 100)}%)`);
  console.log(`============================================================`);

  if (passCount === results.length) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests();
