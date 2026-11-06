import { CardType } from '../Constants.js';
import type BaseCard from '../BaseCard.js';
import DrawCard from '../DrawCard.js';
import type Ring from '../Ring.js';

/** An attachment played on and attached to a province: by default an unbroken one, optionally only its controller's. */
export class ProvinceAttachment extends DrawCard {
    public override canPlayOn(source: BaseCard | Ring) {
        return (
            source.type === CardType.Province &&
            (!this.unbrokenOnly() || !(source.isCard() && source.isProvinceCard() && source.isBroken)) &&
            (!this.controllerProvinceOnly() || (source.isCard() && source.controller === this.controller)) &&
            this.type === CardType.Attachment
        );
    }

    public override canAttach(parent: BaseCard) {
        if(this.unbrokenOnly() && parent.isProvinceCard() && parent.isBroken) {
            return false;
        }

        if(this.controllerProvinceOnly() && parent.controller !== this.controller) {
            return false;
        }

        return parent.type === CardType.Province && this.type === CardType.Attachment;
    }

    protected controllerProvinceOnly(): boolean {
        return false;
    }

    protected unbrokenOnly(): boolean {
        return true;
    }
}
