//是否将对function _(arg)的调用内联
//# define __INLINE_IMPL_TO_TERNARY__
# ifdef __INLINE_IMPL_TO_TERNARY__
# 	define _(arg) (arg._impl ? arg._impl : arg)
# endif

//是否进行g2b,b2g的粗略坐标转换
//#define __GOOGLE__
//是否将粗略坐标转换内联:
//不转换则不能内联
//转换可以选择是否内联
//#define __INLINE_LOOSE_CONVERT_TO_GOOGLE__
# ifdef __INLINE_LOOSE_CONVERT_TO_GOOGLE__
# 	define TO_BLNG(lng)	(lng+65E-4)
# 	define TO_BLAT(lat)	(lat+60E-4)
#	define TO_GLNG(lng)	(lng-65E-4)
#	define TO_GLAT(lat)	(lat-60E-4)
# else
#	define TO_BLNG(lng) lng
#	define TO_BLAT(lat) lat
#	define TO_GLNG(lng) lng
#	define TO_GLAT(lat) lat
# endif
