const mock = require('egg-mock');
const assert = require('assert');
it('update cache',async ()=>{
    const app = mock.app();
    await app.ready();
    assert(!app.scheduleCache);
    await app.runSchedule('updatecache');
    assert(app.scheduleCache.title.length>0);
});