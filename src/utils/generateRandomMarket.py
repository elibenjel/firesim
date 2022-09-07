#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from scipy.stats import skewnorm
import sys
from math import sqrt, pi
import json

# print(skewnorm.mean(a=0,loc=2,scale=1))
# args = {'a' : -0.3, 'loc' : 8, 'scale' : 16 }
# print(skewnorm.cdf(30,**args))
# print(skewnorm.cdf(-20,**args))
# r = skewnorm.rvs(**args, size=10000)
# fig, ax = plt.subplots(1, 1)
# ax.hist(r, density=True, histtype='stepfilled', alpha=0.2)
# plt.show()

(mean_igr, minv_igr, maxv_igr, mean_ir, minv_ir, maxv_ir, period) = [int(el) for el in sys.argv[1:]]

def getParams(mean, minv, maxv):
  args = { 'a' : 0, 'loc' : mean, 'scale' : 1 }
  delta = lambda skew: skew / sqrt(1 + skew**2)
  skewnorm_mean = lambda d: d['loc'] + d['scale']*delta(d['a'])*sqrt(2/pi)
  skewnorm_var = lambda d: d['scale']**2 * (1 - 2*delta(d['a'])**2 / pi)
  wanted_cdft = 0.985
  wanted_cdfb = 0.03
  margin = 0.01
  
  cdft = skewnorm.cdf(maxv, **args)
  cdfb = skewnorm.cdf(minv, **args)
  i=0
  while (i < 100 and not (wanted_cdft + margin >= cdft >= wanted_cdft - margin and wanted_cdfb + margin >= cdfb >= wanted_cdfb - margin)):
    i += 1
    if (cdft < wanted_cdft and cdfb > wanted_cdfb):
      args['scale'] -= 1
    elif (cdft < wanted_cdft):
      args['a'] -= 0.1
    else:
      args['a'] += 0.1
      args['scale'] += 0.5
    
    args['loc'] += mean - skewnorm_mean(args)

    cdft = skewnorm.cdf(maxv, **args)
    cdfb = skewnorm.cdf(minv, **args)
    
  return args

args_igr = getParams(mean_igr, minv_igr, maxv_igr)
market_igr = skewnorm.rvs(**args_igr, size=period)
args_ir = getParams(mean_ir, minv_ir, maxv_ir)
market_ir = skewnorm.rvs(**args_ir, size=period)
print(json.dumps({'igr' : [round(igr, 1) for igr in market_igr], 'ir' : [round(ir, 1) for ir in market_ir]}))
sys.stdout.flush()
