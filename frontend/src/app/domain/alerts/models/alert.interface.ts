export interface Alert {
  id?: number;
  type: 'info' | 'danger' | 'success';
  message: string;
  link?: string;
  linkCaption?: string;
  permanent: boolean;
  // Any alert marked as selectiveDisplay = true will not show on main alert view
  // Used primarily for display in modals
  selectiveDisplay?: boolean;
  // Use select key to determine where to show
  selectKey?: string;
  // The is is the property is true, the error will be the only one showed to the user
  imperative?: boolean;
}
