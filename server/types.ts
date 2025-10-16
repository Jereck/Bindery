import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import type { bookclub, library } from './db/schema';
import type { auth } from './lib/auth';

export type Bookclub = InferSelectModel<typeof bookclub>;
export type NewBookclub = InferInsertModel<typeof bookclub>;
export type Library = InferSelectModel<typeof library>;
export type NewLibrary = InferInsertModel<typeof library>;

export type HonoEnv = {
  Variables: {
    user: typeof auth.$Infer.Session.user;
    session: typeof auth.$Infer.Session.session;
  }
}