import { SetupWorker, setupWorker } from 'msw/browser';
import { apiHandlers } from 'shared';

// This configures a Service Worker with the given request handlers.
export const worker: SetupWorker = setupWorker(...apiHandlers);
