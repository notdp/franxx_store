import { Package } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Check, Zap, Shield, Crown, Activity, MapPin, Fuel, Package2 } from 'lucide-react';

interface PackageCardProps {
  package: Package;
  onSelect: (packageId: string) => void;
}

export function PackageCard({ package: pkg, onSelect }: PackageCardProps) {
  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'legendary':
        return <Crown className="w-5 h-5 text-red-500" />;
      case 'advanced':
        return <Zap className="w-5 h-5 text-blue-500" />;
      default:
        return <Shield className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTierGradient = (tier: string) => {
    switch (tier) {
      case 'legendary':
        return 'bg-gradient-to-br from-red-50 via-pink-50 to-red-100 border-red-200';
      case 'advanced':
        return 'bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 border-blue-200';
      default:
        return 'bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 border-gray-200';
    }
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'legendary':
        return <Badge className="bg-red-500 text-white hover:bg-red-600">传奇型</Badge>;
      case 'advanced':
        return <Badge className="bg-blue-500 text-white hover:bg-blue-600">特装型</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white hover:bg-gray-600">量产型</Badge>;
    }
  };

  const getMagmaLevel = (output: string) => {
    const level = parseInt(output);
    if (level >= 100) return { value: 100, color: 'bg-red-500', label: '超高出力' };
    if (level >= 80) return { value: level, color: 'bg-blue-500', label: '高出力' };
    return { value: level, color: 'bg-gray-500', label: '标准出力' };
  };

  const franxx = pkg.franxx;
  const isLegendary = franxx?.tier === 'legendary';
  const isAdvanced = franxx?.tier === 'advanced';
  const magmaLevel = franxx ? getMagmaLevel(franxx.magmaOutput) : { value: 0, color: 'bg-gray-400', label: '未知' };
  
  const getStockStatus = (stock: number, total: number) => {
    const percentage = (stock / total) * 100;
    if (percentage <= 10) return { status: 'critical', color: 'text-red-600', bgColor: 'bg-red-50', label: '库存紧张' };
    if (percentage <= 30) return { status: 'low', color: 'text-orange-600', bgColor: 'bg-orange-50', label: '库存偏少' };
    return { status: 'normal', color: 'text-green-600', bgColor: 'bg-green-50', label: '库存充足' };
  };

  return (
    <Card className={`relative h-full transition-all duration-500 hover:shadow-xl hover:scale-[1.02] ${
      pkg.popular ? 'shadow-lg' : ''
    } ${franxx ? getTierGradient(franxx.tier) : ''}`}>
      
      {/* 受欢迎标签 */}
      {pkg.popular && (
        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 z-10">
          <Badge className="bg-blue-500 text-white px-3 py-1 shadow-lg rounded-full">
            最受欢迎
          </Badge>
        </div>
      )}



      <CardHeader className="pb-4 relative">
        {/* Plantation 信息条 */}
        {franxx && (
          <div className="absolute top-0 left-0 right-0 h-1 rounded-t-lg"
               style={{ backgroundColor: franxx.color, opacity: 0.6 }}>
          </div>
        )}

        {/* 机体信息 */}
        {franxx && (
          <div className="space-y-4 mb-4">
            {/* 机体标题 */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {getTierIcon(franxx.tier)}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-xl" style={{ color: franxx.color }}>
                      {franxx.model}
                    </span>
                    <span className="text-sm text-muted-foreground font-medium">({franxx.name})</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {franxx.code}  •  {franxx.plantation}  •  {franxx.pilot}
                  </div>
                </div>
              </div>
              {getTierBadge(franxx.tier)}
            </div>

            {/* 系统状态 */}
            <div className="bg-white/50 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Fuel className="w-4 h-4 text-orange-500" />
                  <span className="font-medium">岩浆核心</span>
                </div>
                <span className="font-bold" style={{ color: franxx.color }}>
                  {franxx.magmaOutput}
                </span>
              </div>
              
              <Progress 
                value={magmaLevel.value} 
                className="h-2"
              />
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{magmaLevel.label}</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-green-600 font-medium">系统在线</span>
                </div>
              </div>
            </div>
            
            {/* 机体库存状态 */}
            {franxx.stock !== undefined && franxx.totalUnits !== undefined && (
              <div className="bg-white/50 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Package2 className="w-4 h-4 text-slate-500" />
                    <span className="font-medium">机体库存</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold" style={{ color: franxx.color }}>
                      {franxx.stock}/{franxx.totalUnits}
                    </span>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      getStockStatus(franxx.stock, franxx.totalUnits).bgColor
                    } ${getStockStatus(franxx.stock, franxx.totalUnits).color}`}>
                      {getStockStatus(franxx.stock, franxx.totalUnits).label}
                    </div>
                  </div>
                </div>
                
                <Progress 
                  value={(franxx.stock / franxx.totalUnits) * 100} 
                  className="h-2"
                />
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {franxx.tier === 'legendary' ? '独一无二' : 
                     franxx.tier === 'advanced' ? '限量生产' : '量产机型'}
                  </span>
                  {franxx.stock > 0 ? (
                    <span className="text-green-600 font-medium">可申请驾驶</span>
                  ) : (
                    <span className="text-red-600 font-medium">暂无机体</span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 价格区域 */}
        <div className="flex items-center justify-between mb-3">
          <CardDescription className="text-sm flex-1 mr-4">
            {pkg.description}
          </CardDescription>
          <div className="text-right shrink-0">
            <div className={`text-2xl font-bold ${
              isLegendary ? 'text-red-600' : isAdvanced ? 'text-blue-600' : 'text-primary'
            }`}>
              ¥{pkg.salePrice}
            </div>
            <div className="text-sm text-muted-foreground line-through">¥{pkg.originalPrice}</div>
          </div>
        </div>
        

        
        {/* 节省信息 */}
        <div className={`px-3 py-2 rounded-lg text-sm border ${
          isLegendary ? 'bg-red-50 text-red-700 border-red-200' : 
          isAdvanced ? 'bg-blue-50 text-blue-700 border-blue-200' : 
          'bg-gray-50 text-gray-700 border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <span>节省成本:</span>
            <span className="font-bold">¥{pkg.savings} ({Math.round((pkg.savings / pkg.originalPrice) * 100)}%)</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1">
        <div className="space-y-4">
          {/* 驾驶权限列表 */}
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              作战权限清单
            </h4>
            <ul className="space-y-2">
              {pkg.features.map((feature, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <Check className={`w-3 h-3 mt-1 flex-shrink-0 ${
                    isLegendary ? 'text-red-500' : isAdvanced ? 'text-blue-500' : 'text-gray-500'
                  }`} />
                  <span className="text-sm leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-4">
        <Button 
          className={`w-full transition-all duration-300 relative overflow-hidden ${
            franxx?.stock === 0 ? 'opacity-50 cursor-not-allowed' :
            isLegendary ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg' :
            isAdvanced ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg' :
            pkg.popular ? '' : 'border-2'
          }`}
          onClick={() => franxx?.stock !== 0 && onSelect(pkg.id)}
          variant={pkg.popular && !isLegendary && !isAdvanced ? "default" : "outline"}
          size="lg"
          disabled={franxx?.stock === 0}
        >
          {/* 按钮发光效果 */}
          {(isLegendary || isAdvanced) && (
            <div className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full transition-transform duration-700 hover:translate-x-full"></div>
          )}
          <span className="relative flex items-center justify-center gap-2">
            {franxx?.stock === 0 ? (
              <>
                <Package2 className="w-4 h-4" />
                机体暂无库存
              </>
            ) : (
              <>
                {isLegendary && <Crown className="w-4 h-4" />}
                {isAdvanced && <Zap className="w-4 h-4" />}
                {isLegendary ? '申请传奇驾驶权限' : 
                 isAdvanced ? '申请特装型权限' : 
                 '申请基础驾驶权限'}
              </>
            )}
          </span>
        </Button>
      </CardFooter>
    </Card>
  );
}
