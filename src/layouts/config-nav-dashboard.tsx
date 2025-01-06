import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: 'dashboard',
    path: '/',
    icon: icon('ic-analytics'),
  },
  {
    title: 'user',
    path: '/users',
    icon: icon('ic-user'),
  },
  {
    title: 'product',
    path: '/products',
    icon: icon('ic-cart'),
    info: (
      <Label color="error" variant="inverted">
        +3
      </Label>
    ),
  },
  {
    title: 'blog',
    path: '/blog',
    icon: icon('ic-blog'),
  },
  {
    title: 'signIn',
    path: '/sign-in',
    icon: icon('ic-lock'),
  },
  {
    title: 'notFound',
    path: '/404',
    icon: icon('ic-disabled'),
  },
];
