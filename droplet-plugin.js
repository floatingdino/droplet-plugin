const pluginName = "DropletPlugin";

class DropletPlugin {
  constructor() {
    this.entryRX = /^(?!(vendors|chunk).*$).*\.js$/;
    this.liquid_bootstrap = `{%- comment -%}

This code added by Droplet Plugin.
Use the Shopify CDN as Webpack's publicPath so that dynamic code splitting works

{%- endcomment -%}
{%- capture cdn_path_basis -%}{{ '?' | asset_url }}{%- endcapture -%}
{%- assign cdn_base = cdn_path_basis | split: '?' | first -%}`;
  }
  apply(compiler) {
    Object.keys(compiler.options.entry).forEach(entryKey => {
      const entry = compiler.options.entry[entryKey];
      if (!this.entryRX.test(entry)) {
        return;
      }
      // Add Droplet loader to JS entry points
      compiler.options.entry[
        entryKey
      ] = `droplet-plugin/droplet-loader!${entry}`;
    });

    compiler.hooks.emit.tap(pluginName, compilation =>
      this.bootstrapEntries(compilation)
    );
  }

  bootstrapEntries(compilation) {
    const assetNames = Object.keys(compilation.assets);
    assetNames.forEach(assetName => {
      if (!this.entryRX.test(assetName)) {
        return;
      }

      const parent_source = compilation.assets[assetName].source();

      const transformed_source = parent_source.replace(
        '"DROPLET_LOADER_PUBLIC_PATH"',
        "{{ cdn_base | json }}"
      );

      compilation.assets[`${assetName}.liquid`] = {
        source() {
          return `${this.liquid_bootstrap}
${transformed_source}`;
        },
        size() {
          return transformed_source.length + this.liquid_bootstrap.length;
        }
      };
    });
  }
}

module.exports = DropletPlugin;
