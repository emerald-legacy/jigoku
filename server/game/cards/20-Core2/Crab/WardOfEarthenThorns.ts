import { CardType, Location, Players, Trait } from '../../../Constants.js';
import { modifyProvinceStrength } from '../../../effects.js';
import { removeFate } from '../../../GameActions/GameActions.js';
import { controlsShugenja } from '../../controlsShugenja.js';
import { ProvinceAttachment } from '../../ProvinceAttachment.js';

export default class WardOfEarthenThorns extends ProvinceAttachment {
    static id = 'ward-of-earthen-thorns';

    public override setupCardAbilities() {
        this.playOnlyIf((context) => controlsShugenja(context.player));

        this.persistentEffect({
            targetLocation: Location.Provinces,
            targetController: Players.Any,
            condition: (context) => context.source.controller.hasAffinity(Trait.Earth, context),
            match: (card, context) => card.type === CardType.Province && card === context?.source.parent,
            effect: modifyProvinceStrength(1)
        });

        this.conflictAction('Remove a fate from a character')
            .condition((context) =>
                context.game.currentConflict
                    ?.getConflictProvinces()
                    .some((province) => context.source.parent === province) ?? false)
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isAttacking()
            }, removeFate());
    }
}
