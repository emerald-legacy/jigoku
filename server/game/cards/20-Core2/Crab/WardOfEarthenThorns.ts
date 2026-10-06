import type { AbilityContext } from '../../../AbilityContext.js';
import { CardType, Location, Players } from '../../../Constants.js';
import { modifyProvinceStrength } from '../../../effects.js';
import { removeFate } from '../../../GameActions/GameActions.js';
import { controlsShugenja } from '../../controlsShugenja.js';
import { ProvinceAttachment } from '../../ProvinceAttachment.js';

export default class WardOfEarthenThorns extends ProvinceAttachment {
    static id = 'ward-of-earthen-thorns';

    public setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Location.Provinces,
            targetController: Players.Any,
            condition: (context) => context.source.controller.hasAffinity('earth', context),
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

    canPlay(context: AbilityContext, playType: string) {
        return controlsShugenja(context.player) && super.canPlay(context, playType);
    }
}
