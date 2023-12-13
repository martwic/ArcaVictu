import { SyncDatabaseChangeSet, synchronize } from '@nozbe/watermelondb/sync'
import { supabase } from '../src/constants';
import { databaseWatermelon } from '../model/database';

export default async function syncProvider(){
  //console.log(databaseWatermelon.collections)
  console.log(supabase.from('products').select('*'))
await synchronize({
  databaseWatermelon,
  pullChanges: async ({ lastPulledAt, schemaVersion, migration}) => {
    const { data, error } = await supabase.rpc('pull', {
      last_pulled_at: lastPulledAt,
    })

    const { changes, timestamp } = data
    //const changes=SyncDatabaseChangeSet;
    //const timestamp=number;

    return { changes, timestamp }
  },
  pushChanges: async ({ changes, lastPulledAt }) => {
    const { error } = await supabase.rpc('push', { changes })
  },
  sendCreatedAsUpdated: true,
  //migrationsEnabledAtVersion: 1,
})
}
