import React from 'react';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import {
  Button as ChakraButton,
  ButtonProps as ChakraButtonProps,
  Link as ChakraLink,
  LinkProps as ChakraLinkProps,
} from '@chakra-ui/react';
import { FiExternalLink } from 'react-icons/fi';

type ButtonLink =
  Exclude<ChakraButtonProps, React.ButtonHTMLAttributes<HTMLButtonElement>>
  & React.AnchorHTMLAttributes<HTMLAnchorElement>;

export type LinkProps =
  Omit<NextLinkProps, 'as' | 'passHref'>
  & ((Omit<ChakraLinkProps, 'href'> & { type?: 'link' }) | (ButtonLink & { type: 'button' }));

/**
 * There are two @ts-ignore because the ChakraButton, even though having the 'as' property, it
 * expects to receive certain props as HTMLButtonElement. I cannot be arsed to try to fix this,
 * nor I know how to.
 */
function Link({ type = 'link', children, ...props }: LinkProps) {
  const {
    href, prefetch, replace, scroll, shallow, locale, role, ...chakraProps
  } = props;

  const nextjsProps = {
    href, prefetch, replace, scroll, shallow, locale,
  };

  const isExternal = typeof href === 'string' && (href.startsWith('http') || href.startsWith('mailto:'));

  switch (type) {
    case 'button':
      if (isExternal) {
        return (
          // @ts-ignore
          <ChakraButton
            as="a"
            href={href}
            target="_blank"
            rel="noopener"
            {...chakraProps}
          >
            {children}
            {' '}
            <FiExternalLink style={{ marginLeft: '0.33em' }} />
          </ChakraButton>
        );
      }

      return (
        <NextLink {...nextjsProps} passHref>
          { /** @ts-ignore */}
          <ChakraButton
            as="a"
            {...chakraProps}
          >
            {children}
          </ChakraButton>
        </NextLink>
      );
    case 'link':
      if (isExternal) {
        return (
          <ChakraLink
            href={href}
            isExternal
            {...chakraProps}
          >
            {children}
            {' '}
            <FiExternalLink style={{ display: 'inline', verticalAlign: 'middle' }} />
          </ChakraLink>
        );
      }

      return (
        <NextLink {...nextjsProps} passHref>
          <ChakraLink {...chakraProps}>{children}</ChakraLink>
        </NextLink>

      );
    default:
      return null;
  }
}

export default Link;
