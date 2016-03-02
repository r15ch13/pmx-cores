# pmx-cores

Report system cpu and core usage to keymetrics via pmx.

example
-------

``` js
var pmxcores = require('pmx-cores');

// report every second to keymetrics
pmxcores.report();

// or use the data your way
pmxcores.info(function(cpu) {
  console.log(cpu);
});
pmxcores.usage(function(cpu) {
  console.log(usage);
});
```

# License
[The MIT License (MIT)](http://r15ch13.mit-license.org/)
