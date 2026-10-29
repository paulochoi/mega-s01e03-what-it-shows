<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import { uniqueById, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  import { PROBLEMS, problemOf } from '#lib/kb/problems';

  let { ticket, repo }: { ticket: number; repo: string } = $props();

  const rows = (reports as Report[]).filter((r) => r.mergedInto === ticket);
  const merged = uniqueById(rows);
  const groups = PROBLEMS.map((p) => {
    const rs = merged.filter((r) => problemOf(r, tenantOf(r)) === p.id);
    const days = rs.map((r) => r.receivedAt.slice(0, 10)).sort();
    const tags: Record<string, number> = {};
    for (const r of rs) tags[r.meta.intakeTag] = (tags[r.meta.intakeTag] ?? 0) + 1;
    return { ...p, count: rs.length, tenants: new Set(rs.map((r) => r.tenant)).size, first: days[0], last: days.at(-1), tags };
  }).filter((g) => g.count > 0);
  const tagged = (t: Record<string, number>) => Object.entries(t).sort((a, b) => b[1] - a[1]).map(([k, n]) => `${k} ×${n}`).join(' · ');
</script>

<p class="sum">
  <strong>{rows.length}</strong> rows in the export · <strong>{merged.length}</strong> reports once duplicates are dropped ·
  <strong>{groups.length}</strong> problems
</p>

<table>
  <thead><tr><th>problem</th><th>reports</th><th>tenants</th><th>seen</th><th>intake tagged</th><th>ticket</th></tr></thead>
  <tbody>
    {#each groups as g (g.id)}
      <tr>
        <td><code>{g.id}</code><br /><span class="what">{g.what}</span></td>
        <td><strong>{g.count}</strong></td>
        <td>{g.tenants}</td>
        <td>{g.first} → {g.last}</td>
        <td class="tags">{tagged(g.tags)}</td>
        <td>{#if g.issue}<a href="https://github.com/{repo}/issues/{g.issue}">#{g.issue}</a>{:else}none{/if}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  .sum { font-size: 1.1rem; }
  .what, .tags { color: var(--muted); font-size: 0.85em; }
</style>
