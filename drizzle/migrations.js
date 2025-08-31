// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import m0000 from './0000_zippy_mentallo.sql';
import m0001 from './0001_new_eddie_brock.sql';
import m0002 from './0002_red_sister_grimm.sql';
import m0003 from './0003_dapper_prism.sql';
import m0004 from './0004_burly_gladiator.sql';
import m0005 from './0005_numerous_proudstar.sql';
import m0006 from './0006_tiny_jack_murdock.sql';
import m0007 from './0007_fantastic_moon_knight.sql';
import m0008 from './0008_tranquil_wrecking_crew.sql';
import m0010 from './0010_large_dust.sql';
import journal from './meta/_journal.json';

export default {
  journal,
  migrations: {
    m0000,
    m0001,
    m0002,
    m0003,
    m0004,
    m0005,
    m0006,
    m0007,
    m0008,
    m0010,
  },
};
