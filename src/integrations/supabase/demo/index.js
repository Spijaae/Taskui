// A supabase-js look-alike that runs entirely in the browser.

import { createAuth, currentUserId } from "./auth";
import { createFunctions, demoFetchFunction } from "./functions";
import { QueryBuilder } from "./query";
import { seedAccount } from "./seed";
import { createStorage } from "./storage";

export function createDemoClient() {
  return {
    isDemo: true,
    auth: createAuth((user, created) => {
      if (created) seedAccount(user.id);
    }),
    from: (tableName) => new QueryBuilder(tableName, currentUserId),
    storage: createStorage(),
    functions: createFunctions(),
    channel: () => ({
      on() {
        return this;
      },
      subscribe() {
        return this;
      },
      unsubscribe() {},
    }),
    removeChannel: () => {},
  };
}

export { demoFetchFunction };
