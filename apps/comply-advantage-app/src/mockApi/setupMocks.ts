const ignoredPathnames = ['/assets', '/favicon.ico', 'svg'];

export default async function setupMocks() {
  const { worker } = await import('./browser');

  await worker.start({
    onUnhandledRequest(req, print) {
      if (ignoredPathnames.some((pathname) => req.url.includes(pathname))) {
        return;
      }
      print.warning();
    },
  });
}
