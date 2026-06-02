'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  Monitor,
  Smartphone,
  Globe,
  LayoutDashboard,
  ShoppingCart,
  Zap,
  Users,
  Database,
  Server,
  Cloud,
  GitBranch,
  Layers,
  Cpu,
} from 'lucide-react';
import {
  FaReact, FaNodeJs, FaDocker, FaGitAlt,
} from 'react-icons/fa';
import {
  SiNextdotjs, SiTypescript, SiTailwindcss, SiPrisma,
  SiPostgresql, SiVercel, SiCloudinary,
} from 'react-icons/si';
import type { LucideIcon } from 'lucide-react';

type LinkItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
};

const serviciosLinks: LinkItem[] = [
  { title: 'Apps web a la medida', href: '#servicios', icon: Monitor,        description: 'Plataformas con roles, dashboards y lógica propia' },
  { title: 'Apps móviles',         href: '#servicios', icon: Smartphone,     description: 'iOS y Android, nativas o multiplataforma' },
  { title: 'Páginas y landings',   href: '#servicios', icon: Globe,          description: 'Sitios de alto impacto que convierten visitas' },
  { title: 'Sistemas de gestión',  href: '#servicios', icon: LayoutDashboard,description: 'ERPs, CRMs y herramientas internas a tu medida' },
  { title: 'Tiendas en línea',     href: '#servicios', icon: ShoppingCart,   description: 'E-commerce completo con pagos y administración' },
  { title: 'Integraciones y PWA',  href: '#servicios', icon: Zap,            description: 'WhatsApp, pagos, APIs externas y apps instalables' },
];

type TechItem = {
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
};

const techGroups: { category: string; items: TechItem[] }[] = [
  {
    category: 'Frontend',
    items: [
      { label: 'React',       description: 'UI declarativa y componentizada',        icon: <FaReact />,       color: '#61DAFB' },
      { label: 'Next.js',     description: 'SSR, rutas y optimización automática',   icon: <SiNextdotjs />,   color: '#ffffff' },
      { label: 'TypeScript',  description: 'Tipado estático para código robusto',    icon: <SiTypescript />,  color: '#3178C6' },
      { label: 'Tailwind CSS',description: 'Estilos utilitarios sin fricción',       icon: <SiTailwindcss />, color: '#06B6D4' },
    ],
  },
  {
    category: 'Backend',
    items: [
      { label: 'Node.js',     description: 'Runtime JS rápido y escalable',          icon: <FaNodeJs />,      color: '#339933' },
      { label: 'Prisma',      description: 'ORM moderno con tipado completo',        icon: <SiPrisma />,      color: '#5a67d8' },
      { label: 'PostgreSQL',  description: 'Base de datos relacional de alto nivel', icon: <SiPostgresql />,  color: '#336791' },
      { label: 'Cloudinary',  description: 'Gestión de imágenes y archivos en nube', icon: <SiCloudinary />,  color: '#3448C5' },
    ],
  },
  {
    category: 'Infraestructura',
    items: [
      { label: 'Vercel',      description: 'Deploy instantáneo con CDN global',      icon: <SiVercel />,      color: '#ffffff' },
      { label: 'Docker',      description: 'Contenedores para entornos consistentes',icon: <FaDocker />,      color: '#2496ED' },
      { label: 'Git',         description: 'Control de versiones y colaboración',    icon: <FaGitAlt />,      color: '#F05032' },
    ],
  },
];

function useScroll(threshold: number) {
  const [scrolled, setScrolled] = React.useState(false);
  const onScroll = React.useCallback(() => {
    setScrolled(window.scrollY > threshold);
  }, [threshold]);
  React.useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll]);
  React.useEffect(() => { onScroll(); }, [onScroll]);
  return scrolled;
}

type MobileMenuProps = React.ComponentProps<'div'> & { open: boolean };
function MobileMenu({ open, children, className, ...props }: MobileMenuProps) {
  if (!open || typeof window === 'undefined') return null;
  return createPortal(
    <div
      id="mobile-menu"
      className="fixed top-14 right-0 bottom-0 left-0 z-40 flex flex-col overflow-hidden border-t md:hidden"
      style={{ background: 'rgba(9,9,14,0.97)', borderColor: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)' }}
    >
      <div
        data-slot={open ? 'open' : 'closed'}
        className={cn('data-[slot=open]:animate-in data-[slot=open]:zoom-in-97 ease-out size-full p-5', className)}
        {...props}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

function ListItem({ title, description, icon: Icon, href, className }: LinkItem & { className?: string }) {
  return (
    <NavigationMenuLink asChild>
      <a
        href={href}
        className={cn(
          'flex flex-row gap-3 rounded-lg p-2.5 transition-colors duration-150 hover:bg-white/6 cursor-pointer',
          className,
        )}
      >
        <div
          className="flex aspect-square size-10 shrink-0 items-center justify-center rounded-md"
          style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.2)' }}
        >
          <Icon className="size-4" style={{ color: '#a78bfa' }} />
        </div>
        <div className="flex flex-col justify-center">
          <span className="text-sm font-semibold text-white">{title}</span>
          {description && <span className="text-xs text-white/45 leading-tight mt-0.5">{description}</span>}
        </div>
      </a>
    </NavigationMenuLink>
  );
}

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  const scrolled = useScroll(10);

  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b border-transparent transition-all duration-300',
        scrolled && 'border-white/8',
      )}
      style={{
        background: '#09090e',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
      }}
    >
      <nav className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6">

        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 rounded-lg p-1 transition-opacity hover:opacity-80">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-extrabold text-white"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', letterSpacing: '-0.03em' }}
          >
            N97
          </div>
          <span className="hidden text-sm font-bold text-white sm:block" style={{ letterSpacing: '-0.02em' }}>
            NexCode97
          </span>
        </a>

        {/* Nav desktop */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <span style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Nex
                </span>
                Technology
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[580px] p-4">
                  {/* Encabezado */}
                  <div className="mb-4 pb-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                    <p className="text-sm font-bold text-white">Stack tecnológico</p>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      Las herramientas que usamos para construir cada proyecto
                    </p>
                  </div>
                  {/* Grupos */}
                  <div className="flex flex-col gap-4">
                    {techGroups.map((group) => (
                      <div key={group.category}>
                        <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-widest" style={{ color: '#a78bfa' }}>
                          {group.category}
                        </p>
                        <div className="grid grid-cols-4 gap-1.5">
                          {group.items.map((tech) => (
                            <div
                              key={tech.label}
                              className="flex flex-col items-center gap-2 rounded-lg p-2.5 text-center cursor-pointer"
                              style={{ transition: 'background 100ms ease-out' }}
                              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
                              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                            >
                              <div
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-lg"
                                style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.18)', color: tech.color }}
                              >
                                {tech.icon}
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-white leading-tight">{tech.label}</p>
                                <p className="text-[10px] leading-tight mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{tech.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Servicios</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[520px] grid-cols-2 gap-1.5 p-3">
                  {serviciosLinks.map((item) => (
                    <li key={item.title}>
                      <ListItem {...item} />
                    </li>
                  ))}
                </ul>
                <div className="border-t px-4 py-3" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                  <p className="text-xs text-white/40">
                    ¿Tienes un proyecto en mente?{' '}
                    <a
                      href="https://wa.me/573006359008"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold transition-colors hover:text-violet-400"
                      style={{ color: '#a78bfa' }}
                    >
                      Contacta a ventas
                    </a>
                  </p>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <a
                  href="#nosotros"
                  className="inline-flex h-9 items-center rounded-md px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/8 hover:text-white"
                >
                  Nosotros
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Auth + hamburger */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            <button className="rounded-full px-4 py-2 text-sm font-semibold text-white/70 transition-colors hover:text-white hover:bg-white/8 cursor-pointer">
              Log in
            </button>
            <button className="rounded-full px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 cursor-pointer"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)' }}>
              Sign up
            </button>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg border transition-colors hover:bg-white/8 cursor-pointer"
            style={{ borderColor: 'rgba(255,255,255,0.12)', color: 'white' }}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
          >
            <MenuToggleIcon open={open} className="size-5" duration={300} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <MobileMenu open={open} className="flex flex-col justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="mb-1 px-2 text-xs font-bold uppercase tracking-widest" style={{ color: '#a78bfa' }}>
            Servicios
          </p>
          {serviciosLinks.map((link) => (
            <ListItem key={link.title} {...link} />
          ))}
          <div className="my-2 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
          <p className="mb-1 px-2 text-xs font-bold uppercase tracking-widest" style={{ color: '#a78bfa' }}>
            NexTechnology
          </p>
          {techGroups.map((group) => (
            <div key={group.category}>
              <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>
                {group.category}
              </p>
              <div className="grid grid-cols-2 gap-1">
                {group.items.map((tech) => (
                  <div key={tech.label} className="flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-white/6">
                    <span className="text-base" style={{ color: tech.color }}>{tech.icon}</span>
                    <span className="text-sm font-medium text-white/70">{tech.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="my-2 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
          <a
            href="#nosotros"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-white/70 transition-colors hover:bg-white/6 hover:text-white"
          >
            <div className="flex size-10 items-center justify-center rounded-md" style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.2)' }}>
              <Users className="size-4" style={{ color: '#a78bfa' }} />
            </div>
            Nosotros
          </a>
        </div>

        <div className="flex flex-col gap-2">
          <button className="w-full rounded-full border py-3 text-sm font-semibold text-white/70 transition-colors hover:text-white cursor-pointer"
            style={{ borderColor: 'rgba(255,255,255,0.12)', background: 'transparent' }}>
            Log in
          </button>
          <button className="w-full rounded-full py-3 text-sm font-bold text-white cursor-pointer"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)' }}>
            Sign up
          </button>
        </div>
      </MobileMenu>
    </header>
  );
}
