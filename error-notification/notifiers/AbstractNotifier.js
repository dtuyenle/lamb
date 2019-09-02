/** Abstract Class representing notifier.
  * Can be used to extend other notifier class.
  */
class AbstractNotifier {
  /**
   * Create notifier abstract class.
   * Must implement 'sendErrorNotification' methods.
   * Check required methods, throw exception if not found.
   * Loop through option param and make each as class prop.
   * @param {Object} options - Notifier settings object.
   */
  constructor(options) {
    const requiredMethods = [
      'sendErrorNotification',
    ];
    const errors = [];
    requiredMethods.forEach((method) => {
      if (!Reflect.has(this, method)) {
        errors.push(method);
      }
    });
    if (errors.length > 0) {
      throw new Error(`${this.constructor.name} must implement ${errors.join(',')} methods`);
    }

    if (options) {
      Object.keys(options).forEach((optionName) => {
        this[optionName] = options[optionName];
      });
    }
  }

  /**
   * Check if required settings are set.
   * @param {Array} settingNames - Array of setting to be checked.
   */
  checkRequiredSettings(settingNames) {
    const errors = settingNames.map(settingName => (!this[settingName] ? settingName : '')).filter(settingName => settingName !== '');
    if (errors.length > 0) {
      throw new Error(`You must provide ${errors.join(', ')}`);
    }
  }
}

export default AbstractNotifier;
