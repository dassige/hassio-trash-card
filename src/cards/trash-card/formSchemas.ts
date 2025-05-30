import {
  CARDSTYLES,
  ALIGNMENTSTYLES,
  COLORMODES,
  DAYSTYLES,
  LAYOUTS,
  LAYOUT_ICONS,
} from "./trash-card-config";

import type { LocalizeFunc } from "../../utils/ha";
import type { TrashCardConfig } from "./trash-card-config";
import type { HaFormSchema } from "../../utils/form/ha-form";


const getPatternOthersSchema = (
  localize: LocalizeFunc
) => [
  {
    name: "icon",
    label: localize(`ui.panel.lovelace.editor.card.generic.icon`),
    selector: {
      icon: {},
    },
    context: { icon_entity: "entity" },
  },
  {
    name: "color",
    label: localize(`ui.panel.lovelace.editor.card.tile.color`),
    selector: { ui_color: {} },
  },
];

const getPatternSchema = (
  customLocalize: LocalizeFunc,
  localize: LocalizeFunc
) => [
  {
    label: customLocalize(`editor.card.trash.pattern.fields.label`),
    name: "label",
    selector: {
      text: {},
    },
  },
  ...getPatternOthersSchema(localize),
  {
    label: customLocalize(`editor.card.trash.pattern.fields.pattern`),
    name: "pattern",
    selector: {
      text: {},
    },
  },
  {
    label: customLocalize(`editor.card.trash.pattern.fields.pattern_exact`),
    helper: customLocalize(
      `editor.card.trash.pattern.fields.pattern_exact_description`
    ),
    name: "pattern_exact",
    selector: {
      boolean: {},
    },
  },
  {
    name: "isPatternRegex",
    label: customLocalize(`editor.card.trash.pattern.regex`),
    selector: { boolean: {} },
  },
  {
    label: customLocalize(`editor.card.trash.pattern.fields.picture_url`),
    helper: customLocalize(
      `editor.card.trash.pattern.fields.picture_url_description`
    ),
    name: "picture",
    selector: {
      text: {},
    },
    context: { icon_entity: "entity" },
  },
];

const getSchema = (
  customLocalize: LocalizeFunc,
  currentValues: TrashCardConfig,
  localize: LocalizeFunc
) => {
  const settings: HaFormSchema[] = [
    {
      type: "grid",
      name: "",
      schema: [
        {
          name: "filter_events",
          label: customLocalize(`editor.card.generic.filter_events`),
          selector: { boolean: {} },
        },
        {
          name: "drop_todayevents_from",
          label: customLocalize(`editor.card.generic.drop_todayevents_from`),
          default: {
            hours: 11,
            minutes: 0,
            seconds: 0,
          },
          selector: {
            time: {},
          },
        },
        {
          name: "next_days",
          label: customLocalize(`editor.card.generic.next_days`),
          selector: {
            number: {
              min: 0,
              max: 365,
              step: 1,
              mode: "box",
            },
          },
        },
        {
          name: "refresh_rate",
          label: customLocalize(`editor.form.refresh_rate.title`),
          helper: customLocalize(`editor.form.refresh_rate.helper`),
          selector: {
            number: {
              min: 5,
              max: 1_440,
              step: 5,
              mode: "box",
            },
          },
        },
      ],
    },
    {
      name: "location",
      label: customLocalize(`editor.form.location.title`),
      helper: customLocalize(`editor.form.location.helper`),
      selector: {
        text: {},
      },
    },
    {
      name: "only_all_day_events",
      label: customLocalize(`editor.form.only_all_day_events.title`),
      helper: customLocalize(`editor.form.only_all_day_events.helper`),
      selector: {
        boolean: {},
      },
    },
  ];

  const appearance: HaFormSchema[] = [
    {
      name: "card_style",
      label: customLocalize(`editor.form.card_style.title`),
      selector: {
        select: {
          options: [...CARDSTYLES].map((control) => ({
            value: control,
            label: customLocalize(`editor.form.card_style.values.${control}`),
          })),
          mode: "dropdown",
        },
      },
    },
    {
      type: "grid",
      name: "",
      schema: [
        ...(currentValues.card_style === "icon"
          ? ([
              {
                name: "icon_size",
                label: customLocalize(`editor.card.generic.icon_size`),
                selector: {
                  number: {
                    min: 10,
                    max: 160,
                    step: 1,
                    mode: "box",
                  },
                },
              },
            ] as HaFormSchema[])
          : []),
        ...(currentValues.card_style === "card" ||
        currentValues.card_style === "chip"
          ? ([
              {
                name: "day_style",
                label: customLocalize(`editor.form.day_style.title`),
                selector: {
                  select: {
                    options: [...DAYSTYLES].map((control) => ({
                      value: control,
                      label: customLocalize(
                        `editor.form.day_style.values.${control}`
                      ),
                    })),
                    mode: "dropdown",
                  },
                },
              },
            ] as HaFormSchema[])
          : []),
        ...((currentValues.card_style === "card" ||
          currentValues.card_style === "chip") &&
        currentValues.day_style === "custom"
          ? ([
              {
                name: "day_style_format",
                label: customLocalize(`editor.form.day_style_format.title`),
                helper: customLocalize(`editor.form.day_style_format.helper`),
                selector: {
                  text: {},
                },
              },
            ] as HaFormSchema[])
          : []),
        ...((currentValues.card_style === "card" ||
          currentValues.card_style === "chip") &&
        currentValues.day_style === "custom"
          ? ([
              {
                name: "time_style_format",
                label: customLocalize(`editor.form.time_style_format.title`),
                helper: customLocalize(`editor.form.time_style_format.helper`),
                selector: {
                  text: {},
                },
              },
            ] as HaFormSchema[])
          : []),
        ...(currentValues.card_style === "card" ||
        currentValues.card_style === "chip"
          ? ([
              {
                name: "hide_time_range",
                label: customLocalize(`editor.card.generic.hide_time_range`),
                selector: { boolean: {} },
              },
            ] as HaFormSchema[])
          : []),
        ...(currentValues.card_style === "card" ||
        currentValues.card_style === "chip"
          ? ([
              {
                name: "with_label",
                label: customLocalize(`editor.card.generic.with_label`),
                selector: { boolean: {} },
              },
            ] as HaFormSchema[])
          : []),

        ...(currentValues.with_label &&
        (currentValues.card_style === "card" ||
          currentValues.card_style === "chip")
          ? ([
              {
                name: "use_summary",
                label: customLocalize(`editor.card.generic.use_summary`),
                selector: { boolean: {} },
              },
            ] as HaFormSchema[])
          : []),
        ...(currentValues.card_style === "card" ||
        currentValues.card_style === "chip"
          ? ([
              {
                name: "event_grouping",
                label: customLocalize(`editor.card.generic.event_grouping`),
                selector: { boolean: { default: true } },
              },
            ] as HaFormSchema[])
          : []),
        ...(currentValues.card_style === "card" ||
        currentValues.card_style === "chip"
          ? ([
              {
                name: "color_mode",
                label: customLocalize(`editor.form.color_mode.title`),
                selector: {
                  select: {
                    options: [...COLORMODES].map((control) => ({
                      value: control,
                      label: customLocalize(
                        `editor.form.color_mode.values.${control}`
                      ),
                    })),
                    mode: "dropdown",
                  },
                },
              },
            ] as HaFormSchema[])
          : []),
      ],
    },
    ...(currentValues.card_style === "card"
      ? ([
          {
            type: "grid",
            name: "",
            schema: [
              {
                name: "layout",
                label: customLocalize(`editor.card.generic.layout`),
                selector: {
                  select: {
                    options: [...LAYOUTS].map((layout) => ({
                      icon: LAYOUT_ICONS[layout],
                      value: layout,
                      label: customLocalize(
                        `editor.form.layout_picker.values.${layout}`
                      ),
                    })),
                    mode: "dropdown",
                  },
                },
              },
            ],
          },
          {
            type: "grid",
            name: "",
            schema: [
              {
                name: "full_size",
                label: customLocalize(`editor.card.generic.full_size`),
                selector: { boolean: {} },
              },
              {
                name: "items_per_row",
                label: localize(`ui.panel.lovelace.editor.card.grid.columns`),
                selector: {
                  number: {
                    min: 1,
                    max: 6,
                    step: 1,
                    mode: "box",
                  },
                },
              },
            ],
          },
        ] as HaFormSchema[])
      : []),
    ...(currentValues.card_style === "chip"
      ? ([
          {
            type: "grid",
            name: "",
            schema: [
              {
                name: "alignment_style",
                label: customLocalize(`editor.form.alignment_style.title`),
                selector: {
                  select: {
                    options: [...ALIGNMENTSTYLES].map((control) => ({
                      value: control,
                      label: customLocalize(
                        `editor.form.alignment_style.values.${control}`
                      ),
                    })),
                    mode: "dropdown",
                  },
                },
              },
            ],
          },
        ] as HaFormSchema[])
      : []),
  ];

  const schema: HaFormSchema[] = [
    {
      name: "entities",
      selector: {
        entity: {
          domain: "calendar",
          multiple: true,
        },
      },
    },
    {
      type: "expandable",
      name: "",
      title: customLocalize("editor.form.tabs.settings"),
      icon: "mdi:cog",
      schema: settings,
    },
    {
      type: "expandable",
      name: "",
      title: customLocalize("editor.form.tabs.appearance"),
      icon: "mdi:palette",
      schema: appearance,
    },
  ];

  return schema;
};

export { getSchema, getPatternSchema, getPatternOthersSchema };
