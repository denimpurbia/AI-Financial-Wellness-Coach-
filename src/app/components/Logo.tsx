// Centralized Logo component
import logoImage from '../../assets/9f846f3f3a37de3161d066c7a2b3c59ed9886822.png';

interface LogoProps {
  className?: string;
  alt?: string;
}

export function Logo({ className = "w-9 h-9 rounded-xl object-contain", alt = "Budget Sathi Logo" }: LogoProps) {
  return (
    <img
      src={logoImage}
      alt={alt}
      className={className}
      style={{
        filter: 'drop-shadow(0 0 18px rgba(0,217,255,0.5))',
      }}
    />
  );
}
