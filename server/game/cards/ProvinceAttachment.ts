import { CardType } from '../Constants.js';
import BaseCard from '../BaseCard.js';
import DrawCard from '../DrawCard.js';
import { ProvinceCard } from '../ProvinceCard.js';
import type Ring from '../Ring.js';

/** An attachment played on and attached to a province: by default an unbroken one, optionally only its controller's. */
export class ProvinceAttachment extends DrawCard {
    public canPlayOn(source: BaseCard | Ring) {
        return (
            source.getType() === CardType.Province &&
            (!this.unbrokenOnly() || !(source instanceof ProvinceCard && source.isBroken)) &&
            (!this.controllerProvinceOnly() || (source instanceof BaseCard && source.controller === this.controller)) &&
            this.getType() === CardType.Attachment
        );
    }

    public canAttach(parent: BaseCard) {
        if(this.unbrokenOnly() && parent instanceof ProvinceCard && parent.isBroken) {
            return false;
        }

        if(this.controllerProvinceOnly() && parent.controller !== this.controller) {
            return false;
        }

        return parent.getType() === CardType.Province && this.getType() === CardType.Attachment;
    }

    protected controllerProvinceOnly(): boolean {
        return false;
    }

    protected unbrokenOnly(): boolean {
        return true;
    }
}
