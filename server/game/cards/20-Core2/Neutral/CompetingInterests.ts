import { CardType, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import type { AbilityContext } from '../../../AbilityContext.js';

export default class CompetingInterests extends DrawCard {
    static id = 'competing-interests';

    setupCardAbilities() {
        this.action('Bow a character')
            .condition((context) => this.#hasEnoughUniques(context))
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isUnique() && card.isParticipating()
            }, AbilityDsl.actions.bow());
    }

    #hasEnoughUniques(ctx: AbilityContext) {
        let totalUniques = 0;
        for(const card of ctx.game.currentConflict?.getParticipants() ?? []) {
            if(card.controller !== ctx.player) {
                if(card.isUnique()) {
                    totalUniques++;
                }
                for(const attachment of card.attachments) {
                    if(attachment.isUnique()) {
                        totalUniques++;
                    }
                }

                if(totalUniques >= 2) {
                    return true;
                }
            }
        }
        return false;
    }
}
