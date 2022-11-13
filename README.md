# ActionReadJSON

Read JSON file and set properties to `output` of github action `steps`.

**This forked repo support json array comparing to the upper one.** An example can be find [here](https://github.com/ActionsTool/DockerImageBuilder/blob/main/.github/workflows/sharelatex.yml).

## Usage

Examples:

Get properties

```yaml
---
- name: get properties
  id: json_properties
  uses: ActionsTool/ActionReadJSON@main
  with:
    file_path: "package.json"

- run: |
    echo ${{steps.json_properties.outputs.name}}
    echo ${{steps.json_properties.outputs.version}}
```

Get a specified property **value** with `prop_path`

```yaml
---
- name: get specified property
  id: repository_type
  uses: ActionsTool/ActionReadJSON@main
  with:
    file_path: "package.json"
    prop_path: "repository.type"

- run: |
    echo ${{steps.repository_type.outputs.value}}
```
