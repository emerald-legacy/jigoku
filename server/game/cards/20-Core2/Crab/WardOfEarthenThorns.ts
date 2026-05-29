import type { AbilityContext } from '../../../AbilityContext.js';
import { CardTypes, Locations, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import type BaseCard from '../../../BaseCard.js';
import DrawCard from '../../../DrawCard.js';
import { Conflict } from '../../../Conflict.js';

export default class WardOfEarthenThorns extends DrawCard {
    static id = 'ward-of-earthen-thorns';

    public setupCardAbilities() {
        this.attachmentConditions({ myControl: true });

        this.persistentEffect({
            targetLocation: Locations.Provinces,
            targetController: Players.Self,
            condition: (context) => context.source.controller.hasAffinity('earth', context),
            match: (card, context) => card.type === CardTypes.Province && card === context?.source.parent,
            effect: AbilityDsl.effects.modifyProvinceStrength(1)
        });

        this.action({
            title: 'Remove a fate from a character',
            condition: (context) =>
                (context.game.currentConflict as Conflict | undefined)
                    ?.getConflictProvinces()
                    .some((province) => (context.source.parent as BaseCard | null) === province) ?? false,
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card) => card.isAttacking(),
                gameAction: AbilityDsl.actions.removeFate()
            }
        });
    }

    canPlay(context: AbilityContext, playType: string) {
        return (
            context.player.cardsInPlay.some(
                (card: DrawCard) => card.getType() === CardTypes.Character && card.hasTrait('shugenja')
            ) && super.canPlay(context, playType)
        );
    }

    canPlayOn(source: BaseCard) {
        return (
            source &&
            source.controller === this.controller &&
            source.getType() === CardTypes.Province &&
            this.getType() === CardTypes.Attachment
        );
    }

    canAttach(parent: BaseCard) {
        return (
            parent &&
            parent.controller === this.controller &&
            parent.getType() === CardTypes.Province &&
            this.getType() === CardTypes.Attachment
        );
    }
}
