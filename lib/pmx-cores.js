/* jshint node:true, esversion: 6 */
/* exported info,usage,report */
'use strict';

var os = require('os');
var pmx = require('pmx');

var pmxcores = module.exports;

pmxcores.info = (callback) => {
  process.nextTick(() => {
    var cpus = os.cpus();
    var cpu = { percent:0, user:0, nice:0, sys:0, irq:0, idle:0, total:0, cores: [] };

    for(var core in cpus) {

      cpu.cores[core] = cpu.cores[core] || { percent:0, user:0, nice:0, sys:0, irq:0, idle:0, total:0 };

      cpu.user += cpus[core].times.user;
      cpu.nice += cpus[core].times.nice;
      cpu.sys += cpus[core].times.sys;
      cpu.irq += cpus[core].times.irq;
      cpu.idle += cpus[core].times.idle;

      cpu.cores[core].user += cpus[core].times.user;
      cpu.cores[core].nice += cpus[core].times.nice;
      cpu.cores[core].sys += cpus[core].times.sys;
      cpu.cores[core].irq += cpus[core].times.irq;
      cpu.cores[core].idle += cpus[core].times.idle;
      cpu.cores[core].total = cpus[core].times.user + cpus[core].times.nice + cpus[core].times.sys + cpus[core].times.idle + cpus[core].times.irq;
    }
    cpu.total = cpu.user + cpu.nice + cpu.sys + cpu.idle + cpu.irq;

    if(callback) callback(cpu);
  });
};

pmxcores.usage = (callback, showUsing) => {

  if(typeof showUsing === 'undefined') showUsing = true;

  this.info((start) => {

    setTimeout(() => {

      this.info((end) => {

        end.percent = 100 * (end.idle - start.idle) / (end.total - start.total);

        if(showUsing) {
          end.percent = 100 - end.percent;
        }

        for(var core in end.cores)
        {
          end.cores[core].percent = 100 * (end.cores[core].idle - start.cores[core].idle) / (end.cores[core].total - start.cores[core].total);

          if(showUsing) {
            end.cores[core].percent = 100 - end.cores[core].percent;
          }
        }

        callback(end);
      });
    }, 1000);
  });
};

pmxcores.report = (interval, showCoreUsage) => {
  if(typeof showCoreUsage === 'undefined') interval = 1;
  if(typeof showCoreUsage === 'undefined') showCoreUsage = true;

  var probe = pmx.probe();
  var cpuUsage = probe.metric({
    name: 'System CPU Usage %'
  });
  var cpuCoreUsage = [];

  setInterval(() => {
    this.usage((cpu) => {
      cpuUsage.set(cpu.percent.toFixed(2));

      if(showCoreUsage)
      {
        for(var core in cpu.cores)
        {
          cpuCoreUsage[core] = cpuCoreUsage[core] || probe.metric({ name: 'Core '+core+' Usage %' });
          cpuCoreUsage[core].set(cpu.cores[core].percent.toFixed(2));
        }
      }
    });
  }, interval * 1000);
};
