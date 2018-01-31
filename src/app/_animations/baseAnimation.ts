import { trigger, animate, style, group, query, transition } from '@angular/animations';

export const baseAnimation =
  trigger('baseAnimation', [
    transition('acct => home', [
      query(':enter, :leave', style({ position: 'absolute', top: 0, left: 0, right: 0 })),
      query(':leave', style({ height: '*'})),
      query('.acct', [
        animate('300ms',
          style({ height: 0 }))
      ])
    ]),
    transition('home => acct', [
      query(':enter, :leave',
        style({ position: 'absolute', top: 0, left: 0, right: 0 })),
      query(':enter .acct', [
        style({ height: 0 }),
        animate('300ms', style({ height: '*' }))
      ])
    ])
  ])
