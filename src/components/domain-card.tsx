
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import type { Domain } from '@/lib/domains';

type DomainCardProps = {
  domain: Domain;
};

const gradientClasses = [
  'from-blue-500 to-purple-600',
  'from-purple-500 to-pink-500',
  'from-pink-500 to-orange-500',
  'from-green-400 to-emerald-500',
  'from-cyan-400 to-blue-500',
  'from-orange-400 to-red-500',
  'from-indigo-500 to-purple-500',
  'from-emerald-400 to-cyan-500',
];

export function DomainCard({ domain }: DomainCardProps) {
  const Icon = domain.icon;
  const gradientClass = gradientClasses[Math.abs(domain.name.length) % gradientClasses.length];

  return (
    <Link href={`/domain/${domain.slug}`} className="group">
      <Card className="h-full transition-all duration-500 ease-out hover:shadow-2xl hover:-translate-y-2 hover:scale-105 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover-glow group-hover:shadow-blue-500/25 overflow-hidden relative">
        {/* Gradient Border Effect */}
        <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-[1px] rounded-lg">
          <div className={`absolute inset-[1px] bg-gradient-to-r ${gradientClass} rounded-lg opacity-20`}></div>
        </div>
        
        {/* Shimmer Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="shimmer"></div>
        </div>
        
        <CardHeader className="flex-row items-center gap-4 relative z-10">
          <div className={`bg-gradient-to-r ${gradientClass} p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="h-8 w-8 text-white drop-shadow-sm" />
          </div>
          <CardTitle className="font-headline text-xl group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
            {domain.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <CardDescription className="group-hover:text-gray-700 transition-colors duration-300">
            {domain.description}
          </CardDescription>
          
          {/* Floating Particles */}
          <div className="absolute -top-2 -right-2 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
          <div className="absolute top-1/2 -left-1 w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute -bottom-1 right-1/3 w-1.5 h-1.5 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-opacity duration-300" style={{animationDelay: '1s'}}></div>
        </CardContent>
      </Card>
    </Link>
  );
}
