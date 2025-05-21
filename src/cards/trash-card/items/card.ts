import { css, html, nothing, render } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import { getDateString } from "../../../utils/getDateString";
import { customElement } from "lit/decorators.js";
import { TRASH_CARD_NAME } from "../const";
import { defaultHaCardStyle } from "../../../utils/defaultHaCardStyle";
import { getColoredStyle } from "../../../utils/getColoredStyle";
import { BaseItemElement } from "./BaseItemElement";
import { daysTill } from "../../../utils/daysTill";
import { classMap } from "lit/directives/class-map.js";
import { CalendarItem } from "../../../utils/calendarItem";

@customElement(`${TRASH_CARD_NAME}-item-card`)
class ItemCard extends BaseItemElement {
  public render() {
    if (!this.hass || !this.item || !this.config) {
      return nothing;
    }

    // eslint-disable-next-line prefer-destructuring
    const item = this.item;

    const {
      color_mode,
      hide_time_range,
      day_style,
      layout,
      with_label,
      day_style_format,
      time_style_format,
    } = this.config;

    const { label, date } = item;

    const style = {
      ...getColoredStyle(
        color_mode,
        item,
        this.parentElement,
        this.hass.themes.darkMode
      ),
    };

    const content = getDateString(
      item,
      hide_time_range ?? false,
      day_style,
      day_style_format,
      time_style_format,
      this.hass
    );

    const daysTillToday = Math.abs(daysTill(new Date(), date.start));

    const cssClasses = {
      today: daysTillToday === 0,
      tomorrow: daysTillToday === 1,
      another: daysTillToday > 1,
    };

    const pictureUrl = this.getPictureUrl();

    const contentClasses = { vertical: layout === "vertical" };

    return html`
      <ha-card
        style=${styleMap(style)}
        class=${classMap(cssClasses)}
        @click="${(
          e,
          calendarItem: CalendarItem = item,
          open: Boolean = true
        ) => {
          this.handleClickEventOnItem(e, calendarItem, open);
        }}"
      >
        <div
          id="overlay-info-card"
          class="content background info"
          @click="${(
            e,
            calendarItem: CalendarItem = item,
            open: Boolean = false
          ) => {
            this.handleClickEventOnItem(e, calendarItem, open);
          }}"
        >
          <div id="overlay-info-card-text">

            <table style="border-collapse: collapse; width: 100%;" border="0">
            <tbody>
            <tr>
            <td class="overlay-info-card-icon"><span id="icon" style="text-align: center;"></span></td>
            <td style="width: 80%;">
            <table style="border-collapse: collapse; width: 100%;" border="0">
            <tbody>
            <tr>
            <td style="width: 100%;"><h4>
              <b><span id="label" class="primary"></span></b>
            </h4></td>
            </tr>
            <tr>
            <td style="width: 100%;"><span id="event-date" class="secondary"></span></td>
            </tr>
            <tr>
            <td style="width: 100%;"><span id="description" class="secondary"></td>
            </tr>
            </tbody>
            </table>
            </td>
            </tr>
            </tbody>
            </table>

          </div>
        </div>
        <div class="background" aria-labelledby="info"></div>
        <div class="container">
          <div class="content ${classMap(contentClasses)}">
            ${pictureUrl ? this.renderPicture(pictureUrl) : this.renderIcon()}
            <ha-tile-info
              id="info"
              .primary=${with_label ? label : content}
              .secondary="${with_label ? content : undefined}"
              .multiline=${true}
            ></ha-tile-info>
          </div>
        </div>
      </ha-card>
    `;
  }
  handleClickEventOnItem(
    e: Event,
    calendarItem: CalendarItem,
    open: Boolean
  ): void {
    if (!this.hass || !this.item || !this.config) {
      return;
    }
    const modal = this.shadowRoot?.querySelector(
      "#overlay-info-card"
    ) as HTMLElement;
    //  render(content, modal);
    const text = modal.querySelector("#overlay-info-card-text") as HTMLElement;

    if (!open) {
      modal.style.display = "none";
      text.style.display = "none";
      e.stopPropagation();
      return;
    }

    const dateString = getDateString(
      calendarItem,
      this.config.hide_time_range ?? false,
      this.config.day_style,
      this.config.day_style_format,
      this.config.time_style_format,
      this.hass
    );

    const pictureUrl = this.getPictureUrl();

    const label = text.querySelector("#label") as HTMLElement;
    const desc = text.querySelector("#description") as HTMLElement;
    const icon = text.querySelector("#icon") as HTMLElement;
    const event_date = text.querySelector("#event-date") as HTMLElement;

    label.innerHTML = calendarItem.label;
    desc.innerHTML = calendarItem.content.description ?? "";
    // Render the Lit template into the icon element
    render(
      pictureUrl ? this.renderPicture(pictureUrl) : this.renderIcon(),
      icon
    );
    event_date.innerHTML = dateString ?? "";

    modal.style.display = "block";
    text.style.display = "block";
  }

  public static get styles() {
    return [
      defaultHaCardStyle,
      css`
        :host {
          -webkit-tap-highlight-color: transparent;
        }

        ha-card {
          --ha-ripple-color: var(--tile-color);
          --ha-ripple-hover-opacity: 0.04;
          --ha-ripple-pressed-opacity: 0.12;
          height: 100%;
          transition:
            box-shadow 180ms ease-in-out,
            border-color 180ms ease-in-out;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .background {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          border-radius: var(--ha-card-border-radius, 12px);
          margin: calc(-1 * var(--ha-card-border-width, 1px));
          overflow: hidden;
        }
        .container {
          margin: calc(-1 * var(--ha-card-border-width, 1px));
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .content {
          position: relative;
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 10px;
          flex: 1;
          min-width: 0;
          box-sizing: border-box;
          pointer-events: none;
          gap: 10px;
        }
        .vertical {
          flex-direction: column;
          text-align: center;
          justify-content: center;
        }

        .vertical ha-tile-info {
          width: 100%;
          flex: 0 0 auto;
        }

        ha-tile-icon,
        hui-image {
          --tile-icon-color: var(--tile-color);
          user-select: none;
          -ms-user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          position: relative;
          padding: 6px;
          margin: -6px;
        }

        hui-image {
          width: 24px;
          height: 24px;
          margin: -12px 0px;
        }

        hui-image img {
          object-fit: cover;
        }

        ha-tile-badge {
          position: absolute;
          top: -3px;
          right: -3px;
          inset-inline-end: -3px;
          inset-inline-start: initial;
        }

        ha-tile-info {
          position: relative;
          min-width: 0;
          transition: background-color 180ms ease-in-out;
          box-sizing: border-box;
        }

        ha-state-icon {
          --tile-icon-color: var(--icon-color);
        }

        #overlay-info-card {
          position: fixed;
          display: none;
          width: 80%;
          height: 40%;
          top: 30%;
          left: 10%;
          background-color: var(--ha-card-background,rgb( 137, 137, 137));
          z-index: 2;
          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
          transition: 0.3s;
          pointer-events: auto;
          outline-width: 3px;
          outline-style: solid;
          outline-color: color-mix(in srgb, var(--ha-card-background ), black 30%);
        }
        #overlay-info-card:hover {
          box-shadow: 0 8px 16px 0 rgb(121, 121, 121);
        }
        #overlay-info-card-text {
          font-size: 16px;
        }
        .overlay-info-card-icon {
         

        }
      `,
    ];
  }
}

export { ItemCard };
