# Webpack Droplet Plugin

This plugin + loader allows dynamic code splitting on Shopify by using Liquid syntax features to determine the public asset path for a site.

Install with `npm i -D droplet-plugin`.

## Usage

Use as a plugin in a Shopify Webpack config, but only for deployed files - this will not work for local development.

```
plugins:
  process.env.NODE_ENV === "production" ? [new DropletPlugin()] : [],
```

This does not allow dynamic imports on its own, simply a method for Webpack to be able to find split files at runtime.
Use a module such as `babel-plugin-syntax-dynamic-import` to enable dynamic imports.

## Gotchas

**Please note** Shopify won't let you upload files with a `~` in the file name, which is Webpack's default delimiter for combined chunks. You will probably need to edit this in your Slate / Webpack config using a config something like this (important point being `automaticNameDelimiter`):

```
optimization: {
  splitChunks: {
    chunks: "async",
    minSize: 15000,
    maxSize: 0,
    minChunks: 1,
    automaticNameDelimiter: "@",
    name: true
  }
}
```
