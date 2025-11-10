import { Component } from '@angular/core';

import {
  TooltipComponent,
  TooltipDirection,
} from '../../components/tooltip/tooltip.component';

interface TooltipInputRow {
  name: string;
  type: string;
  defaultValue: string;
  description: string;
}

interface TooltipExample {
  label: string;
  direction: TooltipDirection;
  text: string;
}

@Component({
  selector: 'app-tooltip-demo',
  standalone: true,
  imports: [TooltipComponent],
  templateUrl: './tooltip-demo.component.html',
  styleUrl: './tooltip-demo.component.css',
})
export class TooltipDemoComponent {
  readonly examples: TooltipExample[] = [
    {
      label: 'Top Tooltip',
      direction: 'top',
      text: 'Appears above the trigger element.',
    },
    {
      label: 'Right Tooltip',
      direction: 'right',
      text: 'Great for quick hints when space is limited on the right.',
    },
    {
      label: 'Bottom Tooltip',
      direction: 'bottom',
      text: 'Useful for actions aligned near the top of the viewport.',
    },
    {
      label: 'Left Tooltip',
      direction: 'left',
      text: 'Keep context by aligning with left edges.',
    },
  ];

  readonly inputs: TooltipInputRow[] = [
    {
      name: 'text',
      type: 'string',
      defaultValue: '—',
      description: 'Message shown inside the tooltip bubble.',
    },
    {
      name: 'direction',
      type: '"top" | "right" | "bottom" | "left"',
      defaultValue: '"top"',
      description: 'Controls where the tooltip is positioned relative to its trigger.',
    },
  ];

  readonly usageExample = `<ui-tooltip text="Save your changes" direction="bottom">
  <button type="button" class="primary-button">Save</button>
</ui-tooltip>`;
}
