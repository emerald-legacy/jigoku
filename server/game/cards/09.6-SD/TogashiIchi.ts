import { CardTypes, Locations } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';

export default class TogashiIchi extends DrawCard {
    static id = 'togashi-ichi';

    setupCardAbilities() {
        this.action({
            title: 'Break the province',
            condition: (context) => {
                const conflict = this.game.currentConflict;
                const opponent = context.player.opponent;
                return !!conflict && !!opponent && context.source.isAttacking() &&
                    conflict.getNumberOfCardsPlayed(context.player) +
                        conflict.getNumberOfCardsPlayed(opponent) >= 10 &&
                    conflict.getConflictProvinces().some((p: any) => p.location !== Locations.StrongholdProvince);
            },
            effect: 'break an attacked province',
            gameAction: AbilityDsl.actions.selectCard((context) => ({
                activePromptTitle: 'Choose an attacked province',
                hidePromptIfSingleCard: true,
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                cardCondition: (card) => card.isConflictProvince() && card.location !== Locations.StrongholdProvince,
                message: '{0} breaks {1}',
                messageArgs: (cards) => [context.player, cards],
                gameAction: AbilityDsl.actions.breakProvince()
            }))
        });
    }
}
