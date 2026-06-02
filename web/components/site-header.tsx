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
} from 'lucide-react';
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
        <a href="#" className="flex items-center gap-2.5 rounded-lg p-1 transition-opacity hover:opacity-80">
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
