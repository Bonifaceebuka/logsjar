import { Breadcrumb, ScopeContext } from "../types/events";
import { User } from "../types/user";

export class Scope {
  private user: User | null = null;
  private tags: Record<string, string> = {};
  private breadcrumbs: Breadcrumb[] = [];

  setUser(user: User | null) {
    this.user = user;
  }

  setTag(key: string, value: string) {
    this.tags[key] = value;
  }

  setTags(tags: Record<string, string>) {
    this.tags = { ...this.tags, ...tags };
  }

  addBreadcrumb(breadcrumb: Breadcrumb) {
    this.breadcrumbs.push(breadcrumb);
    if (this.breadcrumbs.length > 100) this.breadcrumbs.shift();
  }

  clear() {
    this.user = null;
    this.tags = {};
    this.breadcrumbs = [];
  }

  snapshot(): ScopeContext {
    return {
      user: this.user ?? undefined,
      tags: { ...this.tags },
      breadcrumbs: [...this.breadcrumbs],
    };
  }
}
