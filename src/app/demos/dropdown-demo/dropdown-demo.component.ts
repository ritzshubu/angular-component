import { Component, computed, signal } from '@angular/core';

import {
  DropdownComponent,
  DropdownOption,
} from '../../components/dropdown/dropdown.component';

interface DropdownGroup {
  title: string;
  options: DropdownOption[];
}

@Component({
  selector: 'app-dropdown-demo',
  standalone: true,
  imports: [DropdownComponent],
  templateUrl: './dropdown-demo.component.html',
  styleUrl: './dropdown-demo.component.css',
})
export class DropdownDemoComponent {
  readonly statusOptions: DropdownOption[] = [
    { label: 'Draft', value: 'draft', hint: 'Visible only to editors' },
    { label: 'Scheduled', value: 'scheduled', hint: 'Publishes automatically' },
    { label: 'Published', value: 'published', hint: 'Live for all audiences' },
    { label: 'Archived', value: 'archived', hint: 'Hidden from new visitors' },
  ];

  readonly handoffGroups: DropdownGroup[] = [
    {
      title: 'Design',
      options: [
        { label: 'Product design', value: 'product' },
        { label: 'Brand studio', value: 'brand' },
        { label: 'Research', value: 'research', hint: 'User insights & strategy' },
      ],
    },
    {
      title: 'Engineering',
      options: [
        { label: 'Frontend', value: 'frontend' },
        { label: 'Platform', value: 'platform' },
        { label: 'QA Review', value: 'qa', disabled: true, hint: 'Slots full until next week' },
      ],
    },
  ];

  readonly selectedStatus = signal<string | null>('draft');
  readonly selectedTeam = signal<string | null>(null);

  readonly flatHandoffOptions = computed(() =>
    this.handoffGroups.flatMap((group) => group.options)
  );

  readonly usageSnippet = `<ui-dropdown
  [options]="statusOptions"
  placeholder="Select publication state"
  [selected]="selectedStatus"
  (selectionChange)="onStatusChange($event)"
></ui-dropdown>`;

  onStatusChange(option: DropdownOption): void {
    this.selectedStatus.set(option.value);
  }

  onTeamChange(option: DropdownOption): void {
    this.selectedTeam.set(option.value);
  }

  displaySelectedStatus(): string {
    const option = this.statusOptions.find(
      (item) => item.value === this.selectedStatus()
    );
    return option?.label ?? 'None selected';
  }

  displaySelectedTeam(): string {
    const option = this.flatHandoffOptions().find(
      (item) => item.value === this.selectedTeam()
    );
    return option?.label ?? 'None selected';
  }
}
