import { Component, signal } from '@angular/core';

import demoData from '../demo-data.json';
import {
  MultiSelectFilterComponent,
  MultiSelectFilterOption,
} from '../../components/multi-select-filter/multi-select-filter.component';

@Component({
  selector: 'app-multi-select-filter-demo',
  standalone: true,
  imports: [MultiSelectFilterComponent],
  templateUrl: './multi-select-filter-demo.component.html',
  styleUrl: './multi-select-filter-demo.component.css',
})
export class MultiSelectFilterDemoComponent {
  private readonly data = demoData as {
    businessFilters: MultiSelectFilterOption[];
    featureFilters: MultiSelectFilterOption[];
  };

  readonly businessFilters = this.data.businessFilters;
  readonly featureFilters = this.data.featureFilters;

  private readonly businessLabelMap = this.buildLabelMap(this.businessFilters);
  private readonly featureLabelMap = this.buildLabelMap(this.featureFilters);

  readonly businessSelection = signal<string[]>([]);
  readonly featureSelection = signal<string[]>([]);

  onBusinessFilterChange(values: string[]): void {
    this.businessSelection.set(values);
  }

  onFeatureFilterChange(values: string[]): void {
    this.featureSelection.set(values);
  }

  formattedBusinessSelection(values: string[]): string {
    return this.formatSelection(values, this.businessLabelMap);
  }

  formattedFeatureSelection(values: string[]): string {
    return this.formatSelection(values, this.featureLabelMap);
  }

  private buildLabelMap(options: MultiSelectFilterOption[]): Record<string, string> {
    const map: Record<string, string> = {};

    const visit = (option: MultiSelectFilterOption): void => {
      map[option.value] = option.label;
      option.children?.forEach((child) => visit(child));
    };

    options.forEach((option) => visit(option));

    return map;
  }

  private formatSelection(values: string[], map: Record<string, string>): string {
    if (!values.length) {
      return 'None';
    }

    return values
      .map((value) => map[value] ?? value)
      .join(', ');
  }
}
