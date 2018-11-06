import { DynamicComponentManifest } from '../../dynamic-component-loader/dynamic-component-loader.model';

// This array defines which "componentId" maps to which lazy-loaded module.
const manifest: DynamicComponentManifest[] = [
  {
    componentId: 'confirmation-modal',
    path: 'dynamic-modal-confirmation', // some globally-unique identifier, used internally by the router
    loadChildren: './components/modals/confirmation/confirmation-modal.module#ConfirmationModalModule',
  },
  {
    componentId: 'logout-modal',
    path: 'dynamic-modal-logout', // some globally-unique identifier, used internally by the router
    loadChildren: './components/modals/logout/logout-modal.module#LogoutModalModule',
  },
];

export const MODALS_MANIFEST = manifest;
