import * as functions from '../../utils/functions';

// in python
// from scipy.stats import skewnorm

// # print(skewnorm.mean(a=0,loc=2,scale=1))
// # args = {'a' : -0.3, 'loc' : 8, 'scale' : 16 }
// # print(skewnorm.cdf(30,**args))
// # print(skewnorm.cdf(-20,**args))
// # r = skewnorm.rvs(**args, size=10000)
// # fig, ax = plt.subplots(1, 1)
// # ax.hist(r, density=True, histtype='stepfilled', alpha=0.2)
// # plt.show()

// def getParams(mean, minv, maxv):
//   args = { 'a' : 0, 'loc' : mean, 'scale' : (maxv-minv) / 5 }
//   wanted_cdft = 0.95
//   wanted_cdfb = 0.05
//   margin = 0.01
  
//   cdft = skewnorm.cdf(maxv, **args)
//   cdfb = skewnorm.cdf(minv, **args)
//   i=0
//   while (i < 100 and not (wanted_cdft + margin >= cdft >= wanted_cdft - margin and wanted_cdfb + margin >= cdfb >= wanted_cdfb - margin)):
//     i += 1
//     print(cdfb, cdft)
//     if (cdft < wanted_cdft and cdfb > wanted_cdfb):
//       print('op 1 essai ', i)
//       args['scale'] -= 1
//     elif (cdft < wanted_cdft):
//       print('op 2 essai ', i)
//       args['a'] -= 0.1
//     else:
//       print('op 3 essai ', i)
//       args['a'] += 0.1
//       args['scale'] += 0.5
    
//     cdft = skewnorm.cdf(maxv, **args)
//     cdfb = skewnorm.cdf(minv, **args)
    
//   print(cdfb, cdft)
  
//   return args


// print(getParams(8, -15, 25))

export const generateRandomMarket = (start, period, igr_info, ir_info) => {
    market = {};
    for (let i = 0; i < period; i++) {
        // market[start + i] = 
    }
}