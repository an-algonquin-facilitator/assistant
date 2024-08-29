export interface IPageProps {
  next: (f: (props: IPageProps) => JSX.Element) => void;
}
