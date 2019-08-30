const pluginName = "DropletPlugin";

class DropletPlugin {
  constructor() {
    this.targetRX = /^(?!(vendors|chunk).*$).*\.js$/;
  }
  apply(compiler) {
    compiler.hooks.emit.tap(pluginName, compilation =>
      this.generateLiquid(compilation)
    );
  }

  generateLiquid(compilation) {
    const assetNames = Object.keys(compilation.assets);
    assetNames.forEach(assetName => {
      if (!this.targetRX.test(assetName)) {
        return;
      }

      const parent_source = compilation.assets[assetName].source();
      const liquid_bootstrap = `{%- comment -%}

Use the Shopify CDN as Webpack's publicPath so that dynamic code splitting works

{%- endcomment -%}
{%- capture cdn_path_basis -%}{{ '?' | asset_url }}{%- endcapture -%}
{%- assign cdn_base = cdn_path_basis | split: '?' -%}
{%- assign cdn_base = cdn_base[0] -%}`;

      const transformed_source = parent_source.replace(
        '"PUBLIC_PATH"',
        "{{ cdn_base | json }}"
      );

      compilation.assets[`${assetName}.liquid`] = {
        source() {
          return `${liquid_bootstrap}
${transformed_source}`;
        },
        size() {
          return transformed_source.length + liquid_bootstrap.length;
        }
      };
    });
  }
}

module.exports = DropletPlugin;
