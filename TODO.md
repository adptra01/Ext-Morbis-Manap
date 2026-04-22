# TODO: Implementasi Sistem Role MORBIS Extension - Phase 1 (Approved)

## Status: In Progress

### Step 1: ✅ Create TODO.md
### Step 2: ✅ Update core.js - Add ROLES, currentRole, allowedRoles, helpers
### Step 3: ✅ Update popup.html - Add role switcher UI
### Step 4: ✅ Update popup.js - Role dropdown logic, filter features by role, banner (partial - DEFAULT_CONFIG synced)
### Step 5: ✅ Update init.js - Add role check before feature.run()
### Step 6: ✅ Update features/*.js - Add allowedRoles prop, update enabled checks to isFeatureAllowed
### Step 7: ✅ Manual Test passed (role switcher shows, features filter by casemix role, reloads work, non-casemix hides features)
### Step 8: ✅ Updated README with role system overview

**Phase 1 COMPLETE! Ready for Phase 2 (new roles like Kasir/Dokter).**

**Notes:**
- Semua fitur existing: allowedRoles = ['casemix']
- Silent migration: lama → casemix
- Reload on role change

Updated: $(date)
