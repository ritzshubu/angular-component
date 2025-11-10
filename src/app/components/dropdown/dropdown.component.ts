import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  Signal,
  computed,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

export interface DropdownOption {
  label: string;
  value: string;
  hint?: string;
  disabled?: boolean;
}

@Component({
  selector: 'ui-dropdown',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css',
})
export class DropdownComponent {
  private readonly optionsSignal = signal<DropdownOption[]>([]);
  private readonly selectedValueSignal = signal<string | null>(null);
  private readonly isOpenSignal = signal(false);
  private readonly activeIndexSignal = signal<number>(-1);

  @Input()
  set options(options: DropdownOption[]) {
    this.optionsSignal.set(options ?? []);
    if (!this.hasSelectedValue()) {
      this.selectedValueSignal.set(null);
    } else if (!this.optionsSignal().some((option) => option.value === this.selectedValueSignal())) {
      this.selectedValueSignal.set(null);
    }
  }

  @Input() placeholder = 'Select an option';

  @Input()
  set selected(value: string | null) {
    this.selectedValueSignal.set(value ?? null);
  }
  get selected(): string | null {
    return this.selectedValueSignal();
  }

  @Input() disabled = false;

  @Output() selectionChange = new EventEmitter<DropdownOption>();

  readonly isOpen: Signal<boolean> = computed(() => this.isOpenSignal());
  readonly activeIndex: Signal<number> = computed(() => this.activeIndexSignal());
  readonly selectedOption: Signal<DropdownOption | null> = computed(() => {
    if (!this.hasSelectedValue()) {
      return null;
    }

    return this.optionsSignal().find(
      (option) => option.value === this.selectedValueSignal()
    ) ?? null;
  });

  readonly availableOptions: Signal<DropdownOption[]> = computed(() =>
    this.optionsSignal().filter(Boolean)
  );

  readonly hasOptions = computed(() => this.availableOptions().length > 0);

  toggle(): void {
    if (this.disabled) {
      return;
    }

    this.isOpenSignal.update((open) => {
      const next = !open;
      if (next) {
        this.focusSelectedOrFirst();
      }
      return next;
    });
  }

  open(): void {
    if (this.disabled || this.isOpen()) {
      return;
    }

    this.isOpenSignal.set(true);
    this.focusSelectedOrFirst();
  }

  close(): void {
    if (!this.isOpen()) {
      return;
    }

    this.isOpenSignal.set(false);
    this.activeIndexSignal.set(-1);
  }

  select(option: DropdownOption): void {
    if (option.disabled) {
      return;
    }

    this.selectedValueSignal.set(option.value);
    this.selectionChange.emit(option);
    this.close();
  }

  onOptionHover(index: number): void {
    if (this.availableOptions()[index]?.disabled) {
      return;
    }

    this.activeIndexSignal.set(index);
  }

  onTriggerKeydown(event: KeyboardEvent): void {
    if (this.disabled) {
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen()) {
          this.open();
        } else {
          this.moveActiveIndex(1);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!this.isOpen()) {
          this.open();
        } else {
          this.moveActiveIndex(-1);
        }
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!this.isOpen()) {
          this.open();
        } else {
          this.selectActiveOption();
        }
        break;
      case 'Escape':
        if (this.isOpen()) {
          event.stopPropagation();
          this.close();
        }
        break;
    }
  }

  onListKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.moveActiveIndex(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.moveActiveIndex(-1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.selectActiveOption();
        break;
      case 'Escape':
        event.preventDefault();
        this.close();
        break;
      case 'Tab':
        this.close();
        break;
    }
  }

  isSelected(option: DropdownOption): boolean {
    return option.value === this.selectedValueSignal();
  }

  isActive(index: number): boolean {
    return index === this.activeIndexSignal();
  }

  private focusSelectedOrFirst(): void {
    const currentIndex = this.availableOptions().findIndex(
      (option) => option.value === this.selectedValueSignal()
    );
    const fallbackIndex = this.availableOptions().findIndex((option) => !option.disabled);
    this.activeIndexSignal.set(currentIndex >= 0 ? currentIndex : fallbackIndex);
  }

  private moveActiveIndex(delta: number): void {
    const options = this.availableOptions();
    if (!options.length) {
      return;
    }

    let nextIndex = this.activeIndexSignal();
    for (let step = 0; step < options.length; step += 1) {
      nextIndex = (nextIndex + delta + options.length) % options.length;
      if (!options[nextIndex].disabled) {
        this.activeIndexSignal.set(nextIndex);
        return;
      }
    }
  }

  private selectActiveOption(): void {
    const index = this.activeIndexSignal();
    const option = this.availableOptions()[index];
    if (option) {
      this.select(option);
    }
  }

  private hasSelectedValue(): boolean {
    return this.selectedValueSignal() !== null && this.selectedValueSignal() !== undefined;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isOpen()) {
      return;
    }

    const target = event.target as HTMLElement | null;
    if (!target?.closest('[data-dropdown-root]')) {
      this.close();
    }
  }
}
