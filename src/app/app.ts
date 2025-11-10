import { Component, computed, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
interface ComponentMeta {
  name: string;
  path: string;
  keywords: string[];
  icon: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly componentList: ComponentMeta[] = [
    {
      name: 'Tooltip',
      path: 'tooltip',
      keywords: ['hint', 'hover', 'information'],
      icon: 'Info',
    },
    {
      name: 'Dropdown',
      path: 'dropdown',
      keywords: ['select', 'menu', 'list'],
      icon: 'ListChecks',
    },
    {
      name: 'Multi-select Filter',
      path: 'multi-select-filter',
      keywords: ['filter', 'multi-select', 'checkbox'],
      icon: 'ListChecks',
    },
  ];

  readonly searchTerm = signal('');

  readonly filteredComponents = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      return this.componentList;
    }

    return this.componentList.filter((component) => {
      const haystack = [component.name, ...component.keywords]
        .join(' ')
        .toLowerCase();

      return haystack.includes(term);
    });
  });

  onSearch(value: string): void {
    this.searchTerm.set(value);
  }

}
