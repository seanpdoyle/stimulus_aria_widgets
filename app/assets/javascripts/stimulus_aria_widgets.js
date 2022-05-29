// nb. This is for IE10 and lower _only_.
var supportCustomEvent = window.CustomEvent;
if (!supportCustomEvent || typeof supportCustomEvent === 'object') {
  supportCustomEvent = function CustomEvent(event, x) {
    x = x || {};
    var ev = document.createEvent('CustomEvent');
    ev.initCustomEvent(event, !!x.bubbles, !!x.cancelable, x.detail || null);
    return ev;
  };
  supportCustomEvent.prototype = window.Event.prototype;
}

/**
 * Dispatches the passed event to both an "on<type>" handler as well as via the
 * normal dispatch operation. Does not bubble.
 *
 * @param {!EventTarget} target
 * @param {!Event} event
 * @return {boolean}
 */
function safeDispatchEvent(target, event) {
  var check = 'on' + event.type.toLowerCase();
  if (typeof target[check] === 'function') {
    target[check](event);
  }
  return target.dispatchEvent(event);
}

/**
 * @param {Element} el to check for stacking context
 * @return {boolean} whether this el or its parents creates a stacking context
 */
function createsStackingContext(el) {
  while (el && el !== document.body) {
    var s = window.getComputedStyle(el);
    var invalid = function(k, ok) {
      return !(s[k] === undefined || s[k] === ok);
    };

    if (s.opacity < 1 ||
        invalid('zIndex', 'auto') ||
        invalid('transform', 'none') ||
        invalid('mixBlendMode', 'normal') ||
        invalid('filter', 'none') ||
        invalid('perspective', 'none') ||
        s['isolation'] === 'isolate' ||
        s.position === 'fixed' ||
        s.webkitOverflowScrolling === 'touch') {
      return true;
    }
    el = el.parentElement;
  }
  return false;
}

/**
 * Finds the nearest <dialog> from the passed element.
 *
 * @param {Element} el to search from
 * @return {HTMLDialogElement} dialog found
 */
function findNearestDialog(el) {
  while (el) {
    if (el.localName === 'dialog') {
      return /** @type {HTMLDialogElement} */ (el);
    }
    if (el.parentElement) {
      el = el.parentElement;
    } else if (el.parentNode) {
      el = el.parentNode.host;
    } else {
      el = null;
    }
  }
  return null;
}

/**
 * Blur the specified element, as long as it's not the HTML body element.
 * This works around an IE9/10 bug - blurring the body causes Windows to
 * blur the whole application.
 *
 * @param {Element} el to blur
 */
function safeBlur(el) {
  // Find the actual focused element when the active element is inside a shadow root
  while (el && el.shadowRoot && el.shadowRoot.activeElement) {
    el = el.shadowRoot.activeElement;
  }

  if (el && el.blur && el !== document.body) {
    el.blur();
  }
}

/**
 * @param {!NodeList} nodeList to search
 * @param {Node} node to find
 * @return {boolean} whether node is inside nodeList
 */
function inNodeList(nodeList, node) {
  for (var i = 0; i < nodeList.length; ++i) {
    if (nodeList[i] === node) {
      return true;
    }
  }
  return false;
}

/**
 * @param {HTMLFormElement} el to check
 * @return {boolean} whether this form has method="dialog"
 */
function isFormMethodDialog(el) {
  if (!el || !el.hasAttribute('method')) {
    return false;
  }
  return el.getAttribute('method').toLowerCase() === 'dialog';
}

/**
 * @param {!DocumentFragment|!Element} hostElement
 * @return {?Element}
 */
function findFocusableElementWithin(hostElement) {
  // Note that this is 'any focusable area'. This list is probably not exhaustive, but the
  // alternative involves stepping through and trying to focus everything.
  var opts = ['button', 'input', 'keygen', 'select', 'textarea'];
  var query = opts.map(function(el) {
    return el + ':not([disabled])';
  });
  // TODO(samthor): tabindex values that are not numeric are not focusable.
  query.push('[tabindex]:not([disabled]):not([tabindex=""])');  // tabindex != "", not disabled
  var target = hostElement.querySelector(query.join(', '));

  if (!target && 'attachShadow' in Element.prototype) {
    // If we haven't found a focusable target, see if the host element contains an element
    // which has a shadowRoot.
    // Recursively search for the first focusable item in shadow roots.
    var elems = hostElement.querySelectorAll('*');
    for (var i = 0; i < elems.length; i++) {
      if (elems[i].tagName && elems[i].shadowRoot) {
        target = findFocusableElementWithin(elems[i].shadowRoot);
        if (target) {
          break;
        }
      }
    }
  }
  return target;
}

/**
 * Determines if an element is attached to the DOM.
 * @param {Element} element to check
 * @return {boolean} whether the element is in DOM
 */
function isConnected(element) {
  return element.isConnected || document.body.contains(element);
}

/**
 * @param {!Event} event
 * @return {?Element}
 */
function findFormSubmitter(event) {
  if (event.submitter) {
    return event.submitter;
  }

  var form = event.target;
  if (!(form instanceof HTMLFormElement)) {
    return null;
  }

  var submitter = dialogPolyfill.formSubmitter;
  if (!submitter) {
    var target = event.target;
    var root = ('getRootNode' in target && target.getRootNode() || document);
    submitter = root.activeElement;
  }

  if (!submitter || submitter.form !== form) {
    return null;
  }
  return submitter;
}

/**
 * @param {!Event} event
 */
function maybeHandleSubmit(event) {
  if (event.defaultPrevented) {
    return;
  }
  var form = /** @type {!HTMLFormElement} */ (event.target);

  // We'd have a value if we clicked on an imagemap.
  var value = dialogPolyfill.imagemapUseValue;
  var submitter = findFormSubmitter(event);
  if (value === null && submitter) {
    value = submitter.value;
  }

  // There should always be a dialog as this handler is added specifically on them, but check just
  // in case.
  var dialog = findNearestDialog(form);
  if (!dialog) {
    return;
  }

  // Prefer formmethod on the button.
  var formmethod = submitter && submitter.getAttribute('formmethod') || form.getAttribute('method');
  if (formmethod !== 'dialog') {
    return;
  }
  event.preventDefault();

  if (value != null) {
    // nb. we explicitly check against null/undefined
    dialog.close(value);
  } else {
    dialog.close();
  }
}

/**
 * @param {!HTMLDialogElement} dialog to upgrade
 * @constructor
 */
function dialogPolyfillInfo(dialog) {
  this.dialog_ = dialog;
  this.replacedStyleTop_ = false;
  this.openAsModal_ = false;

  // Set a11y role. Browsers that support dialog implicitly know this already.
  if (!dialog.hasAttribute('role')) {
    dialog.setAttribute('role', 'dialog');
  }

  dialog.show = this.show.bind(this);
  dialog.showModal = this.showModal.bind(this);
  dialog.close = this.close.bind(this);

  dialog.addEventListener('submit', maybeHandleSubmit, false);

  if (!('returnValue' in dialog)) {
    dialog.returnValue = '';
  }

  if ('MutationObserver' in window) {
    var mo = new MutationObserver(this.maybeHideModal.bind(this));
    mo.observe(dialog, {attributes: true, attributeFilter: ['open']});
  } else {
    // IE10 and below support. Note that DOMNodeRemoved etc fire _before_ removal. They also
    // seem to fire even if the element was removed as part of a parent removal. Use the removed
    // events to force downgrade (useful if removed/immediately added).
    var removed = false;
    var cb = function() {
      removed ? this.downgradeModal() : this.maybeHideModal();
      removed = false;
    }.bind(this);
    var timeout;
    var delayModel = function(ev) {
      if (ev.target !== dialog) { return; }  // not for a child element
      var cand = 'DOMNodeRemoved';
      removed |= (ev.type.substr(0, cand.length) === cand);
      window.clearTimeout(timeout);
      timeout = window.setTimeout(cb, 0);
    };
    ['DOMAttrModified', 'DOMNodeRemoved', 'DOMNodeRemovedFromDocument'].forEach(function(name) {
      dialog.addEventListener(name, delayModel);
    });
  }
  // Note that the DOM is observed inside DialogManager while any dialog
  // is being displayed as a modal, to catch modal removal from the DOM.

  Object.defineProperty(dialog, 'open', {
    set: this.setOpen.bind(this),
    get: dialog.hasAttribute.bind(dialog, 'open')
  });

  this.backdrop_ = document.createElement('div');
  this.backdrop_.className = 'backdrop';
  this.backdrop_.addEventListener('mouseup'  , this.backdropMouseEvent_.bind(this));
  this.backdrop_.addEventListener('mousedown', this.backdropMouseEvent_.bind(this));
  this.backdrop_.addEventListener('click'    , this.backdropMouseEvent_.bind(this));
}

dialogPolyfillInfo.prototype = /** @type {HTMLDialogElement.prototype} */ ({

  get dialog() {
    return this.dialog_;
  },

  /**
   * Maybe remove this dialog from the modal top layer. This is called when
   * a modal dialog may no longer be tenable, e.g., when the dialog is no
   * longer open or is no longer part of the DOM.
   */
  maybeHideModal: function() {
    if (this.dialog_.hasAttribute('open') && isConnected(this.dialog_)) { return; }
    this.downgradeModal();
  },

  /**
   * Remove this dialog from the modal top layer, leaving it as a non-modal.
   */
  downgradeModal: function() {
    if (!this.openAsModal_) { return; }
    this.openAsModal_ = false;
    this.dialog_.style.zIndex = '';

    // This won't match the native <dialog> exactly because if the user set top on a centered
    // polyfill dialog, that top gets thrown away when the dialog is closed. Not sure it's
    // possible to polyfill this perfectly.
    if (this.replacedStyleTop_) {
      this.dialog_.style.top = '';
      this.replacedStyleTop_ = false;
    }

    // Clear the backdrop and remove from the manager.
    this.backdrop_.parentNode && this.backdrop_.parentNode.removeChild(this.backdrop_);
    dialogPolyfill.dm.removeDialog(this);
  },

  /**
   * @param {boolean} value whether to open or close this dialog
   */
  setOpen: function(value) {
    if (value) {
      this.dialog_.hasAttribute('open') || this.dialog_.setAttribute('open', '');
    } else {
      this.dialog_.removeAttribute('open');
      this.maybeHideModal();  // nb. redundant with MutationObserver
    }
  },

  /**
   * Handles mouse events ('mouseup', 'mousedown', 'click') on the fake .backdrop element, redirecting them as if
   * they were on the dialog itself.
   *
   * @param {!Event} e to redirect
   */
  backdropMouseEvent_: function(e) {
    if (!this.dialog_.hasAttribute('tabindex')) {
      // Clicking on the backdrop should move the implicit cursor, even if dialog cannot be
      // focused. Create a fake thing to focus on. If the backdrop was _before_ the dialog, this
      // would not be needed - clicks would move the implicit cursor there.
      var fake = document.createElement('div');
      this.dialog_.insertBefore(fake, this.dialog_.firstChild);
      fake.tabIndex = -1;
      fake.focus();
      this.dialog_.removeChild(fake);
    } else {
      this.dialog_.focus();
    }

    var redirectedEvent = document.createEvent('MouseEvents');
    redirectedEvent.initMouseEvent(e.type, e.bubbles, e.cancelable, window,
        e.detail, e.screenX, e.screenY, e.clientX, e.clientY, e.ctrlKey,
        e.altKey, e.shiftKey, e.metaKey, e.button, e.relatedTarget);
    this.dialog_.dispatchEvent(redirectedEvent);
    e.stopPropagation();
  },

  /**
   * Focuses on the first focusable element within the dialog. This will always blur the current
   * focus, even if nothing within the dialog is found.
   */
  focus_: function() {
    // Find element with `autofocus` attribute, or fall back to the first form/tabindex control.
    var target = this.dialog_.querySelector('[autofocus]:not([disabled])');
    if (!target && this.dialog_.tabIndex >= 0) {
      target = this.dialog_;
    }
    if (!target) {
      target = findFocusableElementWithin(this.dialog_);
    }
    safeBlur(document.activeElement);
    target && target.focus();
  },

  /**
   * Sets the zIndex for the backdrop and dialog.
   *
   * @param {number} dialogZ
   * @param {number} backdropZ
   */
  updateZIndex: function(dialogZ, backdropZ) {
    if (dialogZ < backdropZ) {
      throw new Error('dialogZ should never be < backdropZ');
    }
    this.dialog_.style.zIndex = dialogZ;
    this.backdrop_.style.zIndex = backdropZ;
  },

  /**
   * Shows the dialog. If the dialog is already open, this does nothing.
   */
  show: function() {
    if (!this.dialog_.open) {
      this.setOpen(true);
      this.focus_();
    }
  },

  /**
   * Show this dialog modally.
   */
  showModal: function() {
    if (this.dialog_.hasAttribute('open')) {
      throw new Error('Failed to execute \'showModal\' on dialog: The element is already open, and therefore cannot be opened modally.');
    }
    if (!isConnected(this.dialog_)) {
      throw new Error('Failed to execute \'showModal\' on dialog: The element is not in a Document.');
    }
    if (!dialogPolyfill.dm.pushDialog(this)) {
      throw new Error('Failed to execute \'showModal\' on dialog: There are too many open modal dialogs.');
    }

    if (createsStackingContext(this.dialog_.parentElement)) {
      console.warn('A dialog is being shown inside a stacking context. ' +
          'This may cause it to be unusable. For more information, see this link: ' +
          'https://github.com/GoogleChrome/dialog-polyfill/#stacking-context');
    }

    this.setOpen(true);
    this.openAsModal_ = true;

    // Optionally center vertically, relative to the current viewport.
    if (dialogPolyfill.needsCentering(this.dialog_)) {
      dialogPolyfill.reposition(this.dialog_);
      this.replacedStyleTop_ = true;
    } else {
      this.replacedStyleTop_ = false;
    }

    // Insert backdrop.
    this.dialog_.parentNode.insertBefore(this.backdrop_, this.dialog_.nextSibling);

    // Focus on whatever inside the dialog.
    this.focus_();
  },

  /**
   * Closes this HTMLDialogElement. This is optional vs clearing the open
   * attribute, however this fires a 'close' event.
   *
   * @param {string=} opt_returnValue to use as the returnValue
   */
  close: function(opt_returnValue) {
    if (!this.dialog_.hasAttribute('open')) {
      throw new Error('Failed to execute \'close\' on dialog: The element does not have an \'open\' attribute, and therefore cannot be closed.');
    }
    this.setOpen(false);

    // Leave returnValue untouched in case it was set directly on the element
    if (opt_returnValue !== undefined) {
      this.dialog_.returnValue = opt_returnValue;
    }

    // Triggering "close" event for any attached listeners on the <dialog>.
    var closeEvent = new supportCustomEvent('close', {
      bubbles: false,
      cancelable: false
    });
    safeDispatchEvent(this.dialog_, closeEvent);
  }

});

var dialogPolyfill = {};

dialogPolyfill.reposition = function(element) {
  var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
  var topValue = scrollTop + (window.innerHeight - element.offsetHeight) / 2;
  element.style.top = Math.max(scrollTop, topValue) + 'px';
};

dialogPolyfill.isInlinePositionSetByStylesheet = function(element) {
  for (var i = 0; i < document.styleSheets.length; ++i) {
    var styleSheet = document.styleSheets[i];
    var cssRules = null;
    // Some browsers throw on cssRules.
    try {
      cssRules = styleSheet.cssRules;
    } catch (e) {}
    if (!cssRules) { continue; }
    for (var j = 0; j < cssRules.length; ++j) {
      var rule = cssRules[j];
      var selectedNodes = null;
      // Ignore errors on invalid selector texts.
      try {
        selectedNodes = document.querySelectorAll(rule.selectorText);
      } catch(e) {}
      if (!selectedNodes || !inNodeList(selectedNodes, element)) {
        continue;
      }
      var cssTop = rule.style.getPropertyValue('top');
      var cssBottom = rule.style.getPropertyValue('bottom');
      if ((cssTop && cssTop !== 'auto') || (cssBottom && cssBottom !== 'auto')) {
        return true;
      }
    }
  }
  return false;
};

dialogPolyfill.needsCentering = function(dialog) {
  var computedStyle = window.getComputedStyle(dialog);
  if (computedStyle.position !== 'absolute') {
    return false;
  }

  // We must determine whether the top/bottom specified value is non-auto.  In
  // WebKit/Blink, checking computedStyle.top == 'auto' is sufficient, but
  // Firefox returns the used value. So we do this crazy thing instead: check
  // the inline style and then go through CSS rules.
  if ((dialog.style.top !== 'auto' && dialog.style.top !== '') ||
      (dialog.style.bottom !== 'auto' && dialog.style.bottom !== '')) {
    return false;
  }
  return !dialogPolyfill.isInlinePositionSetByStylesheet(dialog);
};

/**
 * @param {!Element} element to force upgrade
 */
dialogPolyfill.forceRegisterDialog = function(element) {
  if (window.HTMLDialogElement || element.showModal) {
    console.warn('This browser already supports <dialog>, the polyfill ' +
        'may not work correctly', element);
  }
  if (element.localName !== 'dialog') {
    throw new Error('Failed to register dialog: The element is not a dialog.');
  }
  new dialogPolyfillInfo(/** @type {!HTMLDialogElement} */ (element));
};

/**
 * @param {!Element} element to upgrade, if necessary
 */
dialogPolyfill.registerDialog = function(element) {
  if (!element.showModal) {
    dialogPolyfill.forceRegisterDialog(element);
  }
};

/**
 * @constructor
 */
dialogPolyfill.DialogManager = function() {
  /** @type {!Array<!dialogPolyfillInfo>} */
  this.pendingDialogStack = [];

  var checkDOM = this.checkDOM_.bind(this);

  // The overlay is used to simulate how a modal dialog blocks the document.
  // The blocking dialog is positioned on top of the overlay, and the rest of
  // the dialogs on the pending dialog stack are positioned below it. In the
  // actual implementation, the modal dialog stacking is controlled by the
  // top layer, where z-index has no effect.
  this.overlay = document.createElement('div');
  this.overlay.className = '_dialog_overlay';
  this.overlay.addEventListener('click', function(e) {
    this.forwardTab_ = undefined;
    e.stopPropagation();
    checkDOM([]);  // sanity-check DOM
  }.bind(this));

  this.handleKey_ = this.handleKey_.bind(this);
  this.handleFocus_ = this.handleFocus_.bind(this);

  this.zIndexLow_ = 100000;
  this.zIndexHigh_ = 100000 + 150;

  this.forwardTab_ = undefined;

  if ('MutationObserver' in window) {
    this.mo_ = new MutationObserver(function(records) {
      var removed = [];
      records.forEach(function(rec) {
        for (var i = 0, c; c = rec.removedNodes[i]; ++i) {
          if (!(c instanceof Element)) {
            continue;
          } else if (c.localName === 'dialog') {
            removed.push(c);
          }
          removed = removed.concat(c.querySelectorAll('dialog'));
        }
      });
      removed.length && checkDOM(removed);
    });
  }
};

/**
 * Called on the first modal dialog being shown. Adds the overlay and related
 * handlers.
 */
dialogPolyfill.DialogManager.prototype.blockDocument = function() {
  document.documentElement.addEventListener('focus', this.handleFocus_, true);
  document.addEventListener('keydown', this.handleKey_);
  this.mo_ && this.mo_.observe(document, {childList: true, subtree: true});
};

/**
 * Called on the first modal dialog being removed, i.e., when no more modal
 * dialogs are visible.
 */
dialogPolyfill.DialogManager.prototype.unblockDocument = function() {
  document.documentElement.removeEventListener('focus', this.handleFocus_, true);
  document.removeEventListener('keydown', this.handleKey_);
  this.mo_ && this.mo_.disconnect();
};

/**
 * Updates the stacking of all known dialogs.
 */
dialogPolyfill.DialogManager.prototype.updateStacking = function() {
  var zIndex = this.zIndexHigh_;

  for (var i = 0, dpi; dpi = this.pendingDialogStack[i]; ++i) {
    dpi.updateZIndex(--zIndex, --zIndex);
    if (i === 0) {
      this.overlay.style.zIndex = --zIndex;
    }
  }

  // Make the overlay a sibling of the dialog itself.
  var last = this.pendingDialogStack[0];
  if (last) {
    var p = last.dialog.parentNode || document.body;
    p.appendChild(this.overlay);
  } else if (this.overlay.parentNode) {
    this.overlay.parentNode.removeChild(this.overlay);
  }
};

/**
 * @param {Element} candidate to check if contained or is the top-most modal dialog
 * @return {boolean} whether candidate is contained in top dialog
 */
dialogPolyfill.DialogManager.prototype.containedByTopDialog_ = function(candidate) {
  while (candidate = findNearestDialog(candidate)) {
    for (var i = 0, dpi; dpi = this.pendingDialogStack[i]; ++i) {
      if (dpi.dialog === candidate) {
        return i === 0;  // only valid if top-most
      }
    }
    candidate = candidate.parentElement;
  }
  return false;
};

dialogPolyfill.DialogManager.prototype.handleFocus_ = function(event) {
  var target = event.composedPath ? event.composedPath()[0] : event.target;

  if (this.containedByTopDialog_(target)) { return; }

  if (document.activeElement === document.documentElement) { return; }

  event.preventDefault();
  event.stopPropagation();
  safeBlur(/** @type {Element} */ (target));

  if (this.forwardTab_ === undefined) { return; }  // move focus only from a tab key

  var dpi = this.pendingDialogStack[0];
  var dialog = dpi.dialog;
  var position = dialog.compareDocumentPosition(target);
  if (position & Node.DOCUMENT_POSITION_PRECEDING) {
    if (this.forwardTab_) {
      // forward
      dpi.focus_();
    } else if (target !== document.documentElement) {
      // backwards if we're not already focused on <html>
      document.documentElement.focus();
    }
  }

  return false;
};

dialogPolyfill.DialogManager.prototype.handleKey_ = function(event) {
  this.forwardTab_ = undefined;
  if (event.keyCode === 27) {
    event.preventDefault();
    event.stopPropagation();
    var cancelEvent = new supportCustomEvent('cancel', {
      bubbles: false,
      cancelable: true
    });
    var dpi = this.pendingDialogStack[0];
    if (dpi && safeDispatchEvent(dpi.dialog, cancelEvent)) {
      dpi.dialog.close();
    }
  } else if (event.keyCode === 9) {
    this.forwardTab_ = !event.shiftKey;
  }
};

/**
 * Finds and downgrades any known modal dialogs that are no longer displayed. Dialogs that are
 * removed and immediately readded don't stay modal, they become normal.
 *
 * @param {!Array<!HTMLDialogElement>} removed that have definitely been removed
 */
dialogPolyfill.DialogManager.prototype.checkDOM_ = function(removed) {
  // This operates on a clone because it may cause it to change. Each change also calls
  // updateStacking, which only actually needs to happen once. But who removes many modal dialogs
  // at a time?!
  var clone = this.pendingDialogStack.slice();
  clone.forEach(function(dpi) {
    if (removed.indexOf(dpi.dialog) !== -1) {
      dpi.downgradeModal();
    } else {
      dpi.maybeHideModal();
    }
  });
};

/**
 * @param {!dialogPolyfillInfo} dpi
 * @return {boolean} whether the dialog was allowed
 */
dialogPolyfill.DialogManager.prototype.pushDialog = function(dpi) {
  var allowed = (this.zIndexHigh_ - this.zIndexLow_) / 2 - 1;
  if (this.pendingDialogStack.length >= allowed) {
    return false;
  }
  if (this.pendingDialogStack.unshift(dpi) === 1) {
    this.blockDocument();
  }
  this.updateStacking();
  return true;
};

/**
 * @param {!dialogPolyfillInfo} dpi
 */
dialogPolyfill.DialogManager.prototype.removeDialog = function(dpi) {
  var index = this.pendingDialogStack.indexOf(dpi);
  if (index === -1) { return; }

  this.pendingDialogStack.splice(index, 1);
  if (this.pendingDialogStack.length === 0) {
    this.unblockDocument();
  }
  this.updateStacking();
};

dialogPolyfill.dm = new dialogPolyfill.DialogManager();
dialogPolyfill.formSubmitter = null;
dialogPolyfill.imagemapUseValue = null;

/**
 * Installs global handlers, such as click listers and native method overrides. These are needed
 * even if a no dialog is registered, as they deal with <form method="dialog">.
 */
if (window.HTMLDialogElement === undefined) {

  /**
   * If HTMLFormElement translates method="DIALOG" into 'get', then replace the descriptor with
   * one that returns the correct value.
   */
  var testForm = document.createElement('form');
  testForm.setAttribute('method', 'dialog');
  if (testForm.method !== 'dialog') {
    var methodDescriptor = Object.getOwnPropertyDescriptor(HTMLFormElement.prototype, 'method');
    if (methodDescriptor) {
      // nb. Some older iOS and older PhantomJS fail to return the descriptor. Don't do anything
      // and don't bother to update the element.
      var realGet = methodDescriptor.get;
      methodDescriptor.get = function() {
        if (isFormMethodDialog(this)) {
          return 'dialog';
        }
        return realGet.call(this);
      };
      var realSet = methodDescriptor.set;
      /** @this {HTMLElement} */
      methodDescriptor.set = function(v) {
        if (typeof v === 'string' && v.toLowerCase() === 'dialog') {
          return this.setAttribute('method', v);
        }
        return realSet.call(this, v);
      };
      Object.defineProperty(HTMLFormElement.prototype, 'method', methodDescriptor);
    }
  }

  /**
   * Global 'click' handler, to capture the <input type="submit"> or <button> element which has
   * submitted a <form method="dialog">. Needed as Safari and others don't report this inside
   * document.activeElement.
   */
  document.addEventListener('click', function(ev) {
    dialogPolyfill.formSubmitter = null;
    dialogPolyfill.imagemapUseValue = null;
    if (ev.defaultPrevented) { return; }  // e.g. a submit which prevents default submission

    var target = /** @type {Element} */ (ev.target);
    if ('composedPath' in ev) {
      var path = ev.composedPath();
      target = path.shift() || target;
    }
    if (!target || !isFormMethodDialog(target.form)) { return; }

    var valid = (target.type === 'submit' && ['button', 'input'].indexOf(target.localName) > -1);
    if (!valid) {
      if (!(target.localName === 'input' && target.type === 'image')) { return; }
      // this is a <input type="image">, which can submit forms
      dialogPolyfill.imagemapUseValue = ev.offsetX + ',' + ev.offsetY;
    }

    var dialog = findNearestDialog(target);
    if (!dialog) { return; }

    dialogPolyfill.formSubmitter = target;

  }, false);

  /**
   * Global 'submit' handler. This handles submits of `method="dialog"` which are invalid, i.e.,
   * outside a dialog. They get prevented.
   */
  document.addEventListener('submit', function(ev) {
    var form = ev.target;
    var dialog = findNearestDialog(form);
    if (dialog) {
      return;  // ignore, handle there
    }

    var submitter = findFormSubmitter(ev);
    var formmethod = submitter && submitter.getAttribute('formmethod') || form.getAttribute('method');
    if (formmethod === 'dialog') {
      ev.preventDefault();
    }
  });

  /**
   * Replace the native HTMLFormElement.submit() method, as it won't fire the
   * submit event and give us a chance to respond.
   */
  var nativeFormSubmit = HTMLFormElement.prototype.submit;
  var replacementFormSubmit = function () {
    if (!isFormMethodDialog(this)) {
      return nativeFormSubmit.call(this);
    }
    var dialog = findNearestDialog(this);
    dialog && dialog.close();
  };
  HTMLFormElement.prototype.submit = replacementFormSubmit;
}

function isHTMLDialogElement(node) {
    return node instanceof Element && node.localName == "dialog";
}
function siblingElements(element) {
    var _a;
    const elements = Array.from(((_a = element.parentElement) === null || _a === void 0 ? void 0 : _a.children) || []);
    return elements.filter(sibling => sibling != element).filter(canBeInert);
}
function canBeInert(element) {
    return "inert" in element;
}

function polyfill(node) {
    if (isHTMLDialogElement(node)) {
        dialogPolyfill.registerDialog(node);
    }
}
function polyfillDialog (document) {
    for (const element of document.querySelectorAll("dialog")) {
        polyfill(element);
    }
    new MutationObserver((records) => {
        for (const { target, addedNodes } of records) {
            polyfill(target);
            for (const node of addedNodes) {
                polyfill(node);
            }
        }
    }).observe(document.documentElement, { subtree: true, childList: true });
}

/*
Stimulus 3.0.1
Copyright © 2021 Basecamp, LLC
 */

function camelize(value) {
    return value.replace(/(?:[_-])([a-z0-9])/g, (_, char) => char.toUpperCase());
}
function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}
function dasherize(value) {
    return value.replace(/([A-Z])/g, (_, char) => `-${char.toLowerCase()}`);
}

function readInheritableStaticArrayValues(constructor, propertyName) {
    const ancestors = getAncestorsForConstructor(constructor);
    return Array.from(ancestors.reduce((values, constructor) => {
        getOwnStaticArrayValues(constructor, propertyName).forEach(name => values.add(name));
        return values;
    }, new Set));
}
function readInheritableStaticObjectPairs(constructor, propertyName) {
    const ancestors = getAncestorsForConstructor(constructor);
    return ancestors.reduce((pairs, constructor) => {
        pairs.push(...getOwnStaticObjectPairs(constructor, propertyName));
        return pairs;
    }, []);
}
function getAncestorsForConstructor(constructor) {
    const ancestors = [];
    while (constructor) {
        ancestors.push(constructor);
        constructor = Object.getPrototypeOf(constructor);
    }
    return ancestors.reverse();
}
function getOwnStaticArrayValues(constructor, propertyName) {
    const definition = constructor[propertyName];
    return Array.isArray(definition) ? definition : [];
}
function getOwnStaticObjectPairs(constructor, propertyName) {
    const definition = constructor[propertyName];
    return definition ? Object.keys(definition).map(key => [key, definition[key]]) : [];
}
(() => {
    function extendWithReflect(constructor) {
        function extended() {
            return Reflect.construct(constructor, arguments, new.target);
        }
        extended.prototype = Object.create(constructor.prototype, {
            constructor: { value: extended }
        });
        Reflect.setPrototypeOf(extended, constructor);
        return extended;
    }
    function testReflectExtension() {
        const a = function () { this.a.call(this); };
        const b = extendWithReflect(a);
        b.prototype.a = function () { };
        return new b;
    }
    try {
        testReflectExtension();
        return extendWithReflect;
    }
    catch (error) {
        return (constructor) => class extended extends constructor {
        };
    }
})();

function ClassPropertiesBlessing(constructor) {
    const classes = readInheritableStaticArrayValues(constructor, "classes");
    return classes.reduce((properties, classDefinition) => {
        return Object.assign(properties, propertiesForClassDefinition(classDefinition));
    }, {});
}
function propertiesForClassDefinition(key) {
    return {
        [`${key}Class`]: {
            get() {
                const { classes } = this;
                if (classes.has(key)) {
                    return classes.get(key);
                }
                else {
                    const attribute = classes.getAttributeName(key);
                    throw new Error(`Missing attribute "${attribute}"`);
                }
            }
        },
        [`${key}Classes`]: {
            get() {
                return this.classes.getAll(key);
            }
        },
        [`has${capitalize(key)}Class`]: {
            get() {
                return this.classes.has(key);
            }
        }
    };
}

function TargetPropertiesBlessing(constructor) {
    const targets = readInheritableStaticArrayValues(constructor, "targets");
    return targets.reduce((properties, targetDefinition) => {
        return Object.assign(properties, propertiesForTargetDefinition(targetDefinition));
    }, {});
}
function propertiesForTargetDefinition(name) {
    return {
        [`${name}Target`]: {
            get() {
                const target = this.targets.find(name);
                if (target) {
                    return target;
                }
                else {
                    throw new Error(`Missing target element "${name}" for "${this.identifier}" controller`);
                }
            }
        },
        [`${name}Targets`]: {
            get() {
                return this.targets.findAll(name);
            }
        },
        [`has${capitalize(name)}Target`]: {
            get() {
                return this.targets.has(name);
            }
        }
    };
}

function ValuePropertiesBlessing(constructor) {
    const valueDefinitionPairs = readInheritableStaticObjectPairs(constructor, "values");
    const propertyDescriptorMap = {
        valueDescriptorMap: {
            get() {
                return valueDefinitionPairs.reduce((result, valueDefinitionPair) => {
                    const valueDescriptor = parseValueDefinitionPair(valueDefinitionPair);
                    const attributeName = this.data.getAttributeNameForKey(valueDescriptor.key);
                    return Object.assign(result, { [attributeName]: valueDescriptor });
                }, {});
            }
        }
    };
    return valueDefinitionPairs.reduce((properties, valueDefinitionPair) => {
        return Object.assign(properties, propertiesForValueDefinitionPair(valueDefinitionPair));
    }, propertyDescriptorMap);
}
function propertiesForValueDefinitionPair(valueDefinitionPair) {
    const definition = parseValueDefinitionPair(valueDefinitionPair);
    const { key, name, reader: read, writer: write } = definition;
    return {
        [name]: {
            get() {
                const value = this.data.get(key);
                if (value !== null) {
                    return read(value);
                }
                else {
                    return definition.defaultValue;
                }
            },
            set(value) {
                if (value === undefined) {
                    this.data.delete(key);
                }
                else {
                    this.data.set(key, write(value));
                }
            }
        },
        [`has${capitalize(name)}`]: {
            get() {
                return this.data.has(key) || definition.hasCustomDefaultValue;
            }
        }
    };
}
function parseValueDefinitionPair([token, typeDefinition]) {
    return valueDescriptorForTokenAndTypeDefinition(token, typeDefinition);
}
function parseValueTypeConstant(constant) {
    switch (constant) {
        case Array: return "array";
        case Boolean: return "boolean";
        case Number: return "number";
        case Object: return "object";
        case String: return "string";
    }
}
function parseValueTypeDefault(defaultValue) {
    switch (typeof defaultValue) {
        case "boolean": return "boolean";
        case "number": return "number";
        case "string": return "string";
    }
    if (Array.isArray(defaultValue))
        return "array";
    if (Object.prototype.toString.call(defaultValue) === "[object Object]")
        return "object";
}
function parseValueTypeObject(typeObject) {
    const typeFromObject = parseValueTypeConstant(typeObject.type);
    if (typeFromObject) {
        const defaultValueType = parseValueTypeDefault(typeObject.default);
        if (typeFromObject !== defaultValueType) {
            throw new Error(`Type "${typeFromObject}" must match the type of the default value. Given default value: "${typeObject.default}" as "${defaultValueType}"`);
        }
        return typeFromObject;
    }
}
function parseValueTypeDefinition(typeDefinition) {
    const typeFromObject = parseValueTypeObject(typeDefinition);
    const typeFromDefaultValue = parseValueTypeDefault(typeDefinition);
    const typeFromConstant = parseValueTypeConstant(typeDefinition);
    const type = typeFromObject || typeFromDefaultValue || typeFromConstant;
    if (type)
        return type;
    throw new Error(`Unknown value type "${typeDefinition}"`);
}
function defaultValueForDefinition(typeDefinition) {
    const constant = parseValueTypeConstant(typeDefinition);
    if (constant)
        return defaultValuesByType[constant];
    const defaultValue = typeDefinition.default;
    if (defaultValue !== undefined)
        return defaultValue;
    return typeDefinition;
}
function valueDescriptorForTokenAndTypeDefinition(token, typeDefinition) {
    const key = `${dasherize(token)}-value`;
    const type = parseValueTypeDefinition(typeDefinition);
    return {
        type,
        key,
        name: camelize(key),
        get defaultValue() { return defaultValueForDefinition(typeDefinition); },
        get hasCustomDefaultValue() { return parseValueTypeDefault(typeDefinition) !== undefined; },
        reader: readers[type],
        writer: writers[type] || writers.default
    };
}
const defaultValuesByType = {
    get array() { return []; },
    boolean: false,
    number: 0,
    get object() { return {}; },
    string: ""
};
const readers = {
    array(value) {
        const array = JSON.parse(value);
        if (!Array.isArray(array)) {
            throw new TypeError("Expected array");
        }
        return array;
    },
    boolean(value) {
        return !(value == "0" || value == "false");
    },
    number(value) {
        return Number(value);
    },
    object(value) {
        const object = JSON.parse(value);
        if (object === null || typeof object != "object" || Array.isArray(object)) {
            throw new TypeError("Expected object");
        }
        return object;
    },
    string(value) {
        return value;
    }
};
const writers = {
    default: writeString,
    array: writeJSON,
    object: writeJSON
};
function writeJSON(value) {
    return JSON.stringify(value);
}
function writeString(value) {
    return `${value}`;
}

class Controller {
    constructor(context) {
        this.context = context;
    }
    static get shouldLoad() {
        return true;
    }
    get application() {
        return this.context.application;
    }
    get scope() {
        return this.context.scope;
    }
    get element() {
        return this.scope.element;
    }
    get identifier() {
        return this.scope.identifier;
    }
    get targets() {
        return this.scope.targets;
    }
    get classes() {
        return this.scope.classes;
    }
    get data() {
        return this.scope.data;
    }
    initialize() {
    }
    connect() {
    }
    disconnect() {
    }
    dispatch(eventName, { target = this.element, detail = {}, prefix = this.identifier, bubbles = true, cancelable = true } = {}) {
        const type = prefix ? `${prefix}:${eventName}` : eventName;
        const event = new CustomEvent(type, { detail, bubbles, cancelable });
        target.dispatchEvent(event);
        return event;
    }
}
Controller.blessings = [ClassPropertiesBlessing, TargetPropertiesBlessing, ValuePropertiesBlessing];
Controller.targets = [];
Controller.values = {};

class default_1$4 extends Controller {
    constructor() {
        super(...arguments);
        this.comboboxToggled = () => {
            if (this.isExpanded) {
                this.listboxTarget.hidden = false;
            }
            else {
                this.listboxTarget.hidden = true;
            }
        };
    }
    initialize() {
        this.comboboxTarget.setAttribute("aria-controls", this.listboxTarget.id);
        this.comboboxTarget.setAttribute("aria-owns", this.listboxTarget.id);
        this.expandedObserver = new MutationObserver(this.comboboxToggled);
    }
    connect() {
        this.expandedObserver.observe(this.comboboxTarget, { attributeFilter: ["aria-expanded"] });
    }
    disconnect() {
        this.expandedObserver.disconnect();
    }
    expand({ target }) {
        if (target instanceof HTMLInputElement) {
            this.isExpanded = target.value.length > 0;
        }
        else {
            this.isExpanded = true;
        }
    }
    collapse() {
        this.isExpanded = false;
    }
    navigate(event) {
        var _a;
        if (this.isExpanded) {
            let selectedOptionIndex = this.selectedOptionElement ? this.optionTargets.indexOf(this.selectedOptionElement) : 0;
            switch (event.key) {
                case "ArrowUp":
                    event.preventDefault();
                    selectedOptionIndex--;
                    break;
                case "ArrowDown":
                    event.preventDefault();
                    selectedOptionIndex++;
                    break;
                case "Home":
                    event.preventDefault();
                    selectedOptionIndex = 0;
                    break;
                case "End":
                    event.preventDefault();
                    selectedOptionIndex = this.optionTargets.length - 1;
                    break;
                case "Enter":
                    event.preventDefault();
                    (_a = this.selectedOptionElement) === null || _a === void 0 ? void 0 : _a.click();
                    break;
                case "Escape":
                    event.preventDefault();
                    this.collapse();
                    break;
            }
            this.selectOption(selectedOptionIndex);
        }
    }
    selectOption(index) {
        if (index < 0) {
            index = this.optionTargets.length - 1;
        }
        else if (index > this.optionTargets.length - 1) {
            index = 0;
        }
        this.optionTargets.forEach(target => target.setAttribute("aria-selected", "false"));
        if (this.optionTargets[index]) {
            this.optionTargets[index].setAttribute("aria-selected", "true");
            this.comboboxTarget.setAttribute("aria-activedescendant", this.optionTargets[index].id);
        }
    }
    get selectedOptionElement() {
        return this.optionTargets.find(target => target.getAttribute("aria-selected") == "true");
    }
    get isExpanded() {
        return this.comboboxTarget.getAttribute("aria-expanded") == "true";
    }
    set isExpanded(value) {
        this.comboboxTarget.setAttribute("aria-expanded", value.toString());
    }
}
default_1$4.targets = ["combobox", "listbox", "option"];

class dialog_controller extends Controller {
    constructor() {
        super(...arguments);
        this.trapScroll = () => {
            document.documentElement.style.overflow = "hidden";
            this.element.addEventListener("close", this.releaseScroll, { once: true });
        };
        this.releaseScroll = () => {
            document.documentElement.style.overflow = "";
        };
        this.trapFocus = () => {
            siblingElements(this.element).forEach(element => element.inert = true);
            this.element.addEventListener("close", this.releaseFocus, { once: true });
        };
        this.releaseFocus = () => {
            siblingElements(this.element).forEach(element => element.inert = false);
            if (this.previouslyActiveElement instanceof HTMLElement) {
                this.previouslyActiveElement.isConnected && this.previouslyActiveElement.focus();
            }
        };
    }
    initialize() {
        this.observer = new MutationObserver(() => {
            if (isOpen(this.element)) {
                this.element.open = false;
                this.showModal();
            }
            else {
                this.close();
            }
        });
    }
    connect() {
        this.element.setAttribute("role", "dialog");
        this.element.setAttribute("aria-modal", "true");
        if (isOpen(this.element)) {
            this.element.open = false;
            this.showModal();
        }
        this.observeMutations();
    }
    disconnect() {
        this.observer.disconnect();
    }
    showModal() {
        if (isOpen(this.element))
            return;
        this.previouslyActiveElement = document.activeElement;
        this.withoutObservingMutations(dialogElement => dialogElement.showModal());
        this.trapFocus();
        this.trapScroll();
        focusFirstInteractiveElement(this.element);
        ensureLabel(this.element);
    }
    close() {
        if (isOpen(this.element)) {
            this.withoutObservingMutations(dialogElement => dialogElement.close());
        }
    }
    observeMutations(attributeFilter = ["open"]) {
        this.observer.observe(this.element, { attributeFilter: attributeFilter });
    }
    withoutObservingMutations(callback) {
        this.observer.disconnect();
        if (isHTMLDialogElement(this.element)) {
            callback(this.element);
        }
        this.observeMutations();
    }
}
function isOpen(element) {
    return isHTMLDialogElement(element) && element.open;
}
function ensureLabel(element) {
    if (element.hasAttribute("aria-labelledby") || element.hasAttribute("aria-label"))
        return;
    const heading = element.querySelector("h1, h2, h3, h4, h5, h6");
    if (heading) {
        element.addEventListener("close", removeLabel(element), { once: true });
        if (heading.id) {
            element.setAttribute("aria-labelledby", heading.id);
        }
        else {
            element.setAttribute("aria-label", heading.textContent || "");
        }
    }
}
function removeLabel(element) {
    return () => {
        element.removeAttribute("aria-labelledby");
        element.removeAttribute("aria-label");
    };
}
function focusFirstInteractiveElement(element) {
    const firstAutofocusElement = element.querySelector("[autofocus]");
    const interactiveElements = Array.from(element.querySelectorAll('*:not([disabled]):not([hidden]):not([type="hidden"])'));
    const firstInteractiveElement = interactiveElements.find(element => element.tabIndex > -1);
    if (firstAutofocusElement instanceof HTMLElement) {
        firstAutofocusElement.focus();
    }
    else if (firstInteractiveElement instanceof HTMLElement) {
        firstInteractiveElement.focus();
    }
}

class default_1$3 extends Controller {
    constructor() {
        super(...arguments);
        this.pushStateToElement = (expanded) => {
            if (!this.controlsElement)
                return;
            if (this.hasExpandedClass) {
                this.controlsElement.classList.toggle(this.expandedClass, expanded);
            }
            else if (isHTMLDialogElementOrHTMLDetailsElement(this.controlsElement)) {
                this.controlsElement.open = expanded;
            }
            else {
                this.controlsElement.hidden = !expanded;
            }
        };
        this.pullStateFromElement = () => {
            if (!this.controlsElement)
                return;
            let isExpanded = false;
            if (this.hasExpandedClass) {
                isExpanded = this.controlsElement.classList.contains(this.expandedClass);
            }
            else if (isHTMLDialogElementOrHTMLDetailsElement(this.controlsElement)) {
                isExpanded = this.controlsElement.open;
            }
            else {
                isExpanded = !this.controlsElement.hidden;
            }
            this.isExpanded = isExpanded;
        };
    }
    initialize() {
        this.elementStateObserver = new MutationObserver(this.pullStateFromElement);
        this.attributesObserver = new MutationObserver(() => {
            this.elementStateObserver.disconnect();
            if (this.controlsElement) {
                this.elementStateObserver.observe(this.controlsElement, { attributeFilter: ["open"] });
            }
        });
    }
    connect() {
        if (this.canExpand) {
            this.pushStateToElement(this.isExpanded);
        }
        else {
            this.pullStateFromElement();
        }
        this.attributesObserver.observe(this.element, { attributeFilter: ["aria-controls"] });
        if (this.controlsElement) {
            this.elementStateObserver.observe(this.controlsElement, { attributeFilter: ["open"] });
        }
    }
    disconnect() {
        this.attributesObserver.disconnect();
        this.elementStateObserver.disconnect();
    }
    toggle() {
        if (isHTMLElement(this.element)) {
            this.element.focus();
        }
        this.isExpanded = !this.isExpanded;
        this.pushStateToElement(this.isExpanded);
    }
    set isExpanded(expanded) {
        this.element.setAttribute("aria-expanded", expanded.toString());
    }
    get isExpanded() {
        return this.element.getAttribute("aria-expanded") == "true";
    }
    get canExpand() {
        return this.element.hasAttribute("aria-expanded");
    }
    get controlsElement() {
        const id = this.element.getAttribute("aria-controls") || "";
        return document.getElementById(id);
    }
}
default_1$3.classes = ["expanded"];
function isHTMLElement(element) {
    return element instanceof HTMLElement;
}
function isHTMLDetailsElement(element) {
    return element instanceof HTMLDetailsElement;
}
function isHTMLDialogElementOrHTMLDetailsElement(element) {
    return isHTMLDialogElement(element) || isHTMLDetailsElement(element);
}

class default_1$2 extends Controller {
    connect() {
        this.element.setAttribute("role", "feed");
    }
    articleTargetConnected(target) {
        updateSetSize(this.element, this.articleTargets);
        if (!/article/.test(target.localName))
            target.setAttribute("role", "article");
        target.setAttribute("tabindex", "0");
    }
    articleTargetDisconnected() {
        updateSetSize(this.element, this.articleTargets);
    }
    navigate(event) {
        const { ctrlKey, key, target } = event;
        if (target instanceof HTMLElement) {
            const article = this.articleTargets.find(element => element.contains(target));
            if (article) {
                const index = this.articleTargets.indexOf(article);
                const firstIndex = 0;
                const lastIndex = this.articleTargets.length - 1;
                let nextArticle;
                switch (key) {
                    case "PageUp":
                        nextArticle = this.articleTargets[Math.max(firstIndex, index - 1)];
                        break;
                    case "PageDown":
                        nextArticle = this.articleTargets[Math.min(lastIndex, index + 1)];
                        break;
                    case "Home":
                        if (ctrlKey)
                            nextArticle = this.articleTargets[firstIndex];
                        break;
                    case "End":
                        if (ctrlKey)
                            nextArticle = this.articleTargets[lastIndex];
                        break;
                }
                if (nextArticle) {
                    event.preventDefault();
                    nextArticle.focus();
                }
            }
        }
    }
}
default_1$2.targets = ["article"];
function updateSetSize(element, targets) {
    element.setAttribute("aria-setsize", targets.length.toString());
    targets.forEach((target, index) => {
        target.setAttribute("aria-posinset", (index + 1).toString());
    });
}

class default_1$1 extends Controller {
    tabTargetConnected() {
        this.attachTabs();
    }
    tabTargetDisconnected(target) {
        this.disconnectTabpanelControlledBy(target);
        this.attachTabs();
    }
    tabpanelTargetConnected(target) {
        this.attachTabs();
    }
    tabpanelTargetDisconnected(target) {
        this.disconnectTabInControlOfTabpanel(target);
        this.attachTabs();
    }
    isolateFocus({ target }) {
        if (target instanceof HTMLElement)
            this.isolateTabindex(target);
    }
    select({ target }) {
        if (target instanceof HTMLElement)
            this.activate(target);
    }
    navigate(event) {
        const { key, target } = event;
        const tab = this.tabTargets.find(tab => target instanceof Element && tab.contains(target));
        if (tab) {
            const tablist = this.tablistTargets.find(tablist => tablist.contains(tab));
            const orientation = tablist && tablist.getAttribute("aria-orientation") || "";
            const vertical = /vertical/i.test(orientation);
            const horizontal = !vertical;
            const index = this.tabTargets.indexOf(tab);
            const firstIndex = 0;
            const lastIndex = this.tabTargets.length - 1;
            let nextIndex = index;
            switch (key) {
                case "ArrowLeft":
                    if (horizontal)
                        nextIndex = index - 1;
                    break;
                case "ArrowRight":
                    if (horizontal)
                        nextIndex = index + 1;
                    break;
                case "ArrowUp":
                    if (vertical)
                        nextIndex = index - 1;
                    break;
                case "ArrowDown":
                    if (vertical)
                        nextIndex = index + 1;
                    break;
                case "Home":
                    nextIndex = firstIndex;
                    break;
                case "End":
                    nextIndex = lastIndex;
                    break;
                default:
                    return;
            }
            if (nextIndex < firstIndex)
                nextIndex = lastIndex;
            if (nextIndex > lastIndex)
                nextIndex = firstIndex;
            const nextTab = this.tabTargets[nextIndex];
            if (nextTab instanceof HTMLElement) {
                event.preventDefault();
                nextTab.focus();
                if (this.deferSelectionValue)
                    return;
                else
                    this.activate(nextTab);
            }
        }
    }
    attachTabs() {
        const [first] = this.tabTargets;
        const selected = this.tabTargets.find(isSelected) || first;
        const tabindexed = this.tabTargets.find(isTabindexed) || first;
        if (selected)
            this.activate(selected);
        if (tabindexed)
            this.isolateTabindex(tabindexed);
    }
    disconnectTabpanelControlledBy(tab) {
        const controls = tokensInAttribute(tab, "aria-controls");
        for (const tabpanel of this.tabpanelTargets) {
            if (controls.includes(tabpanel.id))
                tabpanel.remove();
        }
    }
    disconnectTabInControlOfTabpanel(tabpanel) {
        for (const tab of this.tabTargets) {
            const controls = tokensInAttribute(tabpanel, "aria-controls");
            if (controls.includes(tabpanel.id))
                tab.remove();
        }
    }
    activate(tab) {
        const controls = tokensInAttribute(tab, "aria-controls");
        for (const target of this.tabpanelTargets) {
            if (controls.includes(target.id)) {
                target.setAttribute("tabindex", "0");
                target.hidden = false;
            }
            else {
                target.setAttribute("tabindex", "-1");
                target.hidden = true;
            }
        }
        for (const target of this.tabTargets) {
            target.setAttribute("aria-selected", (target == tab).toString());
        }
    }
    isolateTabindex(tab) {
        for (const target of this.tabTargets) {
            if (target.contains(tab)) {
                target.setAttribute("tabindex", "0");
            }
            else {
                target.setAttribute("tabindex", "-1");
            }
        }
    }
}
default_1$1.targets = ["tablist", "tab", "tabpanel"];
default_1$1.values = { deferSelection: Boolean };
function tokensInAttribute(element, attribute) {
    return (element.getAttribute(attribute) || "").split(/\s+/);
}
function isSelected(element) {
    return /true/i.test(element.getAttribute("aria-selected") || "");
}
function isTabindexed(element) {
    return element.tabIndex > -1;
}

class default_1 extends Controller {
    gridcellTargetConnected(target) {
        if (target.hasAttribute("tabindex"))
            return;
        const row = this.rowTargets.findIndex(row => row.contains(target));
        const column = this.gridcellTargets.indexOf(target);
        const tabindex = row == this.rowValue && column == this.columnValue ?
            0 :
            -1;
        target.setAttribute("tabindex", tabindex.toString());
    }
    captureFocus({ target }) {
        if (target instanceof HTMLElement) {
            const row = this.rowTargets.find(row => row.contains(target));
            if (row) {
                const columnsInRow = this.gridcellTargets.filter(column => row.contains(column));
                this.rowValue = this.rowTargets.indexOf(row);
                this.columnValue = columnsInRow.indexOf(target);
                for (const column of this.gridcellTargets) {
                    const tabindex = column == target ?
                        0 :
                        -1;
                    column.setAttribute("tabindex", tabindex.toString());
                }
            }
        }
    }
    moveColumn({ key, ctrlKey, params: { directions, boundaries } }) {
        if (directions && key in directions) {
            const row = this.rowTargets[this.rowValue];
            const columnsInRow = this.gridcellTargets.filter(column => row.contains(column));
            this.columnValue += directions[key];
            this.columnValue = Math.min(this.columnValue, columnsInRow.length - 1);
            this.columnValue = Math.max(0, this.columnValue);
            const nextColumn = columnsInRow[this.columnValue];
            if (nextColumn)
                nextColumn.focus();
        }
        else if (boundaries && key in boundaries) {
            if (boundaries[key] < 1) {
                const row = ctrlKey ?
                    this.rowTargets[0] :
                    this.rowTargets[this.rowValue];
                const columnsInRow = this.gridcellTargets.filter(column => row.contains(column));
                const [nextColumn] = columnsInRow;
                if (nextColumn)
                    nextColumn.focus();
            }
            else {
                const row = ctrlKey ?
                    this.rowTargets[this.rowTargets.length - 1] :
                    this.rowTargets[this.rowValue];
                const columnsInRow = this.gridcellTargets.filter(column => row.contains(column));
                const nextColumn = columnsInRow[columnsInRow.length - 1];
                if (nextColumn)
                    nextColumn.focus();
            }
        }
    }
    moveRow({ key, params: { directions } }) {
        if (directions && key in directions) {
            this.rowValue += directions[key];
            this.rowValue = Math.min(this.rowValue, this.rowTargets.length - 1);
            this.rowValue = Math.max(0, this.rowValue);
            const row = this.rowTargets[this.rowValue];
            const columnsInRow = this.gridcellTargets.filter(column => row.contains(column));
            const nextColumn = columnsInRow[this.columnValue];
            if (nextColumn)
                nextColumn.focus();
        }
    }
}
default_1.targets = ["gridcell", "row"];
default_1.values = { column: Number, row: Number };

function installPolyfills(document) {
    polyfillDialog(document);
}

export { default_1$4 as ComboboxController, dialog_controller as DialogController, default_1$3 as DisclosureController, default_1$2 as FeedController, default_1 as GridController, default_1$1 as TabsController, installPolyfills };
