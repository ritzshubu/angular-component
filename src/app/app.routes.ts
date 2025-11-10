import { Routes } from '@angular/router';

import { DropdownDemoComponent } from './demos/dropdown-demo/dropdown-demo.component';
import { MultiSelectFilterDemoComponent } from './demos/multi-select-filter-demo/multi-select-filter-demo.component';
import { TooltipDemoComponent } from './demos/tooltip-demo/tooltip-demo.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'tooltip',
  },
  {
    path: 'tooltip',
    component: TooltipDemoComponent,
    title: 'Tooltip | Component Docs',
  },
  {
    path: 'dropdown',
    component: DropdownDemoComponent,
    title: 'Dropdown | Component Docs',
  },
  {
    path: 'multi-select-filter',
    component: MultiSelectFilterDemoComponent,
    title: 'Multi-select Filter | Component Docs',
  },
  {
    path: '**',
    redirectTo: 'tooltip',
  },
];
