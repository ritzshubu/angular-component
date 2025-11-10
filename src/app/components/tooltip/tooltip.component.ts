import { Component, Input, Signal, computed, signal } from '@angular/core';

export type TooltipDirection = 'top' | 'right' | 'bottom' | 'left';

@Component({
  selector: 'ui-tooltip',
  standalone: true,
  imports: [],
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.css',
})
export class TooltipComponent {
  private static nextId = 0;
  private readonly visible = signal(false);
  private readonly directionSignal = signal<TooltipDirection>('top');

  readonly tooltipId = `ui-tooltip-${TooltipComponent.nextId++}`;
  readonly isVisible: Signal<boolean> = computed(() => this.visible());

  @Input({ required: true }) text = '';

  @Input()
  set direction(direction: TooltipDirection) {
    this.directionSignal.set(this.coerceDirection(direction));
  }
  get direction(): TooltipDirection {
    return this.directionSignal();
  }

  show(): void {
    this.visible.set(true);
  }

  hide(): void {
    this.visible.set(false);
  }

  toggleForTouch(): void {
    this.visible.update((value) => !value);
  }

  private coerceDirection(direction: TooltipDirection): TooltipDirection {
    return ['top', 'right', 'bottom', 'left'].includes(direction)
      ? direction
      : 'top';
  }
}
