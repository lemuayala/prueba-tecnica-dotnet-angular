import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-landing-page',
  standalone: false,
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
})
export class LandingPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('statsSection', { static: false }) statsSection!: ElementRef;
  private observer!: IntersectionObserver;
  currentYear: number = 0;

  // Valores finales para las estadísticas
  targetTrips = 10000;
  targetSavings = 30; // Porcentaje

  // Valores actuales para la animación
  currentTrips = 0;
  currentSavings = 0;

  ngOnInit(): void {
    this.currentYear = new Date().getFullYear();
  }

  ngAfterViewInit(): void {
    this.initIntersectionObserver();
  }

  private initIntersectionObserver(): void {
    const options = {
      root: null, // viewport
      rootMargin: '0px',
      threshold: 0.5, // 50% del elemento visible
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.animateNumbers();
          this.observer.unobserve(entry.target); // Animar solo una vez
        }
      });
    }, options);

    if (this.statsSection && this.statsSection.nativeElement) {
      this.observer.observe(this.statsSection.nativeElement);
    }
  }

  private animateNumbers(): void {
    const animate = (
      target: number,
      currentProp: 'currentTrips' | 'currentSavings',
      duration = 2000
    ) => {
      const startTime = performance.now();
      const initialValue = this[currentProp];

      const step = (timestamp: number) => {
        const elapsedTime = timestamp - startTime;
        const progress = Math.min(elapsedTime / duration, 1);

        this[currentProp] = Math.floor(
          initialValue + progress * (target - initialValue)
        );

        if (elapsedTime < duration) {
          window.requestAnimationFrame(step);
        } else {
          this[currentProp] = target; // Asegurar que el valor final sea exacto
        }
      };
      window.requestAnimationFrame(step);
    };

    animate(this.targetTrips, 'currentTrips');
    animate(this.targetSavings, 'currentSavings');
  }

  ngOnDestroy(): void {
    if (this.observer && this.statsSection && this.statsSection.nativeElement) {
      this.observer.unobserve(this.statsSection.nativeElement);
    }
  }
}
