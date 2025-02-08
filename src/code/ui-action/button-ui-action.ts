import { CommandUiAction } from './command-ui-action';

export class ButtonUiAction extends CommandUiAction {

    pushUnselected() {
        this.pushValue(false);
    }

    pushSelected() {
        this.pushValue(true);
    }
}
