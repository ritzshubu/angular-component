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

export interface MultiSelectFilterOption {
  label: string;
  value: string;
  count?: number;
  children?: MultiSelectFilterOption[];
}

interface FlattenedOption {
  option: MultiSelectFilterOption;
  depth: number;
  descendantLeafValues: string[];
  isLeaf: boolean;
}

@Component({
  selector: 'ui-multi-select-filter',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './multi-select-filter.component.html',
  styleUrl: './multi-select-filter.component.css',
})
export class MultiSelectFilterComponent {
  private readonly optionsSignal = signal<MultiSelectFilterOption[]>([]);
  private readonly showDropdownCountSignal = signal(false);
  private readonly showFilterCountSignal = signal(false);
  private readonly showAllSelectedSignal = signal(true);
  private readonly placeholderSignal = signal('Filter items');
  private readonly selectedLeavesSignal = signal<Set<string>>(new Set());
  private readonly openSignal = signal(false);

  private initialSelectAll = false;

  @Input()
  set options(options: MultiSelectFilterOption[] | null | undefined) {
    this.optionsSignal.set(options ?? []);
    this.applyInitialSelection();
  }

  @Input()
  set placeholder(value: string | undefined) {
    this.placeholderSignal.set(value?.trim() || 'Filter items');
  }

  @Input()
  set showDropdownCount(value: boolean | undefined) {
    this.showDropdownCountSignal.set(!!value);
  }

  @Input()
  set showFilterCount(value: boolean | undefined) {
    this.showFilterCountSignal.set(!!value);
  }

  @Input()
  set showAllSelected(value: boolean | undefined) {
    this.showAllSelectedSignal.set(value ?? true);
  }

  @Input()
  set initialSelection(value: boolean | undefined) {
    this.initialSelectAll = !!value;
    this.applyInitialSelection();
  }

  @Output() readonly selectionChange = new EventEmitter<string[]>();

  readonly isOpen: Signal<boolean> = computed(() => this.openSignal());
  readonly dropdownCountEnabled = computed(
    () => this.showDropdownCountSignal()
  );
  readonly filterCountEnabled = computed(
    () => this.showFilterCountSignal()
  );
  readonly showAllSelectedRow = computed(
    () => this.showAllSelectedSignal()
  );
  readonly placeholderText = computed(() => this.placeholderSignal());

  readonly flattenedOptions: Signal<FlattenedOption[]> = computed(() => {
    const options = this.optionsSignal();
    return this.flattenOptions(options);
  });

  readonly allLeafValues = computed(() =>
    this.flattenedOptions()
      .filter((item) => item.isLeaf)
      .map((item) => item.option.value)
  );

  readonly selectedLeaves = computed(() => this.selectedLeavesSignal());

  readonly isAllSelected = computed(
    () =>
      this.allLeafValues().length > 0 &&
      this.allLeafValues().every((value) =>
        this.selectedLeavesSignal().has(value)
      )
  );

  readonly isPartiallySelected = computed(() => {
    const count = this.selectedLeavesSignal().size;
    return count > 0 && count < this.allLeafValues().length;
  });

  readonly displaySelections = computed(() =>
    this.buildDisplaySelections(this.optionsSignal(), this.selectedLeavesSignal())
  );

  readonly buttonLabel = computed(() => {
    const selections = this.displaySelections();
    if (!selections.length) {
      return {
        text: this.placeholderText(),
        muted: true,
      };
    }

    const label = this.filterCountEnabled()
      ? selections.length === 1
        ? selections[0].label
        : `${selections[0].label} + ${selections.length - 1}`
      : selections.map((item) => item.label).join(', ');

    return {
      text: label,
      muted: false,
    };
  });

  readonly buttonWidth = computed(() => {
    const labels = [
      this.placeholderText(),
      ...this.flattenedOptions().map((item) => this.formatOptionLabel(item.option)),
    ];
    const longest = labels.reduce(
      (max, label) => Math.max(max, label.length),
      0
    );
    const approximateWidth = longest * 7.2 + 96;
    return Math.max(200, Math.min(approximateWidth, 320));
  });

  toggleDropdown(): void {
    this.openSignal.update((open) => !open);
  }

  openDropdown(): void {
    if (!this.isOpen()) {
      this.openSignal.set(true);
    }
  }

  closeDropdown(): void {
    if (this.isOpen()) {
      this.openSignal.set(false);
    }
  }

  toggleAll(): void {
    if (this.isAllSelected()) {
      this.selectedLeavesSignal.set(new Set());
    } else {
      this.selectedLeavesSignal.set(new Set(this.allLeafValues()));
    }
    this.emitSelectionChange();
  }

  toggleOption(item: FlattenedOption): void {
    const next = new Set(this.selectedLeavesSignal());

    if (item.isLeaf) {
      if (next.has(item.option.value)) {
        next.delete(item.option.value);
      } else {
        next.add(item.option.value);
      }
    } else {
      const allSelected = item.descendantLeafValues.every((value) =>
        next.has(value)
      );
      if (allSelected) {
        item.descendantLeafValues.forEach((value) => next.delete(value));
      } else {
        item.descendantLeafValues.forEach((value) => next.add(value));
      }
    }

    this.selectedLeavesSignal.set(next);
    this.emitSelectionChange();
  }

  clearSelection(): void {
    this.selectedLeavesSignal.set(new Set());
    this.emitSelectionChange();
  }

  isChecked(item: FlattenedOption): boolean {
    if (item.isLeaf) {
      return this.selectedLeavesSignal().has(item.option.value);
    }
    return item.descendantLeafValues.every((value) =>
      this.selectedLeavesSignal().has(value)
    );
  }

  isIndeterminate(item: FlattenedOption): boolean {
    if (item.isLeaf) {
      return false;
    }
    const selectedCount = item.descendantLeafValues.filter((value) =>
      this.selectedLeavesSignal().has(value)
    ).length;
    return selectedCount > 0 && selectedCount < item.descendantLeafValues.length;
  }

  formatOptionLabel(option: MultiSelectFilterOption): string {
    if (!this.dropdownCountEnabled() || option.count === undefined) {
      return option.label;
    }
    return `${option.label} (${option.count})`;
  }

  optionPadding(item: FlattenedOption): number {
    return item.depth === 0 ? 8 : 8 + item.depth * 8;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isOpen()) {
      return;
    }

    const target = event.target as HTMLElement | null;
    if (!target?.closest('[data-multi-select-filter-root]')) {
      this.closeDropdown();
    }
  }

  private applyInitialSelection(): void {
    if (!this.optionsSignal().length) {
      return;
    }

    if (this.initialSelectAll) {
      this.selectedLeavesSignal.set(new Set(this.allLeafValues()));
      this.emitSelectionChange();
      return;
    }

    this.selectedLeavesSignal.set(new Set());
    this.emitSelectionChange();
  }

  private flattenOptions(
    options: MultiSelectFilterOption[],
    depth = 0
  ): FlattenedOption[] {
    return options.flatMap((option) => {
      const descendants = this.gatherLeafValues(option);
      const isLeaf = !option.children || option.children.length === 0;
      const current: FlattenedOption = {
        option,
        depth,
        descendantLeafValues: descendants,
        isLeaf,
      };

      if (!isLeaf) {
        return [
          current,
          ...this.flattenOptions(option.children ?? [], depth + 1),
        ];
      }

      return [current];
    });
  }

  private gatherLeafValues(option: MultiSelectFilterOption): string[] {
    if (!option.children || option.children.length === 0) {
      return [option.value];
    }

    return option.children.flatMap((child) => this.gatherLeafValues(child));
  }

  private buildDisplaySelections(
    options: MultiSelectFilterOption[],
    selectedLeaves: Set<string>
  ): { value: string; label: string }[] {
    const selections: { value: string; label: string }[] = [];
    const flattened = this.flattenOptions(options);
    flattened
      .filter((item) => item.isLeaf && selectedLeaves.has(item.option.value))
      .forEach((match) => {
        const alreadyIncluded = selections.some(
          (item) => item.value === match.option.value
        );
        if (!alreadyIncluded) {
          selections.push({
            value: match.option.value,
            label: match.option.label,
          });
        }
      });
    return selections;
  }

  private emitSelectionChange(): void {
    const values = this.flattenedOptions()
      .filter((item) => item.isLeaf && this.selectedLeavesSignal().has(item.option.value))
      .map((item) => item.option.value);
    this.selectionChange.emit(values);
  }
}
