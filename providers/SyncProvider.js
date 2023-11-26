import { SyncDatabaseChangeSet, synchronize } from '@nozbe/watermelondb/sync'

await synchronize({
  database,
  pullChanges: async ({ lastPulledAt, schemaVersion, migration }) => {
    const { data, error } = await supabase.rpc('pull', {
      last_pulled_at: lastPulledAt,
    })

    const changes=SyncDatabaseChangeSet;
    const timestamp=number;

    return { changes, timestamp }
  },
  pushChanges: async ({ changes, lastPulledAt }) => {
    const { error } = await supabase.rpc('push', { changes })
  },
  sendCreatedAsUpdated: true,
  migrationsEnabledAtVersion: 1,
})
