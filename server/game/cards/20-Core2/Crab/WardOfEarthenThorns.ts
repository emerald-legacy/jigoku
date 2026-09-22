import type { AbilityContext } from '../../../AbilityContext.js';
import { CardType, Location, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import { ProvinceAttachment } from '../../ProvinceAttachment.js';
import { Conflict } from '../../../Conflict.js';

export default class WardOfEarthenThorns extends ProvinceAttachment {
    static id = 'ward-of-earthen-thorns';

    public setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Location.Provinces,
            targetController: Players.Any,
            condition: (context) => context.source.controller.hasAffinity('earth', context),
            match: (card, context) => card.type === CardType.Province && card === context?.source.attachedTo,
            effect: AbilityDsl.effects.modifyProvinceStrength(1)
        });

        this.action({
            title: 'Remove a fate from a character',
            condition: (context) =>
                (context.game.currentConflict as Conflict | undefined)
                    ?.getConflictProvinces()
                    .some((province) => context.source.attachedTo === province) ?? false,
            target: {
                cardType: CardType.Character,
                cardCondition: (card) => card.isAttacking(),
                gameAction: AbilityDsl.actions.removeFate()
            }
        });
    }

    canPlay(context: AbilityContext, playType: string) {
        return (
            context.player.cardsInPlay.some(
                (card: DrawCard) => card.getType() === CardType.Character && card.hasTrait('shugenja')
            ) && super.canPlay(context, playType)
        );
    }
}
