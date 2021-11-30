import {MDCTextField} from '@material/textfield';
import {MDCRipple} from '@material/ripple';
import {MDCTooltip} from '@material/tooltip';
import {MDCIconButtonToggle} from '@material/icon-button';
import { MDCLinearProgress } from '@material/linear-progress';



function AutoInit() {
        document.querySelectorAll('.mdc-tab, .mdc-button, .mdc-icon-button, .mdc-card__primary-action').forEach(el => {
            const ripple = new MDCRipple(el);
            (el.classList.contains('mdc-icon-button')) && (ripple.unbounded = true) && (el.MDCToggle = new MDCIconButtonToggle(el));
          });
          
          document.querySelectorAll('.mdc-text-field').forEach(el => {
            new MDCTextField(el);
          });
          document.querySelectorAll('.mdc-tooltip').forEach(el => {
            new MDCTooltip(el);
          });
          document.querySelectorAll('.mdc-linear-progress').forEach(el => {
            new MDCLinearProgress(el);
          });
          
}

export default AutoInit;
