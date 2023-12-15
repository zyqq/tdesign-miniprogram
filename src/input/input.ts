import { SuperComponent, wxComponent } from '../common/src/index';
import config from '../common/config';
import props from './props';
import { getCharacterLength, calcIcon, isNullOrUndefined } from '../common/utils';

const { prefix } = config;
const name = `${prefix}-input`;

@wxComponent()
export default class Input extends SuperComponent {
  options = {
    multipleSlots: true,
  };

  externalClasses = [
    `${prefix}-class`,
    `${prefix}-class-prefix-icon`,
    `${prefix}-class-label`,
    `${prefix}-class-input`,
    `${prefix}-class-clearable`,
    `${prefix}-class-suffix`,
    `${prefix}-class-suffix-icon`,
    `${prefix}-class-tips`,
  ];

  behaviors = ['wx://form-field'];

  properties = props;

  data = {
    prefix,
    classPrefix: name,
    classBasePrefix: prefix,
    showClearIcon: true,
  };

  lifetimes = {
    ready() {
      const { value } = this.properties;
      // 明确地检查null或undefined，防止0的情况被纳入
      this.updateValue(value ?? '');
    },
  };

  observers = {
    prefixIcon(v) {
      this.setData({
        _prefixIcon: calcIcon(v),
      });
    },

    suffixIcon(v) {
      this.setData({
        _suffixIcon: calcIcon(v),
      });
    },

    clearable(v) {
      this.setData({
        _clearIcon: calcIcon(v, 'close-circle-filled'),
      });
    },

    clearTrigger() {
      this.updateClearIconVisible();
    },
  };

  methods = {
    updateValue(value) {
      const { maxcharacter, maxlength } = this.properties;
      if (maxcharacter && maxcharacter > 0 && !Number.isNaN(maxcharacter)) {
        const { length, characters } = getCharacterLength('maxcharacter', value, maxcharacter);
        this.setData({
          value: characters,
          count: length,
        });
      } else if (maxlength > 0 && !Number.isNaN(maxlength)) {
        const { length, characters } = getCharacterLength('maxlength', value, maxlength);
        this.setData({
          value: characters,
          count: length,
        });
      } else {
        this.setData({
          value,
          // 确保值为0时正确设置count
          count: isNullOrUndefined(value) ? String(value).length : 0,
        });
      }
    },
    updateClearIconVisible(value: boolean = false) {
      const { clearTrigger } = this.properties;
      this.setData({ showClearIcon: value || clearTrigger === 'always' });
    },
    onInput(e) {
      const { value, cursor, keyCode } = e.detail;
      this.updateValue(value);
      this.triggerEvent('change', { value: this.data.value, cursor, keyCode });
    },
    onFocus(e) {
      this.updateClearIconVisible(true);
      this.triggerEvent('focus', e.detail);
    },
    onBlur(e) {
      this.updateClearIconVisible();
      this.triggerEvent('blur', e.detail);
    },
    onConfirm(e) {
      this.triggerEvent('enter', e.detail);
    },
    onSuffixClick() {
      this.triggerEvent('click', { trigger: 'suffix' });
    },
    onSuffixIconClick() {
      this.triggerEvent('click', { trigger: 'suffix-icon' });
    },
    clearInput(e) {
      this.triggerEvent('clear', e.detail);
      this.setData({ value: '' });
    },
    onKeyboardHeightChange(e) {
      this.triggerEvent('keyboardheightchange', e.detail);
    },
    onNickNameReview(e) {
      this.triggerEvent('nicknamereview', e.detail);
    },
  };
}
