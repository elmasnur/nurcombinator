import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Users, Compass, Layers, CheckCircle, MessageSquare } from 'lucide-react';

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col">
      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <div className="animate-fade-in max-w-2xl">
          <h1 className="mb-6 font-display text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
            <span className="text-gradient-gold">Nur Combinator</span>
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-lg text-muted-foreground">
            Risale-i Nur ve İslamiyet odaklı projeleri yayına çıkma, kullanıcıya dokunma ve sürdürülebilirlik evrelerinde yönlendiren platform.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-gold">
              <Link to="/explore">
                Projeleri Keşfet <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-border text-foreground hover:bg-secondary">
              <Link to={user ? '/projects/new' : '/auth?redirect=/projects/new'}>Proje Oluştur</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-border px-4 py-16">
        <div className="container mx-auto max-w-4xl">
          <h2 className="mb-10 text-center font-display text-2xl font-bold">Nasıl Çalışır?</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground font-bold">1</div>
              <h3 className="mb-1 font-display text-base font-semibold">Proje Oluştur</h3>
              <p className="text-sm text-muted-foreground">Projenizi tanımlayın, evresini seçin ve yola çıkın.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground font-bold">2</div>
              <h3 className="mb-1 font-display text-base font-semibold">Ekip Kurun</h3>
              <p className="text-sm text-muted-foreground">Açık Çağrı ile ekip arkadaşı ve paydaş bulun.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground font-bold">3</div>
              <h3 className="mb-1 font-display text-base font-semibold">Evrelerle İlerleyin</h3>
              <p className="text-sm text-muted-foreground">7 evre rehberliğinde projenizi sürdürülebilir hale getirin.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="border-t border-border bg-card/50 px-4 py-16">
        <div className="container mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
              <Shield className="h-5 w-5 text-accent-foreground" />
            </div>
            <h3 className="mb-1 font-display text-base font-semibold">Güvenlik & Gizlilik</h3>
            <p className="text-sm text-muted-foreground">Kişisel veri sızdırma yok, spam ve tacize karşı sıfır tolerans.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
              <Compass className="h-5 w-5 text-accent-foreground" />
            </div>
            <h3 className="mb-1 font-display text-base font-semibold">Evre Bazlı Yönlendirme</h3>
            <p className="text-sm text-muted-foreground">7 evre ile projenizi niyetten kurumsallaşmaya taşıyın.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
              <Users className="h-5 w-5 text-accent-foreground" />
            </div>
            <h3 className="mb-1 font-display text-base font-semibold">Açık Çağrı & Networking</h3>
            <p className="text-sm text-muted-foreground">Her evrede ekip arkadaşı ve paydaş arayışı yapın.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-6 text-center text-xs text-muted-foreground">
        Nur Combinator — Şeffaflık, saygı ve hizmet.
      </footer>
    </div>
  );
}
